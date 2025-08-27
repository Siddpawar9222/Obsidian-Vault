
---

# 📝 Notes: Kubernetes Resource Requests, Limits & Quotas

---

## 1. Why Resource Management is Needed?

👉 In real-world clusters, multiple teams and applications run together.  
If one app consumes **all CPU/RAM**, others will **starve** and crash.  
So Kubernetes provides **Resource Requests, Limits, and Quotas** to keep things fair.

---

## 2. Requests vs Limits (Container Level)

Every **container in a Pod** can declare:

- **Request** → Minimum resource it _needs_ to run.
    
- **Limit** → Maximum resource it _can use_.
    

### Example:

```yaml
resources:
  requests:
    cpu: "250m"     # needs at least 0.25 CPU
    memory: "128Mi" # needs at least 128 MB RAM
  limits:
    cpu: "500m"     # can use up to 0.5 CPU
    memory: "256Mi" # max 256 MB RAM
```

📌 Notes:

- `m` = milli. So `500m` = 0.5 vCPU.
    
- If a container tries to use **more than limit**:
    
    - CPU → throttled (slowed down).
        
    - Memory → Pod is killed (OOMKilled).
        

---

## 3. Resource Quota (Namespace Level)

👉 A **ResourceQuota** applies to a **namespace**.  
It restricts how much CPU/Memory/Pods a team can use inside that namespace.

### Example: Dev Namespace Quota

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: dev
spec:
  hard:
    requests.cpu: "1"      # total min CPU requested ≤ 1 core
    requests.memory: 1Gi   # total min memory requested ≤ 1GB
    limits.cpu: "2"        # total max CPU across all pods ≤ 2 cores
    limits.memory: 2Gi     # total max memory across all pods ≤ 2GB
    pods: "5"              # max 5 pods allowed in dev namespace
```

📌 Meaning:

- You can’t create more than **5 pods** in dev namespace.
    
- All requests combined must be ≤ 1 CPU and ≤ 1GB RAM.
    
- All limits combined must be ≤ 2 CPU and ≤ 2GB RAM.
    

---

## 4. Default Limits (Optional)

👉 Sometimes developers forget to set limits.  
You can use **LimitRange** to assign default values.
Which means any container created inside given namespace assign default values

### Example: Default CPU/Memory for Dev Namespace

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: dev-limit-range
  namespace: dev
spec:
  limits:
  - default:
      cpu: 500m
      memory: 256Mi
    defaultRequest:
      cpu: 250m
      memory: 128Mi
    type: Container
```

📌 Meaning:

- If you don’t specify anything → container will get 250m CPU, 128Mi request by default.
    
- And it can use max 500m CPU, 256Mi RAM.
    

---

## 5. Real-World Analogy 🏭

Think of **Kubernetes cluster** as a **factory**:

- **Workers (CPU)** and **Storage rooms (RAM)** are limited.
    
- **Requests** = “I need at least this much to work properly.”
    
- **Limits** = “Don’t let me grab more than this.”
    
- **Quota** = “This whole department (namespace) cannot exceed this budget.”
    

---

## 6. Hands-On Practice (Your Case)

✅ Step 1: Create a quota in `dev` namespace

```bash
kubectl apply -f dev-quota.yaml
```

✅ Step 2: Add requests/limits to your nginx deployment:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "64Mi"
  limits:
    cpu: "200m"
    memory: "128Mi"
```

✅ Step 3: Check applied quota

```bash
kubectl get resourcequota -n dev
```

✅ Step 4: Try creating pods beyond the quota → it will be rejected.

---

## 7. Key Differences

| Concept       | Level     | Purpose                                             |
| ------------- | --------- | --------------------------------------------------- |
| Request       | Container | Minimum guarantee                                   |
| Limit         | Container | Maximum allowed                                     |
| ResourceQuota | Namespace | Total team budget                                   |
| LimitRange    | Namespace | Default for containers created inside the container |

---

🔥 With this, you control both **per container** and **per namespace** resources.  
This prevents “noisy neighbor” problems in production.

---