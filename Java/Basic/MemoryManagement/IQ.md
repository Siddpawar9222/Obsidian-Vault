
---

##  Top 10 Java Memory Management Interview Questions

1. **What is the difference between Heap and Stack memory in Java?**

2. **Explain JVM memory structure.**

   * (Heap, Stack, Method Area/MetaSpace, etc.)

3. **What is Garbage Collection in Java? How does it work?**

4. **What are strong, weak, soft, and phantom references in Java?**

5. **What is a Memory Leak in Java? Can you give an example?**

6. **What is the difference between `OutOfMemoryError` and `StackOverflowError`?**

7. **How can you monitor and troubleshoot memory issues in Java applications?**

   * (Tools like VisualVM, JConsole, etc.)

8. **What JVM parameters are used for memory management?**

   * (`-Xms`, `-Xmx`, `-XX:MetaspaceSize`)

9. **What happens if Garbage Collector cannot free memory?**

10. **How do you prevent memory leaks in Java applications?**


---

## ❓ Q1: What is the difference between Heap and Stack memory in Java?

### ✅ Simple Answer:

- **Stack Memory**
    
    - Stores method calls, local variables, and references.
        
    - Each thread has its own stack.
        
    - Very fast, but limited in size.
        
    - Cleared automatically when method finishes.
        
- **Heap Memory**
    
    - Stores actual objects created using `new`.
        
    - Shared across all threads.
        
    - Managed by Garbage Collector.
        
    - Larger but slower compared to stack.
        

---

### ✅ Example Code:

```java
public class MemoryExample {
    public static void main(String[] args) {
        int x = 10;                  // Stored in Stack
        String s = new String("Hi"); // 's' reference in Stack, object in Heap
    }
}
```

- `x` = 10 → in **Stack**.
    
- `"Hi"` object → in **Heap**.
    
- `s` (reference to object) → in **Stack**.
    

---

## ❓ Q2: Explain JVM Memory Structure

When we run a Java program, the **Java Virtual Machine (JVM)** divides memory into several parts. Each part has a specific role.

---

### ✅ JVM Memory Areas

1. **Heap Memory**
    
    - Stores objects created by `new`.

    -  Keep reference of static variables and object of class
        
    - Managed by Garbage Collector.
        
    - Shared by all threads.
        
    - Example:
        
        ```java
        Student s = new Student(); // Object in Heap
        ```
        

---

2. **Stack Memory**
    
    - Stores method calls, local variables, and references.
        
    - Each thread has its own stack.
        
    - Removed when method finishes.
        
    - Example:
        
        ```java
        int x = 5; // Stored in Stack
        ```
        

---

3. **Method Area (MetaSpace from Java 8)**
    
    - Stores **class metadata**, static variables/objects reference, and method code.
        
    - Example:
        
        ```java
        class Student {
            static String school = "ABC"; // Goes in Method Area
        }
        ```
        

---

4. **Program Counter (PC) Register**
    
    - Each thread has one.
        
    - Keeps track of which instruction is being executed right now.
        

---

5. **Native Method Stack**
    
    - Used when Java calls native (C/C++) code.
        
    - Rarely asked in depth.
        

---

### ✅ Quick Diagram (textual)

```
JVM Memory
 ├── Heap (Objects, GC managed)
 ├── Stack (Methods, local vars, per thread)
 ├── Method Area / MetaSpace (Class info, static vars)
 ├── PC Register (Current instruction)
 └── Native Method Stack (C/C++ code execution)
```

---

