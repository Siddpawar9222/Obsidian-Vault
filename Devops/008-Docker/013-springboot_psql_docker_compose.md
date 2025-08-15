
----

# 1) Spring Boot DB config (use env vars)

Add this to `src/main/resources/application.properties` (or `.yml`):

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/appdb}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:appuser}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:secret}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

>Docker  Compose will provide this Crendential. We write inside variable inside docker compose for flexiblity
  
---

# 2) Dockerfile (choose one)

### A) If you package a **JAR** (recommended for simplicity)

```dockerfile
########################################################
# Stage 1: Build the WAR file inside the container
########################################################
FROM maven:3.9.6-eclipse-temurin-21 AS build   # Use Maven with Java 21 as the build environment
WORKDIR /app                                   # Set working directory inside the container

# Copy only pom.xml first to leverage Docker cache for dependencies
COPY pom.xml .                                 # Copy pom.xml from local machine to container
RUN mvn dependency:go-offline                  # Download all Maven dependencies without building project

# Now copy the actual source code
COPY src ./src                                 # Copy the source folder to container
RUN mvn clean package -DskipTests              # Build the WAR file, skipping tests to save time

########################################################
# Stage 2: Run the application
########################################################
FROM eclipse-temurin:21-jdk                    # Use a lightweight JDK 21 runtime image (no Maven here)
WORKDIR /app                                   # Set working directory inside the container

# Copy WAR from the build stage into runtime image
COPY --from=build /app/target/*.war app.war    # Take WAR file from Stage 1 and place it here

EXPOSE 8080                                    # Inform Docker that app will run on port 8080
ENTRYPOINT ["java", "-jar", "app.war"]         # Command to run the application

```

> Here i used multi stage environment concept and using container itself to build jar and make image. Remove front comments it gives error

---

# 3) docker-compose.yml

Create `docker-compose.yml` in your project root:

```yaml
version: "3.9" // dont need in now

services:
  db:
    image: postgres:latest
    container_name: postgres-compose
    environment:
      POSTGRES_DB: crud-db
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U root -d crud-db || exit 1"]
      interval: 5s
      timeout: 3s
      retries: 10
    ports:
      - "5432:5432"
    restart: unless-stopped

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: spring-compose
    depends_on:
      db:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/crud-db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    ports:
      - "8080:8080"
    restart: unless-stopped

volumes:
  pgdata:
```

**Why this works**

- Services share an isolated network automatically.
    
- Your app connects to Postgres using host **`db`** (service name), not an IP.
    
- `healthcheck` ensures the DB is ready before the app starts.
    
- `pgdata` keeps database data safe across restarts.
    

---
# 4) Exceute command : 

```
 docker-compose up -d
```
> Run this command where your project `docker-compose-file` is there.
# 5) Quick DB checks

```bash
# enter Postgres shell inside the db container
docker compose exec db psql -U appuser -d appdb

# example SQL:
# \l        -- list databases
# \dt       -- list tables
# \q        -- quit
```

---

# 6) Common issues & quick fixes

- **Port already in use (5432/8080):**  
    Change host ports in compose (`"15432:5432"`, `"8081:8080"`) or stop the process using the port.
    
- **Name conflict (“… is already in use”):**  
    `docker compose down` or rename/remove the old container.
    
- **App can’t connect to DB (“connection refused”):**  
    Ensure URL is `jdbc:postgresql://db:5432/appdb` (service name `db`, not `localhost`).
    
- **DB not ready in time:**  
    We added a `healthcheck` and `depends_on`; keep it.
    
- **Permission denied on volumes:**  
    Usually fine on Linux/mac; if needed, `docker compose down -v` and re-up.

- No space left on device : 
    Clean Docker system : Old containers, images, and build cache can take a lot of space.
      `docker system prune -a --volumes`   

---


# Note : 

When you run a **single `docker-compose.yml`** file default isolated network assigned to all container created inside it:

- Docker Compose **creates one isolated network** (usually named `<project_name>_default`). 
    
- All containers in that file are automatically connected to this network.
    
- Containers **can talk to each other by service name** (e.g., `postgres`, `app`).
    
- This network is isolated from other Docker networks, so containers from a different project won’t see them unless you explicitly connect them.
    

Example:

```text
docker-compose up -d
# Creates a network named: myproject_default
```

If your file name is `docker-compose.yml` and the folder is `myproject/`,  
the network name will usually be `myproject_default`.

---

# 7) Stop / Restart / Clean

`stop`, `down`, and `rm` in **Docker Compose**:

```
          ┌──────────────────────────────┐
          │ docker compose up             │
          │ (creates & runs containers)   │
          └──────────────┬───────────────┘
                         │
         ┌───────────────┼────────────────┐
         │               │                │
         ▼               ▼                ▼
docker compose stop   docker compose down   docker compose rm
(stops containers     (stops + removes     (removes stopped
but keeps them)       containers &         containers — can't
                      networks; keeps      remove running ones)
                      volumes unless -v)
```

### **Key points**

- **stop** → pause the party 🎉 (containers are still there, just not running)
    
- **down** → clean up the chairs & decorations 🪑 (containers + network gone)
    
- **down -v** → also throw away the drinks 🍹 (volumes/data gone)
    
- **rm** → just removes stopped containers 🗑️
    

---
# What happens when i run `docker compose` : 

---

### **Case 1: You use `docker compose up`**

- **Without `--build` and without `--force-recreate`**  
    → If the container already exists and the configuration/image hasn’t changed, Docker will **reuse the same container**.  
    → If the config or image changed, it **recreates** the container.
    
- **With `--force-recreate`**  
    → Always creates a **new container**, even if nothing changed.
    
- **With `--build`**  
    → Rebuilds the image first, then **creates a new container**.
    

---

### **Case 2: You use `docker compose up -d` after `docker compose down`**

- `down` removes containers, so when you run `up` again → **new containers** are created.
    

---

### **Case 3: You use `docker compose restart`**

- It **does not create new containers** — just stops and starts the existing ones.
    

---

💡 **Tip for EC2**  
If you want to keep the same container and not lose any state (for example, database data), don’t run `docker compose down -v`. Just use `stop` or `restart`.

---
