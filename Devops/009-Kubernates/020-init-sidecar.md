

---

## **1️⃣ Init Container**

### **Concept**

- An **Init Container** is a special container that runs **before** the main application container starts.
    
- It is used to perform **initialization tasks** that must be completed before your app runs.
    
- Once the Init Container finishes successfully, the main container starts. If it fails, Kubernetes will restart it based on Pod restart policy.
    
- Each Init Container **runs sequentially** (one after another if multiple are defined).
    

### **Use Cases**

- Setting up configuration files or secrets.
    
- Waiting for a service to be ready (like DB).
    
- Preloading data into a volume.
    
- Running database migrations before app starts.
    

---

### **Notes**

- Init Containers **can’t share memory with the main container** but can share **volumes**.
    
- They have their **own image**, separate from the main container.
    
- Useful to keep main container image clean and lightweight.
    

---

## **2️⃣ Sidecar Container**

### **Concept**

- A **Sidecar Container** runs **alongside the main container** in the same Pod.
    
- It helps the main container by providing **additional functionality**.
    
- It **runs continuously**, unlike Init Container which runs once.
    

### **Use Cases**

- Logging (collect logs from main container and push to external service).
    
- Monitoring (e.g., Prometheus exporter).
    
- Proxying network requests (service mesh, API gateway, etc.).
    
- Updating config or secrets dynamically.
    

---

### **Notes**

- Runs **parallel** to main container.
    
- Shares **network and volume** with main container.
    
- Helps in keeping microservices clean and decoupled.
    

---
## **3️⃣ Key Differences**

|Feature|Init Container|Sidecar Container|
|---|---|---|
|Runs Before Main|✅ Yes, sequential|❌ No, runs parallel|
|Purpose|Initialization tasks|Supporting tasks (logging, proxy, monitoring)|
|Lifecycle|Runs once|Runs continuously|
|Volume Sharing|✅ Can share volume|✅ Can share volume|
|Main Container Start|After Init completes|Starts together with main|

---


- **Init container** that creates nginx config and HTML, and **prints messages** to stdout so logs are visible.
    
- **Main nginx container** serving the HTML.
    
- **Sidecar container** tailing nginx logs.
    
- **All necessary volumes**.
    
- Ready to run in the `dev` namespace.
    

---

### **Complete Pod YAML**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-sidecar-demo
  namespace: dev
  labels:
    app: init-sidecar-demo
spec:
  initContainers:
  - name: init-config
    image: busybox
    command:
      - sh
      - -c
      - |
        echo "Init container started" && \
        mkdir -p /app && mkdir -p /usr/share/nginx/html && \
        echo "<h1>Hello from Init Container!</h1>" > /usr/share/nginx/html/index.html && \
        echo "server { listen 80; root /usr/share/nginx/html; index index.html; access_log /var/log/nginx/access.log; error_log /var/log/nginx/error.log; }" > /app/nginx.conf && \
        echo "Config and HTML created successfully"
    volumeMounts:
      - name: app-volume
        mountPath: /app
      - name: html-volume
        mountPath: /usr/share/nginx/html

  containers:
  - name: nginx-main
    image: nginx
    volumeMounts:
      - name: app-volume
        mountPath: /etc/nginx/conf.d
      - name: log-volume
        mountPath: /var/log/nginx
      - name: html-volume
        mountPath: /usr/share/nginx/html
    ports:
      - containerPort: 80
      - containerPort: 443

  - name: log-sidecar
    image: busybox
    command:
      - sh
      - -c
      - mkdir -p /var/log/nginx && touch /var/log/nginx/access.log && tail -f /var/log/nginx/access.log
    volumeMounts:
      - name: log-volume
        mountPath: /var/log/nginx

  volumes:
  - name: app-volume
    emptyDir: {}
  - name: log-volume
    emptyDir: {}
  - name: html-volume
    emptyDir: {}
```

---

### **Service YAML to expose the Pod**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: init-sidecar-service
  namespace: dev
spec:
  selector:
    app: init-sidecar-demo
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```

---

### **Steps to Deploy**

1. Delete old Pod if exists:
    

```bash
kubectl delete pod init-sidecar-demo -n dev
```

2. Apply the Pod YAML:
    

```bash
kubectl apply -f init-sidecar-pod.yml
```

3. Apply the Service YAML:
    

```bash
kubectl apply -f init-sidecar-service.yml
```

4. Check Pod status:
    

```bash
kubectl get pods -n dev
```

5. Check Service endpoints:
    

```bash
kubectl get endpoints init-sidecar-service -n dev
```

6. Port-forward to access nginx:
    

```bash
kubectl port-forward --address 0.0.0.0 svc/init-sidecar-service 8080:80 -n dev
```

7. Open your browser at:
    

```
http://<your-node-ip>:8080
```

- You should see: **Hello from Init Container!**
    

---

### **Check Logs**

```bash
kubectl logs -n dev init-sidecar-demo -c init-config      # Init container logs
kubectl logs -n dev init-sidecar-demo -c nginx-main      # Nginx logs
kubectl logs -n dev init-sidecar-demo -c log-sidecar     # Sidecar logs
```

- Now the Init container logs will show:
    

```
Init container started
Config and HTML created successfully
```

---
