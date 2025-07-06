
---

## ✅ What is `@Order`?

`@Order` is an annotation in Spring that helps you **control the execution order or priority** of:

- `@Component` classes like `@ControllerAdvice`, `@Filter`, `@Aspect`, etc.
    
- Collections like `List<Bean>` or `List<Filter>`
    
- Event listeners
    
- Exception handlers
    

---

## 🧠 Why use `@Order`?

<font color="#ffc000">When multiple beans of the same type exist, **Spring does not guarantee their order** unless you explicitly tell it using `@Order`.</font>

---

## 🧪 Syntax:

```java
@Order(1) // Lower value = higher priority
@Component
public class MyHandler { ... }
```

---

## ✅ Key Rule

> **Lower the number, higher the priority**

| Value         | Priority             |
| ------------- | -------------------- |
| `@Order(0)`   | Highest              |
| `@Order(1)`   | Next                 |
| `@Order(100)` | Low                  |
| No `@Order`   | Lowest (unspecified) |

---

## ✅ Real-world Use Cases

### 1. **Global Exception Handlers**

Suppose you have 2 `@RestControllerAdvice` classes:

```java
@RestControllerAdvice
@Order(1) // Higher priority
public class MainExceptionHandler { ... }

@RestControllerAdvice
@Order(2)
public class LibraryExceptionHandler { ... }
```

✅ Spring will prefer `MainExceptionHandler` when both handle the same exception.

---

### 2. **Spring AOP – Aspects**

```java
@Aspect
@Order(1)
public class LoggingAspect { ... }

@Aspect
@Order(2)
public class SecurityAspect { ... }
```

Here, `LoggingAspect` runs **before** `SecurityAspect`.

---

### 3. **Filters (`OncePerRequestFilter`)**

```java
@Component
@Order(1)
public class JwtAuthenticationFilter extends OncePerRequestFilter { ... }

@Component
@Order(2)
public class LoggingFilter extends OncePerRequestFilter { ... }
```

✅ `JwtAuthenticationFilter` runs before `LoggingFilter`.

---

## 🚫 Without `@Order`, Behavior is Unpredictable

If you don’t specify `@Order`, Spring **might run them in any order**, depending on how beans are discovered.

---

## 🧠 Advanced: `Ordered` Interface

Instead of annotation, you can implement:

```java
public class MyBean implements Ordered {
    @Override
    public int getOrder() {
        return 1;
    }
}
```

But `@Order` is easier and preferred in most cases.

---

## ✅ Summary

|Topic|Details|
|---|---|
|Annotation|`@Order(int value)`|
|Lower number|Higher priority|
|Common use|Exception handlers, filters, aspects, listeners|
|Alternative|`Ordered` interface|

---
