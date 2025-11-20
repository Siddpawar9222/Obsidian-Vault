
----

## **1. Why Multi-stage Builds?**

Before multi-stage builds (Docker 17.05+), you had two common options:

1. **Build inside your local machine, copy the artifact (JAR/WAR) into Docker image**
    
    - Pros: Final image is small.
        
    - Cons: You must install Maven/Gradle locally; not portable for CI/CD.
        
2. **Build directly inside Docker (single stage)**
    
    - Pros: No need for Maven locally, works in CI/CD.
        
    - Cons: The final image becomes **HUGE** because it contains **both Maven and all your source code** — which is unnecessary for running the app.  
        Example:
        
        - Maven + JDK 21 base image ≈ 700MB
            
        - Your app might only need a lightweight JDK runtime (≈ 200MB).
            
        - You're shipping 500MB of "dead weight" to production.
            

---

## **2. Multi-stage Build – The Fix**

The idea: **Use one container to build, another container to run**.

- **Stage 1 (Builder Stage)**
    
    - Contains Maven + JDK (heavy)
        
    - Compiles and packages the app
        
    - Produces only the artifact (`.jar` / `.war`)
        
- **Stage 2 (Runtime Stage)**
    
    - Contains only the lightweight JDK runtime (no Maven, no source code)
        
    - Copies the built `.war` file from Stage 1
        
    - Runs it
        

This keeps your **final image small, secure, and clean**.

---

## **3. How Your Dockerfile Works**

Let’s read it step by step:

```dockerfile
# Stage 1: Build the WAR
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline  # Cache dependencies (speeds up rebuilds)
COPY src ./src
RUN mvn clean package -DskipTests
```

✅ **Here you have Maven + JDK → used only for building.**  
When build finishes, you have `/app/target/app.war`.

---

```dockerfile
# Stage 2: Run the WAR
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.war app.war
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.war"]
```

✅ **Here you only have JDK runtime** — much lighter.  
It pulls only the WAR from Stage 1.

---

**Final image size difference**

- Without multi-stage: ~700MB
    
- With multi-stage: ~200MB  
    _(Numbers vary, but the drop is huge.)_

> Here I havent use lightweight jar , so jar size would be still large

---

## **4. Real Benefits**

1. **Smaller Images** → Faster deployment & less storage cost.
    
2. **Security** → No Maven, no source code in final image → smaller attack surface.
    
3. **CI/CD Friendly** → Works without Maven installed locally.
    
4. **Layer Caching** → Faster builds because dependencies are cached.
    

---

## **5. In Your `docker-compose.yml` Context**

In your setup:

- `db` service → PostgreSQL container
    
- `app` service → Spring Boot container built from this multi-stage Dockerfile
    

When you run:

```bash
docker-compose up --build
```

- Stage 1: Builds WAR inside a Maven container
    
- Stage 2: Creates final container only with WAR and runtime JDK
    
- Both containers (`db`, `app`) run together, connected internally.
    

---

## **🚢 Multi-Stage Build Flow**

```
            ┌──────────────────────────┐
            │   Stage 1: Build Stage    │
            │  (maven + jdk + src code) │
            └──────────────────────────┘
                FROM maven:3.9.6-eclipse-temurin-21
                WORKDIR /app
                COPY pom.xml .
                RUN mvn dependency:go-offline
                COPY src ./src
                RUN mvn clean package -DskipTests
                     │
                     ▼
         Builds: /app/target/app.war


            ┌──────────────────────────┐
            │ Stage 2: Runtime Stage    │
            │ (lightweight jdk only)    │
            └──────────────────────────┘
                FROM eclipse-temurin:21-jdk
                WORKDIR /app
                COPY --from=build /app/target/app.war app.war
                EXPOSE 8080
                ENTRYPOINT ["java", "-jar", "app.war"]

```

---

**How it works in `docker-compose`:**

```
+-----------------+       +------------------------+
|   db container   | <--->|   app container         |
| postgres:latest  |       | spring boot app.war    |
| (5432)           |       | (built via multi-stage)|
+-----------------+       +------------------------+
```

---

**Key takeaways from the diagram**

- **Stage 1** is heavy and only exists during the build process.
    
- **Stage 2** is light, contains no Maven or source code, just your WAR.
    
- `COPY --from=build` is the bridge between both stages.
    
- Final image is smaller → faster builds, smaller uploads, quicker deploys.
    

---

## **Commands** : 

```bash
docker images
```

or the newer command:

```bash
docker image ls
```

It will show something like:

```
REPOSITORY        TAG       IMAGE ID       CREATED         SIZE
spring-compose    latest    a1b2c3d4e5f6   1 minute ago    205MB
postgres          latest    f7g8h9i0j1k2   2 days ago      374MB
```

---

### **To check the size of a running container**

1. **List containers**
    

```bash
docker ps
```

Example:

```
CONTAINER ID   IMAGE             COMMAND             PORTS                     NAMES
123abc456def   spring-compose    "java -jar app.war" 0.0.0.0:8080->8080/tcp    spring-compose
```

2. **Check its size**
    

```bash
docker ps -s
```

Example:

