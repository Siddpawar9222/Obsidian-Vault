
---

# Step 1: Run MySQL in Docker

Run this command:

```bash

docker pull mysql:latest

docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:latest
```

Meaning:

- `mysql` → container name
    
- `3306` → MySQL default port
    
- root password = `root`
    

Check:

```bash
docker ps
```

You should see mysql running.

---

# Step 2: Enter MySQL container

```bash
docker exec -it mysql mysql -u root -p
```

Enter password: `root`

Now you are inside MySQL shell.

---

# Step 3: Create database

```sql
CREATE DATABASE order_service;
```

Verify:

```sql
SHOW DATABASES;
```

You will see:

```
order_service
```

---

# Step 4: (Optional but good) Create a user for service

In real industry, don’t use root.

```sql
CREATE USER 'micro_root'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON order_service.* TO 'micro_root'@'%';
FLUSH PRIVILEGES;
```

Now you have:

- user: `order_user`
    
- password: `order123`
    
- db: `order_service`
    

---

# Step 5: Spring Boot Configuration

## application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/order_service
spring.datasource.username=order_user
spring.datasource.password=order123

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

---

# Step 6: Test with Entity (Java)

```java
@Entity
public class Order {

    @Id
    @GeneratedValue
    private Long id;

    private String productName;
    private int quantity;
}
```

Run application.

Now check MySQL:

```sql
USE order_service;
SHOW TABLES;
```

You’ll see:

```
order
```

Spring Boot created it automatically.

---

# Real World Flow (Very Important)

Think like this:

Docker MySQL → acts as **real server**  
Spring Boot → acts as **client application**  
JPA/Hibernate → acts as **translator between Java & SQL**

---

# Industry Best Practice (Interview Gold)

In microservices:

|Thing|Best Practice|
|---|---|
|Database|One DB per service|
|User|One DB user per service|
|Root|Only for admin|
|DDL|`update` in dev, `validate` in prod|

---

# One-Liner You Should Remember

> Each microservice should own its own database, and should never directly access another service’s database.

This is **core microservices principle**.

---

Now you have:

- MongoDB → for Product Service
    
- MySQL → for Order Service
    

This is **exactly real-world e-commerce architecture** 💯