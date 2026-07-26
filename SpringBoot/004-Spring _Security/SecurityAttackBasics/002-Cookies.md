
---

# Cookies - Complete Guide 

---

# What is a Cookie?

A cookie is a **small piece of text data** stored by the browser on behalf of a website.

The server sends a cookie to the browser using the **Set-Cookie** HTTP response header.

The browser stores it.

Later, whenever the browser sends another request to the same website, it automatically includes that cookie.

```
Browser ------------------> Login Request

Server
    |
    | Set-Cookie: SESSION=abc123
    |
    V

Browser stores cookie

Next Request

Browser ------------------>
Cookie: SESSION=abc123
```

Cookies were introduced because **HTTP is stateless**.

---

# What does "HTTP is Stateless" mean?

Every HTTP request is independent.

Example:

```
GET /login

↓

Server returns response
```

Later,

```
GET /profile
```

The server has no memory that both requests came from the same user.

Cookies solve this problem.

---

# Why Do We Need Cookies?

Without cookies:

```
Login

↓

Server authenticates user

↓

Next request

↓

Server forgets user
```

With cookies:

```
Login

↓

Server creates cookie

↓

Browser stores cookie

↓

Future requests automatically send cookie

↓

Server identifies user
```

---

# Where are Cookies Stored?

Inside the browser.

Every browser has its own cookie storage.

Chrome

Firefox

Edge

Safari

Each browser stores cookies separately.

---

# Who Creates Cookies?

Usually the backend.

Example

Spring Boot

```
Set-Cookie:
SESSION=abc123
```

Browser stores it automatically.

---

# Can Frontend Create Cookies?

Yes.

JavaScript can create cookies.

Example

```javascript
document.cookie = "theme=dark";
```

But…

**JavaScript cannot create HttpOnly cookies.**

**Only the server can.**

---

# Cookie Lifecycle

```
Server

↓

Set-Cookie

↓

Browser stores

↓

Browser sends automatically

↓

Server reads cookie

↓

Cookie expires

↓

Browser deletes it
```

---

# Cookie Structure

Example

```
Set-Cookie:

SESSION=abc123;
Path=/;
HttpOnly;
Secure;
SameSite=Lax;
Max-Age=3600
```

Everything after the value is called a **Cookie Attribute**.

---

# Cookie Components

```
Name

SESSION

Value

abc123

Attributes

HttpOnly

Secure

SameSite

Path

Domain

Expires

Max-Age
```

---

# Types of Cookies

There are many ways to classify cookies.

---

## Session Cookie

No expiry date.

Browser deletes it after closing.

Example

```
SESSION=abc123
```

Use Case

Temporary login session

---

## Persistent Cookie

Contains expiry time.

Browser keeps it until expiration.

Example

```
rememberMe=true
Expires=2027
```

Use Case

Remember Me

Language preference

Dark mode

---

## First-Party Cookie

Created by the same website.

Example

```
amazon.com

↓

Cookie belongs to amazon.com
```

Most login cookies are first-party.

---

## Third-Party Cookie

Created by another domain.

Example

```
news.com

↓

Loads Facebook widget

↓

Facebook sets cookie
```

Mostly used for:

Advertising

Tracking

Analytics

Modern browsers block many third-party cookies by default.

---

## Secure Cookie

Only sent over HTTPS.

```
Secure
```

Never sent over HTTP.

---

## HttpOnly Cookie

Cannot be read using JavaScript.

```
document.cookie
```

returns nothing for HttpOnly cookies.

Excellent protection against XSS.

---

## SameSite Cookie

Controls cross-site requests.

```
SameSite=Strict

SameSite=Lax

SameSite=None
```

We'll discuss these later.

---

# Cookie Attributes

---

## Domain

Determines which domain receives the cookie.

Example

```
Domain=example.com
```

Cookie goes to

```
example.com

api.example.com

admin.example.com
```

---

## Path

Limits cookie to a path.

