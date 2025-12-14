
---


## What is OOPS?

**OOPS (Object-Oriented Programming System)** means we write programs using **objects** that represent **real-world things**.

👉 Example: Laptop, Mobile, Car, Student

---

## 4 Main OOPS Principles (Very Important for Interview)

1. **Encapsulation**
    
2. **Abstraction**
    
3. **Inheritance**
    
4. **Polymorphism**
    

I’ll explain **one by one** with a **Laptop example**.

---

## 1️⃣ Encapsulation (Data Hiding)

### Meaning (Simple)

Encapsulation means:

> **Wrapping up data in single unit**

> **Keep data private and access it using methods (getters/setters)**

### Real-world example

Laptop internals (RAM, Processor) are **hidden**.  
You use **power button**, not directly touch circuits.

---

### Java Example (Laptop)

```java
class Laptop {

    private String brand;
    private int ram; // in GB

    // Setter
    public void setRam(int ram) {
        if (ram > 0) {
            this.ram = ram;
        }
    }

    // Getter
    public int getRam() {
        return ram;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
}
```

### Why Encapsulation?

✔ Protects data  
✔ Control access  
✔ Improves maintainability

🧠 **Interview line**:

> Encapsulation is achieved using **private variables** and **public methods**.

---

## 2️⃣ Abstraction (Hide Implementation)

### Meaning (Simple)

Abstraction means:
> **Hiding internal details and showing only functionality.**
> **Show only what is required, hide how it works**

### Real-world example

When you press **Power button**,  
you don’t know **how motherboard starts**.

---

### Java Example (Using Interface)

```java
interface Laptop {

    void start();
    void shutdown();
}
```

```java
class DellLaptop implements Laptop {

    public void start() {
        System.out.println("Dell laptop starting...");
    }

    public void shutdown() {
        System.out.println("Dell laptop shutting down...");
    }
}
```

### Why Abstraction?

✔ Reduce complexity  
✔ Focus on usage, not logic  
✔ Supports loose coupling

🧠 **Interview line**:

> Abstraction is achieved using **interface** or **abstract class**.

---

## 3️⃣ Inheritance (IS-A Relationship)

### Meaning (Simple)

Inheritance means:

> **If one class uses the properties and behavior of another class,**

> **One class uses properties of another class**

### Real-world example

GamingLaptop **IS A** Laptop  
OfficeLaptop **IS A** Laptop

---

### Java Example

```java
class Laptop {
    void powerOn() {
        System.out.println("Laptop power on");
    }
}
```

```java
class GamingLaptop extends Laptop {

    void playGame() {
        System.out.println("Playing high-end games");
    }
}
```

```java
public class Test {
    public static void main(String[] args) {
        GamingLaptop gl = new GamingLaptop();
        gl.powerOn();    // from parent
        gl.playGame();   // own method
    }
}
```

### Why Inheritance?

✔ Code reusability  
✔ Clean structure

🧠 **Interview line**:

> Inheritance is achieved using the **extends** keyword.

---

## 4️⃣ Polymorphism (Many Forms)

### Meaning (Simple)

Polymorphism means:

> **If one task can be performed in different ways,**

> **Same method name, different behavior**

---

### Real-world example

Power button:

- Normal Laptop → normal start
    
- Gaming Laptop → high performance mode
    

---

### Java Example (Method Overriding)

```java
class Laptop {
    void start() {
        System.out.println("Laptop starting normally");
    }
}
```

```java
class GamingLaptop extends Laptop {

    @Override
    void start() {
        System.out.println("Gaming laptop starting in performance mode");
    }
}
```

```java
public class Test {
    public static void main(String[] args) {

        Laptop laptop = new GamingLaptop();
        laptop.start();   // calls GamingLaptop start()
    }
}
```

### Why Polymorphism?

✔ Flexibility  
✔ Runtime behavior change

🧠 **Interview line**:

> Polymorphism is achieved using **method overriding** and **method overloading**.

---

## 🔁 Quick Interview Summary (Very Important)

| Principle     | Meaning             | Java Keyword        |
| ------------- | ------------------- | ------------------- |
| Encapsulation | Data hiding         | private             |
| Abstraction   | Hide implementation | interface, abstract |
| Inheritance   | IS-A relationship   | extends             |
| Polymorphism  | Many forms          | override            |

---


    