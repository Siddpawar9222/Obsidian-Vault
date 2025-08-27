
---

# 📝 Notes: Kubernetes Taints & Tolerations

---

## 1. Why Taints & Tolerations?

👉 By default, Kubernetes **can schedule any pod on any node**.  
But sometimes we want **control** over which pods go to which nodes.

Example cases:

- A node with **high memory** should only run **DB pods**.
    
- A node with **GPU** should only run **AI/ML pods**.
    
- Some nodes are **reserved for system pods only**.
    

This is where **Taints & Tolerations** help.

---

## 2. What is a Taint?

A **taint** is a rule you put on a **Node** that says:

> “I don’t want pods here unless they can **tolerate** me.”

👉 Taint = Node pushes pods away.

---

## 3. What is a Toleration?

A **toleration** is a rule you put on a **Pod** that says:

> “It’s okay, I can live with this taint.”

👉 Toleration = Pod accepts the rule.

---

## 4. How They Work Together

- If a Node has a **taint** but a Pod has **no toleration** → Pod won’t be scheduled there.
    
- If a Pod has a **toleration** matching the Node’s taint → Pod can be scheduled there.
    
- If a Node has **no taints** → any pod can run there (default behavior).
    

---

## 5. Taint Syntax

```bash
kubectl taint nodes <node-name> key=value:effect
```

### Effects:

- **NoSchedule** → Don’t schedule pods unless they tolerate.
    
- **PreferNoSchedule** → Avoid scheduling, but not strict.
    
- **NoExecute** → Evict existing pods if they don’t tolerate.
    

---

## 6. Examples

### 🔹 Example 1: Taint a Node

```bash
kubectl taint nodes node1 dedicated=db:NoSchedule
```

👉 Node `node1` is tainted → only pods with toleration for `dedicated=db` can run here.

---

### 🔹 Example 2: Pod with Toleration

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: db-pod
spec:
  tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "db"
    effect: "NoSchedule"
  containers:
  - name: mysql
    image: mysql:latest
```

👉 This pod can run on `node1` because it tolerates the taint.

---

### 🔹 Example 3: Taint with NoExecute

```bash
kubectl taint nodes node2 special=true:NoExecute
```

👉 All existing pods **without this toleration** will be evicted from node2.

Pod toleration for `NoExecute`:

```yaml
tolerations:
- key: "special"
  operator: "Equal"
  value: "true"
  effect: "NoExecute"
```

---

## 7. Real-World Analogy 🏫

Think of a **school (cluster)** with **classrooms (nodes)** and **students (pods):**

- Some classrooms have **“No Entry unless you have special pass”** sign (taint).
    
- Students with a **matching pass (toleration)** can enter.
    
- Others must find another classroom.
    

Effects:

- **NoSchedule** → Students without pass cannot enter.
    
- **PreferNoSchedule** → Try not to put students here, but if needed, okay.
    
- **NoExecute** → Students without pass must leave immediately.
    

---

## 8. Key Points

|Concept|Level|Purpose|
|---|---|---|
|**Taint**|Node|Restrict which pods can come|
|**Toleration**|Pod|Permission to enter tainted node|
|**Effect**|Node|Defines how strict the rule is (NoSchedule / PreferNoSchedule / NoExecute)|

---

## 9. Text Diagram

```
Cluster
│
├── Node1 (taint: dedicated=db:NoSchedule)
│      └── Only pods with toleration "dedicated=db" can run here
│
├── Node2 (no taint)
│      └── Any pod can run here
│
└── Pod (toleration: dedicated=db)
       └── Allowed on Node1 ✅
```


---

# 🛠 Practical Hands-On: Taints & Tolerations

---

## **Step 1: Check Your Nodes**

List all nodes:

```bash
kubectl get nodes
```

Pick one node (e.g., `minikube` or `worker-node-1`).  
We’ll taint this node.

---

## **Step 2: Apply a Taint to Node**

```bash
kubectl taint nodes <node-name> dedicated=db:NoSchedule
```

Example:

```bash
kubectl taint nodes minikube dedicated=db:NoSchedule
```

👉 Now this node says:

> “No pods unless they tolerate `dedicated=db`.”

---

## **Step 3: Deploy a Pod WITHOUT Toleration**

Create file `nginx-no-toleration.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-no-toleration
spec:
  containers:
  - name: nginx
    image: nginx
```

Apply it:

```bash
kubectl apply -f nginx-no-toleration.yaml
kubectl get pods -o wide
```

📌 Expected:

- Pod will stay in **Pending** state.
    
- Run `kubectl describe pod nginx-no-toleration` → you’ll see reason:  
    `node(s) had taint {dedicated: db}, that the pod didn't tolerate.`
    

---

## **Step 4: Deploy a Pod WITH Toleration**

Create file `nginx-with-toleration.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-with-toleration
spec:
  tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "db"
    effect: "NoSchedule"
  containers:
  - name: nginx
    image: nginx
```

Apply it:

```bash
kubectl apply -f nginx-with-toleration.yaml
kubectl get pods -o wide
```

📌 Expected:

- This Pod will run on the tainted node ✅
    

---

## **Step 5: Try `NoExecute` Taint (Eviction Demo)**

Now let’s use a stronger taint.  
Apply:

```bash
kubectl taint nodes <node-name> special=true:NoExecute
```

👉 Any existing pods **without toleration** for `special=true:NoExecute` will be **evicted** (removed).

Create Pod with toleration:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-noexecute
spec:
  tolerations:
  - key: "special"
    operator: "Equal"
    value: "true"
    effect: "NoExecute"
  containers:
  - name: nginx
    image: nginx
```

Apply → Pod will stay safe, others get evicted.

---

## **Step 6: Remove Taint**

To remove a taint:

```bash
kubectl taint nodes <node-name> dedicated=db:NoSchedule-
```

Notice the **trailing dash `-`** → it removes the taint.

---

# 🔑 What You Observed

1. **No Toleration** → Pod cannot run on tainted node.
    
2. **With Toleration** → Pod can run successfully.
    
3. **NoExecute** → Pods without toleration are evicted.
    
4. **Removing Taint** → Node becomes normal again.
    

---