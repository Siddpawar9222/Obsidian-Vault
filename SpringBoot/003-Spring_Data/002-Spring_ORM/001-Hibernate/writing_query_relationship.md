# 🧠 Step 1: Entity structure

### Employee entity

```java
@Entity
public class Employee {

    @Id
    private Integer employeeId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
```

---

### Department entity

```java
@Entity
public class Department {

    @Id
    private Integer departmentId;

    private String departmentName;
}
```

---

# 🧠 Step 2: What you want

👉 “Give me all employees whose departmentId = 10”

---

# 🧠 Step 3: Think in Java first

How will you write this in normal Java?

```java
employee.getDepartment().getDepartmentId()
```

👉 Means:

* Go to employee
* Go inside department object
* Get departmentId

---

# 🧠 Step 4: Convert to Spring Data JPA

Spring Data cannot understand `. (dot)`
So we use `_`

---

## ✅ Correct method

```java
List<Employee> findByDepartment_DepartmentId(Integer departmentId);
```

---

# 🔥 What `_` means here

```text
department_departmentId
```

👉 means:

```text
employee.department.departmentId
```

👉 `_` = “go inside object”

---

# ❌ Wrong ways (important)

### 1. This will FAIL ❌

```java
findByDepartmentId(Integer departmentId);
```

👉 Why?

* Employee does NOT have `departmentId` directly
* It has `department` object

---

### 2. This will FAIL ❌

```java
findByDepartmentDepartmentId(Integer departmentId);
```

👉 Why?

* Spring cannot separate field names

---

# 🧠 Visual understanding

```
Employee
   |
   └── Department
           |
           └── departmentId
```

👉 So query becomes:

```text
department.departmentId
```

👉 In Spring:

```text
department_departmentId
```

---

# 🧪 More examples (very useful)

---

### 👉 Find by department name

```java
List<Employee> findByDepartment_DepartmentName(String name);
```

👉 Java meaning:

```java
employee.getDepartment().getDepartmentName()
```

---

### 👉 Find by multiple conditions

```java
List<Employee> findByDepartment_DepartmentIdAndName(Integer deptId, String name);
```

👉 Java meaning:

```java
employee.getDepartment().getDepartmentId()
AND
employee.getName()
```

---

# 🧠 Real-world example

Think like company:

* Employee belongs to Department
* You want:
  👉 “All employees in IT department”

So you filter using:

```text
employee.department.departmentId = IT
```

---

# 💡 Golden rule (remember this)

👉 If field is object:

```
object.childField
→ object_childField
```

---

# 🚀 Final understanding (one line)

👉 `_` in Spring Data = `.` in Java

```
department_departmentId  =  department.departmentId
```

---
