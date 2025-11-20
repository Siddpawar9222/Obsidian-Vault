

---

#  Kubernetes Ingress 

---

## 1. Recap: How Services Work

Before Ingress, let’s recall:

- **ClusterIP** → Service accessible only inside the cluster (default).
    
- **NodePort** → Service accessible on every node’s IP at a static port (e.g., `30080`).
    
- **LoadBalancer** → Cloud provider assigns a public IP for your service (works only on AWS, GCP, Azure, etc.).
    

👉 Problem:  
If you have **10 services**, you need **10 different NodePorts** or LoadBalancers.  
That’s messy ❌

---

## 2. What is Ingress?

👉 **Ingress = Smart Traffic Router** inside Kubernetes.

- It lets you define **rules** for routing external HTTP/HTTPS traffic to internal services.
    
- Instead of exposing each service separately, you expose **only the Ingress Controller** to the outside world.
    

---

## 3. Components of Ingress

### (A) **Ingress Resource**

- A YAML config that defines **routing rules** (like URL path → Service).
    

Example:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  namespace: dev
spec:
  rules:
    - host: myapp.com
      http:
        paths:
          - path: /shop
            pathType: Prefix
            backend:
              service:
                name: shop-service
                port:
                  number: 80
          - path: /blog
            pathType: Prefix
            backend:
              service:
                name: blog-service
                port:
                  number: 80
```

👉 Rule:

- `http://myapp.com/shop` → goes to `shop-service`
    
- `http://myapp.com/blog` → goes to `blog-service`
    

---

### (B) **Ingress Controller**

- The actual **reverse proxy** (like Nginx, HAProxy, Traefik) that implements Ingress rules.
    
- Kubernetes only provides the **specification** for Ingress, but you must install a **controller**.
    

Most common: **NGINX Ingress Controller**

---

## 4. How Traffic Flows with Ingress

1. **Client** → requests `http://myapp.com/shop`
    
2. **DNS** resolves `myapp.com` to your cluster’s IP (LoadBalancer or NodePort for ingress controller).
    
3. **Ingress Controller (Nginx)** receives the request.
    
4. Controller looks at **Ingress rules**.
    
5. Routes traffic to the correct **Service** → which forwards to **Pod**. ✅
    

---

## 5. Benefits of Ingress

✔ Single entry point for all services  
✔ Supports **host-based routing** (`shop.com`, `blog.com`)  
✔ Supports **path-based routing** (`/shop`, `/blog`)  
✔ Easy to manage TLS/SSL certificates  
✔ Reduces need for multiple NodePorts / LoadBalancers

---

## 6. Industrial Example

Imagine an **E-commerce app**:

- `shop.example.com` → product service
    
- `cart.example.com` → cart service
    
- `user.example.com` → user service
    

Instead of 3 NodePorts, you expose **one Ingress Controller**, and configure rules.

---

## 7. Practical Setup (High-Level Steps)

1. Install **Ingress Controller** (e.g., Nginx).
    
    ```bash
    minikube addons enable ingress
    ```
    
2. Deploy your **services** (e.g., shop, blog).
    
3. Create an **Ingress resource** with routing rules.
    
4. Add DNS entry or edit `/etc/hosts` to map `myapp.com` → minikube IP.
    
5. Access services via domain/path.
    

---

## 8. Notes for You (Since you use EC2 + Minikube + Docker)

- In cloud (AWS, GCP) → Ingress uses a real LoadBalancer.
    
- In Minikube → Ingress will be exposed via **NodePort** or Minikube IP (`minikube ip`).
    
- You’ll test it by mapping `myapp.com` → `minikube ip` in `/etc/hosts`.
    

---

✅ So in short:

- **Service** = entry point for one app.
    
- **Ingress** = entry point for the whole cluster, with smart routing.
    

---

# 📝 Step-by-Step: Multiple Apps with Ingress

## 1. Create Two Deployments + Services

👉 One for `nginx1`, another for `nginx2`.

`nginx1-deploy.yml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx1-deploy
  namespace: dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx1
  template:
    metadata:
      labels:
        app: nginx1
    spec:
      containers:
      - name: nginx1
        image: nginx:1.21
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx1-service
  namespace: dev
spec:
  selector:
    app: nginx1
  ports:
  - port: 80
    targetPort: 80
```

