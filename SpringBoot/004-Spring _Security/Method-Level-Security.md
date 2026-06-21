
---

This is a very common question in Spring Security interviews.

At first glance it looks like:

```java
http
   .authorizeHttpRequests(auth -> auth
       .requestMatchers("/admin/**").hasRole("ADMIN")
       .requestMatchers("/customer/**").hasRole("CUSTOMER")
   );
```

So you might think:

> "If I can secure endpoints in SecurityFilterChain, why do I need `@PreAuthorize`?"

The answer is that **URL security and Method security protect different layers.**

---

## SecurityFilterChain protects URLs
￼￼SecurityFilterChain protects URLs
Example:

```java
GET /api/users
```

```java
.requestMatchers("/api/users/**")
.hasRole("ADMIN")
```

Spring checks:

```text
Request arrives
      ↓
Security Filter Chain
      ↓
Does user have ADMIN role?
      ↓
YES → Controller executes
NO  → 403
```

This is called **web layer security**.

---

## Problem with URL Security Only

Suppose tomorrow another developer creates:

```java
@RestController
public class InternalController {

    @GetMapping("/api/internal/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
```

They forgot to secure this endpoint.

Now:

```text
/api/users             -> secured
/api/internal/users    -> unsecured
```

The same service method is exposed through another URL.

---

## Method Security Protects Business Logic

```java
@Service
public class UserService {

    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return repository.findAll();
    }
}
```

Now flow becomes:

```text
Request
   ↓
Filter Chain
   ↓
Controller
   ↓
UserService.getAllUsers()
   ↓
@PreAuthorize check
```

Even if another endpoint calls this method:

```java
userService.getAllUsers();
```

Spring still checks:

```text
Is user ADMIN?
```

So business logic remains protected.

---

## Real Production Example

Imagine a banking application.

```java
@Service
public class AccountService {

    @PreAuthorize("hasRole('MANAGER')")
    public void approveLoan(Long loanId) {
        ...
    }
}
```

Many controllers may call:

```java
/loan/approve
/admin/loan/approve
/internal/loan/approve
```

Instead of securing every URL separately, secure the actual operation:

```java
approveLoan()
```

Now nobody can approve a loan unless they have the MANAGER role.

---

## Another Benefit: Ownership Checks

SecurityFilterChain can usually check only:

```java
Role
Authority
Authentication
```

But method security can check method arguments.

Example:

```java
@PreAuthorize("#userId == authentication.principal.id")
public User getProfile(Long userId) {
    ...
}
```

User can access only their own profile.

```text
User ID = 10
Requesting profile 10 -> Allowed

User ID = 10
Requesting profile 20 -> Denied
```

This kind of check is impossible with simple URL matching.

---

## Why Most Production Projects Use Both

### Filter Chain

Used for:

```text
Authentication
JWT Validation
Public vs Private URLs
Basic Role Restrictions
```

Example:

```java
/api/auth/**
/swagger/**
/admin/**
```

---

### Method Security

Used for:

```text
Business Rules
Role Checks
Ownership Checks
Permission Checks
Fine-grained Authorization
```

Example:

```java
@PreAuthorize("hasRole('ADMIN')")

@PreAuthorize("hasAnyRole('ADMIN','SUPPORT_HEAD')")

@PreAuthorize("#ticket.customer.id == authentication.principal.id")
```

---

## Industry Practice

Most Spring Boot applications do:

```java
@EnableMethodSecurity
```

and use:

```java
SecurityFilterChain
```

for coarse-grained security

plus

```java
@PreAuthorize
@PostAuthorize
@Secured
```

for fine-grained business authorization.

A good way to think about it is:

```text
SecurityFilterChain
    = "Can this request enter the application?"

Method Security
    = "Can this user perform this business operation?"
```

In your Ticket Management System, URL security might allow:

```java
/tickets/**
```

for all authenticated users, but method security can enforce:

```java
@PreAuthorize("hasRole('SUPPORT_HEAD')")
assignTicket()

@PreAuthorize("hasRole('ADMIN')")
deleteTenant()

@PreAuthorize("#ticket.customerId == authentication.principal.id")
viewTicket()
```

This is why method-level security is considered the safer and more maintainable layer for protecting business logic.