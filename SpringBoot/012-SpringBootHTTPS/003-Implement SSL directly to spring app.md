
---

## **Step 3: Install Certbot on Your Server**

Certbot is a **tool** that helps you get an SSL certificate from Let’s Encrypt **automatically**. Instead of manually creating SSL keys, Certbot does everything for you.

💡 **Example:**  
Think of Certbot like a **self-checkout machine** in a store. Instead of waiting for someone to issue an SSL certificate, Certbot helps you get one instantly.

We need to **install Certbot** to request an SSL certificate.

### **📌 Steps to Install Certbot (For Ubuntu users)**

1. **Update your package list** to make sure you get the latest software:
    
    ```bash
    sudo apt update
    ```
    
2. **Install Certbot**:
    
    ```bash
    sudo apt install certbot
    ```
    

✅ **Now Certbot is installed!**

---

## **Step 4: Get an SSL Certificate Using Certbot**

Now, we will generate an **SSL certificate** for our domain.

### **📌 Run this command** (Replace `yourdomain.com` with your actual domain):

```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### **💡 Explanation:**

- `certbot certonly` → We are **only requesting a certificate** (not auto-configuring a web server).
- `--standalone` → Certbot will **temporarily start its own web server** to verify your domain.
- `-d yourdomain.com -d www.yourdomain.com` → These are the **domains** for which we need an SSL certificate.
- Note : You can skip  `-d www.yourdomain.com`

### **📌 What happens next?**

1. Certbot **verifies** that you own `yourdomain.com`.
2. If successful, it **generates SSL certificates** and stores them in:
    
    ```
    /etc/letsencrypt/live/yourdomain.com/
    ```
    
3. You will see **four important files**:
    - **fullchain.pem** → The SSL certificate (used for authentication).
    - **privkey.pem** → The private key (used for encryption).
    - **cert.pem** → The main certificate.
    - **chain.pem** → The intermediate certificate.

✅ **Now you have an SSL certificate from Let’s Encrypt!**

---

## **Step 5: Convert SSL Certificate to PKCS12 Format**

Spring Boot requires a **PKCS12 keystore** format to use SSL.

### **📌 Convert the Certificate to `.p12` Format:**

```bash
sudo openssl pkcs12 -export \
    -inkey /etc/letsencrypt/live/yourdomain.com/privkey.pem \
    -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem \
    -out /etc/letsencrypt/live/yourdomain.com/keystore.p12 \
    -name tomcat
    -password pass:yourpassword
```

### **💡 Explanation:**

- `-inkey privkey.pem` → Use your **private key**.
- `-in fullchain.pem` → Use your **certificate**.
- `-out keystore.p12` → Create a new `.p12` keystore.
- `-name tomcat` → Give the keystore an **alias** ("tomcat" is just a name).
- `-password pass:` : Password for spring boot app to connect


✅ **Now your SSL certificate is converted to a format that Spring Boot can use!**

**Note : 
 Give proper permission to `keystore.p12` path so spring boot can access this path.**
```bash
    sudo chmod 644 /home/ubuntu/your-app/keystore.p12
 ```
---

## **Step 6: Configure SSL in Spring Boot**

Now, we will **tell Spring Boot to use SSL**.

### **📌 Add These Lines to `application.properties`**

```properties
server.port=443
server.ssl.key-store-type=PKCS12
server.ssl.key-store=/etc/letsencrypt/live/yourdomain.com/keystore.p12
server.ssl.key-store-password=yourpassword
server.ssl.key-alias=tomcat
```

### **💡 Explanation:**

- `server.port=443` → Spring Boot will run on port **8443** (HTTPS).
- `server.ssl.key-store-type=PKCS12` → We are using a **PKCS12** keystore.
- `server.ssl.key-store=.../keystore.p12` → The **path** to our keystore file.
- `server.ssl.key-store-password=yourpassword` → The **password** you set in Step 5.
- `server.ssl.key-alias=tomcat` → The **alias** we gave in Step 5.

✅ **Now Spring Boot is configured to use SSL!**

---

## **Step 7: Restart Your Spring Boot Application**

Now restart  Spring Boot application to apply the changes.

```bash
sudo systemctl restart your-spring-boot-app
```

✅ **Now your Spring Boot application is running with HTTPS!**

---

## **Step 8: Test Your SSL Configuration**

1. Open  browser and go to:
    
    ```
    https://yourdomain.com:8443
    ```
    
2. If everything is set up correctly, you should see **a secure lock 🔒 in the browser**.

✅ **Congratulations!  Spring Boot app is now secured with SSL! 🎉**

---

## **Step 9: Auto-Renew Your SSL Certificate**

Let’s Encrypt certificates expire every **90 days**, so we need to set up auto-renewal.

### **📌 Test Renewal Manually**

```bash
sudo certbot renew --dry-run
```

### **📌 Set Up Auto-Renewal (Crontab)**

```bash
sudo crontab -e
```

Add this line at the bottom:

```bash
0 0 * * 1 certbot renew --quiet && \
openssl pkcs12 -export \
-inkey /etc/letsencrypt/live/yourdomain.com/privkey.pem \
-in /etc/letsencrypt/live/yourdomain.com/fullchain.pem \
-out /etc/letsencrypt/live/yourdomain.com/keystore.p12 \
-name tomcat -passout pass:yourpassword && \
systemctl restart your-spring-boot-app
```

This will **auto-renew your SSL certificate every Monday at midnight**.

✅ **Now  SSL will be automatically renewed!**

---
## Steps to renew : 
- Stop running spring boot application
- sudo lsof -i :443 : use this command to see running any app and if it is kill it
- sudo certbot renew run this command then
- Run spring boot application

