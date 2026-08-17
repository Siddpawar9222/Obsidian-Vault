# CSRF Double-Submit Cookie — Revision Notes

## Core idea

CSRF is dangerous when the browser **automatically sends authentication cookies** with a request initiated by another website.

Example:

```text
Victim logged in
        ↓
Browser has:
accessToken=ABC
        ↓
evil.com sends POST to api.cybermeru.com
        ↓
Browser automatically attaches authentication cookie
        ↓
Backend may execute the request
```

The purpose of a CSRF token is to require an additional value that the attacker's website cannot obtain.

---

## Double-Submit Cookie Pattern

The server creates a CSRF token:

```text
CSRF token = ABC123
```

and sends it as a cookie:

```http
Set-Cookie: XSRF-TOKEN=ABC123
```

The legitimate frontend reads the cookie and sends the same value in a header:

```http
X-XSRF-TOKEN: ABC123
```

Backend verifies:

```text
Cookie token == Header token
        ↓
       YES
        ↓
    accept request
```

The important point:

> The attacker does not need to be prevented from **creating a random CSRF token**. They need to be prevented from obtaining the **victim's actual CSRF token**.

---

## "Can't the attacker just create their own CSRF token?"

Yes, they can create:

```text
attackerToken = XYZ999
```

But normally they cannot make the victim's browser replace its legitimate cookie:

```text
XSRF-TOKEN=ABC123
```

with:

```text
XSRF-TOKEN=XYZ999
```

So the attacker may cause:

```http
X-XSRF-TOKEN: XYZ999
```

while the browser sends:

```http
Cookie: XSRF-TOKEN=ABC123
```

Backend:

```text
ABC123 != XYZ999
       ↓
     REJECT
```

### Key point

```text
Attacker knows:
- cookie name
- header name
- token format
- frontend implementation
- API endpoint

Attacker does NOT know:
- victim's actual CSRF token
```

That's what makes CSRF protection useful.

---

# Your `cybermeru.com` Example

Suppose you have:

```text
app.cybermeru.com
api.cybermeru.com
```

and backend sends:

```http
Set-Cookie: XSRF-TOKEN=ABC123;
Domain=cybermeru.com;
Path=/;
Secure;
```

Because of:

```text
Domain=cybermeru.com
```

the cookie is scoped to the parent domain and can apply to its subdomains.

Conceptually:

```text
cybermeru.com
├── app.cybermeru.com      ✓
├── api.cybermeru.com      ✓
└── other.cybermeru.com    ✓
```

This is useful when frontend and backend need to participate in the Double-Submit pattern.

---

# Can `evil.com` Override Your Cookie?

**No.**

This:

```text
evil.com
```

cannot normally create:

```http
Set-Cookie: XSRF-TOKEN=EVIL;
Domain=cybermeru.com;
```

because `evil.com` is not part of the `cybermeru.com` domain hierarchy.

So:

```text
evil.com
   |
   X
   |
cybermeru.com
```

The browser's cookie rules prevent this.

---

# The Important Cookie-Injection Problem

The situation changes if an attacker controls or compromises a **subdomain of your own domain**.

For example:

```text
cybermeru.com
├── app.cybermeru.com
├── api.cybermeru.com
└── evil.cybermeru.com   ← attacker somehow controls this
```

The attacker-controlled subdomain may potentially set a parent-domain cookie:

```http
Set-Cookie: XSRF-TOKEN=EVIL;
Domain=cybermeru.com;
```

Now the attacker has injected a cookie into the same cookie scope.

This is called:

> **Cookie injection**

---

# Why Cookie Injection Matters for Naive Double-Submit

Naive Double-Submit essentially checks:

```text
Cookie == Header
```

Suppose attacker manages to inject:

```text
XSRF-TOKEN=EVIL999
```

If the attacker can also cause the request to contain:

```http
X-XSRF-TOKEN: EVIL999
```

the backend sees:

```text
Cookie = EVIL999
Header = EVIL999

        ↓

Cookie == Header

        ↓

       PASS
```

The backend cannot distinguish this attacker-generated token from a legitimate one.

Therefore:

> **Naive Double-Submit Cookie is vulnerable to cookie injection if an attacker can write a cookie into the relevant cookie scope.**

---

# Why `Domain=cybermeru.com` Is Important

When you specify:

```http
Domain=cybermeru.com
```

you intentionally make the cookie available to the domain's subdomains.

This creates a larger trust boundary:

```text
Domain=cybermeru.com
        ↓
multiple subdomains
        ↓
all potentially relevant to cookie scope
```

Therefore, every subdomain becomes important from a cookie-security perspective.

A vulnerable or compromised subdomain can potentially become relevant to cookie injection.

---

# `__Host-` Cookie

`__Host-` is a browser-enforced cookie security mechanism.

Example:

```http
Set-Cookie: __Host-XSRF-TOKEN=ABC123;
Path=/;
Secure;
```

For a `__Host-` cookie:

```text
✓ Secure required
✓ Path=/ required
✗ Domain attribute forbidden
```

The important rule is:

```text
NO Domain attribute
```

Therefore, the cookie becomes **host-only**.

If `api.cybermeru.com` creates:

```text
__Host-XSRF-TOKEN=ABC123
```

the cookie belongs specifically to:

```text
api.cybermeru.com
```

not:

```text
cybermeru.com
```

and not:

```text
app.cybermeru.com
```

---

# Why `__Host-` Helps

Suppose:

```text
evil.cybermeru.com
```

is compromised.

It tries:

```http
Set-Cookie: __Host-XSRF-TOKEN=EVIL;
Domain=cybermeru.com;
```

The browser rejects it because:

```text
__Host- cookie
       +
Domain attribute
       =
INVALID
```

