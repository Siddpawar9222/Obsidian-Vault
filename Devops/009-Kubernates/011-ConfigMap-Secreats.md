

---

# 📘 Kubernetes **ConfigMap & Secret** (with MySQL Example)

---

## 1. What is a **ConfigMap**?

👉 In simple English:  
A **ConfigMap** is used to store **non-sensitive configuration data** (key-value pairs, environment variables, or config files).

💡 Example in real life:
    
- Same way, a **ConfigMap** stores configuration like `DB_NAME`, `DB_HOST`, `APP_MODE=dev` etc.
    

### Features:

- Stores plain text values.
    
- Can be mounted inside pods as **environment variables** or **files**.
    
- **Not encrypted** → not good for sensitive data.
    

---

## 2. What is a **Secret**?

👉 In simple English:  
A **Secret** is like a **locker** for storing sensitive information such as passwords, API keys, tokens, or certificates.

💡 Example in real life:

- You keep your office timings on a notice board (ConfigMap).
    
- But you keep your ATM PIN inside a locker with a key (Secret).
    

### Features:

- Data is **Base64-encoded** (not encryption, but better than plain text).
    
- Mounted as **environment variables** or **files** inside pods.
    
- Designed for **sensitive info** (DB password, SSH keys, TLS certs).
    

---

## 3. MySQL Example with ConfigMap + Secret

Now let’s apply this to your MySQL **StatefulSet**.

---

### 🔹 Step 1: Create a **ConfigMap** for MySQL Config

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-config
  namespace: dev
data:
  MYSQL_DATABASE: mydb
  MYSQL_USER: myuser
```

- This stores **non-sensitive** data like DB name and username.
    

---

### 🔹 Step 2: Create a **Secret** for Password

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: dev
type: Opaque
data:
  MYSQL_PASSWORD: bXlwYXNzd29yZA==   # base64 encoded "mypassword"
  MYSQL_ROOT_PASSWORD: cm9vdHBhc3M=   # base64 encoded "rootpass"
```

⚡ Command to encode value:

```bash
echo -n "mypassword" | base64
```

---

### 🔹 Step 3: Use them in a **StatefulSet**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: dev
spec:
  serviceName: "mysql"
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
          name: mysql
        env:  # Use env instead of envFrom for better control
        - name: MYSQL_DATABASE
          valueFrom:
            configMapKeyRef:
              name: mysql-config
              key: MYSQL_DATABASE
        - name: MYSQL_USER
          valueFrom:
            configMapKeyRef:
              name: mysql-config
              key: MYSQL_USER
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_PASSWORD
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_ROOT_PASSWORD
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: standard
      resources:
        requests:
          storage: 1Gi

```

---

## 4. How It Works Together

### Inside Pod:

- Env Variables will look like:
    
    ```bash
    echo $MYSQL_DATABASE   # mydb
    echo $MYSQL_USER       # myuser
    echo $MYSQL_PASSWORD   # mypassword
    echo $MYSQL_ROOT_PASSWORD # rootpass
    ```

## Check Environment Variable : 
```
# Check environment variables in the pod 
kubectl exec mysql-0 -n dev -- env | grep MYSQL
```

### Text Diagram:

```
+----------------------+
| ConfigMap (mysql-config) |
|  MYSQL_DATABASE=mydb     |
|  MYSQL_USER=myuser       |
+----------------------+
            |
            v
+----------------------+
| Secret (mysql-secret)   |
|  MYSQL_PASSWORD=*****   |
|  MYSQL_ROOT_PASSWORD=***|
+----------------------+
            |
            v
+----------------------+
| StatefulSet (MySQL)  |
|  Pod-0 Pod-1 Pod-2   |
|  Each Pod:           |
|   - Reads DB name & user from ConfigMap |
|   - Reads password from Secret          |
|   - Stores data in PVC (Persistent)     |
+----------------------+
```

---

## 5. Why This is Powerful?

- ✅ **ConfigMap** → easy to change DB name, username, host without touching app code.
    
- ✅ **Secret** → keeps sensitive info secure, not exposed in plain text.
    
- ✅ **StatefulSet + PVC** → ensures each MySQL pod keeps its **own data**, even if deleted.
    
- ✅ **Separation of Concerns** → passwords and configs are managed independently.
    


---
