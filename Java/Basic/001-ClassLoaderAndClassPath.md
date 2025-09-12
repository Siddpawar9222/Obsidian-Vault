
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
## Types of classpath : 

By default, the **JVM (Java Virtual Machine)** searches for classes in the following locations, in this order:

1. **The Current Directory (`.`)**:
   - The JVM first looks in the current directory (where you run the `java` command) for any `.class` files.
   - For example, if you run `java MyProgram`, the JVM will look for `MyProgram.class` in the current directory.

2. **The Bootstrap Classpath**:
   - This includes the core Java libraries (like `java.lang`, `java.util`, etc.) that are part of the Java Runtime Environment (JRE).
   - These classes are stored in the `rt.jar`(before java 8) file (or its equivalent in newer Java versions  `java.base.module`) and are automatically included by the JVM.

3. **The Extension Classpath**:
   - The JVM also looks in the **extension directories** (usually `lib/ext` inside the JRE installation directory) for additional JAR files or classes.
   - This is rarely used in modern Java development.
   - The `lib/ext` folder was removed in **Java 9** as part of the move to the **<font color="#ffc000">Java Platform Module</font> System (JPMS)**.
      - `lib/ext` : To maintain backword compability (in old project this used to be)
      - `java.sql , java.desktop`
   
 4. **The System Classpath**:
   - If you don’t specify a classpath using the `-cp` or `-classpath` option, the JVM uses the **system classpath**, which is defined by the `CLASSPATH`<font color="#ffff00"> environment variable.</font>
   - If the `CLASSPATH` environment variable is not set, the JVM only looks in the current directory and the bootstrap/extension classpaths.

By default, the **JVM (Java Virtual Machine)** searches for classes in the following locations, in this order: 

`Current Directory (`.`) --> Bootstrap Classpath -->Extension Classpath --> System Classpath`

---

### Example of Default Behavior:
If you compile and run a simple Java program like this:
```java
// MyProgram.java
public class MyProgram {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

1. Compile it:
   ```bash
   javac MyProgram.java
   ```
   This creates `MyProgram.class` in the current directory.

2. Run it:
   ```bash
   java MyProgram
   ```
   The JVM will:
   - Look for `MyProgram.class` in the current directory (`.`).
   - Find and load the `System` class from the bootstrap classpath (`java.lang.System`).

---

### How to Override the Default Classpath?
You can override the default classpath by using the `-cp` or `-classpath` option when running the `java` command. For example:
```bash
java -cp "/path/to/your/classes:/path/to/library.jar" MyProgram
```
This tells the JVM to look in `/path/to/your/classes` and `/path/to/library.jar` instead of the default locations.

---
## Set System classpath in windows: 

 If you set the **`CLASSPATH` environment variable** in your Windows system, any Java program you run will automatically use the directories or JAR files specified in that `CLASSPATH` to find the required classes and resources. Here’s how it works:

---

### Steps to Set the `CLASSPATH` Environment Variable in Windows:

1. **Open Environment Variables Settings**:
   - Right-click on **This PC** or **My Computer** on your desktop or in File Explorer.
   - Select **Properties**.
   - Click on **Advanced system settings** on the left.
   - In the System Properties window, click the **Environment Variables** button.

2. **Add or Edit the `CLASSPATH` Variable**:
   - In the **Environment Variables** window:
     - If `CLASSPATH` already exists, select it and click **Edit**.
     - If it doesn’t exist, click **New** under the **System variables** section.
   - Set the **Variable name** to `CLASSPATH`.
   - Set the **Variable value** to the paths of the directories or JAR files you want to include, separated by semicolons (`;`). For example:
     ```
     C:\myproject\classes;C:\myproject\lib\mylibrary.jar
     ```

3. **Save and Close**:
   - Click **OK** to save the changes and close all the windows.

---

### What Happens After Setting the `CLASSPATH`?

Once you set the `CLASSPATH` environment variable:
- Any Java program you run on your system will automatically use the paths specified in the `CLASSPATH` to find classes and resources.
- You no longer need to specify the `-cp` or `-classpath` option when running your Java programs (unless you want to override the system classpath for a specific program).

---

### Example:

Let’s say:
- You have a directory `C:\myproject\classes` containing your compiled `.class` files.
- You have a JAR file `C:\myproject\lib\mylibrary.jar` containing a third-party library.

#### Step 1: Set the `CLASSPATH` Environment Variable
Set the `CLASSPATH` variable to:
```
C:\myproject\classes;C:\myproject\lib\mylibrary.jar
```

#### Step 2: Run a Java Program
If you have a class `MyProgram.class` in `C:\myproject\classes`, you can simply run:
```bash
java MyProgram
```
The JVM will:
- Look for `MyProgram.class` in `C:\myproject\classes`.
- Look for any additional classes in `C:\myproject\lib\mylibrary.jar`.

---

### Important Notes:
1. **Overriding the System Classpath**:
   - If you want to override the system classpath for a specific program, you can still use the `-cp` or `-classpath` option:
     ```bash
     java -cp "C:\other\classes;C:\other\lib\otherlibrary.jar" MyProgram
     ```
   - This will ignore the system `CLASSPATH` and use the paths you specify.

2. **Avoid Using System `CLASSPATH` for Everything**:
   - Setting a global `CLASSPATH` can sometimes cause issues if different projects require different libraries or versions.
   - In modern development, it’s more common to use build tools like **Maven** or **Gradle**, or specify the classpath explicitly for each program.

---
Sure! Let me explain **classloaders** in Java in simple terms.

---

### What is a ClassLoader?
A **classloader** is a part of the Java Runtime Environment (JRE) that loads Java classes into memory so they can be executed. Think of it as a **librarian** in a library:
- The **librarian** (classloader) knows where all the books (Java classes) are stored.
- When you ask for a book (a class), the librarian finds it and brings it to you (loads it into memory).

---
