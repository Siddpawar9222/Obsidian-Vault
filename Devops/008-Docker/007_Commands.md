
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
