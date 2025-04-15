

---

###  Step 1: Install Prometheus

```bash
cd /opt
sudo useradd --no-create-home --shell /bin/false prometheus

# Download latest version (you can also visit https://prometheus.io/download/)
wget https://github.com/prometheus/prometheus/releases/download/v2.51.2/prometheus-2.51.2.linux-amd64.tar.gz

tar -xvzf prometheus-2.51.2.linux-amd64.tar.gz
mv prometheus-2.51.2.linux-amd64 prometheus
cd prometheus
```

Create Prometheus config file:

```bash
sudo nano /opt/prometheus/prometheus.yml
```

Paste this config (edit your Spring Boot HTTPS URL):

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    scheme: 'https'
    static_configs:
      - targets: ['your-springboot-domain.com']
```

---

###  Step 2: Run Prometheus

Create a service:

```bash
sudo nano /etc/systemd/system/prometheus.service
```

Paste:

```ini
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
ExecStart=/opt/prometheus/prometheus \
  --config.file=/opt/prometheus/prometheus.yml \
  --storage.tsdb.path=/opt/prometheus/data

[Install]
WantedBy=default.target
```

Then:

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
```

Check status:

```bash
sudo systemctl status prometheus
```

Now access Prometheus:

```
http://your-server-ip:9090
```

---

###  Step 3: Install Grafana

```bash
sudo apt-get install -y apt-transport-https software-properties-common wget
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -

echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

sudo apt-get update
sudo apt-get install grafana -y

sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

Access Grafana:

```
http://your-server-ip:3000
```

Default credentials:

```
Username: admin
Password: admin
```

Then:

- Go to "Add Data Source"
    
- Choose "Prometheus"
    
- Set URL: `http://localhost:9090`
    
- Save & Test
    

---

### Step 4: Install Alertmanager

```bash
cd /opt
wget https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz
tar -xvzf alertmanager-0.27.0.linux-amd64.tar.gz
mv alertmanager-0.27.0.linux-amd64 alertmanager
cd alertmanager
```

Create config:

```bash
sudo nano alertmanager.yml
```

Paste:

```yaml
global:
  resolve_timeout: 5m

route:
  receiver: 'default'

receivers:
  - name: 'default'
    email_configs:
      - to: 'your-email@example.com'
        from: 'alertmanager@yourdomain.com'
        smarthost: 'smtp.yourprovider.com:587'
        auth_username: 'your-email@example.com'
        auth_identity: 'your-email@example.com'
        auth_password: 'your-email-password'
        require_tls: true
```

Create service:

```bash
sudo nano /etc/systemd/system/alertmanager.service
```

Paste:

```ini
[Unit]
Description=Alertmanager
After=network.target

[Service]
ExecStart=/opt/alertmanager/alertmanager \
  --config.file=/opt/alertmanager/alertmanager.yml \
  --storage.path=/opt/alertmanager/data

[Install]
WantedBy=multi-user.target
```

Start service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable alertmanager
sudo systemctl start alertmanager
```

Access Alertmanager:

```
http://your-server-ip:9093
```

---

### Step 5: Connect Prometheus to Alertmanager

In your Prometheus config (`prometheus.yml`), add this at the bottom:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - localhost:9093
```

Then restart Prometheus:

```bash
sudo systemctl restart prometheus
```

---

### Step 6: Add Alert Rule for Exception Count

In the same `prometheus.yml`:

```yaml
rule_files:
  - "alert-rules.yml"
```

Now create:

```bash
sudo nano /opt/prometheus/alert-rules.yml
```

Paste:

```yaml
groups:
  - name: springboot-alerts
    rules:
      - alert: HighExceptionCount
        expr: service_exception_count > 10
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High exception count in service"
          description: "Exception count is {{ $value }}."
```

Reload config:

```bash
sudo systemctl restart prometheus
```

---

##  Final URLs:

