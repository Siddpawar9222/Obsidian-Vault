

---

# 📝 Notes: Kubernetes Probes (Liveness, Readiness, Startup)

---

## 1. Why Probes?

👉 Kubernetes manages Pods, but it needs a way to **check if containers are healthy**.

Without probes:

- A container may be running but **not responding**.
    
- Users might get errors, but Kubernetes won’t know.
    

So Kubernetes uses **Probes** to ask:

> > “Hey container, are you alive? Ready? Or just starting up?”

---

## 2. Types of Probes

### 🔹 (a) **Liveness Probe**

- Checks: **Is the container alive?**
    
- If this probe fails → Kubernetes **restarts the container**.
    

👉 Example: App is stuck in infinite loop but not crashed → liveness probe restarts it.

---

### 🔹 (b) **Readiness Probe**

- Checks: **Is the container ready to serve traffic?**
    
- If this probe fails → Kubernetes **removes pod from Service Endpoints** (no traffic sent).
    

👉 Example: App is running but database not connected yet → not ready.

---

### 🔹 (c) **Startup Probe**

- Checks: **Has the container finished starting?**
    
- Useful for **slow apps** (like Java Spring Boot, big Node.js apps).
    
- During startup, Kubernetes doesn’t run liveness/readiness probes until startup probe succeeds.
    

👉 Example: Prevents false restarts while app is still booting.

---

## 3. Probe Mechanisms

Kubernetes probes can work in 3 ways:

1. **HTTP Probe** → K8s sends HTTP request (`GET /health`) to container.
    
2. **TCP Probe** → K8s checks if a TCP socket is open (useful for DB, non-HTTP apps).
    
3. **Command Probe** → K8s runs a command inside container; if exit code = 0 → success.
    

---

## 4. Example YAMLs

### 🔹 Liveness + Readiness Probes (Nginx)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-probe
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
    livenessProbe:          # checks if container is alive
      httpGet:
        path: /             # request GET /
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 10
    readinessProbe:         # checks if ready for traffic
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 2
      periodSeconds: 5
```

---

### 🔹 Startup Probe (Slow Boot App, e.g., Spring Boot)

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 8080
  failureThreshold: 30    # try 30 times
  periodSeconds: 10       # every 10s → 5 mins total wait
```

👉 During startup, only **startupProbe** runs.  
Once it passes → **liveness & readiness** start working.

---

## 5. Important Probe Parameters

- **initialDelaySeconds** → wait before first check.
    
- **periodSeconds** → how often to check.
    
- **timeoutSeconds** → how long to wait for response.
    
- **failureThreshold** → how many failures before marking as unhealthy.
    
- **successThreshold** → how many successes before marking as healthy.
    

---

## 6. Real-World Analogy 🏥

Think of a container like a **patient in a hospital**:

- **Startup probe** = “Is the patient awake yet?” (don’t disturb until ready).
    
- **Liveness probe** = “Is the patient still breathing?” (if not → restart treatment).
    
- **Readiness probe** = “Is the patient ready to go back to work?” (if not → don’t send tasks yet).
    

---

## 7. Key Differences

| Probe Type    | Purpose                                 | Action if fails                     |
| ------------- | --------------------------------------- | ----------------------------------- |
| **Liveness**  | Checks if container is still alive      | Restart container                   |
| **Readiness** | Checks if container can handle traffic  | Remove pod from Service endpoints   |
| **Startup**   | Waits until container has fully started | Only then enable liveness/readiness |

---

✅ With these, Kubernetes makes sure your app is **self-healing**, **no bad pod receives traffic**, and **slow apps don’t get killed during startup**.

---

# 🛠 Practical Hands-On: Probes in Kubernetes

---

## **Step 1: Create a Pod with Liveness Probe**

Create file: `nginx-liveness.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-liveness
  namespace: dev
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    livenessProbe:
      httpGet:
        path: /healthy   # <-- WRONG path (nginx does not have this)
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 10
```

👉 Here, Kubernetes will check `http://<pod-ip>:80/healthy`.  
Since nginx does **not** serve `/healthy`, the probe will fail.

---

## **Step 2: Apply and Observe**

```bash
kubectl apply -f nginx-liveness.yaml
kubectl get pods -n dev -w
```

📌 Expected Behavior:

- Pod starts → after 5s (initialDelay) K8s checks `/healthy`.
    
- Probe fails → after 3 failures, Kubernetes **restarts the container**.
    
- You’ll see pod status as `CrashLoopBackOff` or `Restarting`.
    

---

## **Step 3: Fix the Liveness Probe**

Edit to use root `/` path (which nginx serves):

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 10
```

Apply again:

```bash
kubectl apply -f nginx-liveness.yaml
```

Now the Pod should stay `Running` ✅

---

## **Step 4: Add Readiness Probe**

Modify pod: `nginx-readiness.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-readiness
  namespace: dev
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    readinessProbe:
      httpGet:
        path: /ready   # <-- WRONG path, will fail
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 5
```

Apply:

```bash
kubectl apply -f nginx-readiness.yaml
kubectl describe pod nginx-readiness -n dev
```

📌 Expected Behavior:

- Pod will be `Running` but **not Ready** (1/1 containers running but `0/1 Ready`).
    
- If this Pod is behind a Service, it will **not receive traffic**.
    

---

## **Step 5: Fix the Readiness Probe**

Change `/ready` → `/`:

```yaml
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
```

Apply again → Now Pod should show `1/1 Ready`.

---

## **Step 6: Startup Probe Example (for slow apps)**

Let’s simulate with nginx (not really slow, but just to practice).

Create file: `nginx-startup.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-startup
  namespace: dev
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    startupProbe:
      httpGet:
        path: /
        port: 80
      failureThreshold: 10   # try 10 times
      periodSeconds: 5       # every 5s → total 50s wait
    livenessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 5
```

👉 Here:

- First, **startupProbe runs** for up to 50s.
    
- Liveness probe is only enabled after startupProbe succeeds.
    

---

## **Step 7: Observe**

Check status:

```bash
kubectl get pods -n dev -w
```

📌 If startupProbe fails → Pod restarts immediately.  
📌 If it succeeds → liveness probe takes over.

---

# 🔑 What You Learned

1. **Liveness Probe** → Restarts container if app is dead.
    
2. **Readiness Probe** → Stops sending traffic if app not ready.
    
3. **Startup Probe** → Gives slow apps time to start before applying liveness/readiness.
    

---
