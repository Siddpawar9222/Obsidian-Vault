

---

# Step 1: User logs in

Suppose your Spring Security configuration is:

```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
);
```

This tells Spring:

> "Store the CSRF token inside a cookie."

---

# Step 2: Spring generates a random token

Spring creates something like:

```text
ABCD123456XYZ
```

This is just a long random string.

For example:

```text
XSRF-TOKEN=ABCD123456XYZ
```

---

# Step 3: Spring sends the token to the browser

Spring adds

```http
Set-Cookie:

XSRF-TOKEN=ABCD123456XYZ
```

Browser stores it.

---

# Browser now has

```text
Cookie

jwt=eyJ....

(HttpOnly)

-------------------

Cookie

XSRF-TOKEN=ABCD123456XYZ
```

---

# Step 4: React sends a request

React reads

```javascript
document.cookie
```

It finds

```text
XSRF-TOKEN=ABCD123456XYZ
```

Then Axios sends

```http
PUT /profile

Cookie:

jwt=eyJ...

Cookie:

XSRF-TOKEN=ABCD123456XYZ

Header:

X-XSRF-TOKEN: ABCD123456XYZ
```

Notice the same token appears twice.

```text
Cookie

ABCD123456XYZ

↓

Header

ABCD123456XYZ
```

---

# Step 5: Spring Security receives the request

Before your controller runs, the request goes through the Spring Security filter chain.

One of the filters is:

```text
CsrfFilter
```

Flow:

```text
Request

↓

Security Filter Chain

↓

CsrfFilter

↓

Authentication Filter

↓

Controller
```

So **CSRF validation happens before your controller executes**.

---

# Step 6: What does `CsrfFilter` do?

It asks the configured `CsrfTokenRepository`:

> "What is the expected CSRF token for this request?"

Since you configured

```java
CookieCsrfTokenRepository
```

Spring reads the cookie.

Internally it's conceptually similar to:

```java
String expectedToken =
request.getCookie("XSRF-TOKEN");
```

Suppose it gets

```text
ABCD123456XYZ
```

---

# Step 7: Spring reads the header

Next Spring reads

```text
X-XSRF-TOKEN
```

Conceptually:

```java
String actualToken =
request.getHeader("X-XSRF-TOKEN");
```

Suppose it gets

```text
ABCD123456XYZ
```

---

# Step 8: Spring compares them

Conceptually, Spring does something like:

```java
if(expectedToken.equals(actualToken)){

    allowRequest();

}
else{

    rejectRequest();

}
```

Example:

```text
Cookie

ABCD123456XYZ

==

Header

ABCD123456XYZ

↓

Match

↓

Controller executes
```

---

# What if they don't match?

Example

Cookie

```text
ABCD123456XYZ
```

Header

```text
AAAA999999
```

Spring immediately returns

```http
403 Forbidden
```

The controller is **never called**.

---

# What if the header is missing?

Attacker submits

```html
<form action="/profile">
```

HTML forms cannot add

```http
X-XSRF-TOKEN
```

The request becomes

```http
Cookie:

jwt=...

Cookie:

XSRF-TOKEN=ABCD123456XYZ

Header:

Missing
```

Spring checks

```text
Expected

↓

ABCD123456XYZ

Received

↓

null
```

Comparison fails.

Spring returns

```http
403 Forbidden
```

---

# But couldn't the attacker just copy the cookie value into the header?

No.

This is the most important part.

Imagine the attacker's JavaScript:

```javascript
fetch("https://bank.com/profile", {
    headers: {
        "X-XSRF-TOKEN": ???
    }
});
```

Where will they get

```text
ABCD123456XYZ
```

from?

They cannot execute

```javascript
document.cookie
```

for **bank.com** because their code is running on

```text
evil.com
```

Due to the browser's **Same-Origin Policy**, JavaScript on `evil.com` cannot read cookies that belong to `bank.com`.

So the attacker does not know the token value.

---

# Why does Spring trust this comparison?

Because only **your frontend** can do both things:

✅ Read the `XSRF-TOKEN` cookie.

✅ Send the same value back in the `X-XSRF-TOKEN` header.

An attacker can usually make the browser send cookies automatically, but they **cannot discover the CSRF token value** to put into the required header.

---

# Internal Spring Flow

```text
Incoming Request
        │
        ▼
Security Filter Chain
        │
        ▼
CsrfFilter
        │
        ├── Read Cookie
        │      XSRF-TOKEN
        │
        ├── Read Header
        │      X-XSRF-TOKEN
        │
        ├── Compare both values
        │
        ├── Match?
        │
        ├── YES ─────────► Continue Filter Chain
        │                      │
        │                      ▼
        │               Authentication
        │                      │
        │                      ▼
        │                 Controller
        │
        └── NO ─────────► Return 403 Forbidden
```

### One more important detail

In Spring Security, the comparison logic is performed by the `CsrfFilter` together with the configured `CsrfTokenRepository`. When you use `CookieCsrfTokenRepository`, Spring:

1. Loads the expected token from the `XSRF-TOKEN` cookie.
    
2. Loads the submitted token from the `X-XSRF-TOKEN` header (or `_csrf` request parameter for form submissions).
    
3. Compares them.
    
4. If they don't match, throws an `InvalidCsrfTokenException` or `MissingCsrfTokenException`, and the request ends with **403 Forbidden** before any controller or business logic executes.
    

This entire verification happens automatically—you don't write this comparison yourself. It's part of Spring Security's filter chain.

---
