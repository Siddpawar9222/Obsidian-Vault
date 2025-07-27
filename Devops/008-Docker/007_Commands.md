
---


```
sudo systemctl status docker
docker login -u geekysiddhesh
then enter password (PAT works as well)
docker images 
docker ps : running container
docker ps -a :  all container

docker pull image_name : pull image from docker hub(docker registry) 

docker run hello_world : pull image from docker hub(docker registry)  + run 

docker stop container_id
docker start container_id or container_name


docker restart container_id 
docker rm container_id 
docker rmi image_id

docker logs container_name

```


---

## 🐘 Step-by-step: Run PostgreSQL in Docker

### ✅ 1. **Pull PostgreSQL image**

```bash
docker pull postgres
```

This downloads the latest official PostgreSQL image from Docker Hub.

---

### ✅ 2. **Start PostgreSQL container**

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

**What this means:**

|Part|Meaning|
|---|---|
|`--name my-postgres`|Name of the container|
|`-e POSTGRES_PASSWORD=...`|Set DB password|
|`-d`|Run in background (detached)|
|`-p 5432:5432`|Maps host port to container|
|`postgres`|Image name|

✅ Now your PostgreSQL is running in Docker.

---

### ✅ 3. **Connect to PostgreSQL using `psql`**

```bash
docker exec -it my-postgres psql -U postgres
```

**Explanation:**

- `my-postgres` → container name
    
- `psql` → command-line client
    
- `-U postgres` → username is `postgres` (default)

-  `exec` to use terminal of postgres

Once you run this, you'll enter the PostgreSQL shell (like `mysql>` but for PostgreSQL), and you can run commands like:

```sql
\l         -- list databases
\dt        -- list tables
CREATE DATABASE testdb;
```

Exit with `\q`

---

### ✅ 4. (Optional) Stop the container

```bash
docker stop my-postgres
```

---

## 🧠 Summary

| Action         | Command                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Pull image     | `docker pull postgres`                                                                         |
| Start DB       | `docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres` |
| Login to DB    | `docker exec -it my-postgres psql -U postgres`                                                 |
| Exit `psql`    | `\q`                                                                                           |
| Stop container | `docker stop my-postgres`                                                                      |

---

## 🔹 1. `-i` → Interactive mode

**Means:** Keep the container’s standard input (keyboard input) open

### ✅ Real-world example:

When you want to type **commands inside the container**, like a terminal.

```bash
docker run -i ubuntu
```

👉 But you won’t **see anything properly** because there’s no terminal (no formatting or cursor).

---

## 🔹 2. `-t` → TTY (terminal)

**Means:** Allocate a terminal inside the container

It gives a **user-friendly shell** inside the container, like a Linux terminal screen.

```bash
docker run -t ubuntu
```

👉 But it won’t accept input unless you also use `-i`.

---

## ✅ 3. `-it` → `-i` + `-t` together

Used when you want to **run and interact** with the container using a terminal.

```bash
docker run -it ubuntu
```

💬 It opens an Ubuntu container and gives you a terminal inside.  
You can type Linux commands like `ls`, `pwd`, etc.

---

## 🔹 4. `-d` → Detached mode

**Means:** Run the container in the background (like a service/daemon)

```bash
docker run -d ubuntu
```

📦 You won’t see the terminal — container runs **in background**.

Used when:

- You run a database (like PostgreSQL)
    
- Or a server (like Nginx, Spring Boot app)
    

---

## ✅ 5. `-itd` → All 3 flags together

Used when you want to:

- Run container in background (`-d`)
    
- But still keep it interactive and terminal ready (`-it`)
    

```bash
docker run -itd ubuntu
```

This is rarely used unless you're debugging or plan to attach to the container later.

---

## 🔁 Recap with use-cases:

| Flag   | Meaning              | Use-case                            |
| ------ | -------------------- | ----------------------------------- |
| `-i`   | Interactive          | Accept input                        |
| `-t`   | Terminal             | Proper shell formatting             |
| `-it`  | Interactive Terminal | Shell + input (e.g., bash)          |
| `-d`   | Detached             | Run in background (e.g., DB/server) |
| `-itd` | All 3                | Interactive + terminal + background |

---

## 🧪 Example:

```bash
docker run -it ubuntu bash
```

👉 Starts Ubuntu and gives you a terminal with `bash` shell.

```bash
docker run -d --name pg -e POSTGRES_PASSWORD=1234 postgres
```

👉 Starts PostgreSQL in background with detached mode (`-d`)

---