A subdomain therefore cannot use the `Domain` attribute to create/overwrite a `__Host-` cookie for another host.

So:

```text
api.cybermeru.com
       ↓
__Host-XSRF-TOKEN
       ↓
host-only
       ↓
protected from sibling-subdomain
cookie injection
```

---

# `__Host-` Does NOT Mean "CSRF Protection"

Important distinction:

```text
CSRF token
        ↓
prevents cross-site request attacks

__Host- cookie
        ↓
strengthens cookie scoping
        ↓
helps prevent cookie injection
```

`__Host-` itself is not a CSRF mechanism.

It is a **cookie security mechanism** that can strengthen a CSRF design.

---

# Problem With `__Host-` in Your Architecture

Your architecture is approximately:

```text
app.cybermeru.com
       ↓
     React

api.cybermeru.com
       ↓
   Spring Boot
```

Suppose API creates:

```http
Set-Cookie: __Host-XSRF-TOKEN=ABC123;
Path=/;
Secure;
```

The cookie belongs to:

```text
api.cybermeru.com
```

But your React application runs on:

```text
app.cybermeru.com
```

JavaScript on `app.cybermeru.com` cannot read the host-only cookie belonging to `api.cybermeru.com`.

Therefore:

```text
api.cybermeru.com
       ↓
__Host-XSRF-TOKEN
       ↓
❌ JavaScript on app.cybermeru.com cannot read it
```

This matters because your current Double-Submit implementation requires the frontend to read the CSRF cookie and copy it into:

```http
X-XSRF-TOKEN
```

---

# Why Reverse Proxy Can Help

A reverse proxy can expose frontend and backend through the **same origin**:

```text
https://cybermeru.com
        |
        ├── /
        │    ↓
        │   React
        │
        └── /api
             ↓
          Spring Boot
```

Internally:

```text
Browser
   ↓
cybermeru.com
   ↓
Reverse Proxy
   ├── /       → Frontend
   └── /api    → Backend
```

Now the browser sees everything under:

```text
cybermeru.com
```

The backend can create:

```http
Set-Cookie: __Host-XSRF-TOKEN=ABC123;
Path=/;
Secure;
```

and the frontend is on the same host.

Therefore the frontend can read the non-HttpOnly CSRF cookie and send:

```http
X-XSRF-TOKEN: ABC123
```

### Important

Reverse proxy is **not required to use `__Host-`**.

It simply makes `__Host-` easier to use when your frontend and backend currently live on different subdomains.

---

# Naive vs Stronger Double-Submit

### Naive Double-Submit

```text
Random CSRF token
       ↓
Cookie
       +
Header
       ↓
Cookie == Header
```

Good against normal cross-site attackers.

But:

```text
Cookie injection
       ↓
attacker controls cookie
       ↓
Cookie == Header
       ↓
potential bypass
```

---

### Signed / Session-Bound Double-Submit

The token is cryptographically tied to server-known information, such as the user's session.

Conceptually:

```text
CSRF token
    =
HMAC(serverSecret, sessionId + randomValue)
```

The attacker might inject:

```text
EVIL999
```

but cannot generate a valid token for the victim's session without the server-side secret.

Backend verifies:

```text
Cookie exists
        +
Header exists
        +
Cookie == Header
        +
Token signature valid
        +
Token bound to correct session
```

This provides stronger protection against cookie-injection scenarios.

---

# Complete Mental Model

```text
                    CSRF ATTACK
                         |
                         ↓
          Attacker sends request from evil.com
                         |
                         ↓
              Browser automatically
              sends authentication cookie
                         |
                         ↓
              CSRF protection checks
                         |
              ┌──────────┴──────────┐
              ↓                     ↓
       CSRF token missing     CSRF token valid
              ↓                     ↓
           REJECT                 Continue
```

Normal attacker:

```text
evil.com
   ↓
cannot read victim's CSRF token
   ↓
cannot create matching header
   ↓
REJECT
```

Cookie-injection attacker:

```text
attacker controls subdomain
        ↓
injects parent-domain cookie
        ↓
naive Double-Submit
        ↓
Cookie == Header
        ↓
potential bypass
```

Stronger design:

```text
__Host- cookie
      +
signed/session-bound CSRF token
      ↓
cookie injection becomes much harder
      ↓
stronger CSRF protection
```

---

## Final revision points

- **CSRF token is not secret because the attacker can't generate one.**
    
- The important thing is that the attacker cannot obtain the **victim's token**.
    
- `evil.com` cannot normally set a cookie for `cybermeru.com`.
    
- A compromised/vulnerable `*.cybermeru.com` subdomain may potentially inject a parent-domain cookie.
    
- `Domain=cybermeru.com` intentionally makes a cookie available across subdomains.
    
- This broader scope creates a **cookie-injection risk**.
    
- Naive Double-Submit only checks:
    

```text
Cookie == Header
```

- If an attacker can control both values through cookie injection, naive Double-Submit can potentially be bypassed.
    
- `__Host-` requires:
    
    - `Secure`
        
    - `Path=/`
        
    - **no `Domain`**
        
- `__Host-` makes the cookie **host-only**.
    
- A sibling subdomain cannot create a `__Host-` cookie for another host.
    
- `__Host-` is **not itself CSRF protection**; it strengthens cookie security.
    
- With `app.cybermeru.com` + `api.cybermeru.com`, a host-only `__Host-` cookie on the API cannot be read by frontend JavaScript on the app subdomain.
    
- A reverse proxy can put frontend and backend behind one host, making `__Host-` easier to use.
    
- Reverse proxy is **not mandatory** for `__Host-`.
    
- A **signed/session-bound Double-Submit token** provides stronger protection than simple cookie/header equality.
---


