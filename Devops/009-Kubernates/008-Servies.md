
---

# 🌐 Kubernetes Services – From Scratch

## 1. The Problem

- In Kubernetes, **Pods are ephemeral** → IP addresses change whenever Pods are recreated.
    
- Example:
    
    - Today: Pod has IP `10.244.1.5`
        
    - Tomorrow (after restart): Pod has IP `10.244.2.7`
        

👉 If clients (frontend Pods, external users) connect directly to Pod IP, connections break.

We need a **stable way** to reach Pods, no matter if they restart or scale.

---

## 2. What is a Service?

A **Service** in Kubernetes is:

- A **stable networking endpoint** (a permanent IP + DNS name).
    
- It automatically **load balances traffic** across matching Pods.
    
- Works using **labels + selectors**.
    
---

## 3. How Service Works (internally)

1. Pods have **labels** (e.g., `app=nginx`).
    
2. Service has a **selector** → matches Pods with those labels.
    
3. Service gets a **ClusterIP** (stable IP) and a DNS name.
    
4. Kubernetes **kube-proxy + iptables/ebpf** routes traffic from Service → actual Pods.
    

---

## 4. Types of Services

There are mainly **4 types**:

---

### (a) **ClusterIP (default)**

- Exposes service **inside the cluster only**.
    
- Other Pods can use it, but **not accessible outside**.
    

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

Access: `curl http://my-service:80` (from another Pod in cluster)

---

### (b) **NodePort**

- Exposes service on each **Node’s IP:Port** (port between 30000–32767).
    
- Accessible from outside using `http://<NodeIP>:NodePort`.
    

```yaml
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - port: 80        # Service port
      targetPort: 80  # Container port
      nodePort: 30080 # External port
```

Access: `http://<EC2-Public-IP>:30080`

```
kubectl port-forward --address 0.0.0.0 svc/myapp-service -n dev 8080:80
```
---

### (c) **LoadBalancer**

- Works only on **cloud providers** (AWS, GCP, Azure).
    
- Creates a cloud load balancer and maps it to your Service.
    
- External users get a **public IP** or DNS.
    


```yaml
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

Access: Cloud provider gives `http://<public-ip>`

---

### (d) **ExternalName**

- Special case.
    
- Doesn’t route traffic to Pods, instead **maps to an external DNS name**.
    

```yaml
spec:
  type: ExternalName
  externalName: example.com
```

Access: `http://my-service` → forwards to `http://example.com`

---

## 5. Service + Pod Relationship

📌 Text Diagram:

```
          ┌───────────────┐
          │  Client/User  │
          └───────┬───────┘
                  │
        http://NodeIP:30080
                  │
         ┌────────▼─────────┐
         │   Service        │   (Stable IP + DNS)
         │ (NodePort/CLIP)  │
         └────────┬─────────┘
                  │  (selects pods with label app=nginx)
    ┌─────────────┼─────────────────┐
    │             │                 │
┌───▼───┐    ┌────▼────┐      ┌─────▼────┐
│ Pod 1 │    │  Pod 2  │      │   Pod 3  │
│ IP1   │    │  IP2    │      │   IP3    │
└───────┘    └─────────┘      └──────────┘
```

---

## 6. Notes on **DNS in Kubernetes**

- Every Service gets an internal DNS name:
    
    ```
    <service-name>.<namespace>.svc.cluster.local
    ```
    
- Example: `my-service.dev.svc.cluster.local`
    

So Pods in the same namespace can just use `http://my-service`.

---

## 7. Industrial Real-World Examples

- **Frontend → Backend**: React app (Pod) calls `http://backend-service:8080` inside the cluster.
    
- **Database Service**: A MySQL Pod is exposed as a `ClusterIP` Service so only in-cluster apps can access it.
    
- **Public Web App**: A Node.js frontend exposed via `LoadBalancer` to the internet.
    
- **Hybrid**: Backend services use `ClusterIP`, but API Gateway is exposed with `NodePort` or `LoadBalancer`.
    

---

## 8. Quick Revision Table

| Service Type     | Scope               | Access from Outside?  | Real-world analogy        |
| ---------------- | ------------------- | --------------------- | ------------------------- |
| **ClusterIP**    | Inside cluster only | ❌ No                  | Internal extension        |
| **NodePort**     | NodeIP:Port         | ✅ Yes (manual)        | Door at street address    |
| **LoadBalancer** | Cloud LoadBalancer  | ✅ Yes (cloud-managed) | Fancy public receptionist |
| **ExternalName** | External DNS        | ✅ Yes (redirect)      | Forward calls outside     |

---
