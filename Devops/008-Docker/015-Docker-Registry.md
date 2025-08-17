
---
## 🚀 Steps to Push Local Docker Image to Registry

### 1. **Check if you have an image locally**

Run:

```bash
docker images
```

Example output:

```
REPOSITORY        TAG       IMAGE ID       CREATED       SIZE
my-app            v1        a1b2c3d4e5f6   2 hours ago   200MB
```

Here your image name is **`my-app`** and tag is **`v1`**.

---

### 2. **Login to your registry**

If you’re using **Docker Hub**:

```bash
docker login
```

It will ask for:

- Username
    
- Password / Personal Access Token (recommended)
    

If you’re using a **private registry** (example: `registry.example.com`):

```bash
docker login registry.example.com
```

---

### 3. **Tag your local image for the registry**

Your local image might be just `my-app:v1`, but to push, Docker needs it in the format:

```
<registry>/<username>/<repository>:<tag>
```

Examples:

- For Docker Hub:
    
    ```bash
    docker tag my-app:v1 mydockerhubusername/my-app:v1
    ```
    
- For Private Registry:
    
    ```bash
    docker tag my-app:v1 registry.example.com/my-team/my-app:v1
    ```
    

---

### 4. **Push the image**

Now push it:

```bash
docker push mydockerhubusername/my-app:v1
```

or for private registry:

```bash
docker push registry.example.com/my-team/my-app:v1
```

---

### 5. **Verify the push**

- If it’s Docker Hub → log in to [https://hub.docker.com](https://hub.docker.com/) → check your repository.
    
- If it’s a private registry → open its web UI or pull it from another machine:
    
    ```bash
    docker pull registry.example.com/my-team/my-app:v1
    ```
    

---

## ⚡ Quick Example: Docker Hub

```bash
docker images
# Found my-app:v1

docker login
# Enter username/password

docker tag my-app:v1 siddheshpawar/my-app:v1

docker push siddheshpawar/my-app:v1
```

Now the image is online 🚀

---