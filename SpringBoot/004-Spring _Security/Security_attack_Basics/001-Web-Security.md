# Web Security: Same-Origin Policy (SOP), CORS, CSRF, and Preflight

This guide covers the fundamental security mechanisms implemented by web browsers to protect users and APIs. If you are learning Spring Security, understanding these browser behaviors is essential.

---

## Part 1: Same-Origin Policy (SOP)

### What is the Same-Origin Policy?
The **Same-Origin Policy (SOP)** is a core security mechanism built into modern web browsers. It prevents JavaScript running on one website from reading data or interacting with resources on a different website.

#### The Browser Tab Example
Suppose you have two tabs open in your web browser:
* **Tab 1**: You are logged into `https://amazon.com` (viewing your private account).
* **Tab 2**: You are visiting a malicious site `https://evil.com`.

Without the Same-Origin Policy, JavaScript code running in **Tab 2** (`evil.com`) could reach into **Tab 1** (`amazon.com`), read your session cookies, and steal your personal info. The browser enforces the Same-Origin Policy to keep each tab's data completely isolated.


---

### What Defines an "Origin"?
An origin is defined by three components:
1. **Protocol** (e.g., `http` vs. `https`)
2. **Domain** (e.g., `example.com` vs. `api.example.com`)
3. **Port** (e.g., `:80`, `:443`, `:8080`)

All three must match exactly for two URLs to share the same origin.

| URL Compared to `https://example.com` | Same Origin? | Reason for Decision |
| :--- | :---: | :--- |
| `https://example.com/profile` | ✅ Yes | Same protocol, domain, and default port |
| `https://example.com:443` | ✅ Yes | Same protocol, domain, and explicit port |
| `http://example.com` | ❌ No | Different protocol (`http` vs `https`) |
| `https://api.example.com` | ❌ No | Different domain (subdomain `api.` is different) |
| `https://example.com:8080` | ❌ No | Different port (`8080` vs default `443`) |

---

### Accessing Cookies and LocalStorage
By default, JavaScript from one origin cannot read another origin's browser storage:

| Storage Type | Can Site B (`evil.com`) read Site A's data? |
| :--- | :---: |
| **`localStorage`** | ❌ No (Isolated by origin) |
| **`sessionStorage`** | ❌ No (Isolated by origin and tab) |
| **Standard Cookies** | ❌ No (Isolated by domain/path) |
| **`HttpOnly` Cookies** | ❌ No (Even JavaScript on Site A cannot read it) |

#### Special Case: Shared Parent Domains
If a cookie is created with `Domain=.example.com`, both `app.example.com` and `admin.example.com` subdomains will automatically send that cookie with HTTP requests to the server. However, whether JavaScript can read it using `document.cookie` still depends on safety flags like `HttpOnly`.

#### Special Case: XSS (Cross-Site Scripting) Attacks
If an attacker finds a vulnerability in Site A and injects malicious JavaScript into it, that script runs under **Site A's origin**. The browser thinks it is legitimate, so it **can** read non-`HttpOnly` cookies and local storage. This is why securing your site against XSS is critical.

#### Special Case: `HttpOnly` Cookies
Setting the `HttpOnly` flag on a cookie ensures that it is completely hidden from the browser's JavaScript API (e.g., `document.cookie` returns nothing). It is only managed and sent automatically by the browser's networking layer during HTTP requests. This prevents hackers from stealing session IDs using XSS.

---

## Part 2: CORS (Cross-Origin Resource Sharing)

### Why was CORS Introduced?
While the Same-Origin Policy (SOP) is great for security, modern web applications often need cross-origin communication. For example:
* Frontend runs on `https://app.company.com`
* Backend API runs on `https://api.company.com`

Without an exception, SOP would block the frontend from calling its own backend. **CORS (Cross-Origin Resource Sharing)** is the official HTTP-header-based mechanism that tells the browser it is safe to allow a cross-origin request.

---

### How CORS Works
When your JavaScript makes a cross-origin request, the browser automatically appends an `Origin` header. The server must reply with specific CORS response headers to approve it.

```text
  React App (https://app.company.com)
         │
         │ 1. JavaScript fetch()
         ▼
  [Browser] ─── 2. HTTP Request (Origin: https://app.company.com) ───► [Backend API]
            ◀── 3. HTTP Response (Access-Control-Allow-Origin: ...) ───
         │
         │ 4. Browser matches Origin with Access-Control-Allow-Origin
         ▼
  If matched: JavaScript receives JSON response
  If blocked: JavaScript gets a CORS Network Error
```

1. **The Request**: The browser adds the request header:
   ```http
   Origin: https://app.company.com
   ```
2. **The Server Policy**: The backend verifies the origin. If trusted, it responds with:
   ```http
   Access-Control-Allow-Origin: https://app.company.com
   ```
3. **The Browser Decision**: The browser compares the two. If they match, JavaScript receives the response data. If not, the browser blocks the response and throws a CORS error.

### Important: CORS is Browser-Enforced
CORS is **not** a firewall or a server-side security rule. It is a security instruction *from the server to the browser*. 
* Tools like **Postman**, **`curl`**, or another backend server do not enforce CORS because they are not browsers. 
* A backend server configured with restricted CORS will still accept, execute, and respond to requests from Postman or malicious python scripts.

---

### Simple Requests vs. Preflight Requests
Browsers divide CORS requests into two categories:

#### 1. Simple Requests
These requests are sent directly to the server without asking for permission first. A request is "simple" if it meets all these criteria:
* HTTP Methods: `GET`, `POST`, or `HEAD`.
* Allowed Content-Type headers: `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`.
* No custom headers (like `Authorization` or `X-Custom-Header`).

