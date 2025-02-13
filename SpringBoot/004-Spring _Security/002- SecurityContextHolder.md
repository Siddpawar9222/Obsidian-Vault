
---

`SecurityContextHolder` is like a **security diary** that keeps track of the currently logged-in user's details <font color="#ffff00">during a request</font> in a Spring Boot application.

Whenever a user logs in, their authentication details (username, roles, etc.) are stored in this **security diary** so that different parts of the application can access them without asking for login details again.

---

### **Industrial Example: 

 Let suppose use want do get csv of class due of student. In csv file we want to print who generated this csv, at what time etc. Without again extracting information from JWT token, we will use `SecurityContextHolder` to get information of user.

---

### **Key Benefits of `SecurityContextHolder`**

✅ **No Need to Login Again** for every request.  
✅ **Role-Based Access** (e.g., Employees cannot approve leave requests, only Admins can).  
✅ **Security Handling in One Place**, making authentication & authorization easy.

---

In **JWT authentication**, we store the user’s authentication details in `SecurityContextHolder` **on every request**, not just initially.

#### **Why?**

- JWT authentication is **stateless** (no session storage).
- Every request must **re-authenticate** using the JWT token.
- `SecurityContextHolder` is **emptied after each request**, so it must be set again.

---

### **🔹 Flow: How `SecurityContextHolder` Works on Every Request**

1. **User logs in → JWT token is generated and sent to the client.**
2. **Client sends requests → Each request includes the JWT token in the `Authorization` header.**
3. **JWT Filter (`JwtAuthFilter`) intercepts the request:**
    - Extracts the JWT token.
    - Validates the token.
    - Retrieves user details from the database.
    - Stores authentication details in `SecurityContextHolder`.
4. **Controller uses `SecurityContextHolder` to get the authenticated user.**
5. **Request completes → `SecurityContextHolder` is cleared.**
6. **Next request → The process repeats (Step 2 - Step 5).**

---


### **How Does Spring Security Identify Which `SecurityContextHolder` to Clear for Multiple Users?**

Spring Security **does not store authentication globally** for all users. Instead, it manages **each user's authentication separately per request** using **thread-local storage**.

#### **🔹 How SecurityContext is Handled for Multiple Users?**

1. Each incoming request runs on a **separate thread** (Spring uses thread-per-request model).
2. `SecurityContextHolder` is **thread-local**, meaning it stores authentication details **only for the current request/thread**.
3. When the request completes, Spring **automatically clears `SecurityContextHolder` for that specific thread**.
4. If another user sends a request, they get a **separate thread with their own `SecurityContextHolder`**.

---

### **🔹 Example Scenario**

#### **Suppose two users, Alice and Bob, are logged in at the same time:**

- **Alice sends a request** → `SecurityContextHolder` stores Alice’s authentication.
- **Bob sends a request** → `SecurityContextHolder` stores Bob’s authentication (in a different thread).
- **Alice’s request completes** → Spring clears `SecurityContextHolder` for Alice’s thread.
- **Bob’s request completes** → Spring clears `SecurityContextHolder` for Bob’s thread.

Each request is handled in **isolation** using its own thread, so there is no risk of one user’s authentication data affecting another user.

---

### **🔹 How Does Spring Security Ensure This?**

Spring Security sets the `SecurityContextHolder` mode to **ThreadLocal** by default:

```java
SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_THREADLOCAL);
```

This ensures that **each request gets a separate SecurityContext**, preventing data leakage between users.

---

### **🔹 Advanced Use Case: Multi-Threaded Execution in a Single Request**

If an authenticated user starts **multiple threads within a single request** (e.g., background tasks), the new threads **won’t automatically inherit the `SecurityContextHolder`**. You must manually pass the security context:

```java
SecurityContext context = SecurityContextHolder.getContext();
executorService.submit(() -> {
    SecurityContextHolder.setContext(context);  // Manually propagate the security context
    processUserTask();
});
```

This is needed only if you are running **asynchronous tasks** in the same request.

---