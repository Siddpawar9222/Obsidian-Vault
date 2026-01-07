
-----

### Spring Profile : 
**Spring Profile** is a way to define **different configurations for different environments** in a Spring Boot application.


**application.properties:**
It's commonly used to configure settings for a Spring Boot application, such as database connection details, server port, logging levels, and many other aspects.

**MySQL:**

```
spring.datasource.url=jdbc:mysql://localhost:3306/abc
spring.datasource.username=root
spring.datasource.password=123456
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.hibernate.ddl-auto=update
```

Where:

- `spring.datasource.url`: Specifies the URL for connecting to the MySQL database. Replace `abc` with the name of your database.
- `spring.datasource.username`: Specifies the username for authenticating with the MySQL database.
- `spring.datasource.password`: Specifies the password for authenticating with the MySQL database.
- `spring.jpa.hibernate.ddl-auto`: Configures how Hibernate handles the database schema. In this example, `update` is used to automatically update the schema based on entity mappings. Other options include `create`, `create-drop`, `validate`, or `none`.
- `spring.jpa.show-sql`: Specifies whether to show SQL statements executed by Hibernate in the console. Set it to `true` to enable SQL logging.
- `spring.jpa.properties.hibernate.dialect`: Sets the Hibernate dialect for MySQL, which determines the SQL syntax and specific behavior for MySQL. In this case, it's set to `org.hibernate.dialect.MySQLDialect` for MySQL databases.

<font color="#ffff00">**Placeholder substitution in Spring applications:**</font>

e.g.
```
spring.datasource.url=jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/mydb
```
or
```
spring.datasource.url=jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/mydb
```

Where:

If `MYSQL_HOST` and `MYSQL_PORT` environment variables are not set, the default values "localhost" and "3306" will be used. You can provide `MYSQL_HOST` and `MYSQL_PORT` environment variables at runtime.

**In Docker context (docker-compose):**

```yaml
version: '3'

services:
  myapp:
    image: myapp-image:latest
    ports:
      - "8080:8080"
    environment:
      - MYSQL_HOST=mydbhost
      - MYSQL_PORT=3307
      - MYSQL_USERNAME=myuser
      - MYSQL_PASSWORD=mypassword
```

----

**Profiles:**

`application-dev.properties`: This means this is a developer profile property file.

**Questions:**

**Q. Explain the difference between yml and properties file.**

**Ans:**

1. **Syntax:**
   - **Properties File:** Uses a simple <font color="#ffff00">key-value</font> pair format. Each property is represented as `key=value`.
     ```
     server.port=8080
     database.url=jdbc:mysql://localhost:3306/mydb
     ```
   - **YAML File:** Employs <font color="#ffff00">indentation</font> for structure and uses a more human-readable syntax. It represents data using a combination of key-value pairs and nested structures.
     ```yaml
     server:
       port: 8080
     database:
       url: jdbc:mysql://localhost:3306/mydb
     ```

2. **Hierarchy and Nesting:**
   - **Properties File:** Doesn't support hierarchical structures or nesting. If you need to represent nested properties, you often use prefixes.
   - **YAML File:** Supports nested structures, making it more readable and maintainable for complex configurations.

3. **Readability:**
   - **Properties File:** Simple and easy to read for flat configurations. Can become less readable for complex structures or deep hierarchies.
   - **YAML File:** More readable for complex configurations due to its indentation-based structure. It's often considered more human-friendly.

4. **Data Types:**
   - **Properties File:** Everything is treated as a string. If you need other data types, conversion is usually required.
   - **YAML File:** Supports multiple data types, including strings, numbers, booleans, lists, and maps, without explicit conversion.

5. **Comments:**
   - **Properties File:** Uses `#` for comments.
   - **YAML File:** Also uses `#` for comments.

6. **Arrays and Lists:**
   - **Properties File:** Lists are often simulated using indexed keys.
   - **YAML File:** Supports native list and array syntax, making it more intuitive.
     ```yaml
     fruits:
       - apple
       - orange
       - banana
     ```

7. **Multiline Strings:**
   - **Properties File:** Multiline strings are not straightforward and might require special handling.
   - **YAML File:** Supports multiline strings using the `|` or `>` operators.

**Q. If I configure the same values in both properties and yml file then which value will be loaded by Spring Boot?**

**Ans:**

- **Command-line arguments and System properties:** These take precedence over any other property sources. You can provide these using the command line or by setting system properties.
- **Properties or YAML files:** Properties defined in the `application.properties` file take precedence over those in the `application.yml` file. If a property is defined in both files, the value from `application.properties` will be used.
- **Profile-specific properties:** If you have profiles (e.g., `application-dev.properties`), the properties in these files will override the general `application.properties` or `application.yml`.
- **Default properties:** These are the last fallback and contain the default values for your application. 

   <font color="#ffff00">**In Short :** </font>
<font color="#ffff00">     Command-line arguments and System properties >> Profile-specific properties >>  application.properties >> application.yml</font>

---

## 🗂️ Property Priority in Spring Boot (Highest ➡️ Lowest)

---

### 1. **Command Line Arguments**

✅ **Highest priority**

You can pass properties when starting your application using `--` syntax:

```bash
java -jar myapp.jar --server.port=9999 --spring.profiles.active=dev
```

🧠 **Why use this?**

- Great for overriding values temporarily (like in CI/CD pipelines or quick testing).
    
- Highest priority — overrides everything else.
    

---

### 2. **Environment Variables**

These are OS-level or system-wide settings.

#### Example (Linux/macOS):

```bash
export SERVER_PORT=8888
```

In `application.properties`:

```properties
server.port=${SERVER_PORT}
```

🧠 **Why use this?**

- Securely inject secrets like passwords or API keys.
    
