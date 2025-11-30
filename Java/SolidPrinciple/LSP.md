

---

### **🔹 What is the Liskov Substitution Principle (LSP)?**

👉 **Definition:** _"Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program."_

🔸 In simple words:  
✅ **If a class (subclass) extends another class (parent), it should behave in a way that does not break the parent class's behavior.**

🚨 **Violating LSP leads to unexpected behaviors when using polymorphism.**

---

## **🔹 Problem Statement (Breaking LSP)**

Let’s say we have a `PaymentStrategy` interface for handling different payment methods (Credit Card, PayPal, UPI).

Now, **we introduce a new type of payment: "GiftCard Payment"**, but it has a limitation—it **doesn't allow partial payments**.

🚨 **Bad Example (Violating LSP)**

```java
public interface PaymentStrategy {
    void pay(double amount);
}
```

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
```

🚨 **Now, let's introduce GiftCardPayment but break LSP**

```java
@Component
public class GiftCardPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        throw new UnsupportedOperationException("Gift Card does not support partial payments");
    }
}
```

---

### **🔹 What is Wrong Here? (Why LSP is Broken?)**

🔸 `GiftCardPayment` **inherits** from `PaymentStrategy`, but it **does not behave like other payment types**.  
🔸 `pay(amount)` throws an exception, which **violates the expected behavior** of the interface.  
🔸 Now, if `PaymentService` **expects all payments to work the same way**, it **will crash when GiftCard is used**.

🚨 **This breaks LSP because a subclass (`GiftCardPayment`) cannot fully replace its parent (`PaymentStrategy`).**

---

## **🔹 Correct Approach (Following LSP)**

✅ **Solution:** Instead of forcing `GiftCardPayment` to implement `pay(amount)`, we **create a new interface** for payments that do not support partial payments.

---

### ✅ **Step 1: Create a Base Interface for Regular Payments**

```java
public interface PaymentStrategy {
    void pay(double amount);
}
```

---

### ✅ **Step 2: Create a Separate Interface for Fixed-Value Payments**

```java
public interface FixedAmountPaymentStrategy extends PaymentStrategy {
    void payFullAmount(); // No partial payment allowed
}
```

---

### ✅ **Step 3: Implement Correct Payment Strategies**

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
```

---

### ✅ **Step 4: Implement Gift Card Payment Correctly**

```java
@Component
public class GiftCardPayment implements FixedAmountPaymentStrategy {
    @Override
    public void payFullAmount() {
        System.out.println("Processing Gift Card Payment (Full Amount Only)");
    }

    @Override
    public void pay(double amount) {
        throw new UnsupportedOperationException("Use payFullAmount() instead");
    }
}
```

---

### ✅ **Step 5: Modify `PaymentService` to Handle Both Types of Payments**

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
        if (strategy == null) {
            throw new RuntimeException("Invalid payment method: " + paymentMethod);
        }

        if (strategy instanceof FixedAmountPaymentStrategy) {
            ((FixedAmountPaymentStrategy) strategy).payFullAmount();
        } else {
            strategy.pay(amount);
        }
    }
}
```

---

### ✅ **Step 6: Call `PaymentService` in Controller or Main Class**

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

✅ **Now, `GiftCardPayment` does not break `PaymentStrategy` rules**.  
✅ **`GiftCardPayment` has its own behavior using `FixedAmountPaymentStrategy`**.  
✅ **`PaymentService` can now safely handle both regular and full-payment-only strategies.**  
✅ **LSP is satisfied because subclasses can replace their parent class without breaking behavior.**

---
