
---

Think of Docker like a **factory** 🏭 where containers are the machines. If something goes wrong, you need **CCTV (monitoring)** and **notebook of incidents (logging)**.

---

# 📝 1. What is Logging?

- **Logging = Container writes messages about what it is doing.**
    
- Example: An app prints `Started server on port 8080` or `Database connection failed`.
    
- Logs are used for debugging, auditing, and tracking issues.
    

👉 In Docker:

- Every container has a **logging driver** (by default: `json-file`).
    
- Logs are stored in files like `/var/lib/docker/containers/<container-id>/<container-id>-json.log`.
    

### Check logs:

```bash
docker logs <container-id or name>
```

- `-f` (follow) to stream logs like `tail -f`.
    

```bash
docker logs -f my-container
```

---

# 📊 2. What is Monitoring?

- **Monitoring = Tracking the health, resource usage, and performance of containers.**
    
- Example: CPU usage, memory usage, container is running or crashed.
    

👉 Without monitoring:

- You don’t know if your container is eating 100% CPU or has crashed.
    

---

# ⚙️ 3. Docker Logging in Detail

Docker supports different **logging drivers**:

- `json-file` → default, logs stored in JSON file.
    
- `syslog` → send logs to system syslog.
    
- `fluentd`, `gelf`, `awslogs`, `splunk`, `logstash` → send logs to external systems.
    

### Configure logging driver (in `docker run`):

```bash
docker run -d \
  --name myapp \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  my-image
```

This limits logs to 10MB × 3 files (rotation).

---

# 📡 4. Docker Monitoring in Detail

There are multiple layers:

### (a) **Basic Monitoring with Docker CLI**

```bash
docker stats
```

Shows real-time CPU, memory, network usage per container.

### (b) **Docker Events**

```bash
docker events
```

Gives real-time stream of container lifecycle events (start, stop, kill, etc.).

---

### (c) **Using Tools**

1. **cAdvisor (by Google)** → Collects container metrics.  
    Run as container:
    
    ```bash
    docker run \
      --volume=/:/rootfs:ro \
      --volume=/var/run:/var/run:ro \
      --volume=/sys:/sys:ro \
      --volume=/var/lib/docker/:/var/lib/docker:ro \
      -p 8080:8080 \
      gcr.io/cadvisor/cadvisor
    ```
    
    Open `http://localhost:8080`.
    
2. **Prometheus + Grafana**
    
    - Prometheus scrapes metrics (including from Docker / cAdvisor).
        
    - Grafana visualizes them with dashboards.
        
3. **ELK / EFK Stack**
    
    - **E**lasticsearch + **L**ogstash/**F**luentd + **K**ibana
        
    - Collect, store, and visualize logs.
        

---

# 🔄 5. Difference Between Logging and Monitoring

| Feature | Logging 📝                            | Monitoring 📊                             |
| ------- | ------------------------------------- | ----------------------------------------- |
| Purpose | Record what happened inside container | Track health, performance, resource usage |
| Example | "Error: DB connection failed"         | "CPU usage 95%" or "container stopped"    |
| Tools   | Docker logs, ELK, Fluentd             | docker stats, cAdvisor, Prometheus        |

---

# 🛠️ 6. Real World Example

Suppose you deploy a Spring Boot app inside Docker:

- **Logs** → See application logs via `docker logs my-app` or send them to **ELK**.
    
- **Monitoring** → Use `docker stats` or connect cAdvisor + Prometheus + Grafana to see:
    
    - How much memory app is using
        
    - CPU spike when traffic increases
        
    - Alerts if container crashes
        

---

✅ **Summary:**

- **Logging** = What happened (text records of app).
    
- **Monitoring** = How it’s behaving (CPU, memory, uptime).
    
- Start with `docker logs` and `docker stats`, then move to **Prometheus + Grafana (monitoring)** and **ELK stack (logging)** for production.
    

---