- Easy to change without modifying your code or config files.
    

---

### 3. **`application-{profile}.properties` or `.yml`**

These are **profile-specific config files**, like:

- `application-dev.properties`
    
- `application-prod.properties`
    

You select the profile like this:

```properties
spring.profiles.active=dev
```

🧠 **Why use this?**

- Keep different configs for different environments.
    
- For example, `dev` DB on localhost, but `prod` DB on cloud.
    

---

### 4. **`application.properties` or `.yml` (Default)**

This is the main/default configuration file.

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
```

🧠 **Why use this?**

- Base/default settings for all environments.
    
- Can be overridden by profile-specific files or other sources.
    

---

### 5. **`@PropertySource` Annotations**

You can use this inside a Spring class to load properties manually:

```java
@PropertySource("classpath:custom.properties")
@Configuration
public class MyConfig {
    // Inject properties here
}
```

🧠 **Why use this?**

- When you want to load custom property files other than the default ones.
    
- Used for modular configurations.
    

---

### 6. **Default Values in Code**

If nothing else sets a value, you can give a default directly in code:

```java
@Value("${my.value:DefaultValue}")
private String myValue;
```

If `my.value` is **not** defined anywhere, Spring uses `DefaultValue`.

🧠 **Why use this?**

- Safety net in case no property is set.
    
- Helps prevent NullPointerException.
    

---

## 🔁 Example of Override Priority

Let’s say you define the same property `server.port` in different places:

| Source                               | Value  |
| ------------------------------------ | ------ |
| Command Line                         | `9999` |
| Environment Variable (`SERVER_PORT`) | `8888` |
| application-dev.properties           | `9090` |
| application.properties               | `8080` |
| `@PropertySource`                    | `7070` |
| Default in code                      | `6060` |

If you run:

```bash
java -jar app.jar --server.port=9999
```

➡️ Spring Boot will use **9999** (from Command Line).

If command line is not set, then it will use **8888** (from Environment Variable), and so on...

---

> 🧠 **Where should we keep these `export` commands (`DB_PASSWORD`, `JWT_SECRET`) so they are available when we run our Spring Boot app?**

---

## ✅ 1. **If You Run Your App from Terminal (Manually)**

You can export the variables **in the terminal** before running your Spring Boot app.

### 🧪 Steps:

```bash
export DB_PASSWORD=MySecretPassword
export JWT_SECRET=MyJwtKey
java -jar your-app.jar
```

⏳ This works **only for the current terminal session**. Once you close the terminal, variables are gone.

---

## ✅ 2. **To Make Environment Variables Permanent (Linux/macOS)**

Add your `export` lines in your shell config file (based on the terminal you use):

| Shell | File to update                   |
| ----- | -------------------------------- |
| Bash  | `~/.bashrc` or `~/.bash_profile` |
| Zsh   | `~/.zshrc`                       |

### 👇 Example:

Edit `~/.bashrc`:

```bash
export DB_PASSWORD=MySecretPassword
export JWT_SECRET=MyJwtKey
```

Then run:

```bash
source ~/.bashrc
```

Now these variables will be available **every time you open the terminal**.

---

## ✅ 3. **If You Run Spring Boot from IntelliJ IDEA**

You can set environment variables inside IntelliJ:

### 🛠️ Steps:

1. Go to **Run > Edit Configurations**.
    
2. Select your Spring Boot app.
    
3. In the **Environment Variables** field, add:
    
    ```
    DB_PASSWORD=MySecretPassword;JWT_SECRET=MyJwtKey
    ```
    
4. Click **Apply** and run your app.
    

---

## ✅ 4. **If You Use a `.env` File (Optional)**

Create a file named `.env`:

```
DB_PASSWORD=MySecretPassword
JWT_SECRET=MyJwtKey
```

This is useful when using **Docker**, **Docker Compose**, or libraries like **dotenv-java**.

⚠️ Spring Boot does **not automatically read `.env`** unless you use extra tools.

---

## ✅ 5. **On Production Servers (like AWS, DigitalOcean, etc.)**

- Set environment variables in your **cloud provider dashboard** or in **startup scripts**.
    
- For example:
    
    - AWS EC2 → add in user-data script or instance environment settings.
        
    - Docker → use `-e` option:
        
        ```bash
        docker run -e DB_PASSWORD=MySecretPassword your-app
        ```
        

---

## 🧾 Summary

|Method|Where to keep it|Usage|
|---|---|---|
|Temporary (manual)|Terminal|Good for quick test|
|Permanent (Linux/macOS)|`~/.bashrc`, `~/.zshrc`|Best for local development|
|IntelliJ IDEA|Run Config → Environment Variables|Best for Java developers|
|Docker / Cloud|In Docker/Cloud configs|Best for deployment|
|`.env` file|Project root (with dotenv support)|Use with Docker or libraries|

---

## Running Spring Boot Application : 


 **Command to run a basic Spring Boot project using command line:**

If you have a Spring Boot project and you have built a `.jar` file,  
you can run it using:

```bash
mvn clean package
java -jar yourprojectname.jar

```

 **Command to run a Spring Boot project with a specific profile (like dev, prod, test):**

You can pass the profile using `--spring.profiles.active` option:

```bash
java -jar yourprojectname.jar --spring.profiles.active=profilename
```

---

**If you are running from Maven without building a jar:**

Sometimes during development,  
you just want to run without creating a jar file.  
Use:

```bash
./mvnw spring-boot:run
```

or (if you have Maven installed):

```bash
mvn spring-boot:run
```

 **Running with profile using Maven:**

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=profilename
```

**Example:**

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---
[Medium Article](https://medium.com/@mayank-yadav/mastering-spring-boot-profiles-easy-guide-with-examples-priority-order-pro-tips-47f1484769ff)

