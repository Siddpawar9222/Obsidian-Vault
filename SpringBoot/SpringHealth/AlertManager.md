
---



---

##  **What is Alertmanager? (In Simple Words)**

- Prometheus collects **metrics** (like CPU, errors, memory).
    
- But Prometheus **alone doesn’t send alerts** like emails, Slack messages, etc.
    
- **Alertmanager** helps Prometheus by **sending alerts to you** when something bad happens (like memory too high, app is down, etc.).
    

---

## ⚙️ Step-by-Step: Install & Setup Alertmanager (Windows – No Docker)

---

###  **Step 5.1: Download and Run Alertmanager**

1. Go to [Alertmanager Releases](https://prometheus.io/download/#alertmanager)
    
2. Download the **Windows zip** for Alertmanager.
    
3. Extract the zip to a folder like:
    
    ```
    C:\Tools\alertmanager
    ```
    
4. Inside that folder, create a new file:
    
    ```
    alertmanager.yml
    ```
    
5. Paste this sample config inside `alertmanager.yml`:
    
    ```yaml
    global:
      resolve_timeout: 1m
    
    route:
      receiver: 'email-alert'
    
    receivers:
      - name: 'email-alert'
        email_configs:
          - to: 'your-email@example.com'
            from: 'alertmanager@example.com'
            smarthost: 'smtp.gmail.com:587'
            auth_username: 'your-email@example.com'
            auth_password: 'your-app-password'
            auth_identity: 'your-email@example.com'
            require_tls: true
    ```
    
    > 🔒 Use **Gmail App Password** (not your normal password). You can also skip email and use other receivers like Slack, webhook, etc.
    
6. Run it with:
    
    ```bash
    alertmanager.exe --config.file=alertmanager.yml
    ```
    
7. Open browser and go to:
    
    ```
    http://localhost:9093
    ```
    

---

###  **Step 5.2: Configure Prometheus to Use Alertmanager**

1. Go to your `prometheus.yml` file.
    
2. Add this block at the end:
    
    ```yaml
    alerting:
      alertmanagers:
        - static_configs:
            - targets:
                - "localhost:9093"
    ```
    

---

### ✅ **Step 5.3: Add Some Alert Rules in Prometheus**

1. In your `prometheus.yml`, add a new file under `rule_files`:
    
    ```yaml
    rule_files:
      - "alert_rules.yml"
    ```
    
2. Create a new file in the same directory as Prometheus:
    
    ```
    alert_rules.yml
    ```
    
3. Paste a simple alert rule:
    
    ```yaml
    groups:
      - name: example-alert
        rules:
          - alert: HighMemoryUsage
            expr: jvm_memory_used_bytes / jvm_memory_max_bytes > 0.8
            for: 1m
            labels:
              severity: warning
            annotations:
              summary: "High JVM memory usage"
              description: "Memory usage is above 80% for more than 1 minute."
    ```
    

---

### **Step 5.4: Restart Prometheus**

After updating both `prometheus.yml` and creating `alert_rules.yml`, **restart Prometheus** so changes take effect.

---

### Now You’re All Set

- If memory usage crosses 80% for 1 minute, **Prometheus triggers an alert.**
    
- **Alertmanager** catches that and sends you email (or Slack/webhook if configured).
    

---
Perfect! You can use your **Brevo SMTP credentials** in **Alertmanager** to send email alerts. Here’s how you can configure your `alertmanager.yml` using the info from your Brevo dashboard.

---

### ✅ Step-by-step Alertmanager SMTP config (for Brevo):

```yaml
global:
  smtp_smarthost: 'smtp-relay.brevo.com:587'
  smtp_from: '81fc48001@smtp-brevo.com'   # Your Brevo login (from image)
  smtp_auth_username: '81fc48001@smtp-brevo.com'
  smtp_auth_password: 'your-smtp-key'     # Use the "spring-app-1" key here
  smtp_require_tls: true

route:
  receiver: 'email-alert'

receivers:
  - name: 'email-alert'
    email_configs:
      - to: 'your-destination-email@gmail.com'
        send_resolved: true
```

---

### 🛡️ Important Notes:

- Replace `'your-smtp-key'` with the actual key like `**********9adfjM` shown under "spring-app-1".
    
- Replace `'your-destination-email@gmail.com'` with the email where you want to **receive alerts**.
    
- Keep your SMTP key **private** (do not upload to GitHub).
    
- Make sure port `587` is open in your firewall/VM/network.
    
- If running in Docker, expose port properly.
    

---

### ✅ Example Use Case:

If a Spring Boot app metric like memory usage exceeds 80%, Prometheus will trigger an alert → Alertmanager will email you via Brevo.

---

Do you want me to help test this setup? Or should I help you **trigger a test alert**?