# Calling Third-Party APIs in Spring Boot (Quick Notes)

## 1. The Big Picture

Your app sends an **HTTP request** to another company's system and gets a **response**.

```
Your App ── HTTP request ──▶ Third-Party API (Razorpay, Microsoft Graph, Courier)
         ◀── JSON response ──
```

All tools below do the same job. They differ in **the problem they solve**.

---

## 2. Tools and the Problem Each One Solves

| Tool | Problem it solves | Style | New code? |
|---|---|---|---|
| `HttpURLConnection` | Basic Java HTTP | Manual, long code | No |
| `RestTemplate` | Less boilerplate | Blocking | Old projects only |
| **`RestClient`** | Modern replacement (Boot 3.2+) | Blocking | **Default choice** |
| `WebClient` | Threads waiting for slow APIs | Non-blocking | For parallel calls |
| Feign / HTTP Interface | Repeating code for many endpoints | Declarative | Many endpoints |
| OkHttp / Apache HttpClient | Fine control (pool, SSL) | Engine under the hood | Optional |
| Resilience4j | Third-party API is down or slow | Safety layer | Always in production |

---

## 3. RestClient (Default Choice)

**Use when:** simple, one-by-one calls.

```java
RestClient restClient = RestClient.create();

PaymentResponse response = restClient.get()
        .uri("https://api.example.com/payments/{id}", 123)  // {id} becomes 123
        .retrieve()                                         // send request
        .body(PaymentResponse.class);                       // JSON -> Java object
```

- Needs only `spring-boot-starter-web`.
- Thread **waits** for the reply (blocking).

---

## 4. WebClient (Non-Blocking)

**Problem:** with blocking calls, 100 slow API calls waste 100 waiting threads.
**Use when:** many calls in parallel.

```java
WebClient webClient = WebClient.create("https://api.example.com");

Mono<PaymentResponse> response = webClient.get()
        .uri("/payments/{id}", 123)
        .retrieve()
        .bodyToMono(PaymentResponse.class);   // Mono = one result that arrives later
```

**Parallel calls with `Mono.zip`:**

```java
Mono<PaymentResponse> payment = paymentClient.getPayment(id);
Mono<ShipmentResponse> shipment = courierClient.getShipment(id);

return Mono.zip(payment, shipment)   // run both together, wait for both
        .map(t -> new OrderDashboard(t.getT1(), t.getT2()));
```

```
Blocking:      Payment (2s) -> Courier (2s)  = 4s
Non-blocking:  Payment (2s) + Courier (2s)   = 2s
```

---

## 5. Do I Need the WebFlux Dependency?

**Yes, for `WebClient`.**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

- Adding it does **not** make your app reactive.
- If `starter-web` is also present, you stay on **Spring MVC + Tomcat**.
- Only blocking calls? Use `RestClient` and skip WebFlux.

---

## 6. Feign (Declarative Client)

**Problem:** many endpoints mean repeated HTTP code.
**Idea:** write an **interface**, Spring writes the code.

```java
@FeignClient(name = "payment-api", url = "https://api.example.com")
public interface PaymentClient {

    @GetMapping("/payments/{id}")
    PaymentResponse getPayment(@PathVariable("id") String id);

    @PostMapping("/payments")
    PaymentResponse createPayment(@RequestBody PaymentRequest request);
}
```

**Sync or async?**
- **Synchronous (blocking) by default.**
- For async: wrap with `@Async` + `CompletableFuture`, or use Java 21 virtual threads.

```java
@Async
public CompletableFuture<PaymentResponse> getPaymentAsync(String id) {
    return CompletableFuture.completedFuture(paymentClient.getPayment(id));
}
```

---

## 7. HTTP Interface (Spring 6, Built-In Feign Alternative)

Same idea as Feign, but no Spring Cloud needed.

**Step 1: Interface (describes the API)**

```java
public interface PaymentClient {

    @GetExchange("/payments/{id}")
    PaymentResponse getPayment(@PathVariable String id);

    @PostExchange("/payments")
    PaymentResponse createPayment(@RequestBody PaymentRequest request);
}
```

**Step 2: Config (connects it to a real HTTP client)**

```java
@Bean
public PaymentClient paymentClient() {
    RestClient restClient = RestClient.builder()
            .baseUrl("https://api.example.com")
            .build();                                           // the real HTTP client

    RestClientAdapter adapter = RestClientAdapter.create(restClient);  // translator

    return HttpServiceProxyFactory.builderFor(adapter)
            .build()
            .createClient(PaymentClient.class);                 // Spring writes the code
}
```

**Step 3: Use it like a normal method**

```java
PaymentResponse response = paymentClient.getPayment("123");
```

**Blocking vs non-blocking = which client you plug in:**

| | `RestClient` | `WebClient` |
|---|---|---|
| Adapter | `RestClientAdapter` | `WebClientAdapter` |
| Method returns | `PaymentResponse` | `Mono<PaymentResponse>` (or normal type) |
| Thread | Waits | Does not wait |

---

## 8. Resilience4j (Safety Layer)

Not a way to call APIs. It **protects your app** when the API fails.

```
Without it:  API down -> threads stuck -> YOUR app down
With it:     API down -> circuit opens -> fail fast -> YOUR app alive
```

```java
@CircuitBreaker(name = "paymentApi", fallbackMethod = "fallback")
@Retry(name = "paymentApi")
public PaymentResponse getPayment(String id) {
    return paymentClient.getPayment(id);
}

public PaymentResponse fallback(String id, Throwable ex) {
    return PaymentResponse.pending(id);   // safe default
}
```

Hystrix is retired. Use Resilience4j.

---

## 9. How to Choose

```
Need to call a third-party API?
  |
  |-- Simple, one-by-one calls ----------> RestClient
  |-- Many calls in parallel ------------> WebClient
  |-- Many endpoints of one API ---------> HTTP Interface / Feign
  |-- Production? -----------------------> ADD timeouts + Resilience4j
```

---

## 10. Key Points

1. All tools send an HTTP request and get a response.
2. New project? Start with **RestClient**.
3. Parallel calls? Use **WebClient** (needs `starter-webflux`).
4. Many endpoints? Use **HTTP Interface** or **Feign**.
5. Feign is **blocking by default**.
6. Always set **timeouts**.
7. Always add **Resilience4j** in production.

## 11. Best Practices

- Never hardcode API keys. Use `application.yml` or environment variables.
- Wrap each API in your own service (for example `RazorpayService`).
- Log request and response IDs, not secrets.
- Use an **idempotency key** for payment calls so retries don't charge twice.
