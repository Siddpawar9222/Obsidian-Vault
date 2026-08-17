

---

# 🔹 Statement vs PreparedStatement (JDBC)

## 1️⃣ What is `Statement`?

👉 `Statement` is used to execute **simple SQL queries** where values are **fixed**.

### Example (Real world)

You write a **full sentence every time**:

> “Give me student whose id is 1”  
> “Give me student whose id is 2”

Every time → **new sentence**

---

### ❌ Statement Example

```java
Statement stmt = con.createStatement();

String sql = "SELECT * FROM student WHERE id = 1";
ResultSet rs = stmt.executeQuery(sql);
```

### Problems

❌ SQL Injection risk  
❌ Query compiled every time  
❌ Not good for dynamic values

---

## 2️⃣ What is `PreparedStatement`?

👉 `PreparedStatement` is used for **dynamic queries**  
👉 Query is **compiled once**, values change later

---

### Example (Real world)

You create a **form with blanks**:

> “Give me student whose id = ___”

You just **fill the blank** every time ✔

---

### ✅ PreparedStatement Example

```java
String sql = "SELECT * FROM student WHERE id = ?";

PreparedStatement ps = con.prepareStatement(sql);
ps.setInt(1, 1);

ResultSet rs = ps.executeQuery();
```

---

## 3️⃣ Side-by-Side Comparison (Very Important)

|Feature|Statement|PreparedStatement|
|---|---|---|
|Query type|Static|Dynamic|
|Performance|Slow|Faster|
|SQL Injection|❌ Risk|✅ Safe|
|Compilation|Every time|Once|
|Parameters|❌ Not allowed|✅ Allowed|
|Best for|Simple testing|Real projects|

---

## 4️⃣ SQL Injection Example (INTERVIEW GOLD ⭐)

### ❌ Using Statement (Danger)

```java
String userInput = "1 OR 1=1";

String sql = "SELECT * FROM student WHERE id = " + userInput;
```

👉 This returns **all records** 😱

---

### ✅ Using PreparedStatement (Safe)

```java
String sql = "SELECT * FROM student WHERE id = ?";

PreparedStatement ps = con.prepareStatement(sql);
ps.setString(1, userInput);
```

👉 Treated as **data**, not SQL ✔

---

## 5️⃣ When to Use What?

### ❌ Avoid `Statement`

- Production code
    
- User input
    
- Dynamic queries
    

### ✅ Always Use `PreparedStatement`

- CRUD operations
    
- Real applications
    
- Spring Boot / Hibernate internally uses this
    

---

