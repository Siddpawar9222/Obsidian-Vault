
---

## Expose Prometheus Endpoint:

- Add **Micrometer** (metrics library)
    
- Add **Spring Boot Actuator**
    
- Expose the `/actuator/prometheus` endpoint
---

## 🛠️ What is Micrometer?

Micrometer is like a **bridge** between Spring Boot and Prometheus.  
It collects metrics from Spring Boot and **formats them for Prometheus**.

So when Prometheus scrapes your app, it understands the metrics.

Micrometer is a metrics collection library that acts as a facade(**simplified interface**) for various monitoring systems. It provides a vendor-neutral API to instrument applications and export metrics to different backends like Prometheus, Datadog, and others. In Spring Boot, Micrometer is integrated as the default metrics collection facility. It enables developers to collect and monitor application performance data, such as request timings, resource usage, and custom metrics.

---

##  1. Add Dependencies (in `pom.xml` for Maven)

```xml
<dependencies>
    <!-- Spring Boot Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- Micrometer for Prometheus -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>
</dependencies>
```

---

## ✅ 2. Update `application.properties` or `application.yml`

For **`application.properties`**:

```properties
# Expose Prometheus endpoint  
management.endpoints.web.exposure.include=prometheus,health,info  
# Prometheus path (default): /actuator/prometheus  
management.endpoint.prometheus.enabled=true
```

---

## ✅ 3. Start Your Spring Boot App

Once you start the app, open this in your browser or use curl:

```
http://localhost:8080/actuator/prometheus
```

You will see **metrics in text format** like:

```
# HELP jvm_memory_used_bytes ...
jvm_memory_used_bytes{area="heap",...} 1234567.0
...
```

This means your app is now **ready to be scraped(collect)** by Prometheus!

---

## ✅ 4. Test Other Actuator Endpoints (Optional)

You can also try:

- `http://localhost:8080/actuator/health` → App health
    
- `http://localhost:8080/actuator/info` → App info (you can configure custom info)
    

---

##  Install & Configure Prometheus on Windows:

- Install Prometheus on your Windows machine
    
- Configure it to collect data (scrape) from your Spring Boot app
    
- Run and test Prometheus
    

---

## Step 1: Download Prometheus

1. Go to the official Prometheus download page:  
    👉 [https://prometheus.io/download/](https://prometheus.io/download/)
    
2. Under **"Prometheus Windows amd64"**, click on the `.zip` file to download it.
    
3. Extract the zip file to a folder, for example:  
    `C:\Tools\prometheus`
    

---

## Step 2: Configure Prometheus to scrape your Spring Boot app

1. Inside the extracted folder, open the file:  
    `prometheus.yml`
    
2. You’ll see some default configuration.  
    Replace the contents with this:
    

```yaml
global:
  scrape_interval: 15s  # Prometheus will collect data every 15 seconds

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']  # Use your Spring Boot app's host and port
```

 This tells Prometheus:

- Collect metrics every 15 seconds
    
- Go to `http://localhost:8080/actuator/prometheus` to collect data
    

---

##  Step 3: Run Prometheus

1. In the same folder, double-click the file `prometheus.exe`.
    
2. A black terminal window will open and Prometheus will start.
    
3. Open your browser and go to:  
    👉 `http://localhost:9090`
    

You’ll see the **Prometheus web UI**!

---

## Step 4: Test If It Works

1. Click on the **"Status" → "Targets"** tab in the top menu.
    
2. You should see your Spring Boot app listed as a target:
    
    ```
    spring-boot-app | http://localhost:8080/actuator/prometheus | UP
    ```
    

If it says "UP", everything is working fine!  
Prometheus is **scraping your Spring Boot app** and **storing the data**.


---

## How to Check if Prometheus is Collecting Data

### 🔍 Step 1: Open Prometheus UI

Go to your browser and open:  
👉 `http://localhost:9090`

---

### 🧪 Step 2: Run a Query

In the **search bar at the top**, try typing the following metric name:

```
http_server_requests_seconds_count
```

Then click the **[Execute]** button.

---

### If data is being collected, you will see:

- A list of **results** below the search bar
    
- Each result has a label (like method="GET", status="200", uri="/", etc.)
    
- And a number — that's the **count of HTTP requests**
    

It means Prometheus is successfully:

- Scraping metrics from your app
    
- Storing them
    
- Allowing you to query them

---

###  More Example Metrics You Can Try

|Metric Name|What It Means|
|---|---|
|`jvm_memory_used_bytes`|JVM memory used|
|`process_cpu_usage`|CPU usage of your app|
|`system_cpu_usage`|CPU usage of your system|
|`logback_events_total`|Log events (info, error, etc.)|
|`tomcat_threads_busy`|Number of busy Tomcat threads|
|`http_server_requests_seconds_sum`|Total response time|

Try typing any of these in the search box and click **Execute**.

---

### Optional: View the Graph

After running a query:

- Click the **[Graph]** tab (next to Table)
    
- You will see a time-series graph of that metric
    

---

Let me know if you'd like to move to **Step 4: Install Grafana** now, where you can create beautiful dashboards and charts from this data.