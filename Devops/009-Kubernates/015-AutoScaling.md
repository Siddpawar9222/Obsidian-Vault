
---

# 📝 Notes: **Autoscaling in Kubernetes**

## 🔹 1. What is Autoscaling?

👉 Autoscaling = Kubernetes automatically adjusts resources (Pods, Nodes) **based on demand**.  
This ensures:

- No resource wastage 💸
    
- No downtime when load increases 🚀
    
- Saves cost when load decreases ⬇️
    

Think of it like a **restaurant kitchen**:

- Few customers → only 1-2 chefs working.
    
- Many customers → more chefs join.
    
- Late night, no customers → chefs go home.
    

That’s Autoscaling.

---

## 🔹 2. Types of Autoscaling in K8s

Kubernetes provides **3 levels** of autoscaling:

1. **Horizontal Pod Autoscaler (HPA)** 🏗️
    
    - Scales **Pods** horizontally (adds/removes Pod replicas).
        
    - Based on metrics like CPU, Memory, or custom metrics.
        
    - Example: Increase Pods from 2 → 10 if CPU > 70%.
        
2. **Vertical Pod Autoscaler (VPA)** 📏
    
    - Adjusts **CPU/Memory requests & limits** of existing Pods.
        
    - Example: If a Pod always uses 2GB RAM but limit is 512MB → VPA will adjust it.
        
    - Useful for apps with unpredictable resource usage.
        
3. **Cluster Autoscaler (CA)** 🖥️
    
    - Scales **Nodes** (VMs) in the cluster.
        
    - Example: If HPA adds 50 Pods but no space → CA adds new Nodes.
        
    - Works with Cloud providers (AWS, GCP, Azure, etc.).
        

---

## 🔹 3. Horizontal Pod Autoscaler (HPA) in Detail

📌 Most common in interviews & real-world.

- Works on **Deployments / ReplicaSets / StatefulSets**.
    
- Uses **metrics**:
    
    - CPU utilization %
        
    - Memory utilization
        
    - Custom metrics (e.g., requests/sec).
        

### Example:

```bash
kubectl autoscale deployment nginx --cpu-percent=50 --min=2 --max=10
```

👉 Meaning:

- If CPU usage > 50% → add Pods.
    
- Minimum Pods = 2.
    
- Maximum Pods = 10.
    

---

## 🔹 4. Vertical Pod Autoscaler (VPA) in Detail

- Doesn’t add new Pods, instead **resizes existing Pods**.
    
- Example:
    
    - Pod requests: 200m CPU, 512Mi memory.
        
    - Actual usage: 1 CPU, 2Gi memory.
        
    - VPA will recommend/inject new requests/limits.
        

⚠️ Limitation: Pod restarts may happen when resizing.

---

## 🔹 5. Cluster Autoscaler (CA) in Detail

- Works at **Node level**.
    
- Example:
    
    - HPA increases Pods to 20.
        
    - Current Nodes have no capacity.
        
    - **Cluster Autoscaler adds new Node (VM)**.
        
- If load decreases, extra Nodes are removed.
    

---

## 🔹 6. Text Diagram

```
        ┌───────────────┐
        │   Users Load  │
        └───────┬───────┘
                │
        ┌───────▼────────┐
        │   Pods Level   │  <-- HPA (adds/removes Pods)
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │ Pod Resources  │  <-- VPA (adjusts CPU/Memory of Pods)
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │ Cluster Nodes  │  <-- CA (adds/removes Nodes)
        └────────────────┘
```

---

## 🔹 7. Real-World Example

💡 Imagine an **e-commerce site** on Black Friday:

- Normal day: 2 Pods enough 🛒
    
- During Sale: CPU goes 90% 🔥 → HPA adds 20 Pods.
    
- But existing Nodes can’t handle → CA adds 5 new Nodes.
    
- Some Pods constantly under-utilize memory → VPA adjusts limits to save resources.
    
- At midnight, traffic drops → HPA scales down Pods to 2 → CA removes extra Nodes. ✅
    

---

✅ **Quick Recap**:

- HPA → Scales **Pods** (most used).
    
- VPA → Adjusts **Pod resources**.
    
- CA → Scales **Nodes**.
    

---

# 🪄 Step-by-Step Guide to HPA in Kubernetes

---

## **1. Prerequisites**

- A running Kubernetes cluster (minikube/kind/EKS/etc.).
    
- `kubectl` configured.
    
