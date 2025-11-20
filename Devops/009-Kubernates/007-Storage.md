
---

## 1. The Problem

By default, Pods in Kubernetes are **ephemeral**:

- If a Pod dies → all files inside the container are lost.
    
- Example: If your Nginx pod stores a log or a user uploads a file → it disappears when pod restarts.
    

👉 To fix this, Kubernetes provides **Volumes** (a way to persist data).

---

## 2. Types of Storage in Kubernetes

### (a) **EmptyDir**

- Storage that lives as long as the Pod runs.
    
- Deleted when Pod is deleted.
    
- Use case: Cache, temp files.
    

```yaml
volumes:
  - name: cache
    emptyDir: {}
```

---

### (b) **HostPath**

- Mounts a directory from the **node’s filesystem** into the Pod.
    
- If Pod moves to another node, data is lost.
    
- Use case: Single-node testing (not recommended in production).
    

```yaml
volumes:
  - name: host-storage
    hostPath:
      path: /mnt/data
```

---

### (c) **PersistentVolume (PV) + PersistentVolumeClaim (PVC)**

This is the **proper way** for persistence.

#### PersistentVolume (PV)

- **Actual storage resource** (e.g., disk on a node, NFS share, cloud disk).

- Cluster Level
    
- Created by admins.
    
- Has:
    
    - Size
        
    - AccessModes
        
    - ReclaimPolicy
        

#### PersistentVolumeClaim (PVC)

- **Request for storage** made by developers (like an application).

- Namespace Level
    
- Says: _“I need 1Gi of storage, ReadWriteOnce.”_
    
- Kubernetes finds a matching PV and binds PVC → PV.
    

---

📌 **Analogy:**

- PV = _warehouse_ (storage unit created by the company).
    
- PVC = _employee request_ for space.
    
- K8s = _manager_ who assigns warehouse space.
    

---

### (d) **StorageClass**

- Provides **dynamic provisioning** of PVs.
    
- Instead of admins creating PVs manually, Kubernetes creates them automatically using `StorageClass`
    
- Example: In Minikube → `standard` storage class uses hostPath.
    
- In AWS → it provisions EBS volumes.
    

---

### (e) **CSI (Container Storage Interface) Drivers**

- Modern way to plug external storage providers (AWS EBS, GCP PD, Ceph, etc.).
    
- Lets Kubernetes work with any storage system. 
    
---

## 3. Access Modes

Each PV supports **how it can be accessed**:

- **RWO (ReadWriteOnce)** → only one node can mount at a time (most common, like AWS EBS).
    
- **ROX (ReadOnlyMany)** → multiple nodes can mount, but read-only.
    
- **RWX (ReadWriteMany)** → multiple nodes can mount, read-write (like NFS, CephFS).
    

📌 **Analogy:**

- RWO → one employee gets the locker key.
    
- ROX → many can look inside, nobody can change.
    
- RWX → team locker with multiple keys.
    

---

## 4. Reclaim Policies

Defines what happens to PV data after PVC is deleted:

- **Retain** → Keep the data, admin has to clean manually.
    
- **Delete** → Data is deleted along with PVC (common with dynamic provisioning).
    
- **Recycle (deprecated)** → Old option to wipe and reuse.
    

---

## 5. Storage Lifecycle

Here’s the typical flow:

```
[Admin] Create PV 
    ↓
[Developer] Create PVC 
    ↓
K8s matches PVC → PV 
    ↓
Pod uses PVC as a volume 
    ↓
If Pod dies → data persists in PV
    ↓
If PVC deleted:
    → Retain: PV stuck with data
    → Delete: PV + data deleted
```

---

## 6. Example Workflow

### Step 1: Admin creates PV

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: ""
  hostPath:
    path: /mnt/data
```

### Step 2: Dev creates PVC

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
  namespace: dev
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: ""   # match manual PV
```

### Step 3: Pod uses PVC

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  namespace: dev
spec:
  containers:
    - name: my-container
      image: nginx
      volumeMounts:
        - name: my-storage
          mountPath: /usr/share/nginx/html
  volumes:
    - name: my-storage
      persistentVolumeClaim:
        claimName: my-pvc
```

---

## 7. Real-World Industrial Examples

- **E-commerce app** → Store product images in PV (backed by cloud storage like AWS EBS).
    
- **Banking app** → Use RWX (like NFS) for shared transaction logs across Pods.
    
- **Video streaming** → Use object storage (via CSI) for large file persistence.
    
- **CI/CD pipelines** → Use EmptyDir for temporary build artifacts, PV for cache.
    

---

## 8. Text Diagram – Big Picture

```
             ┌─────────────┐
             │   Storage    │  (Physical storage: AWS EBS, NFS, local disk)
             └──────┬──────┘
                    │
              [ PersistentVolume (PV) ]
                    │
            matches with
                    │
              [ PersistentVolumeClaim (PVC) ]
                    │
        Pod declares: "I want PVC"
                    │
              [ Pod mounts Volume ]
                    │
           Container sees files inside mountPath
```

---

