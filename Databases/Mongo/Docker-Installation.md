
---

# Step 2: Pull MongoDB Image

```bash
docker pull mongo:7
```

(7 is latest stable major version)

---

# Step 3: Run MongoDB Container

### Basic command (most common)

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  mongo:7
```

This means:

- `-d` → run in background
    
- `--name mongodb` → container name
    
- `-p 27017:27017` → expose port
    
- `mongo:7` → image
    

---

# Step 4: Check if running

```bash
docker ps
```

You should see:

```
mongodb   mongo:7   27017->27017
```

---

# Step 5: Connect to Mongo Shell

```bash
docker exec -it mongodb mongosh
```

Now you're inside MongoDB 🎉

---

# Step 6: Use in Spring Boot

application.yml

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/productdb
```

---

# Optional (Production-like) with Volume

So data is not lost if container stops:

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:7
```

---

# If you want username/password (real-world)

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:7
```

Spring config:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://admin:admin123@localhost:27017/productdb
```

---

## Authentication Error in Spring Boot: 

---

## The error message (important part)

```
userName='root', source='productdb'
```

This means:

> Spring Boot is trying to authenticate user **root** in database **productdb**

But your user **root was created in `admin` database**, not in `productdb`.

So MongoDB says:  
❌ _"I don't find user root inside productdb"_

---

## Why this happens

When you ran Docker:

```bash
-e MONGO_INITDB_ROOT_USERNAME=root
-e MONGO_INITDB_ROOT_PASSWORD=root
```

Mongo created this user:

- username: `root`
    
- database: `admin` (by default)
    

But Spring Boot is connecting like:

```
mongodb://root:root@localhost:27017/productdb
```

So it thinks:

> root user belongs to `productdb`

Which is wrong.

---

## Solution 1 (Best & Simple) – Add authSource

Just tell Spring Boot:

> "My user is in admin DB"

### application.properties

```properties
spring.data.mongodb.uri=mongodb://root:root@localhost:27017/productdb?authSource=admin
```

That’s it ✅

This is the **correct and standard solution**.

---

## Solution 2 (Alternative) – Use admin as database

Not recommended for real projects, but works:

```properties
spring.data.mongodb.uri=mongodb://root:root@localhost:27017/admin
```

But now your data will go into `admin` DB (bad practice).

---

## How to verify in Mongo Shell

Enter shell:

```bash
docker exec -it mongodb mongosh -u root -p root --authenticationDatabase admin
```

Then:

```js
use admin
db.getUsers()
```

You’ll see:

```js
root user exists here
```

---


