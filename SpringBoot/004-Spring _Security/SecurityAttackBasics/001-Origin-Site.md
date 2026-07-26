
---

# Think of an address

Suppose we have this URL:

```text
https://api.example.com:8443/users
```

It has four parts:

```text
Protocol : https

Subdomain : api

Domain : example.com

Port : 8443
```

Now we'll compare different URLs.

---

# What is an Origin?

An **origin** consists of only **three things**:

- Protocol
    
- Host (domain + subdomain)
    
- Port
    

```text
Origin

Protocol
+

Host
+

Port
```

Path (`/users`) is **not** part of the origin.

---

## Example 1

```text
https://api.example.com:443
```

vs

```text
https://api.example.com:443
```

Everything matches.

✅ Same Origin

---

## Example 2

```text
https://api.example.com
```

vs

```text
http://api.example.com
```

Protocol changed.

❌ Different Origin

---

## Example 3

```text
https://api.example.com
```

vs

```text
https://app.example.com
```

Subdomain changed.

❌ Different Origin

---

## Example 4

```text
https://api.example.com:8080
```

vs

```text
https://api.example.com:8443
```

Port changed.

❌ Different Origin

---

# So Origin is VERY strict.

Even changing **only the port** makes it a different origin.

---

# What is a Site?

A **site** is much broader.

The browser mainly looks at the **registrable domain**.

For example

```text
example.com
```

Everything under it belongs to the same site.

```text
api.example.com

↓

example.com

----------------

app.example.com

↓

example.com

----------------

admin.example.com

↓

example.com
```

All of these belong to the **same site**.

---

# Example

Suppose your company owns

```text
https://app.google.com
```

and

```text
https://api.google.com
```

Origins?

Different.

Because

```text
app.google.com

≠

api.google.com
```

Sites?

Same.

Because both belong to

```text
google.com
```

---

# Another Example

```text
https://amazon.com
```

and

```text
https://google.com
```

Origins?

Different.

Sites?

Also different.

---

# Let's Compare

### Example 1

```text
https://app.example.com

↓

https://api.example.com
```

Origin?

❌ Different

because host changed.

Site?

✅ Same

because both belong to

```text
example.com
```

---

### Example 2

```text
https://example.com

↓

https://example.com:8080
```

Origin?

❌ Different

because port changed.

Site?

✅ Same

because domain is still

```text
example.com
```

---

### Example 3

```text
https://example.com

↓

http://example.com
```

Origin?

❌ Different

because protocol changed.

Site?

Modern browsers use a concept called **schemeful same-site**, so changing from `https` to `http` is also treated as **cross-site**.

---

### Example 4

```text
https://example.com

↓

https://google.com
```

Origin?

❌ Different

Site?

❌ Different

---

# Easy Rule to Remember

### Origin checks

```text
Protocol

+

Host

+

Port
```

Everything must match.

Very strict.

---

### Site checks

```text
Same company/domain?

↓

example.com
```

Much broader.

---

# Why does SOP use Origin?

Imagine this:

```text
https://bank.example.com
```

and

```text
https://blog.example.com
```

If browsers allowed JavaScript to freely access data between these two just because they share `example.com`, then a vulnerable blog could steal banking information.

That's why **Same-Origin Policy (SOP)** uses the stricter **origin** rule.

---

# Why does SameSite use Site?

Cookies are often shared across related services.

Example:

```text
React

↓

app.company.com

Spring Boot

↓

api.company.com
```

If SameSite also required the same origin, cookies would not work naturally between these related subdomains.

So SameSite uses the broader **site** concept instead.

---

# Real Production Example

Imagine your company has:

```text
Frontend

https://app.microsoft.com
```

Backend

```text
https://api.microsoft.com
```

|Check|Result|
|---|---|
|Same Origin?|❌ No|
|Same Site?|✅ Yes|

Therefore:

- **SOP/CORS** sees them as **cross-origin**, so CORS configuration is required.
    
- **SameSite cookies** see them as **same-site**, so `SameSite=Lax` or `Strict` can still work.
    

---


