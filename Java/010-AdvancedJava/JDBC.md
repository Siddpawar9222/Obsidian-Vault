
---


## 1️⃣ What is JDBC (Java Database Connectivity)?

JDBC is an **API** that allows a **Java program to talk to a database**.

👉 Example (Real world):  
Java program = Customer  
Database = Shop  
JDBC = Language used to talk with shopkeeper

---

## 2️⃣ Important JDBC Interfaces

### 🔹 Driver

- Converts Java JDBC calls into **database-specific calls**
    
- Example:
    
    - MySQL → `com.mysql.cj.jdbc.Driver`
        

---

### 🔹 DriverManager : Class

- Manages database drivers
    
- Used to **get connection**
    

```java
Connection con = DriverManager.getConnection(url, user, password);
```

---

### 🔹 Connection

- Represents a **connection between Java app and DB**
    
- Created only **once per DB interaction**
    

---

### 🔹 Statement

Used to execute **simple SQL queries**

Types:

1. `Statement` → static query
    
2. `PreparedStatement` → dynamic query (recommended)
    

---

### 🔹 ResultSet

- Holds **data returned by SELECT query**
    
- Cursor points **before first row**
    
- Use `next()` to move row by row
    

---

## 3️⃣ JDBC Execution Steps (VERY IMPORTANT)


### ✅ Step 1: Load Driver

```java
Class.forName("com.mysql.cj.jdbc.Driver");
```

- Fully Qualified Class name required (`com.mysql.cj.jdbc.Driver`)
- Required only once

---

### ✅ Step 2: Get Connection

```java
Connection con = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/school",
    "root",
    "password"
);
```

```java 
DriverManager.getConnection(
    URL,
    USER,
    PASSWORD
)
```
---

### ✅ Step 3: Create Statement

```java
PreparedStatement ps = con.prepareStatement(sql);
```

---

### ✅ Step 4: Execute Query

- INSERT / UPDATE / DELETE → `executeUpdate()`
    
- SELECT → `executeQuery()`
    

---

### ✅ Step 5: Close Connection

```java
con.close();
```

---

## 4️⃣ Statement Methods 

| Method            | Used For               | What it Returns                                              |
| ----------------- | ---------------------- | ------------------------------------------------------------ |
| `executeUpdate()` | INSERT, UPDATE, DELETE | **`int`** → number of rows affected                          |
| `executeQuery()`  | SELECT                 | **`ResultSet`** → data returned from DB                      |
| `execute()`       | Any SQL                | **`boolean`** → `true` if ResultSet, `false` if update count |

---

## 5️⃣ CRUD Operations (Complete Java Code)

Assume **Student Table**

```sql
CREATE TABLE student (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT
);
```

---

# 🟢 CREATE (INSERT)

```java
import java.sql.*;

public class InsertStudent {
    public static void main(String[] args) throws Exception {

        Class.forName("com.mysql.cj.jdbc.Driver");

        Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/school",
                "root",
                "password"
        );

        String sql = "INSERT INTO student VALUES (?, ?, ?)";
        PreparedStatement ps = con.prepareStatement(sql);

        ps.setInt(1, 1);
        ps.setString(2, "Siddhesh");
        ps.setInt(3, 23);

        int rows = ps.executeUpdate();
        System.out.println(rows + " record inserted");

        con.close();
    }
}
```

👉 `executeUpdate()` returns **number of rows affected**

---

# 🔵 READ (SELECT)

```java
import java.sql.*;

public class ReadStudent {
    public static void main(String[] args) throws Exception {

        Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/school",
                "root",
                "password"
        );

        String sql = "SELECT * FROM student";
        PreparedStatement ps = con.prepareStatement(sql);

        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            System.out.println(
                    rs.getInt("id") + " " +
                    rs.getString("name") + " " +
                    rs.getInt("age")
            );
        }

        con.close();
    }
}
```

👉 `rs.next()` moves cursor **row by row**

---

# 🟡 UPDATE

```java
import java.sql.*;

public class UpdateStudent {
    public static void main(String[] args) throws Exception {

        Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/school",
                "root",
                "password"
        );

        String sql = "UPDATE student SET age=? WHERE id=?";
        PreparedStatement ps = con.prepareStatement(sql);

        ps.setInt(1, 24);
        ps.setInt(2, 1);

        int rows = ps.executeUpdate();
        System.out.println(rows + " record updated");

        con.close();
    }
}
```

---

# 🔴 DELETE

```java
import java.sql.*;

public class DeleteStudent {
    public static void main(String[] args) throws Exception {

        Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/school",
                "root",
                "password"
        );

        String sql = "DELETE FROM student WHERE id=?";
        PreparedStatement ps = con.prepareStatement(sql);

        ps.setInt(1, 1);

        int rows = ps.executeUpdate();
        System.out.println(rows + " record deleted");

        con.close();
    }
}
```

---

## 6️⃣ Why PreparedStatement is Better?

✔ Prevents SQL Injection  
✔ Faster  
✔ Cleaner code

👉 **Always use `PreparedStatement` in real projects**

---

## 7️⃣ ResultSet Key Points 

- Cursor starts **before first row**
    
- `next()` → move to next row
    
- Forward only by default
    
- Not updatable unless specified
    

---