```
Path=/api
```

Only API endpoints receive it.

---

## Expires

Specific date.

```
Expires=Wed, 20 Jan 2027
```

---

## Max-Age

Lifetime in seconds.

```
Max-Age=3600
```

One hour.

---

## Secure

```
Secure
```

Only HTTPS.

Production always uses Secure.

---

## HttpOnly

```
HttpOnly
```

JavaScript cannot read.

---

## SameSite

Controls cross-site behavior.

---

# SameSite Modes

---

## Strict

Cookie only sent when user is already on same site.

Highest protection.

Sometimes affects usability.(navigation from other link)

---

## Lax

Modern default.

Allows normal navigation.

Blocks most CSRF attacks.

Most production apps use this.

---

## None

Cookie sent everywhere.

Requires

```
Secure
```

Used when frontend and backend are on different sites.

---

# Cookie Flow

```
Browser

↓

POST /login

↓

Server

↓

Set-Cookie

↓

Browser stores

↓

GET /profile

↓

Cookie automatically attached
```

No JavaScript required.

---

# How Browser Sends Cookies

Suppose browser has

```
SESSION=abc123
```

Request becomes

```
GET /profile

Cookie:

SESSION=abc123
```

Browser adds it automatically.

---

# Can JavaScript Read Cookies?

Normal cookie

```
Yes
```

HttpOnly cookie

```
No
```

---

# Can Postman Store Cookies?

Yes.

Cookie Jar.

But unlike browsers,

Postman is not enforcing SOP or CORS.

---

# Can Mobile Apps Use Cookies?

Yes.

But mobile apps usually prefer

```
Authorization:

Bearer JWT
```

instead of cookies.

---

# Cookies vs Sessions

Many beginners confuse these.

Cookie

Stored in browser.

Session

Stored on server.

Cookie usually stores

```
Session ID
```

Server stores

```
Actual user information
```

```
Cookie

↓

SESSION=abc123

↓

Server

↓

abc123

↓

User Information
```

---

# Cookies vs LocalStorage

|Feature|Cookie|LocalStorage|
|---|---|---|
|Size|~4 KB|~5-10 MB|
|Automatically sent|✅ Yes|❌ No|
|HttpOnly support|✅ Yes|❌ No|
|Accessible by JavaScript|Optional|Always|
|Better for Authentication|✅ Yes|❌ Usually No|

---

# Cookies vs SessionStorage

|Feature|Cookie|SessionStorage|
|---|---|---|
|Shared across tabs|Yes|No|
|Auto attached|Yes|No|
|Expires|Configurable|Browser tab close|

---

# Cookies vs JWT

JWT is **not** a cookie.

JWT is simply a token.

You can store JWT

- inside a Cookie
    
- inside LocalStorage
    
- inside SessionStorage
    
- inside Memory

Cookie is storage.

JWT is data.

---

# Cookies in Spring Boot

Login endpoint

↓

Generate JWT

↓

Create Cookie

↓

Return

```
Set-Cookie
```

Every request

↓

Browser automatically sends

```
Cookie:

jwt=…
```

JWT Filter

↓

Read Cookie

↓

Validate JWT

↓

Authenticate User

---

# Cookies in OAuth2 Login

Google Login

↓

Google returns Authorization Code

↓

Backend exchanges code

↓

Backend creates JWT

↓

JWT stored in HttpOnly Cookie

↓

User authenticated

---

# Production Best Practices

Always use

```
HttpOnly
```

Always use

```
Secure
```

Always use HTTPS.

Use

```
SameSite=Lax
```

for most browser applications.

Keep Access Token expiry short (10–15 minutes).

Store Refresh Token in a separate HttpOnly cookie.

Rotate Refresh Tokens.

Never store passwords in cookies.

Never store sensitive user information directly inside cookies.

Encrypt or sign cookie contents if they contain sensitive data.

Limit cookie scope using `Path` and `Domain` to the minimum required.

---

