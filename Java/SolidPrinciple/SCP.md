

---

# 🔥 **Single Responsibility Principle (SRP)**

### **Definition:**

**One class should have only one responsibility and one reason to change.**

---

# 🧠 **Explain in Simple English**

Think like this:

👉 **If a class is doing too many things, it becomes messy.**  
👉 **Changes in one feature will affect other features.**  
👉 **So, divide the work—one class does one job.**

---

# 💳 **Spring Boot Payment Example (SRP From Scratch)**

Let’s imagine your app needs to:

1. Calculate discount
    
2. Process payment
    
3. Send payment notification
    

If you put **all three responsibilities inside one class**, that is **bad design**.

---

# ❌ **Bad Example (SRP Violation)**

### One class doing EVERYTHING

```java
@Service
public class PaymentService {

    // 1️⃣ Calculate Discount
    public double calculateDiscount(String userId, double amount) {
        // Example discount logic
        return amount * 0.10;
    }

    // 2️⃣ Process Payment
    public double processPayment(String userId, double amount) {
        double discount = calculateDiscount(userId, amount);
        double finalAmount = amount - discount;
        System.out.println("Payment processed: ₹" + finalAmount);
        return finalAmount;
    }

    // 3️⃣ Send Notification
    public void sendNotification(String userId, double amount) {
        System.out.println("Notification sent to " + userId);
    }
}
```

---

## ❌ Why This Breaks SRP?

Because **PaymentService** is doing:

1. Discount calculation
    
2. Payment handling
    
3. Notification sending
    

Three responsibilities in **one single class**.

So if:

- Discount logic changes → modify this class
    
- Notification format changes → modify same class
    
- Payment logic changes → modify same class
    

This makes the class large, complex and harder to maintain.

---

# ✅ **Good Example (SRP Applied)**

### Break big responsibilities into small focused services.

---

## **1️⃣ DiscountService – Handles only discounts**

```java
@Service
public class DiscountService {
    public double calculateDiscount(String userId, double amount) {
        return amount * 0.10; // example
    }
}
```

---

## **2️⃣ PaymentService – Handles only payment**

```java
@Service
public class PaymentService {

    private final DiscountService discountService;

    public PaymentService(DiscountService discountService) {
        this.discountService = discountService;
    }

    public double processPayment(String userId, double amount) {
        double discount = discountService.calculateDiscount(userId, amount);
        double finalAmount = amount - discount;
        System.out.println("Payment processed: ₹" + finalAmount);
        return finalAmount;
    }
}
```

---

## **3️⃣ NotificationService – Handles only notifications**

```java
@Service
public class NotificationService {
    public void sendPaymentNotification(String userId, double amount) {
        System.out.println("Notification sent to " + userId);
    }
}
```

---

# 🚀 What Did We Achieve with SRP?

### ✔ Each class handles ONE responsibility

- `DiscountService` → discount logic
    
- `PaymentService` → payment logic
    
- `NotificationService` → communication logic
    

### ✔ If discount logic changes

Only update `DiscountService`.

### ✔ If notification changes

Only update `NotificationService`.

### ✔ If payment logic evolves

Only update `PaymentService`.

### ✔ Clean, readable, modular code

Each class is small and easy to understand.

### ✔ Easily testable

You can write unit tests for each service separately.

---
