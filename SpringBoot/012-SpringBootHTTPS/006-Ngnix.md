

---


```bash
sudo nginx -t  # Check for errors
sudo systemctl restart nginx  # Restart Nginx
sudo systemctl status nginx  # Check if it's running

```


Here is your **Nginx configuration file** with detailed explanations in comments:

```nginx
# This server block listens on port 80 (HTTP) and redirects all requests to HTTPS
server {
    listen 80;  # Listen for incoming connections on port 80 (HTTP)
    server_name stage.techeazyconsulting.com;  # The domain name for this server

    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

# This server block listens on port 443 (HTTPS) and acts as a reverse proxy to Spring Boot
server {
    listen 443 ssl;  # Listen for incoming connections on port 443 (HTTPS)
    server_name stage.techeazyconsulting.com;  # The domain name for this server

    # SSL certificate settings (provided by Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/stage.techeazyconsulting.com/fullchain.pem;  # Path to SSL certificate
    ssl_certificate_key /etc/letsencrypt/live/stage.techeazyconsulting.com/privkey.pem;  # Path to SSL private key

    # Location block defines how requests should be handled
    location / {
        proxy_pass https://localhost:8080;  # Forward requests to Spring Boot running on port 8080 with HTTPS
        proxy_ssl_verify off;  # Disable SSL certificate verification for the backend server (Spring Boot)
        
        # Pass necessary headers to maintain original request information
        proxy_set_header Host $host;  # Preserve the original host header
        proxy_set_header X-Real-IP $remote_addr;  # Forward the client's real IP address
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # Forward the original client IP in case of proxies
    }
}
```

### 🔍 **What This Does**

1. **For HTTP (Port 80)**
    
    - Listens on port `80` (non-secure HTTP).
    - Redirects all requests to **HTTPS** using a `301` redirect.
2. **For HTTPS (Port 443)**
    
    - Listens on port `443` (secure HTTPS).
    - Uses SSL certificates from **Let's Encrypt** for encryption.
    - Acts as a **reverse proxy** to forward requests to the Spring Boot application running on `https://localhost:8080`.
    - Disables SSL verification (`proxy_ssl_verify off`) since Spring Boot already has SSL.
    - Passes request headers so the Spring Boot application knows the original request details.




### **Why Does Nginx Need an SSL Certificate If the Backend (Spring Boot) is Handling SSL?**

- When a user visits `https://stage.techeazyconsulting.com`, their browser connects **to Nginx first**.
- Since browsers expect **a valid SSL certificate** on port `443`, Nginx needs an SSL certificate to establish a secure connection.



- If **Nginx is handling SSL**, Spring Boot **should not** handle SSL.
- If **Spring Boot is handling SSL**, Nginx **still needs an SSL certificate** to accept secure connections from users.
- The best practice is to **let Nginx handle SSL** and forward plain HTTP traffic to Spring Boot.


---
Right now, **Nginx is acting as a reverse proxy** between your users and your Spring Boot backend.

### 🔍 **Why Use Nginx?**

1. **Handles Incoming Requests**
    
    - Users visit `https://stage.techeazyconsulting.com`.
    - Nginx receives the request **before** sending it to Spring Boot.
2. **Security (SSL & Firewall Protection)**
    
    - Nginx manages **SSL certificates** to keep the connection secure.
    - It can block **malicious requests** before they reach Spring Boot.
3. **Performance & Load Balancing**
    
    - Nginx can handle **many users at once** and forward traffic efficiently.
    - It can distribute load between **multiple backend servers** if needed.
4. **Hiding Backend Details**
    
    - Users **never see your backend server** (localhost:8080).
    - This protects your infrastructure from **direct attacks**.

---

### 🔥 **Real-World Example**

Think of **Nginx as a receptionist at a company**:

- **User (Guest)** → Arrives at the front desk (Nginx).
- **Nginx (Receptionist)** → Verifies who they are and forwards them to the right office (Spring Boot backend).
- **Spring Boot (Office)** → Handles the actual request.

This way, **Spring Boot doesn’t have to handle everything directly**, making your system **safer and more efficient**.

---

### **🛠 What is a Reverse Proxy?**

A **reverse proxy** is a server that sits **between users and backend servers**. It receives requests from users, forwards them to backend servers (like your Spring Boot app), and then sends the response back to the user.

### **🖥 How Does It Work?**

1️⃣ **User Requests a Web Page**

- The user visits `https://stage.techeazyconsulting.com`.
- The request goes to the **reverse proxy (Nginx)** instead of directly hitting the backend.

2️⃣ **Reverse Proxy Forwards the Request**

- Nginx receives the request and **forwards** it to `https://localhost:8080` (Spring Boot backend).

3️⃣ **Backend Processes the Request**

- Spring Boot processes the request and sends a response **back to Nginx**.

4️⃣ **Reverse Proxy Sends the Response to the User**

- Nginx forwards the backend response to the user.

---

### **🔍 Why Use a Reverse Proxy?**

✅ **Hides Backend Servers** → Users don’t directly access `localhost:8080`, improving security.  
✅ **Manages SSL (HTTPS)** → Nginx can handle SSL encryption instead of Spring Boot.  
✅ **Load Balancing** → Can distribute traffic across multiple backend servers for better performance.  
✅ **Caching** → Can store frequently requested data to reduce load on the backend.  
✅ **Rate Limiting & Security** → Can block bad traffic (e.g., too many requests from one user).

---