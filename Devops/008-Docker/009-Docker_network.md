
---

## 🚀 STEP 1: Networking Basics

### What is Docker Networking?

- **Containers = Computers**
- **Docker Networks = Wi-Fi networks** that connect those computers
- Networks allow containers to:
    - Talk to each other
    - Talk to the outside world
    - Stay isolated when needed

### Why Do We Need Networks?

- By default, containers are isolated
- To build real applications, containers need to communicate
- Example: A web app needs to talk to a database

---

## 🔧 STEP 2: Types of Docker Networks

### 1. Bridge Network (Default)

 Run these commands:

```bash
docker run -d --name container1 ubuntu sleep 1000
docker run -d --name container2 ubuntu sleep 1000
```

**Docker automatically connects both containers to the default bridge network** because:

- You didn't specify `--network` parameter
- Docker uses the **default bridge network** when no network is specified

## Let's Verify This:

### 1. Check what networks exist:

```bash
docker network ls
```

You'll see something like:

```
NETWORK ID     NAME      DRIVER    SCOPE
abc123def456   bridge    bridge    local    ← This is the default bridge
```

### 2. Inspect the default bridge network:

```bash
docker network inspect bridge
```

You'll see both `container1` and `container2` listed in the "Containers" section!

## Default Bridge Network Characteristics:

### ✅ What Works:

```bash
# Check container IPs
docker inspect container1 | grep IPAddress
# Output: "IPAddress": "172.17.0.2"

docker inspect container2 | grep IPAddress  
# Output: "IPAddress": "172.17.0.3"

# Containers CAN ping each other using IP addresses
docker exec -it container1 ping 172.17.0.3  # This works!
```

### ❌ What Doesn't Work:

```bash
# Containers CANNOT ping each other using names
docker exec -it container1 ping container2  # This FAILS!
```

## Visual Representation:

```
Default Bridge Network (172.17.0.0/16)
├── container1 (IP: 172.17.0.2)
└── container2 (IP: 172.17.0.3)

✅ container1 can ping 172.17.0.3
❌ container1 cannot ping "container2"
```

## Why This is a Problem:

In real applications, you don't want to hardcode IP addresses because:

- IPs can change when containers restart
- It's hard to remember IP addresses
- It makes configuration complex

## The Solution - User-Defined Networks:

### 2. User-Defined Networks:

```bash
# Create custom network
docker network create my-network

# Run containers on custom network
docker run -d --name app1 --network my-network ubuntu sleep 1000
docker run -d --name app2 --network my-network ubuntu sleep 1000

# Now this works!
docker exec -it app1 ping app2  # ✅ Success!
```

- **Advantage**: Containers can talk using names (app1 can ping app2)
- **Use case**: Multi-container applications (web + database)

### 3. Host Network

```bash
# Container uses host machine's network directly
docker run --network host nginx
```

- **Advantage**: Maximum performance, no isolation layer
- **Disadvantage**: No isolation, can cause port conflicts
- **Use case**: Monitoring tools, performance-critical apps

### 4. None Network

```bash
# No network access at all
docker run --network none ubuntu
```

- **Use case**: Complete isolation, security testing

---

## 🛠️ STEP 3: Essential Network Commands

```bash
# List all networks
docker network ls

# Create a network
docker network create network-name

# Inspect network details
docker network inspect network-name

# Remove a network
docker network rm network-name

# Connect container to network
docker network connect network-name container-name

# Test connectivity between containers
docker exec -it container1 ping container2
```

---

## 🏗️ STEP 4: 2-Tier Project - Spring Boot + PostgreSQL

### Project Architecture

```
Custom Docker Network (app-network)
├── PostgreSQL Container (database)
└── Spring Boot Container (web application)
```

### Step 4.1: Create Network

```bash
docker network create app-network
```

### Step 4.2: Run PostgreSQL Container

```bash
docker run -d \
  --name postgres-db \
  --network app-network \
  -e POSTGRES_USER=appuser \
  -e POSTGRES_PASSWORD=apppass \
  -e POSTGRES_DB=appdb \
  postgres:13
```

**Environment Variables Explained:**

- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name

### Step 4.3: Configure Spring Boot Application

Create `application.properties`:

```properties
# Database connection using container name
spring.datasource.url=jdbc:postgresql://postgres-db:5432/appdb
spring.datasource.username=appuser
spring.datasource.password=apppass

# JPA settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server port
server.port=8080
```

**Key Point**: Use `postgres-db` (container name) instead of IP address!

### Step 4.4: Create Dockerfile for Spring Boot

```dockerfile
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 4.5: Build Spring Boot Image

```bash
# Build your Spring Boot project first
mvn clean package

# Build Docker image
docker build -t spring-app .
```

### Step 4.6: Run Spring Boot Container

```bash
docker run -d \
  --name spring-container \
  --network app-network \
  -p 8080:8080 \
  spring-app
```

**Port Mapping**: `-p 8080:8080` makes app accessible from host machine

---

## 🧪 STEP 5: Testing and Verification

### Check Running Containers

```bash
docker ps
```

### Verify Network Connections

```bash
# See which containers are on the network
docker network inspect app-network

# Test connectivity from Spring Boot to PostgreSQL
docker exec -it spring-container ping postgres-db
```

### Access Application

- Open browser: `http://localhost:8080`
- Your Spring Boot app should connect to PostgreSQL successfully!

---

## 🔍 STEP 6: Troubleshooting

### Common Issues and Solutions

1. **Connection Refused**
    
    ```bash
    # Check if containers are on same network
    docker network inspect app-network
    ```
    
2. **Database Connection Failed**
    
    ```bash
    # Check PostgreSQL logs
    docker logs postgres-db
    
    # Check Spring Boot logs
    docker logs spring-container
    ```
    
3. **Port Already in Use**
    
    ```bash
    # Use different port
    docker run -p 8081:8080 ...
    ```

---



