
---


Great question — when you have **Minikube + EKS** both configured on the same machine, you must always know **which Kubernetes cluster kubectl is talking to**.

Kubernetes already gives you commands for this.

I’ll show you **simple commands** + **how to switch between clusters**.

---

# ⭐ 1️⃣ Check which cluster kubectl is using right now

Run:

```
kubectl config current-context
```

You will see **one of these**:

### ✔ If using Minikube:

```
minikube
```

### ✔ If using AWS EKS:

```
arn:aws:eks:ap-south-1:<account-id>:cluster/eks-microservice-cluster
```

This tells EXACTLY which cluster you are connected to.

---

# ⭐ 2️⃣ List ALL clusters configured on your machine

```
kubectl config get-contexts
```

You will see something like:

```
CURRENT   NAME                                                             CLUSTER
*         arn:aws:eks:ap-south-1:249834689323:cluster/eks-microservice-cluster   eks-microservice-cluster
          minikube                                                         minikube
```

- `*` means current context
    
- Others are available but not active
    

---

# ⭐ 3️⃣ How to switch between clusters

### ➤ Switch to EKS

```
kubectl config use-context arn:aws:eks:ap-south-1:249834689323:cluster/eks-microservice-cluster
```

### ➤ Switch to Minikube

```
kubectl config use-context minikube
```

After switching, confirm active cluster:

```
kubectl config current-context
```

---

# ⭐ 4️⃣ Extra tip: Show cluster endpoint (just to be sure)

```
kubectl cluster-info
```

If EKS:

```
Kubernetes control plane is running at https://XXXX.gr7.ap-south-1.eks.amazonaws.com
```

If Minikube:

```
Kubernetes control plane is running at https://127.0.0.1:xxxx
```

---

# ⭐ Summary (simple)

|Task|Command|
|---|---|
|Check current cluster|`kubectl config current-context`|
|List all clusters|`kubectl config get-contexts`|
|Switch to EKS|`kubectl config use-context <eks-context>`|
|Switch to Minikube|`kubectl config use-context minikube`|

---

If you're ready:

👉 **Next step: deploy microservices to EKS**