
----

# 📝 Kubernetes RBAC (Role-Based Access Control)

---

## 1. What is RBAC?

👉 **RBAC = Role-Based Access Control**  
It is a **security mechanism** in Kubernetes that decides:

- **Who (User/ServiceAccount)**
    
- **Can perform what action (verbs like get, list, create, delete)**
    
- **On which resources (pods, deployments, secrets, etc.)**
    
- **In which namespace**
    

---

## 2. Why do we need RBAC?

- Without RBAC, anyone with access to the cluster can do anything.
    
- In production, you don’t want a developer accidentally deleting the database pod.
    
- RBAC allows **fine-grained permissions**.
    

👉 Example in real world:

- A **developer** → can only **view pods**.
    
- A **DevOps engineer** → can **create and delete deployments**.
    
- A **monitoring service** → can only **read metrics**.
    

---

## 3. Main RBAC Components

1. **Role**
    
    - Defines **what actions are allowed on which resources** in a **namespace**.
        
    - Example: Role that allows "get, list, watch pods" in `dev` namespace.
        
2. **ClusterRole**
    
    - Similar to Role, but applies **cluster-wide** (all namespaces).
        
    - Example: Granting permission to view nodes (nodes are cluster-level objects).
        
3. **RoleBinding**
    
    - Connects a **Role** to a **user/group/ServiceAccount** inside a namespace.
        
4. **ClusterRoleBinding**
    
    - Connects a **ClusterRole** to a **user/group/ServiceAccount** across the cluster.
        

---

## 4. Structure of RBAC Objects (YAML)

### Example: Role (Namespace-specific)

```yaml
# role.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role   # Role = Namespace level permission
metadata:
  namespace: dev   # Role is created inside "dev" namespace
  name: pod-reader
rules:
- apiGroups: [""]  # "" means core API group (pods, services, configmaps, etc.)
  resources: ["pods"]   # This Role applies only to "pods"
  verbs: ["get", "list"]   # Allowed actions: get pod info & list all pods

```

👉 This Role says:

- In `dev` namespace,
    
- Allow **get, watch, list** actions
    
- On **pods**.
    

---

### Example: RoleBinding

```yaml
# rolebinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding   # Connect Role -> User/ServiceAccount
metadata:
  name: read-pods-binding
  namespace: dev   # Binding also applies only inside "dev"
subjects:
- kind: ServiceAccount   # Could also be User/Group
  name: test-sa          # ServiceAccount name
  namespace: dev         # ServiceAccount exists in "dev" namespace
roleRef:
  kind: Role
  name: pod-reader       # Attach Role "pod-reader"
  apiGroup: rbac.authorization.k8s.io

```

👉 This connects `dev-user` → to → `pod-reader` role in `dev` namespace.

---

### Example: ClusterRole

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-admin-view
rules:
- apiGroups: [""]
  resources: ["nodes", "pods"]
  verbs: ["get", "list", "watch"]
```

---

### Example: ClusterRoleBinding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-view-binding
subjects:
- kind: User
  name: admin-user
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: cluster-admin-view
  apiGroup: rbac.authorization.k8s.io
```

👉 This allows `admin-user` to **view nodes and pods across all namespaces**.

---

## Command : 
```
kubectl create namespace dev
kubectl create sa test-sa -n dev
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml


# Can "test-sa" get pods in dev namespace? ✅
kubectl auth can-i get pods --as=system:serviceaccount:dev:test-sa -n dev

# Can "test-sa" create pods in dev namespace? ❌ (Not allowed)
kubectl auth can-i create pods --as=system:serviceaccount:dev:test-sa -n dev

# Can "test-sa" list pods in another namespace (like prod)? ❌ (Not allowed)
kubectl auth can-i list pods --as=system:serviceaccount:dev:test-sa -n prod

```


---


## 5. Verbs in RBAC

Common verbs you can allow:

- **get** → Read one resource
    
- **list** → List all resources
    
- **watch** → Watch for changes
    
- **create** → Create new resource
    
- **update** → Update resource
    
- **patch** → Partially update
    
- **delete** → Delete resource
    

---

## 6. Key Points to Remember

- **Role** = namespace level
    
- **ClusterRole** = cluster level
    
- **Binding** = connects role to a subject (user/group/service account)
    
- **Principle** = **least privilege** → give minimum permissions needed
    

---

## 7. Quick Real-World Example

- You are DevOps lead.
    
- You want a **developer** to only see pods in `dev` namespace.
    

Steps:

1. Create **Role** (allow read pods in dev namespace).
    
2. Create **RoleBinding** (bind developer user to that role).
    
3. Developer logs in → can only view pods, cannot delete.
    

---

✅ **Summary Notes**

- RBAC secures Kubernetes with **roles & bindings**.
    
- **Role vs ClusterRole** = namespace vs cluster-wide.
    
- **Binding** connects a user to a role.
    
- Always use **least privilege principle**.
    

---

### 🔹 Role vs ClusterRole

✅ **Role**

- Always **namespaced** (bound to a single namespace).
    
- Defines permissions (like read, write, list pods, etc.) **inside one namespace**.
    
- Example: Allow reading Pods only in `dev` namespace.
    

✅ **ClusterRole**

- Not namespaced (global).
    
- Can define permissions that apply to:
    
    1. **All namespaces** (e.g., view pods in all namespaces).
        
    2. **Cluster-wide resources** (like `nodes`, `persistentvolumes`, which are not inside any namespace).
        
- Example: Allow viewing all nodes in the cluster.
    

---

### 🔹 RoleBinding vs ClusterRoleBinding

✅ **RoleBinding**

- Binds a **Role** (or even a ClusterRole) **to a user/group/serviceAccount within a single namespace**.
    
- Example: Bind Role `pod-reader` to user `dev-user` in namespace `dev`.  
    (user will only have access in `dev`, not in `prod` or `test`).
    

✅ **ClusterRoleBinding**

- Binds a **ClusterRole** to a user/group/serviceAccount **across the whole cluster**.
    
- Example: Bind ClusterRole `cluster-admin` to user `admin-user`.  
    (user gets access to all namespaces + cluster resources).
    

---

### 📊 Summary Table

|Object|Scope|Example Use Case|
|---|---|---|
|**Role**|Namespace|Read pods only in `dev` namespace|
|**ClusterRole**|Cluster-wide|Read nodes across cluster|
|**RoleBinding**|Namespace|Give user read access to pods in `dev` namespace|
|**ClusterRoleBinding**|Cluster-wide|Give user cluster-admin access across all namespaces|

---
