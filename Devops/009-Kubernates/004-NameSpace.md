

---
## 1. What is a Namespace?

- A **namespace** is like a **folder on your computer** or a **department in a company** (HR, Finance, Engineering).
    
- It is a **logical separation** inside a Kubernetes cluster.
    
- Helps to:
    
    - Group resources (pods, services, deployments, etc.).
        
    - Apply **resource limits** and **access control (RBAC)** separately.
        

---

## 2. Default Namespaces

When you install Minikube (or any cluster), Kubernetes creates some namespaces by default:

- **default** → where resources go if you don’t specify a namespace.
    
- **kube-system** → internal components (DNS, proxy, scheduler, etc.).
    
- **kube-public** → public resources, readable by all.
    
- **kube-node-lease** → used for node heartbeat signals.
    

---

## 3. Manifest File

- A **manifest file** (`.yml`) is a **declaration** of what you want Kubernetes to create.
    
- Example: Pods, Deployments, Services, Namespaces.
    
- Think of it like a **form submitted to HR** → Kubernetes creates the resource as described.
    

---

## 4. Example Manifests

### (a) Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```

### (b) Pod in a Namespace

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: dev
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

### (c) All-in-One (Namespace + Pod)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
---
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: dev
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

---

## 5. Why YAML Manifests?

- **Version-controlled** (store in Git).
    
- Easy to **reproduce environments** (`dev`, `test`, `prod`).
    
- Declarative → You say _“I want 2 replicas”_, Kubernetes ensures it.
    

---

## 6. Pod Debugging

- Use `kubectl describe pod` to see details:
    
    - Status (Running, Pending, CrashLoopBackOff, etc.).
        
    - Node assigned.
        
    - Containers running.
        
    - Events (errors, restarts).
        

---

## 7. Accessing Pods

- **`localhost` (127.0.0.1)** = your own machine.
    
- **`0.0.0.0`** = listen on all network interfaces (external access allowed).
    
- To access pods from outside EC2:
    
    - Use **`kubectl port-forward`** with `--address 0.0.0.0`.
        
    - Ensure **EC2 Security Group allows inbound port (e.g., 8080)**.
        

---

# ⚡ Commands 

```bash
# View namespaces
kubectl get namespaces

# Create a namespace
kubectl create namespace dev

# Deploy a pod in a namespace
kubectl run nginx --image=nginx --namespace=dev

# Check pods in a namespace
kubectl get pods -n dev

# Set default namespace
kubectl config set-context --current --namespace=dev

# Apply namespace manifest
kubectl apply -f namespace-dev.yml

# Apply pod/deployment manifest
kubectl apply -f deployment-dev.yml

# Apply combined (namespace + pod) manifest
kubectl apply -f all-in-one.yml

# Describe a pod
kubectl describe pod myapp -n dev

# See container logs
kubectl logs <pod-name>

# If multiple containers are inside the pod (like with a sidecar), you must specify the container name:
kubectl logs <pod-name> -c <container-name>

# Get inside the pod (open a shell or bash inside container)
kubectl exec -it <pod-name> -- /bin/sh
kubectl exec -it <pod-name> -- /bin/bash

# Stream logs live
kubectl logs -f <pod-name>

# Port-forward (inside EC2)
kubectl port-forward --address 0.0.0.0 pod/myapp 8080:80 -n dev
```

---

# 🌐 Localhost vs 0.0.0.0 (Text Diagram)

```
Case 1: Binding to 127.0.0.1 (localhost)
----------------------------------------

   [EC2 Machine]
   +-----------------------------------+
   |   Pod (nginx)                     |
   |       Port 80                     |
   |                                   |
   |   Port-Forward 8080 -> 80         |
   |   Bound to: 127.0.0.1             |
   |                                   |
   |   Accessible from:                |
   |      ✔ EC2 itself                 |
   |      ✘ Outside world              |
   +-----------------------------------+

   Local Browser (your laptop) ❌ Cannot access
   Only curl/wget inside EC2 ✅ Works


Case 2: Binding to 0.0.0.0 (all interfaces)
-------------------------------------------

   [EC2 Machine]
   +-----------------------------------+
   |   Pod (nginx)                     |
   |       Port 80                     |
   |                                   |
   |   Port-Forward 8080 -> 80         |
   |   Bound to: 0.0.0.0               |
   |                                   |
   |   Accessible from:                |
   |      ✔ EC2 itself                 |
   |      ✔ Outside world (your laptop)|
   +-----------------------------------+

   Local Browser (your laptop) ✅ Can access  
   URL: http://EC2_PUBLIC_IP:8080
```

---

👉 **Key takeaway**:

- `127.0.0.1` → only works **inside the EC2 machine**.
    
- `0.0.0.0` → listens on **all network interfaces**, so you can connect from outside (if firewall/security group allows).
    

---
