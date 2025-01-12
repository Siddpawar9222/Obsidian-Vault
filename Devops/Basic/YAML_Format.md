
---

### **What is YAML?**

YAML (stand for Yet Another Markup Language) is a **human-readable data format** used to describe configurations, settings, or data in an organized way. It's similar to JSON or XML but easier to read and write.

### **Where is YAML Used?**

- **Configuration files** (e.g., Kubernetes, Docker Compose, GitHub Actions).
- **Data exchange** between applications.
- Setting up workflows or automation.

---

### **How YAML Looks**

YAML uses **indentation** and **key-value pairs** to represent data. There are no brackets `{}` or semicolons `;`, making it clean and readable.

---

### **YAML Basics**

#### 1. **Key-Value Pairs**

```yaml
name: John
age: 30
country: USA
```

- `name`, `age`, and `country` are **keys**.
- `John`, `30`, and `USA` are **values**.

---

#### 2. **Lists**

Use a dash (`-`) to create a list:

```yaml
hobbies:
  - coding
  - reading
  - cricket
```

This means:

- **hobbies** is a key.
- Its value is a list: `coding`, `reading`, `cricket`.

---

#### 3. **Nested Structures**

Indentation shows nesting (like objects in JSON):

```yaml
person:
  name: John
  age: 30
  address:
    city: New York
    zip: 10001
```

Here:

- `person` is a key.
- Inside `person`, there are more keys: `name`, `age`, and `address`.
- `address` contains nested keys: `city` and `zip`.

---

#### 4. **Comments**

Use `#` for comments:

```yaml
# This is a YAML file
name: John  # This is a name
```

---

#### 5. **Boolean, Null, and Numbers**

- **Boolean**: Use `true` or `false` (without quotes).
- **Null**: Use `null` or leave it empty.
- **Numbers**: Write them directly.

```yaml
is_active: true
score: 95
remarks: null
```

---

#### 6. **Anchors and Aliases**

Avoid repeating the same data using anchors (`&`) and aliases (`*`):

```yaml
default_settings: &defaults
  theme: dark
  language: English

user_settings:
  <<: *defaults
  language: Spanish
```

- `&defaults` anchors the `default_settings`.
- `*defaults` refers to the same settings in `user_settings`.

---

### **How to Write a YAML File**

1. Use **spaces** (not tabs) for indentation (usually 2 spaces).
2. Save the file with a `.yaml` or `.yml` extension.
3. Keep it simple and consistent.

---

### **Comparison: YAML vs JSON**

|**Feature**|**YAML**|**JSON**|
|---|---|---|
|**Readability**|Easy for humans|Harder for humans|
|**Syntax**|Indentation-based|Uses `{}`, `[]`, `:`|
|**Comments**|Yes (`#`)|No|
|**Usage**|Config files, Kubernetes|APIs, web apps|

---

### **Simple Example**

**YAML File (app-config.yaml):**

```yaml
app:
  name: MyApp
  version: 1.0
  features:
    - login
    - notifications
    - dark-mode

server:
  host: localhost
  port: 8080

database:
  name: mydb
  user: admin
  password: secret
```

---

### **Practice Exercise**

1. Write a YAML file describing:
    - Your name, age, and hobbies.
    - Details about your favorite book (title, author, year).
2. Validate it using a YAML linter (like [https://www.yamllint.com/](https://www.yamllint.com/)).