
---

# DaemonSet : 

👉 Think of a **DaemonSet** like a rule that says:

> “Run **one copy of a pod on every node** in the cluster.”

- In a **Deployment** → Kubernetes decides how many replicas you want (e.g., 3 pods anywhere).
    
- In a **DaemonSet** → Kubernetes ensures **each node** gets **at least one pod**.
    

---

# 🏭 Industrial use cases

DaemonSets are used when you need something **running on every node**, like:

- **Logging agent** → e.g., Fluentd, Filebeat (collect logs from each node).
    
- **Monitoring agent** → e.g., Prometheus Node Exporter (to monitor CPU, RAM).
    
- **Networking agent** → e.g., CNI plugin (Calico, Weave).
    

---

# 📝 Example DaemonSet YAML

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-agent
  namespace: dev
spec:
  selector:
    matchLabels:
      app: log-agent
  template:
    metadata:
      labels:
        app: log-agent
    spec:
      containers:
        - name: log-agent
          image: busybox
          command: [ "sh", "-c", "while true; do echo 'Logging from $(hostname)'; sleep 10; done" ]
```

---

# ▶️ Hands-on Steps

1. Save the file: `daemonset.yaml`
    
2. Apply it:
    
    ```bash
    kubectl apply -f daemonset.yaml
    ```
    
3. Check pods:
    
    ```bash
    kubectl get pods -o wide -n dev
    ```
    
    👉 You’ll see **one pod per node**.
    
4. If you add a **new node** → Kubernetes **automatically creates a new DaemonSet pod** there.
    

---

🔑 Key takeaway:

- **Deployment** = “I want N copies” (scalable apps).
    
- **DaemonSet** = “I want 1 per node” (system-level agents).
    

---

 **Kubernetes Delete Commands Cheat Sheet (All in One Place)** 

```
# Delete a Pod
kubectl delete pod <pod-name> -n <namespace>

# Delete a Deployment
kubectl delete deployment <deployment-name> -n <namespace>

# Delete a Service
kubectl delete service <service-name> -n <namespace>

# Delete a ReplicaSet
kubectl delete rs <replicaset-name> -n <namespace>

# Delete a DaemonSet
kubectl delete ds <daemonset-name> -n <namespace>

# Delete a Job
kubectl delete job <job-name> -n <namespace>

# Delete a CronJob
kubectl delete cronjob <cronjob-name> -n <namespace>

# Delete a Namespace
kubectl delete namespace <namespace-name>

# Delete all resources in a namespace
kubectl delete all --all -n <namespace>

# Delete all resources in the cluster (DANGEROUS ⚠️)
kubectl delete all --all --all-namespaces
```

---

# 🔹 Kubernetes **Job**

👉 **Concept (Simple English):**

- A **Job** runs a **task once** (or a fixed number of times) until it **completes successfully**.
    
- Example: Data migration, DB backup, sending an email batch.
    
- After it finishes, Pod will not restart again (unless you ask it to retry on failure).
    

---

## 📄 Example: `job.yml`

```yaml
apiVersion: batch/v1          # API group for Jobs
kind: Job                     # Resource type is Job
metadata:
  name: hello-job             # Name of the Job
spec:
  completions: 3              # Run task until it succeeds 3 times
  parallelism: 2              # Run 2 pods at the same time (in parallel)
  template:                   # Pod template (same as Deployment/Pod)
    spec:
      containers:
      - name: hello
        image: busybox
        command: ["echo", "Hello from Job"]  # Task to run
      restartPolicy: Never    # Don't restart Pod once it finishes
```

### 👉 What will happen?

- 3 Pods will run in total (`completions: 3`)
    
- At most 2 Pods run in parallel (`parallelism: 2`)
    
- Each Pod just prints `Hello from Job` and exits.
    
- Once all Pods are done → Job is **Completed ✅**
    

---

# 🔹 Kubernetes **CronJob**

👉 **Concept (Simple English):**

- A **CronJob** is like a **Linux cron task** in Kubernetes.
    
- Runs a **Job** on a **schedule** (daily, hourly, every minute, etc.).
    
- Example: Take DB backup every night at 2 AM.
    

---

## 📄 Example: `cronjob.yml`

```yaml
apiVersion: batch/v1
kind: CronJob                 # Resource type is CronJob
metadata:
  name: hello-cronjob
spec:
  schedule: "*/1 * * * *"     # CRON expression → Run every 1 minute
  jobTemplate:                # Template for the Job
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox
            command: ["echo", "Hello from CronJob"]
          restartPolicy: Never
```

### 👉 What will happen?

- Every **1 minute**, a new Job will be created.
    
- That Job will run 1 Pod that prints `Hello from CronJob`.
    
- Old completed Jobs/Pods can be cleaned automatically (configurable).
    

---

# 🔑 Difference Between **Job** & **CronJob**

|Feature|Job (One-time Task)|CronJob (Scheduled Task)|
|---|---|---|
|Runs once?|✅ Yes|❌ Runs repeatedly|
|Use case|Data migration, batch process|Backups, reports, cleanup|
|Example|Send 1 batch of emails|Send report daily at 6 AM|

---

## 🔹 **CronJob Commands**

```bash
# Create CronJob
kubectl apply -f cronjob.yml

# List all CronJobs
kubectl get cronjobs

# See CronJob details
kubectl describe cronjob hello-cronjob

# Check Jobs created by CronJob
kubectl get jobs --selector=job-name

# See Pods created by CronJob's Job
kubectl get pods

# Manually trigger CronJob (create Job immediately)
kubectl create job --from=cronjob/hello-cronjob manual-run

# Delete CronJob (Jobs may remain, unless cleaned up)
kubectl delete cronjob hello-cronjob
```

---