#### 2. Preflight Requests
If a request is not simple (e.g., it uses `PUT`, `DELETE`, or has custom headers like `Authorization` with JSON content type), the browser sends a **preflight request** first.

* The browser sends an `OPTIONS` request to verify the server's policies before sending the real request.
* **The OPTIONS Request**:
  ```http
  OPTIONS /users HTTP/1.1
  Origin: https://app.company.com
  Access-Control-Request-Method: PUT
  Access-Control-Request-Headers: Authorization
  ```
* **The Server Response**:
  ```http
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: https://app.company.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Authorization
  ```
* If the server approves the preflight request, the browser automatically sends the real `PUT` request.

---

## Part 3: Backend Request Execution Flow

Understanding how the backend handles CORS is critical for debugging Spring Boot and Spring Security.

### Flow 1: Simple Requests (e.g., GET /users)
For simple requests, the backend **executes your business logic first** before CORS checking happens on the browser.

```text
  Browser sends GET ──► [Auth Filter] ──► [Controller] ──► [Service] ──► [Database]
                                                                             │
  Browser Blocks JS ◀── [CORS Headers Added] ◀── [Normal HTTP Response] ◀─────┘
```

1. The backend receives the request.
2. It executes authentication filters, database transactions, and controllers.
3. The server generates the JSON payload, appends the configured CORS headers, and returns it.
4. The browser receives the response. **If the origin is not allowed, the browser hides the response from JavaScript.**
5. **Crucial point**: The database insert, update, or action on the backend *still happened*. Only the client-side JavaScript was blocked from seeing the result.

---

### Flow 2: Preflight OPTIONS Requests (e.g., PUT /users)
For preflight requests, the backend **intercepts the request early** and does not run your business logic.

```text
  Browser sends OPTIONS ──► [CORS Filter] (Checks configuration)
                                 │
  Browser sends PUT   ◀── [200 OK with CORS Headers] (No Controller/DB execution)
```

1. The browser sends `OPTIONS /users`.
2. The Spring Security/CORS filter chain intercepts the request.
3. The backend returns a `200 OK` response with allowed methods and origins immediately. **It does not invoke your Controller or query the Database.**
4. If approved, the browser sends the real `PUT` request, which runs normally.

---

## Part 4: CSRF (Cross-Site Request Forgery)

### What is a CSRF Attack?
**Cross-Site Request Forgery (CSRF)** forces a logged-in user's browser to execute an unwanted action on a trusted web application.

#### Scenario
1. You log into your banking site: `https://bank.com`.
2. The server authenticates you and stores your session ID in a browser cookie.
3. You open a new tab and visit a malicious site: `https://evil.com`.
4. `evil.com` runs JavaScript or hosts a hidden HTML form that submits a request to the bank:
   ```html
   <form action="https://bank.com/api/transfer" method="POST">
       <input name="to" value="attacker_account">
       <input name="amount" value="10000">
   </form>
   <script>document.forms[0].submit();</script>
   ```
5. When the form submits, the browser **automatically attaches your `bank.com` session cookie**.
6. The bank server sees a valid session cookie and processes the transfer of $10,000.

---

### Why CORS Does Not Protect Against CSRF
This is a very common point of confusion. You might think: *"If I set CORS to only allow `bank.com`, won't the browser block `evil.com`'s request?"*

**No, CORS will not stop CSRF.** Here is why:
1. **CORS only protects the response**: It prevents `evil.com` from *reading* the bank's response. It does not stop the browser from *sending* the request and executing the database action on the server. The attacker does not care about the response; they just want the transfer to happen.
2. **CORS does not apply to HTML forms**: Form submissions (`<form action="...">`) do not trigger CORS preflight checks or browser blocks.

---

### How to Protect Against CSRF

#### 1. CSRF Tokens (Synchronizer Token Pattern)
* The server generates a unique, unpredictable token (a CSRF Token) for the user's current session.
* When the user's frontend makes a mutation request (POST, PUT, DELETE), it must include this token in a custom header (e.g., `X-XSRF-TOKEN`).
* Since the malicious site `evil.com` cannot read the victim's CSRF token due to Same-Origin Policy (SOP), it cannot include the correct token in its forge request.
* The server compares the submitted token with the session token and rejects requests without a match.

#### 2. SameSite Cookie Attribute
Modern browsers support the `SameSite` cookie attribute to prevent automatic cookie sending on cross-site requests:
* **`SameSite=Strict`**: The cookie is never sent on cross-site requests (e.g., clicking a link from an email to the bank will not send the session cookie).
* **`SameSite=Lax` (Default in modern browsers)**: The cookie is not sent on cross-state subrequests (like images or forms triggered by `evil.com`), but is sent when a user navigates to the target site. This blocks most CSRF attacks.
* **`SameSite=None`**: The cookie is sent on all cross-origin requests (requires the `Secure` flag).

#### 3. Custom Headers
Adding custom headers (like `Authorization: Bearer <JWT>`) to API requests protects you because custom headers trigger preflight checks and cannot be sent via standard HTML forms. Additionally, malicious sites cannot steal or read JWTs stored in JavaScript memory/localStorage due to SOP.

---

## Part 5: Summary & Key Differences

| Concept | What is its primary focus? | Who enforces it? | Key Protection |
| :--- | :--- | :--- | :--- |
| **SOP** | Preventing cross-origin script access to local browser data. | The Browser | Protects `localStorage` and client storage. |
| **CORS** | Allowing trusted domains to read API responses. | The Browser (using server headers) | Controls **who can read** response data. |
| **CSRF Protection** | Preventing unauthorized actions using active sessions. | The Server (using tokens or SameSite flags) | Controls **who can perform actions**. |