- **metrics-server** installed (required for HPA to fetch CPU/Memory usage).
    

👉 Check if metrics-server is running:

```bash
kubectl get deployment metrics-server -n kube-system
```

If not installed (on minikube for example):

```bash
minikube addons enable metrics-server
or 
minikube addons enable metrics-server -p multi-node-cluster
```

Check Status (Restart cluster if not applied)

```bash
minikube addons list -p multi-node-cluster
```

---

## **2. Create an Nginx Deployment (with resource requests/limits)**

⚠️ HPA needs CPU/memory **requests** defined in deployment, otherwise it won’t know scaling rules.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi
```

Apply it:

```bash
kubectl apply -f nginx-deployment.yaml
```

---

## **3. Expose Deployment via Service**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: dev
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

Apply it:

```bash
kubectl apply -f nginx-service.yaml
```

---

## **4. Create HPA**

Let’s say we want to maintain average **CPU usage = 50%** of requests (`100m` → so target is ~50m per Pod).

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
  namespace: dev
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50

```

Check HPA:

```bash
kubectl get hpa -n dev
```

---

## **5. Generate Load to Trigger Scaling(We can use Apache JMeter by exposing port  to outside world**

We’ll simulate traffic using a busybox Pod (acts as load generator):

```bash
kubectl run -i --tty load-generator \
  --image=busybox \
  --restart=Never \
  -n dev -- /bin/sh
```

Inside the pod, run:

```bash
while true; do wget -q -O- http://nginx-deployment.dev.svc.cluster.local; done
```

This keeps hitting Nginx and raises CPU usage.

---

## **6. Watch Autoscaling in Action**

In another terminal, run:

```bash
kubectl get hpa -w -n dev
```

You’ll see something like:

```
NAME                REFERENCE                     TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
nginx-deployment    Deployment/nginx-deployment   90%/50%   1         5         3          2m
```

Pods will increase (`kubectl get pods -n dev`) until CPU load stabilizes.

---

## **7. Stop Load & Observe Scale Down**

When you exit the load generator pod, CPU usage drops.  
HPA will gradually scale down pods to the minimum (after ~5 minutes default cooldown).

---

# 📝 Notes (HPA Essentials)

- **Metrics-server** = heart of HPA (collects metrics).
    
- HPA needs **resource requests** defined.
    
- Scales based on:
    
    - CPU utilization (most common).
        
    - Memory (with custom setup).
        
    - Custom metrics (Prometheus + Adapter).
        
- Cooldown/scale-down takes some minutes to avoid thrashing.
    

---

## ✅ Step-by-Step: Setting Up Vertical Pod Autoscaler (VPA) in Minikube

### 1. Enable Metrics Server

VPA requires usage metrics (CPU/memory) → install metrics-server:

```bash
minikube addons enable metrics-server
```

---

### 2. Clone Autoscaler Repo

```bash
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler/hack
```

---

### 3. Generate Certificates

The admission controller in VPA needs **TLS certs**. Generate them:

```bash
./vpa-up.sh
```


This will install:

- `vpa-admission-controller`
    
- `vpa-recommender`
    
- `vpa-updater`

---

### 5. Verify Installation

```bash
kubectl get pods -n kube-system | grep vpa
```

✅ You should see pods like:

- `vpa-admission-controller-xxxx`
    
- `vpa-recommender-xxxx`
    
- `vpa-updater-xxxx`
    

---

## 🎯 Next Step: Use VPA in a Demo Deployment

Example: Nginx deployment + VPA object.

### nginx-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
          limits:
            cpu: 200m
            memory: 200Mi
```

### vpa.yaml

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: nginx-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind:       Deployment
    name:       nginx-deployment
  updatePolicy:
    updateMode: "Auto"   # Options: Off / Initial / Auto
```

---

### Deploy Both

```bash
kubectl apply -f nginx-deployment.yaml
kubectl apply -f vpa.yaml
```

---

### Check Recommendations

```bash
kubectl describe vpa nginx-vpa
```

👉 You’ll see **recommended CPU/Memory** values (based on usage).  
If `updateMode: Auto`, VPA will **evict pods & recreate** with updated requests/limits.

---

⚡ This way you’ll **see with your eyes** how pods get restarted with new resources based on actual usage → Vertical Scaling in action!

---

Do you want me to also give you a **load test script** (so we can generate CPU/memory stress inside the pod and watch VPA recommendations change)?