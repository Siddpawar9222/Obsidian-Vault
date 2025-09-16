

---

### 🔑 Things to Remember About AOP

1. **Use AOP for Cross-Cutting Concerns**
    
    - Don’t put logging, security, transactions, or performance monitoring logic everywhere.
        
    - Keep them in one place (Aspect) and let Spring apply them automatically.
        
    
    👉 Example: Instead of writing `System.out.println("Method started")` in 50 methods, just write one logging aspect.
    

---

2. **Advice Runs on Methods (Join Points)**
    
    - In Spring AOP, join points are **only method executions** <font color="#ffc000">(not variables, not constructors).</font>
        
    - So your advice runs when a method is called.
        

---

3. **Proxy-Based**
    
    - <font color="#ffc000">Spring uses **Proxy objects** (JDK Dynamic Proxy or CGLIB) to add advice.</font>
        
    - This means:
        
        - <font color="#ffc000">AOP works only on **Spring-managed beans**.</font>
            
        - Direct calls inside the same class **don’t trigger advice**.
            

---

4. **Types of Advice** (easy to recall order):
    
    - **Before** → Runs before method.
        
    - **After** → Runs after method (always).
        
    - **AfterReturning** → Runs only if method succeeds.
        
    - **AfterThrowing** → Runs only if method throws exception.
        
    - **Around** → Runs before & after method, and can even **stop execution** (most powerful).
        

---

5. **Pointcuts Decide Where to Apply**
    
    - You write **expressions** like:
        
        ```java
        @Pointcut("execution(* com.example.service.*.*(..))")
        ```
        
        👉 Means: apply advice to all methods inside `service` package.
        

---

6. **Weaving Happens at Runtime in Spring**
    
    - Unlike AspectJ, which can weave at compile-time or load-time,
        
    - Spring AOP does it at **runtime using proxies**.
        

---

7. **Keep It Simple**
    
    - Don’t overuse AOP.
        
    - Use it **only when logic is repeated everywhere** (like logs, security, transactions, caching).
        

---

⚡ Quick way to **remember**:

> **AOP = One place for common code → Applied everywhere automatically.**

---