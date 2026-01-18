
---
## Introduction:

 The **classpath** in Java is like a <font color="#ffff00">map that tells the Java Virtual Machine (JVM) where to find the classes and libraries it needs to run your program.</font> It’s a list of directories or files (like JAR files) that contain the compiled Java code (.class files) or other resources.


### Example in Java:
Let’s say you’re building a Java application that uses a library like **Apache Commons Lang** for string manipulation. Here’s how the classpath works:

1. **Your Java program** needs to use a class from the **Apache Commons Lang** library.
2. The **Apache Commons Lang** library is stored in a JAR file (e.g., `commons-lang3-3.12.0.jar`).
3. You need to tell the JVM where to find this JAR file by setting the classpath.

#### Setting the Classpath:
- If you’re running your program from the command line, you can set the classpath like this:
  ```bash
  java -cp ".:/path/to/commons-lang3-3.12.0.jar" MyProgram
  ```
  Here:
  - `-cp` stands for classpath.
  - `.` means the current directory (where your compiled `.class` files are).
  - `/path/to/commons-lang3-3.12.0.jar` is the path to the JAR file containing the library.

- If you’re using an IDE like IntelliJ or Eclipse, the IDE automatically manages the classpath for you when you add the JAR file to your project.

### Why is Classpath Important?
- Without the correct classpath, the JVM won’t be able to find the classes or libraries your program needs, and you’ll get errors like `ClassNotFoundException` or `NoClassDefFoundError`.
- It ensures your program can access all the necessary components to run properly.

---

# 📘 Java ClassLoader Notes (Java 9+ – JPMS)

---

## 1️⃣ Before Java 9 (for context)

### Java 8 and below

|ClassLoader|Location|
|---|---|
|Bootstrap|`jre/lib`|
|Extension|`jre/lib/ext`|
|Application|`classpath`|

Problems:

- Classpath conflicts
    
- Security issues
    
- Hard to manage dependencies
    

---

## 2️⃣ Java 9+ Changes (Big Shift)

### What changed?

- ❌ `jre/` folder removed
    
- ❌ `lib/ext` removed
    
- ✅ **JPMS (Java Platform Module System)** introduced
    

### New structure

```text
JAVA_HOME/lib/
 ├── modules      → actual JDK bytecode
 ├── jrt-fs.jar   → virtual filesystem for modules
```

---

## 3️⃣ `modules` & `jrt-fs.jar` (Core concept)

### 🔹 `modules`

- Single runtime image
    
- Contains **all JDK modules**
    
- Examples:
    
    - `java.base`
        
    - `java.sql`
        
    - `java.xml`
        
    - `java.desktop`
        

### 🔹 `jrt-fs.jar`

- Provides **jrt:/ virtual filesystem**
    
- Allows Java tools & APIs to read classes from `modules`
    

---

### 🔍 Practical (Ubuntu)

```bash
java --list-modules
```

```bash
jar tf $JAVA_HOME/lib/jrt-fs.jar | head
```

---

## 4️⃣ Types of ClassLoaders (Java 9+)

---

## 1️⃣ Bootstrap ClassLoader

### 🔹 What it does

- Loads **core Java classes**
    
- Required for JVM startup
    

### 🔹 Module

- `java.base`
    

### 🔹 Examples

- `java.lang.String`
    
- `java.lang.Object`
    
- `java.util.List`
    

### 🔹 ClassLoader value

```text
null
```

### 🔹 Think like this

👉 **Foundation of JVM**

---

### 🔍 Practical Example

```java
public class BootstrapDemo {
    public static void main(String[] args) {
        System.out.println(String.class.getClassLoader());
    }
}
```

Output:

```text
null
```

---

## 2️⃣ Platform ClassLoader

_(Earlier Extension ClassLoader)_

### 🔹 What it does

- Loads **standard JDK libraries**
    
- Not needed to start JVM, but provided by JDK
    

### 🔹 Modules

- `java.sql`
    
- `java.xml`
    
- `java.desktop`
    
- `java.logging`
    

### 🔹 ClassLoader value

```text
PlatformClassLoader
```

### 🔹 Think like this

👉 **Official tools JVM can use when needed**

---

### 🔍 Practical Example

```java
public class PlatformDemo {
    public static void main(String[] args) {
        System.out.println(java.sql.Driver.class.getClassLoader());
    }
}
```

Output:

```text
jdk.internal.loader.ClassLoaders$PlatformClassLoader@...
```

---

## 3️⃣ Application ClassLoader

_(System ClassLoader)_

### 🔹 What it does

- Loads **your application code**
    
- Loads **external JARs**
    

### 🔹 From

- Classpath / Module path
    

### 🔹 Examples

- Your `.class` files
    
- Spring Boot jars
    
- Third-party libraries
    

### 🔹 ClassLoader value

```text
AppClassLoader
```

### 🔹 Think like this

👉 **Your project code**

---

### 🔍 Practical Example

```java
public class AppDemo {
    public static void main(String[] args) {
        System.out.println(AppDemo.class.getClassLoader());
    }
}
```

Output:

```text
jdk.internal.loader.ClassLoaders$AppClassLoader@...
```

---

## 5️⃣ ClassLoader vs Modules (Important)

- `modules` → **storage**
    
- ClassLoader → **loader**
    
- Same file, **different responsibility**
    

### Mapping

|Module|Loaded By|
|---|---|
|`java.base`|Bootstrap|
|Other JDK modules|Platform|
|App code|Application|

---

## 6️⃣ Parent Delegation Model

Order of loading:

```
Bootstrap
   ↑
Platform
   ↑
Application
```

Why?

- Security
    
- Prevent overriding core classes
    

---

## 7️⃣ One Code to See All Loaders

```java
public class LoaderSummary {
    public static void main(String[] args) {
        System.out.println("String → " + String.class.getClassLoader());
        System.out.println("SQL → " + java.sql.Driver.class.getClassLoader());
        System.out.println("App → " + LoaderSummary.class.getClassLoader());
    }
}
```

---

## 8️⃣ Interview-Ready Summary ⭐

> In Java 9+, all JDK classes are stored inside the `lib/modules` runtime image.  
> The `java.base` module is loaded by the Bootstrap ClassLoader, other standard JDK modules are loaded by the Platform ClassLoader, and application code is loaded by the Application ClassLoader.  
> The `jrt-fs.jar` provides a virtual filesystem to access classes inside modules.

---

## 9️⃣ Quick Revision Table

| ClassLoader | Loads         | Example    |     |
| ----------- | ------------- | ---------- | --- |
| Bootstrap   | Core Java     | `String`   |     |
| Platform    | Standard APIs | `java.sql` |     |
| Application | App + jars    | Your code  |     |

---



