
----


🚀 **Open/Closed Principle (OCP) Explained with Payment System in Spring Boot**

---

### **🔹 What is the Open/Closed Principle (OCP)?**

👉 **Definition:** _"A class should be open for extension but closed for modification."_

### **🔹 What Does This Mean?**

✅ You should be able to **add new functionality without modifying existing code**.  
🚨 If you have to keep changing old code to support new features, **you are violating OCP**.

---

## **🔹 Problem Statement (Breaking OCP)**

Let's say we have a **PaymentService** that processes payments using different payment methods (Credit Card, PayPal, UPI).

🚨 **Bad Example (Violating OCP)**

```java
@Service
public class PaymentService {
    public void processPayment(String paymentType, double amount) {
        if (paymentType.equals("CREDIT_CARD")) {
            System.out.println("Processing Credit Card Payment of ₹" + amount);
        } else if (paymentType.equals("PAYPAL")) {
            System.out.println("Processing PayPal Payment of ₹" + amount);
        } else if (paymentType.equals("UPI")) {
            System.out.println("Processing UPI Payment of ₹" + amount);
        } else {
            throw new RuntimeException("Invalid payment method");
        }
    }
}
```

❌ **Problems with This Approach:**

1. **Every time we add a new payment method, we modify `PaymentService`** (violates OCP).
    
2. **Code is tightly coupled**—modifying one part may break another.
    
3. **Difficult to test**—adding new conditions increases complexity.
    

---

## **🔹 Correct Approach (Following OCP)**

👉 Instead of modifying `PaymentService` every time we introduce a new payment method, we use **polymorphism (interfaces & abstraction)**.

✅ **Step 1: Create a Payment Strategy Interface**

```java
public interface PaymentStrategy {
    void pay(double amount);
}
```

---

✅ **Step 2: Implement Different Payment Strategies**

```java
@Component
public class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Processing Credit Card Payment of ₹" + amount);
    }
}

@Component
public class PayPalPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Processing PayPal Payment of ₹" + amount);
    }
}

@Component
public class UpiPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Processing UPI Payment of ₹" + amount);
    }
}
```

---

✅ **Step 3: Modify `PaymentService` to Use Dependency Injection (OCP Applied)**

```java
@Service
public class PaymentService {
    private final Map<String, PaymentStrategy> paymentStrategies;

    @Autowired
    public PaymentService(List<PaymentStrategy> paymentStrategyList) {
        this.paymentStrategies = new HashMap<>();
        for (PaymentStrategy strategy : paymentStrategyList) {
            paymentStrategies.put(strategy.getClass().getSimpleName(), strategy);
        }
    }

    public void processPayment(String paymentMethod, double amount) {
        PaymentStrategy strategy = paymentStrategies.get(paymentMethod);
        if (strategy != null) {
            strategy.pay(amount);
        } else {
            throw new RuntimeException("Invalid payment method: " + paymentMethod);
        }
    }
}
```

---

✅ **Step 4: Call `PaymentService` in Controller or Main Class**

```java
@RestController
@RequestMapping("/payment")
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/pay")
    public ResponseEntity<String> makePayment(@RequestParam String method, @RequestParam double amount) {
        paymentService.processPayment(method, amount);
        return ResponseEntity.ok("Payment of ₹" + amount + " done via " + method);
    }
}
```

---

## **🔹 Why is This Better?**

✅ **Open for extension:**

- If we want to **add a new payment method**, we **only create a new class** implementing `PaymentStrategy`.
    
- We **DO NOT modify** `PaymentService` at all!
    

✅ **Closed for modification:**

- **Existing code remains unchanged** when adding new features.
    

✅ **Follows SOLID & Clean Code Practices:**

- **Easy to test**
    
- **More maintainable**
    
- **Less risk of introducing new bugs when adding features**
    

---

## **🎯 Summary**

|**Approach**|**OCP Violated?**|**Problem**|
|---|---|---|
|**If-Else in `PaymentService`**|🚨 Yes|Every new payment method requires modifying existing code.|
|**Using Strategy Pattern (OCP Applied)**|✅ No|New payment methods can be added without modifying `PaymentService`.|

---

## **🚀 Final Thoughts**

By applying the **Open/Closed Principle**, your Spring Boot application becomes **scalable, maintainable, and testable**. Now, adding new payment methods is **as simple as creating a new class**—without modifying any existing logic!