|Tool|URL|
|---|---|
|Prometheus|[http://your-server-ip:9090](http://your-server-ip:9090/)|
|Grafana|[http://your-server-ip:3000](http://your-server-ip:3000/)|
|Alertmanager|[http://your-server-ip:9093](http://your-server-ip:9093/)|

---

### Some Errors 

---

```
panic: Unable to create mmap-ed active query log
```

---

###  What this means:

Prometheus is trying to create a file in its **data directory** (at `/opt/prometheus/data`), but:

- It **doesn’t have write permission**, or
    
- The **directory doesn't exist**, or
    
- There's a **disk/memory issue** (rare).
    

---

### Fix it step-by-step

#### 1. **Make sure the directory exists:**

```bash
sudo mkdir -p /opt/prometheus/data
```

#### 2. **Give Prometheus permission to write:**

```bash
sudo chown -R $USER:$USER /opt/prometheus/data
```

If Prometheus runs as a special user (e.g. `prometheus`), use:

```bash
sudo chown -R prometheus:prometheus /opt/prometheus/data
```

#### 3. **(Optional)** Clean up existing files if you're reinstalling:

```bash
sudo rm -rf /opt/prometheus/data/*
```

---

### Then restart Prometheus:

```bash
sudo systemctl restart prometheus
```

### 🔍 Check the status again:

```bash
sudo systemctl status prometheus
```

If it's still crashing, run this to see full error log:

```bash
journalctl -u prometheus.service -e
```

---



```
unable to initialize gossip mesh
err="couldn't deduce an advertise address: no suitable IP address found"
```

---

### What does it mean?

Alertmanager runs in a **cluster mode** by default, even if you're using it alone. To do this, it tries to **detect your server’s IP address**, but **it failed to find one** — that’s why it crashed.

---

###  Solution: Disable clustering or explicitly set the IP address

You have **two simple options**:

---

###  **Option 1: Disable clustering (Recommended for single-node setup)**

Edit your **systemd service file**:

```bash
sudo nano /etc/systemd/system/alertmanager.service
```

Find this line:

```
ExecStart=/opt/alertmanager/alertmanager --config.file=/opt/alertmanager/alertmanager.yml --storage.path=/opt/alertmanager/data
```

 Change it to:

```bash
ExecStart=/opt/alertmanager/alertmanager \
  --config.file=/opt/alertmanager/alertmanager.yml \
  --storage.path=/opt/alertmanager/data \
  --cluster.listen-address=""
```

> This disables clustering and solves the IP error.

---

###  **Option 2: Set your IP manually (only needed for cluster mode)**

If you want cluster mode, find your server IP:

```bash
hostname -I
```

Then add:

```bash
--cluster.advertise-address=YOUR_IP:9094
```

But for now, **Option 1 is enough** since you’re using it standalone.

---

###  Final steps

1. Save the service file
    
2. Reload systemd:
    

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
```

3. Restart Alertmanager:
    

```bash
sudo systemctl restart alertmanager
```

4. Check status:
    

```bash
sudo systemctl status alertmanager
```

---

You can check the logs of Alertmanager on your Linux server using this command:

###  Check logs with `journalctl`

If you installed and run Alertmanager using `systemd` (as a service), use:

```bash
journalctl -u alertmanager -f
```

- `-u alertmanager` → filter logs for the alertmanager service
    
- `-f` → shows real-time logs (like `tail -f`)
    

---

###  To see last 50 lines of logs:

```bash
journalctl -u alertmanager -n 50
```

This is useful to check what happened recently (like email failures, config errors, etc.)

---

### To check logs from a specific time:

```bash
journalctl -u alertmanager --since "10 minutes ago"
```

Or use a specific time:

```bash
journalctl -u alertmanager --since "2025-04-15 10:00:00"
```

---

###  Restart Alertmanager & Watch Logs:

```bash
sudo systemctl restart alertmanager
journalctl -u alertmanager -f
```

This will show any startup errors and whether emails are being sent.

---

## Not solved 

Apr 15 12:13:29 vps alertmanager[40090]: ts=2025-04-15T12:13:29.275Z caller=dispatch.go:353 level=error compone nt=dispatcher msg="Notify for alerts failed" num_alerts=1 err="email-alert/email[0]: notify retry canceled afte r 2 attempts: context deadline exceeded" Apr 15 12:13:53 vps alertmanager[40090]: ts=2025-04-15T12:13:53.641Z caller=dispatch.go:353 level=error component=dispatcher msg="Notify for alerts failed" num_alerts=1 err="email-alert/email[0]: notify retry canceled after 2 attempts: context deadline exceeded"