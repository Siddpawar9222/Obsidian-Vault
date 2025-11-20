
---

# 🛠 Step 1: Namespace

Create a namespace called `dev`

```yaml
# namespace-dev.yml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```

Apply it:

```bash
kubectl apply -f namespace-dev.yml
kubectl get namespaces
```

👉 Check if `dev` shows up.

---

# 🛠 Step 2: Pod with labels

Create a Pod (one small team) inside `dev`, add a **label**.

```yaml
# pod-nginx.yml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: dev
  labels:
    app: myapp
    tier: frontend
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

Apply:

```bash
kubectl apply -f pod-nginx.yml
kubectl get pods -n dev --show-labels
```

👉 Notice labels like `app=myapp,tier=frontend`.

---

# 🛠 Step 3: ReplicaSet

Now let’s say you want **3 copies of this Pod**.

```yaml
# replicaset-nginx.yml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-rs
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

Apply:

```bash
kubectl apply -f replicaset-nginx.yml
kubectl get pods -n dev
```

👉 You should see **3 pods** created.

---

# 🛠 Step 4: Deployment

Now we add a manager (Deployment) to control ReplicaSets. For Rollback and updates. For new updated first run new pods and then stop existing running pods.

```yaml
# deployment-nginx.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deploy
  namespace: dev
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp-deploy
  template:
    metadata:
      labels:
        app: myapp-deploy
    spec:
      containers:
        - name: nginx
          image: nginx:1.21
          ports:
            - containerPort: 80
```

Apply:

```bash
kubectl apply -f deployment-nginx.yml
kubectl get deployments -n dev
kubectl get pods -n dev
kubectl set image deployment/myapp-deployment nginx=nginx:1.22 -n dev
```

👉 You’ll see 2 pods running under this Deployment.  
👉 If you update `nginx:1.22` and re-apply, Deployment will **roll out** new pods safely.

---

# 🛠 Step 5: StatefulSet (optional but good practice)

For apps that need fixed identity (like DB).

```yaml
# statefulset-mysql.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: dev
spec:
  serviceName: "mysql"
  replicas: 2
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:5.7
          ports:
            - containerPort: 3306
```

Apply:

```bash
kubectl apply -f statefulset-mysql.yml
kubectl get pods -n dev
```

👉 Pod names will be `mysql-0`, `mysql-1` (stable identities).

---

# 🛠 Step 6: Clean up

```bash
kubectl delete namespace dev
```

(Removes all resources inside `dev`.)

---

## 🔎 What is a Selector in Kubernetes?

- **Labels** = tags on Pods.
    
- **Selector** = filter rule that matches those tags.
    

👉 Think:

- Every employee (Pod) wears a **badge** (`role=engineer`, `team=backend`).
    
- HR (ReplicaSet / Deployment / Service) says:
    
    - _“I only manage employees with badge `role=engineer`.”_
        

That’s the **selector**.

---

## ⚙️ Example: Pod with label

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: dev
  labels:
    app: myapp
    tier: frontend
spec:
  containers:
    - name: nginx
      image: nginx:latest
```

This Pod has labels:

- `app=myapp`
    
- `tier=frontend`
    

---

## ⚙️ Example: ReplicaSet with selector

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-rs
  namespace: dev
spec:
  replicas: 3
  selector:                # selector = which Pods I control
    matchLabels:
      app: myapp           # must match Pod's label
  template:                # blueprint for new Pods
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: nginx
          image: nginx:latest
```

👉 What happens here?

1. Selector says: _“I will only manage pods with `app=myapp`.”_
    
2. The template creates **new pods** with that label.
    
3. ReplicaSet keeps exactly `3` of them alive.

4. If existing pod with same name is already running then it consider it and doesnt manage 
that pod (Did practical)
---

## ⚙️ Why is Selector important?

- If labels don’t match the selector → ReplicaSet/Deployment won’t manage those pods.
    
- Services also use selectors to decide **where to send traffic**.
    

Example Service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
  namespace: dev
