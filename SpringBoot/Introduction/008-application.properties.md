
-----


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

**Placeholder substitution in Spring applications:**

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

**Profiles:**

`application-dev.properties`: This means this is a developer profile property file.

**Questions:**

**Q. Explain the difference between yml and properties file.**

**Ans:**

1. **Syntax:**
   - **Properties File:** Uses a simple key-value pair format. Each property is represented as `key=value`.
     ```
     server.port=8080
     database.url=jdbc:mysql://localhost:3306/mydb
     ```
   - **YAML File:** Employs indentation for structure and uses a more human-readable syntax. It represents data using a combination of key-value pairs and nested structures.
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
