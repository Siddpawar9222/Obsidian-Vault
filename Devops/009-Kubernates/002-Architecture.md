
---

![[Kubernetes-Architecture.webp]]



# 🔹 Kubernetes Architecture (Flow Explanation)

Kubernetes has **two main parts**:

1. **Master Node (Control Plane)** – the _brain_ 🧠 (makes decisions).
    
2. **Worker Nodes** – the _hands_ 🖐️ (run containers).
    

Let’s go step by step 👇

---

## 🟢 1. User Interaction Layer

- **UI (Dashboard)** → Web-based dashboard to interact with Kubernetes.
    
- **CLI (kubectl)** → Command line tool (most commonly used).
    

👉 Example: You type a command →

```bash
kubectl create deployment myapp --image=nginx
```

This request first goes to the **Master Node**.

---

## 🟢 2. Master Node (Control Plane)

The **Master Node** is the _brain/manager_ that decides what should run, where, and how.

It has 4 key components:

### 1. **API Server**

- Entry point for all requests (from CLI/UI/other services).
    
- Acts like a **receptionist** in an office – receives your requests and forwards them.
    

---

### 2. **etcd**

- A **key-value database** that stores the cluster state.
    
- Example: Which pods are running, how many replicas, configurations, etc.
    
- Think of it like **Kubernetes’ memory** 🧠.
    

---

### 3. **Scheduler**

- Decides **where to place new Pods** (on which worker node).
    
- Example: If Worker Node-1 has high CPU usage, it may place the new Pod on Worker Node-2.
    

---

### 4. **Controller Manager**

- Watches the system continuously → ensures the desired state = actual state.
    
- Example: You said 3 replicas of `myapp`. If one pod dies, Controller Manager creates a new one.
    
- Acts like a **supervisor**.
    

---

## 🟢 3. Worker Nodes

Worker nodes are the **machines (VMs or physical servers)** where your containers actually run.

Each worker node has:

### 1. **Pods**

- Smallest deployable unit in Kubernetes.
    
- A Pod = 1 or more containers.
    
- Example: `Pod-1` may have 2 containers (App + Sidecar Logger).
    

---

### 2. **Docker (or container runtime like containerd, CRI-O)**

- Actually runs your containers inside pods.
    
- Kubernetes doesn’t run containers directly → it delegates to Docker/container runtime.
    

---

### 3. **Kubelet**

- Agent running on every worker node.
    
- Talks to the Master node → executes instructions.
    
- Example: If Scheduler assigns a Pod to Node-2, kubelet pulls the image and runs it.
    

---

### 4. **Kube-Proxy**

- Handles networking inside the cluster.
    
- Ensures Pods can talk to each other and external traffic can reach them.
    
- Example: If a request comes to Service IP, kube-proxy routes it to the correct pod.
    

---

## 🔹 Flow of a Request (End-to-End)

Let’s say you deploy an app:

```bash
kubectl create deployment myapp --image=nginx
```

👉 Here’s what happens step by step:

1. **User (kubectl)** → Sends request to **API Server**.
    
2. **API Server** → Validates request and stores desired state in **etcd**.
    
3. **Scheduler** → Decides on which worker node to place the Pod.
    
4. **Controller Manager** → Ensures the Pod is created.
    
5. **Kubelet (on that node)** → Talks to Docker (or container runtime) → runs the container.
    
6. **Kube-Proxy** → Makes networking possible (so app is accessible).
    
7. ✅ Pod is running successfully on Worker Node.
    

---

# 📝 Simple Analogy

- **Master Node = Office Manager** (decides work, keeps records).
    
- **Worker Nodes = Employees** (do the actual work).
    
- **API Server = Receptionist** (receives tasks).
    
- **etcd = Office Diary** (records everything).
    
- **Scheduler = HR** (assigns tasks to employees).
    
- **Controller Manager = Supervisor** (checks if tasks are done).
    
- **Kubelet = Employee’s assistant** (executes tasks on employee’s desk).
    
- **Kube-Proxy = Office Phone Operator** (connects employees with each other & outsiders).
    

---

# 🔹 What is a Kubernetes Cluster?

A **Kubernetes Cluster** = **Master Node(s) + Worker Node(s)** working together to run containerized applications.

👉 In simple words:  
It’s a **group of machines** (physical or virtual) where:

- **Master Nodes** = the brain 🧠 (decides what to run, manages state).
    
- **Worker Nodes** = the muscles 💪 (actually run your apps inside containers).
    

---

## 🟢 Structure of a Cluster

A cluster usually has:

1. **One or more Master Nodes (Control Plane)**
    
    - Handles scheduling, monitoring, scaling, and decision-making.
        
2. **Multiple Worker Nodes**
    
    - Run your applications inside Pods.
        

---

## 🟢 Example (Real-World Analogy)

Imagine you run a **food delivery company** 🍔

- **Cluster** = The whole company.
    
- **Master Node** = The manager’s office (decides which orders go to which delivery person).
    
- **Worker Nodes** = The delivery persons (actually deliver the food).
    
- **Pods** = Each food delivery order (running containerized app).
    

👉 Without the **manager (master node)**, delivery boys don’t know where to go.  
👉 Without the **delivery boys (worker nodes)**, food never reaches customers.

Together, they form a **Cluster** that runs smoothly.

---

## 🟢 Why do we need a Cluster?

Because in real-world production:

- You don’t run apps on one server (it may crash).
    
- You use **many worker nodes** → Kubernetes clusters manage them as **one single system**.
    
- This ensures **scalability, fault tolerance, and high availability**.
    

---
