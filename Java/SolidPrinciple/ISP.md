
---

## 🔹 What is the Interface Segregation Principle (ISP)?

👉 **Definition:**  
_A client (class) should not be forced to depend on methods it does not use._

### ✅ In Simple English:

- Don’t create **large, fat interfaces**.
    
- Instead, create **small, specific interfaces**.
    
- Each class should implement **only the methods it really needs**.
    

---

## 🔧 Real-World Analogy

Imagine you go to a **restaurant**. They give you a big menu with:

- Indian food
    
- Italian food
    
- Chinese food  
    You just came for **coffee**, but now you must look through the **entire menu**—even though 90% doesn’t matter to you. Annoying, right?
    

👉 This is exactly what happens when we give **large interfaces** to classes that need **only 1 or 2 methods**.

---

## 🔥 Problem Statement (Breaking ISP) – Payment System

Suppose we create a **big interface** for all payment types:

```java
public interface PaymentMethod {
    void pay(double amount);
    void refund(double amount);
    void saveCardDetails(String cardNumber);
}
```

Now let’s say we create a `UPIPayment` class:

```java
public class UPIPayment implements PaymentMethod {
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " via UPI");
    }

    public void refund(double amount) {
        System.out.println("Refunded ₹" + amount + " via UPI");
    }

    public void saveCardDetails(String cardNumber) {
        throw new UnsupportedOperationException("UPI doesn't support saving card details");
    }
}
```

---

### 🚨 What’s Wrong?

- `UPIPayment` is **forced to implement a method** (`saveCardDetails`) that it **shouldn’t care about**.
    
- This violates **Interface Segregation Principle**.
    
- Later, if someone calls `saveCardDetails()` by mistake — 💥 the app crashes.
    

---

## ✅ Solution (Apply ISP)

👉 **Break large interface into smaller ones:**

```java
public interface Payable {
    void pay(double amount);
}

public interface Refundable {
    void refund(double amount);
}

public interface CardSavable {
    void saveCardDetails(String cardNumber);
}
```

### ✅ Now only implement what’s needed:

```java
public class UPIPayment implements Payable, Refundable {
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " via UPI");
    }

    public void refund(double amount) {
        System.out.println("Refunded ₹" + amount + " via UPI");
    }
}
```

```java
public class CreditCardPayment implements Payable, Refundable, CardSavable {
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " via Credit Card");
    }

    public void refund(double amount) {
        System.out.println("Refunded ₹" + amount + " via Credit Card");
    }

    public void saveCardDetails(String cardNumber) {
        System.out.println("Card saved: " + cardNumber);
    }
}
```

---

## ✅ Why Is This Better?

|❌ Old Approach|✅ ISP Applied|
|---|---|
|One big interface with all methods|Small, focused interfaces|
|Classes forced to implement unused methods|Classes implement only what they need|
|Risk of runtime errors|Safe and clean code|
|Hard to maintain & scale|Easy to test, extend, and refactor|

---

## 🔧 Spring Boot Real Use

In Spring, this is similar to splitting responsibilities between:

- `JpaRepository<T, ID>` (for database)
    
- `EmailService` (only for sending emails)
    
- `PaymentProcessor` (only for payment logic)
    

You don’t mix these into one giant interface. You create **small services/interfaces**, and classes depend **only on what they use**.

---

## 🎯 Summary

|Principle|Explanation|
|---|---|
|**ISP**|Don’t force a class to depend on methods it doesn’t use. Break large interfaces into smaller, meaningful ones.|

---

