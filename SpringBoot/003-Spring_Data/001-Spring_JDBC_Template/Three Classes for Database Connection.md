
## DriverManagerDataSource Class

The `DriverManagerDataSource` class is a part of the `DataSource` interface(implement) found in the `javax.sql` package. It serves as an implemented class for managing database configurations, loading drivers, and creating connections. This class is essential for setting up the initial database connection parameters within the Spring framework.

## JdbcTemplate Class

The `JdbcTemplate` class acts as the central component in the Spring JDBC module. Its primary purpose is to facilitate database operations, particularly CRUD operations (Create, Read, Update, Delete). It offers various methods for executing SQL queries and retrieving data from the database.

### Methods for Database Operations:

- `update()`: Executes SQL queries for insert, update, and delete operations.
- `query()`: Retrieves data from the database and stores it in different data structures like lists, maps, or bean objects.
- `queryForMap()`: Retrieves data from the database and maps it into a key-value pair.
- `queryForObject()`: Retrieves a single object from the database.
- `queryForRowSet()`: Retrieves data from the database and stores it in a RowSet object.

## NamedParameterJdbcTemplate

The `NamedParameterJdbcTemplate` class is a specialized tool provided by Spring for executing SQL queries with named parameters instead of traditional positional placeholders ("?"). This approach improves code readability, maintainability, and reduces errors in SQL queries by replacing positional placeholders with named parameters.

### Example Usage:

```java
String sql = "UPDATE employee SET name = :name, email = :email, mobile_no = :mobileNo, " +  
"gender = :gender, age = :age, nationality = :nationality WHERE id = :id";
```

In the above example, we see the usage of named parameters (`:id`, `:name`, etc.) instead of positional parameters ("?"). This makes the SQL query more readable and easier to manage.

Here, we can insert values through a map, which provides convenience and clarity for developers.

## Note:
 - Java configuration takes precedence over `application.properties` for configuring database connections and other settings.