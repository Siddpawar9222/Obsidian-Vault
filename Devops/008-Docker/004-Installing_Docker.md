

---

## 🐳 Step-by-step Commands to Install Docker on EC2 (Ubuntu)

### ✅ 1. **Update the system**

```bash
sudo apt update && sudo apt upgrade -y
```

---

### ✅ 2. **Install required dependencies**

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

---

### ✅ 3. **Add Docker's official GPG key**

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

---

### ✅ 4. **Add Docker repository**

```bash
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

---

### ✅ 5. **Update again to load new repo**

```bash
sudo apt update
```

---

### ✅ 6. **Install Docker Engine**

```bash
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

---

### ✅ 7. **Verify Docker installation**

```bash
docker --version
```

You should see something like:

```
Docker version 24.x.x, build ...
```

---

Now we can run docker command only through sudo 
```
 sudo docker ps
``` 
---

## Why ? 

---

## 🐧 You're using:

- **Linux OS (Ubuntu)** on **AWS EC2**
    
- You installed **Docker**
    
- But when you run: `docker ps`  
    You get:
    
    ```
    permission denied while trying to connect to the Docker daemon socket...
    ```
    

---

## 💡 First: Understand how Docker runs in Linux

### 🔧 Docker has 2 parts:

1. **Docker Daemon** (also called `dockerd`)
    
    - Runs as a **background service**
        
    - Requires **root (admin) permission**
        
    - Manages containers, images, etc.
        
2. **Docker Client** (what you type: `docker ps`, `docker run`)
    
    - Sends commands to the daemon
        

🧠 **Key point**: Docker Daemon is secure and needs **admin/root access**  
So, by default, **only `sudo` users can use Docker**

---

## ❌ The Error You Got: What It Means

When you ran:

```bash
docker ps
```

You got this error:

```
permission denied while trying to connect to the Docker daemon socket
```

This means:

> "Hey, your user (`ubuntu`) doesn’t have permission to talk to the Docker engine (daemon)."

---

## ✅ Solution: Add your user to the `docker` group

To allow **non-root users** (like `ubuntu`) to run Docker:

### 1. Add user to docker group:

```bash
sudo usermod -aG docker $USER
```

> This tells Linux: “Give `ubuntu` user access to Docker like an admin.”

---

### 2. Refresh session (VERY IMPORTANT)

Because group changes don't apply until you **log out and back in**

✅ You can do either:

- **Log out** and **SSH again** into EC2:
    
    ```bash
    exit
    ssh ubuntu@your-ec2-ip
    ```
    

**OR**

- Use this shortcut:
    
    ```bash
    newgrp docker
    ```
    

---

### 3. Try again

Now, try:

```bash
docker ps
```

✅ It should work **without sudo** now!

---

## 🧠 Summary

|Concept|Explanation|
|---|---|
|Docker Daemon|Runs with root permission|
|You|A normal user (`ubuntu`)|
|Issue|You were not allowed to access Docker without `sudo`|
|Fix|Add user to `docker` group and re-login|

---