```
CONTAINER ID   IMAGE             COMMAND             SIZE      NAMES
123abc456def   spring-compose    "java -jar app.war" 200MB     spring-compose
```

> **Tip:** `SIZE` here means **writable layer size** (data written after container started), not the base image size.

---

If you want to compare **multi-stage vs single-stage build size**, you can:

```bash
docker image ls | grep spring-compose
```

before and after you change the Dockerfile.

---

## **When you run above commands** :

```
spring-compose     2.96MB (virtual 503MB)
postgres-compose   63B    (virtual 454MB)
```

Here’s what those two numbers mean:

- **Writable layer size** → `2.96MB` for your Spring Boot app, `63B` for PostgreSQL.  
    This is **extra data written** after the container started (logs, temp files, uploads, etc.).  
    This number grows as your app writes files inside the container.
    
- **Virtual size** → `503MB` for your app, `454MB` for PostgreSQL.  
    This is the **total size = base image + writable layer**.  
    Basically, this is what the image consumes on disk.
    

---

**Why your app image is ~503MB even with multi-stage build**

- Stage 2 still uses `eclipse-temurin:21-jdk` which is a **full JDK**, not a slim runtime.
    
- Full JDK base images are large (~400–450MB).
    
- If you use a **JRE slim** image (or `temurin:21-jre-alpine`), you can reduce it to ~200MB or less.
    

---

## **Optimized Multi-stage Dockerfile**


1. Keep Stage 1 as is (Maven with JDK 21 for building).
    
2. Use a **small runtime image** for Stage 2 (`temurin:21-jre-alpine`).
    
3. Remove unnecessary files and use a fixed filename for clarity.
    

```dockerfile
########################################################
# Stage 1: Build the WAR file
########################################################
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src
RUN mvn clean package -DskipTests

########################################################
# Stage 2: Run the application (lightweight)
########################################################
FROM eclipse-temurin:21-jre-alpine   # Small JRE (Alpine Linux)
WORKDIR /app

# Copy WAR from the build stage
COPY --from=build /app/target/*.war app.war

# Expose the application port
EXPOSE 8080

# Run the WAR
ENTRYPOINT ["java", "-jar", "app.war"]
```

---

## **Why this is much smaller**

- **eclipse-temurin:21-jre-alpine** ≈ **70–80MB**  
    (compared to `eclipse-temurin:21-jdk` which is ≈ 400MB).
    
- We’re not installing Maven or keeping the source code in the final image.
    
- Multi-stage ensures only the **app.war** file is copied into the small runtime image.
    

---

## **How to build and check**

```bash
docker-compose build --no-cache
docker image ls
```

You should see something like:

```
REPOSITORY                TAG       SIZE
devops-docker-compose-app latest    ~150MB
postgres                  latest    454MB
```

---

⚡ If you want to go **even smaller** (below 100MB), we can use **distroless Java runtime** instead of Alpine, which removes even shell access from the final image (good for production security).


---

## **1. Does multi-stage create a “container” for Stage 1?**

Not exactly.  
When you run:

```bash
docker build -t my-app .
```

Docker does **not** start containers the way `docker run` does.  
Instead, each `FROM ...` line starts a **new temporary image layer**.  
Internally, Docker _does_ use container-like execution environments during build steps,  
but these are **ephemeral** and **discarded** after the step finishes.

---

## **2. Lifecycle in multi-stage build**

Let’s walk through your Dockerfile:

```
Stage 1: FROM maven:3.9.6-eclipse-temurin-21 AS build
  → Creates temporary image layers for Maven & JDK
  → Copies pom.xml, runs mvn dependency:go-offline
  → Copies src/, builds WAR
  → Produces /app/target/app.war inside the Stage 1 image

Stage 2: FROM eclipse-temurin:21-jre-alpine
  → Creates a new, smaller image (base = JRE only)
  → COPY --from=build takes WAR from Stage 1 image
  → Final image = only Stage 2 layers
```

When the build is done:

- **Stage 1’s layers are discarded** unless you explicitly name/tag them.
    
- **Final image** contains only Stage 2 layers.
    

---

## **3. What happens to Stage 1?**

- By default → **thrown away** after build finishes.
    
- Docker might keep **layers in its build cache** to speed up future builds.
    
- These cached layers are **not running containers** — just stored image layers.
    
- If you run `docker image ls` after the build, you won’t see a separate "build stage" image unless you tagged it manually.
    

---

## **4. Lifecycle Summary**

1. **Build process**
    
    - Uses multiple stages (temporary images)
        
    - Each stage runs isolated
        
    - Final stage copies what it needs
        
2. **After build**
    
    - Only the final stage image is kept and tagged with your name
        
    - Intermediate stages are deleted unless cached for rebuilds
        
3. **During run (`docker-compose up`)**
    
    - Only one container is started (from the final image)
        
    - Stage 1 never runs in production
        

---

- **Stage 1** → **JDK + Maven** for **building** your `.war`
    
    - Heavy image
        
    - Exists only during build
        
    - Never reaches production
        
- **Stage 2** → **JRE** for **running** your app
    
    - Lightweight image
        
    - Starts faster, smaller size, less attack surface
        
    - This is the only image shipped to production
        

---