`nginx2-deploy.yml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx2-deploy
  namespace: dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx2
  template:
    metadata:
      labels:
        app: nginx2
    spec:
      containers:
      - name: nginx2
        image: nginx:1.21
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx2-service
  namespace: dev
spec:
  selector:
    app: nginx2
  ports:
  - port: 80
    targetPort: 80
```

Apply:

```bash
kubectl apply -f nginx1-deploy.yml
kubectl apply -f nginx2-deploy.yml
```

---

## 2. Create the Ingress Resource

`ingress.yml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  namespace: dev
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /app1
        pathType: Prefix
        backend:
          service:
            name: nginx1-service
            port:
              number: 80
      - path: /app2
        pathType: Prefix
        backend:
          service:
            name: nginx2-service
            port:
              number: 80
```

Apply:

```bash
kubectl apply -f ingress.yml
```

---

## 3. Access the Apps

Check Ingress:

```bash
kubectl get ingress -n dev
```

Expected output (example):

```
NAME            CLASS   HOSTS   ADDRESS        PORTS   AGE
myapp-ingress   nginx   *       192.168.49.2   80      1m
```

Now test:

```bash
curl http://192.168.49.2/app1   # nginx1
curl http://192.168.49.2/app2   # nginx2
```

If on **EC2** → replace `192.168.49.2` with your **EC2 Public IP** and expose port `80` of minikube (either via `minikube tunnel` or `kubectl port-forward ingress-nginx-controller`).

---

## 🔑 What’s happening?

- Both apps run inside the cluster.
    
- Ingress + Nginx Ingress Controller sits at **entry point**.
    
- Requests like:
    
    - `http://<EC2-IP>/app1` → forwarded to `nginx1-service` → pod.
        
    - `http://<EC2-IP>/app2` → forwarded to `nginx2-service` → pod.
        
- No need to expose **NodePorts** for each service.
    

---

## 4️⃣ Expose to EC2


```bash
kubectl port-forward --address 0.0.0.0 -n ingress-nginx svc/ingress-nginx-controller 8080:80
```

Now:

- `http://<EC2-PUBLIC-IP>:8080/app1` → goes to **nginx1**
    
- `http://<EC2-PUBLIC-IP>:8080/app2` → goes to **nginx2**
    

---

## 5️⃣ (Optional) Hostname Demo (Do it later)

If you want to access via domain instead of port, update `/etc/hosts` on your laptop:

```
<EC2-PUBLIC-IP> demo.local
```

Then you can use:

- `http://demo.local/app1`
    
- `http://demo.local/app2`
    

---

✅ This shows the **real power of Ingress**: one load balancer (Ingress controller) can route to **multiple services**.

---


### 📝 Updated Text Diagram (with Nginx Ingress Controller layer)

```
                [ User Browser ]
                       |
                http://<minikube-ip>/app1
                       |
              ============================
              |  Nginx Ingress Controller |
              |  (runs as a Pod in K8s)   |
              ============================
                       |
                ----------------------------
                |        Ingress           |
                |--------------------------|
                | Path: /app1 -> svc-app1  |
                | Path: /app2 -> svc-app2  |
                ----------------------------
                       |
           ------------------------       ------------------------
           |      Service          |       |      Service          |
           |  svc-app1 (ClusterIP) |       |  svc-app2 (ClusterIP) |
           ------------------------       ------------------------
                       |                           |
               -----------------             -----------------
               |   Pod (nginx)   |           |   Pod (nginx)   |
               | index.html=App1 |           | index.html=App2 |
               -----------------             -----------------
```

---

### 🔑 Explanation

- **Ingress Controller (Nginx Pod)** → the actual web server that listens on your **Minikube IP (NodePort/LoadBalancer)**.
    
- **Ingress Object (YAML rules)** → only config/rules, it tells the controller _how to route_.
    
- The Nginx Ingress Controller Pod dynamically updates its config when you apply an Ingress object.
    

👉 Without the **Ingress Controller Pod**, your Ingress YAML is just a “rule book” with nobody to enforce it.

---
