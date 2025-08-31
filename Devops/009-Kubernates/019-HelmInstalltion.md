
---

## **Install Helm on Ubuntu**

The recommended way to install Helm on Ubuntu is by adding the official Helm repository and using `apt`.

### **Steps:**

1. **Add the Helm GPG key:**
    

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
```

2. **Add the Helm repository to your sources list:**
    

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm.list
```

3. **Update your package list:**
    

```bash
sudo apt-get update
```

4. **Install Helm:**
    

```bash
sudo apt-get install helm
```

5. **Verify the installation:**
    

```bash
helm version
```

> You should see the installed Helm client version, confirming a successful installation.

---