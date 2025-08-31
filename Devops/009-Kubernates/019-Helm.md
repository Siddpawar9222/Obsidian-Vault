
---

# 🚀 Helm – Concept Notes

### 1. **What is Helm?**

- Helm is a **package manager for Kubernetes** (like `apt` for Ubuntu or `yum` for RHEL).
    
- It helps you **define, install, and manage Kubernetes applications**.
    
- In Kubernetes, deploying apps usually requires **lots of YAML files** (Deployment, Service, ConfigMap, Ingress, etc). Helm bundles all of these into a **chart**.
    

---

### 2. **Key Concepts**

#### 🔹 Chart

- A **Helm package** (like `.deb` or `.rpm`).
    
- It contains all YAML files needed for an app, plus a templating system.
    
- Example: `nginx-chart` may contain Deployment + Service + ConfigMap YAMLs.
    

#### 🔹 Release

- A **running instance** of a Helm chart in your cluster.
    
- Example: If you install `nginx-chart`, Helm creates a release called `nginx-release` in the cluster.
    
- You can install the same chart multiple times with different release names.
    

#### 🔹 Repository

- A collection of Helm charts stored online (like Docker Hub for images).
    
- Example: `bitnami` Helm repo, `artifacthub.io`.
    

---

### 3. **Why Use Helm?**

Without Helm:

- You manually write 5–10 YAML files for a single app.
    
- Updating version/config means editing YAML everywhere.
    

With Helm:

- Define values (like image, replicas) in **`values.yaml`**.
    
- Helm injects them into templates (`templates/*.yaml`).
    
- Upgrading is as simple as:
    
    ```bash
    helm upgrade my-release my-chart --set image.tag=2.0
    ```
    

---

### 4. **Helm Workflow**

1. **Add repo** (optional if using remote charts)
    
    ```bash
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update
    ```
    
2. **Install a chart**
    
    ```bash
    helm install my-nginx bitnami/nginx
    ```
    
3. **List releases**
    
    ```bash
    helm list
    ```
    
4. **Upgrade release**
    
    ```bash
    helm upgrade my-nginx bitnami/nginx --set replicaCount=3
    ```
    
5. **Uninstall release**
    
    ```bash
    helm uninstall my-nginx
    ```
    

---

### 5. **Structure of a Helm Chart**

When you create your own chart (we’ll do this soon):

```
mychart/
  Chart.yaml        # Info about chart (name, version, etc.)
  values.yaml       # Default config values
  templates/        # YAML templates (Deployment, Service, etc.)
  charts/           # Dependency charts
```

---

### 6. **Industrial Use Case**

✅ Instead of every developer writing raw YAML, teams use Helm:

- **DevOps teams**: maintain reusable charts for DBs, monitoring (Prometheus, Grafana).
    
- **Developers**: just set configs in `values.yaml` (e.g., replicas, DB creds).
    
- **CI/CD pipelines**: deploy apps via Helm commands.
    

---

👉 In short:  
**Helm = Package manager + Templating system + Version control for Kubernetes apps.**

---

## 🔹 Step 1: Create `dev` namespace

```bash
kubectl create namespace dev
```

👉 This ensures all Helm resources go inside `dev`.

---

## 🔹 Step 2: Create a new chart

```bash
helm create mychart
```

👉 This generates a chart folder:

```
mychart/
 ├── Chart.yaml
 ├── values.yaml
 ├── templates/
 └── charts/
```

---

## 🔹 Step 3: Edit `values.yaml`

Open `values.yaml` and set:

```yaml
replicaCount: 2

image:
  repository: nginx
  tag: "1.25"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
```

---

## 🔹 Step 4: Install chart in `dev` namespace

```bash
helm install myapp ./mychart -n dev
```

👉 Helm will:

- Render templates
    
- Send manifests to Kubernetes
    
- Create resources inside `dev` namespace
    

---

## 🔹 Step 5: Verify installation

```bash
helm list -n dev
kubectl get all -n dev
```

You should see:

- 2 Pods (`nginx` replicas)
    
- 1 Deployment
    
- 1 Service
    

---

## 🔹 Step 6: Upgrade release

Change replicas in `values.yaml`:

```yaml
replicaCount: 3
```

Apply upgrade:

```bash
helm upgrade myapp ./mychart -n dev
```

Verify:

```bash
kubectl get pods -n dev
```

---

## 🔹 Step 7: Rollback if needed

```bash
helm rollback myapp 1 -n dev
```

---

## 🔹 Step 8: Uninstall release

```bash
helm uninstall myapp -n dev
```

👉 Removes all resources created by Helm.

---

## **Helm Create Flow**

```
Step 1: Create Chart
--------------------
$ helm create mychart

Result:
mychart/
 ├── Chart.yaml          (chart metadata: name, version)
 ├── values.yaml         (default values for templates)
 ├── templates/          (all k8s manifests in template form)
 └── charts/             (dependencies if any)

```

```
Step 2: Customize Chart
-----------------------
- Edit Chart.yaml (set app name, version)
- Edit values.yaml (image name, replicas, service port)
- Edit templates/ (deployment.yaml, service.yaml, ingress.yaml)

```

```
Step 3: Install/Deploy Chart
----------------------------
$ helm install myapp ./mychart

Helm does:
  1. Reads Chart.yaml + values.yaml
  2. Renders templates into final YAML
  3. Sends YAML to Kubernetes API Server

```

```
Step 4: Verify Release
----------------------
$ helm list
→ shows installed releases (myapp)

$ kubectl get all
→ shows pods, svc, deployments created by chart

```

```
Step 5: Upgrade (Change Config)
-------------------------------
- Update values.yaml (e.g. replicas: 3)
$ helm upgrade myapp ./mychart

→ Helm updates the release with new config

```

```
Step 6: Rollback (if issue comes)
---------------------------------
$ helm rollback myapp 1
→ Rollback to revision 1

```

```
Step 7: Uninstall Chart
-----------------------
$ helm uninstall myapp
→ Removes all resources created by that release
```

---

⚡ So the **flow** is:

`helm create → edit chart → helm install → verify → upgrade/rollback → uninstall`

---

Do you want me to now **show you practically by creating a simple chart (like nginx app) step by step with commands**?