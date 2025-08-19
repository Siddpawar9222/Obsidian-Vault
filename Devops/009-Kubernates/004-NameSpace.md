
---

## 1. What is a Namespace in Kubernetes?

👉 In simple English:  
A **namespace** is like a **folder** in your computer, or like a **department in a company**.

- In a company → you have departments like _HR_, _Finance_, _Engineering_.

Each department keeps its things separate so they don’t get mixed up.

🔹 In Kubernetes:  
A **namespace** is a **logical separation** inside your cluster.  
It helps you group resources (pods, services, deployments, etc.) into different sections.
You can apply **resource limits** or **access control (RBAC)** per namespace.

---

## 3. Default Namespaces in Kubernetes

When you install Minikube (or any cluster), some namespaces are created automatically:

- `default` → where your resources go if you don’t specify a namespace.
    
- `kube-system` → for Kubernetes internal stuff (like DNS, proxy, scheduler).
    
- `kube-public` → public resources, readable by all users (rarely used).
    
- `kube-node-lease` → for node heartbeat signals.
    

---

## 4. Commands to Work with Namespaces

Let’s try some hands-on 👨‍💻 (run these inside your Minikube terminal):

### 👉 View namespaces

```bash
kubectl get namespaces
```

### 👉 Create a new namespace

```bash
kubectl create namespace dev
```

### 👉 Deploy something inside that namespace

```bash
kubectl run nginx --image=nginx --namespace=dev
```

### 👉 Check pods in a namespace

```bash
kubectl get pods -n dev
```

### 👉 Set default namespace for your commands

```bash
kubectl config set-context --current --namespace=dev
```

Now when you run `kubectl get pods`, it will check in `dev` namespace automatically.


---

## 1. What is a manifest file?

- A **manifest file** is a `.yml` file where you **declare what you want** in the cluster.
    
- Kubernetes **reads it** and creates resources exactly as described.
    
- It can include **namespaces, pods, deployments, services, etc.**
    

Think of it like a **form you submit to HR** to hire an employee:

- You fill all details → HR (Kubernetes) creates the employee in the right department.
    

---

## 2. Example: Namespace manifest

We want a **dev department**:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```

- `apiVersion: v1` → which version of Kubernetes API to use
    
- `kind: Namespace` → type of resource
    
- `metadata.name` → name of the namespace (department)
    

✅ Save this as `namespace-dev.yml`

Create it using:

```bash
kubectl apply -f namespace-dev.yml
```

---

## 3. Example: Deployment manifest in that namespace

Now we want **one employee (pod) in the dev department**:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: dev  # put this pod in dev department
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80

```

- `replicas: 2` → 2 pods (2 employees)
    
- `namespace: dev` → which department they belong to
    
- `containers` → what the employee (pod) will do (here, run Nginx)
    

✅ Save as `deployment-dev.yml` and apply:

```bash
kubectl apply -f deployment-dev.yml
```

---

## 4. Check if it worked

```bash
kubectl get pods -n dev
kubectl get deployments -n dev
```



---

## 5. Why use YAML manifest?

- Everything is **version-controlled** (store in Git).
    
- Easy to **reproduce environments** (`dev`, `test`, `prod`).
    
- Changes are **declarative**: you say “I want 2 replicas”, Kubernetes makes it so.
    

---

💡 Key tip: You can create **one YAML file that has both namespace + deployment**. Just separate resources with `---`:

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
  namespace: dev  # put this pod in dev department
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

Apply with:

```bash
kubectl apply -f all-in-one.yml
```

---
## Commands:
###  To describe a pod in Kubernetes, use:

```bash
kubectl describe pod <pod-name> -n <namespace>
```

For example, with our pod `myapp` in namespace `dev`:

```bash
kubectl describe pod myapp -n dev
```

This will show detailed info about the pod:

- Status (Running, Pending, etc.)
    
- Node it’s on
    
- Containers inside it
    
- Events (like errors or restarts)

### Check Pod working or not : 

#### Option 1: SSH tunnel (recommended)

From your **local machine**, run:

```bash
ssh -i your-key.pem -L 8080:127.0.0.1:8080 ubuntu@EC2_PUBLIC_IP
```

- This creates a secure tunnel from your local `localhost:8080` → EC2 `localhost:8080`.
    
- Then open browser:
    

```
http://localhost:8080
```

---

#### Option 2: Use `kubectl port-forward` with `--address 0.0.0.0` (less secure - Worked for me)

On your EC2 instance:

```bash
kubectl port-forward --address 0.0.0.0 pod/myapp 8080:80 -n dev
```

- Now it listens on **all EC2 network interfaces**, not just localhost.
    
- Open browser from your local machine using **EC2 public IP**:
    

```
http://EC2_PUBLIC_IP:8080
```

⚠️ Make sure **EC2 security group allows inbound TCP 8080**.

---

💡 For learning, **Option 1 (SSH tunnel)** is safer.

I can give you a **step-by-step command set** to make Nginx accessible from your browser. Do you want me to do that?
 