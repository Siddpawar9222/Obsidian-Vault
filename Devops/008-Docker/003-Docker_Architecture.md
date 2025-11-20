
---

## 🔧 What is Docker Architecture?

Docker follows **Client-Server architecture**.  
There are **3 main components**:

### ✅ 1. **Docker Client (CLI)**

This is **what you use to type commands**, like:

```bash
docker build
docker run
docker ps
```

🧠 Think of it like:  
👨‍💻 **You**, giving instructions to Docker.

---

### ✅ 2. **Docker Daemon (dockerd)**

This is the **main engine** of Docker. It:

- Builds images
    
- Runs containers
    
- Manages volumes, networks, etc.
    

The daemon keeps running in the background and listens for commands from Docker Client.

🧠 Think of it like:  
⚙️ **A chef in a restaurant**, doing the actual cooking based on your orders.

---

### ✅ 3. **Docker Objects**

Docker uses these main objects:

| Object           | What it is                                                      |
| ---------------- | --------------------------------------------------------------- |
| 🔹 **Image**     | Blueprint (template) of your app (like a `.jar` file or `.exe`) |
| 🔹 **Container** | Running instance of an image (like an app running in memory)    |
| 🔹 **Volume**    | Storage used by containers                                      |
| 🔹 **Network**   | Communication between containers                                |



---

### ✅ 4. **Docker Registries (e.g., Docker Hub)**

This is where Docker stores and fetches images.

- You can **pull** an image (e.g. `openjdk`, `postgres`)
    
- You can **push** your own image
    

🧠 Think of it like:  
🌐 **Play Store** for Docker images

---

## 🔄 How Docker Works (Step-by-Step)

Let’s say you type:

```bash
docker run postgres
```

Here’s what happens internally:

1. 🧑‍💻 **Docker Client** sends command to Docker Daemon
    
2. 🔄 Docker Daemon checks if the image `postgres` is available locally
    
3. 🌐 If not, it pulls it from Docker Hub (registry)
    
4. 📦 Creates a **container** from the image
    
5. 🚀 Starts the container (PostgreSQL is now running)
    

---

## 🔁 Docker Architecture Diagram (Text-based)

```
            +----------------------+
            |  Docker Client (CLI) |
            +----------+-----------+
                       |
                       | REST API
                       v
             +---------+----------+
             |   Docker Daemon    |
             +----+----------+----+
                  |          |
      +-----------+--+   +---+-------------+
      | Docker Images |   | Docker Containers |
      +---------------+   +------------------+
                  |
             +----v-----+
             | Registry |
             | (Docker  |
             |   Hub)   |
             +----------+
```

---
![[docker_ architecture.jpg]]
---
## ✅ Summary

| Component        | Role                                  |
| ---------------- | ------------------------------------- |
| Docker Client    | Sends commands                        |
| Docker Daemon    | Executes commands, manages containers |
| Docker Image     | Blueprint of app                      |
| Docker Container | Running app                           |
| Docker Registry  | Image storage (like Docker Hub)       |