spec:
  selector:
    app: myapp    # send traffic to pods with app=myapp
  ports:
    - port: 80
      targetPort: 80
```

👉 Only Pods with label `app=myapp` will receive traffic from this Service.

---

# 1️⃣ What goes into **one Pod**?

👉 **Rule of thumb**:

- A **Pod = tightly coupled containers** that must always live/die together.
    
- If they are **independent services**, they should be in **separate Pods**.
    

### ✅ Good use cases (multiple containers in one Pod):

- **Main app + helper (sidecar)**
    
    - Example: Spring Boot app + log shipper (sidecar for pushing logs).
        
- **Reverse proxy + app** that always go together.
    
- **Data scraper + tiny cache container** that only works for that scraper.
    

### ❌ Bad use case:

- Frontend + Backend in same pod → Wrong, because they don’t need to scale together.
    
- MySQL + Redis in same pod → Wrong, because they’re different systems with different lifecycles.
    

👉 So **Spring Boot and React** = **two separate Pods**.

---

# 2️⃣ What goes into **one Namespace**?

👉 **Namespace = logical boundary (department)**.  
It’s about **organization, access control, and resource limits**, not tight coupling.

### Common patterns:

- **By environment**:
    
    - `dev`, `test`, `prod` → each environment gets its own namespace.
        
- **By team**:
    
    - `frontend-team`, `backend-team` → each team manages their own namespace.
        
- **By application (less common)**:
    
    - `lms-system`, `inventory-system` if they are totally different products.
        

### Example with your app:

- You create a namespace `dev`.
    
- Inside it:
    
    - `frontend-deployment` (pods running React app)
        
    - `backend-deployment` (pods running Spring Boot app)
        
    - `database-statefulset` (pods running PostgreSQL or MySQL)
        

All belong to the same **namespace (dev)** because they are part of the **same project/environment**.

---

✅ For your Spring Boot + React system:

- **Pods** → one for frontend, one for backend, one for DB.
    
- **Namespace** → all in `dev` (if you’re learning). Later you’ll have `prod`, `qa`, etc.
    

---
# Sidecar : 
---

## 🚗 Real-world analogy

Think of a **motorbike with a sidecar**:

- The **motorbike** = main container (your app).
    
- The **sidecar** = small helper container that always rides along, providing extra functionality.
    

They **travel together**, but the sidecar isn’t the star — it just supports the main vehicle.

---

## 💻 In Kubernetes

A **sidecar container** is a **secondary container inside the same Pod** that supports the main container.

👉 They share:

- The **same network** (so they can talk via `localhost`)
    
- The **same storage volumes**
    

---

## ⚙️ Examples of Sidecar Pattern

1. **Logging sidecar**
    
    - Main container: Spring Boot app.
        
    - Sidecar: log shipper (e.g., Fluentd) that forwards logs to Elasticsearch.
        
2. **Proxy sidecar**
    
    - Main container: App.
        
    - Sidecar: Envoy proxy (used in service mesh like Istio) to handle traffic/security.
        
3. **File updater sidecar**
    
    - Main container: Nginx serving React frontend.
        
    - Sidecar: Container that updates React build files periodically.
        

---

## 📝 Example YAML (Spring Boot + log sidecar)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: springboot-with-logger
spec:
  containers:
    - name: springboot
      image: my-springboot:latest
      ports:
        - containerPort: 8080
    - name: log-agent
      image: busybox
      command: ["sh", "-c", "tail -f /var/log/app.log"]
      volumeMounts:
        - name: log-volume
          mountPath: /var/log
  volumes:
    - name: log-volume
      emptyDir: {}
```

- `springboot` = main app writing logs to `/var/log/app.log`
    
- `log-agent` = sidecar reading logs and doing something (ship, process, forward)
    
- Both share the **log-volume**
    

---

## ✅ When to use Sidecar?

- If the helper must **always run with the main app**
    
- If they must **share same network/storage**
    
- If it doesn’t make sense to scale them separately
    

---

👉 So, **sidecar = helper container** in the same Pod.

---
