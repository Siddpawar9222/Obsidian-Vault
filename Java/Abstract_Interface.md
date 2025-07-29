
---

### **Abstract Class (CardPayment)**

**When to use:**

- **IS-A Relationship**: CreditCard IS-A CardPayment, DebitCard IS-A CardPayment
- **Shared State**: All cards have cardNumber, holderName, balance
- **Shared Behavior**: All cards validate the same way, generate receipts similarly
- **Template Method Pattern**: Define the skeleton (validateCard, generateReceipt) and let subclasses fill in specific parts (processPayment, authorizeTransaction)

**Theory Benefits:**

1. **Code Reuse**: Common functionality written once
2. **Consistency**: All card types follow the same structure
3. **Partial Implementation**: Can provide default implementations
4. **Protected Access**: Subclasses can access parent's protected members

### **Interface (PaymentMethod)**

**When to use:**

- **CAN-DO Relationship**: WalletPayment CAN-DO payments, BankTransfer CAN-DO payments, etc.
- **No Shared Implementation**: Each payment method is fundamentally different
- **Contract Definition**: All must implement the same methods but in their own way
- **Multiple Inheritance**: A class can implement multiple interfaces

**Theory Benefits:**

1. **Flexibility**: Can implement multiple interfaces
2. **Loose Coupling**: Client code depends on interface, not concrete classes
3. **Polymorphism**: Can treat all payment methods uniformly
4. **Design by Contract**: Forces implementation of required methods

## **Key Decision Factors:**

**Choose Abstract Class if:**

- You have common fields/methods that subclasses should inherit
- You want to provide default implementations
- Subclasses are closely related (same family)
- You need protected access modifiers

**Choose Interface if:**

- No shared code between implementations
- Classes are from different hierarchies but need same capabilities
- You want to achieve multiple inheritance
- You're defining a contract/protocol

## **Real-World Rule:**

- **Abstract Class**: "All my shapes have area calculation, but circles and rectangles calculate it differently"
- **Interface**: "Cars, boats, and planes can all move, but they have nothing else in common"

---

```java
// ============= ABSTRACT CLASS EXAMPLE =============
// Use Case: Different types of Card Payments (Credit, Debit, Prepaid)
// Theory: When you have IS-A relationship with shared behavior and state

abstract class CardPayment {
    // Common state - all cards have these
    protected String cardNumber;
    protected String holderName;
    protected double balance;
    
    // Constructor for common initialization
    public CardPayment(String cardNumber, String holderName) {
        this.cardNumber = cardNumber;
        this.holderName = holderName;
    }
    
    // Common behavior - all cards validate the same way
    public boolean validateCard() {
        return cardNumber.length() == 16 && holderName != null;
    }
    
    // Common behavior - all cards format transaction receipt similarly
    public void generateReceipt(double amount) {
        System.out.println("=== RECEIPT ===");
        System.out.println("Card: ****" + cardNumber.substring(12));
        System.out.println("Holder: " + holderName);
        System.out.println("Amount: $" + amount);
        System.out.println("==============");
    }
    
    // Abstract method - each card type processes payment differently
    public abstract boolean processPayment(double amount);
    
    // Abstract method - each card type has different authorization logic
    public abstract boolean authorizeTransaction(double amount);
}

class CreditCard extends CardPayment {
    private double creditLimit;
    private double currentDebt;
    
    public CreditCard(String cardNumber, String holderName, double creditLimit) {
        super(cardNumber, holderName);
        this.creditLimit = creditLimit;
        this.currentDebt = 0;
    }
    
    @Override
    public boolean authorizeTransaction(double amount) {
        // Credit card specific: check credit limit
        return (currentDebt + amount) <= creditLimit;
    }
    
    @Override
    public boolean processPayment(double amount) {
        if (validateCard() && authorizeTransaction(amount)) {
            currentDebt += amount;
            System.out.println("Credit card charged: $" + amount);
            generateReceipt(amount);
            return true;
        }
        return false;
    }
}

class DebitCard extends CardPayment {
    public DebitCard(String cardNumber, String holderName, double balance) {
        super(cardNumber, holderName);
        this.balance = balance;
    }
    
    @Override
    public boolean authorizeTransaction(double amount) {
        // Debit card specific: check available balance
        return balance >= amount;
    }
    
    @Override
    public boolean processPayment(double amount) {
        if (validateCard() && authorizeTransaction(amount)) {
            balance -= amount;
            System.out.println("Debit card debited: $" + amount);
            generateReceipt(amount);
            return true;
        }
        return false;
    }
}

// ============= INTERFACE EXAMPLE =============
// Use Case: Different Payment Methods (Card, Wallet, Bank, Crypto)
// Theory: When you have CAN-DO relationship with no shared implementation

interface PaymentMethod {
    // Contract: every payment method must be able to do these
    boolean processPayment(double amount, String merchantId);
    String getTransactionId();
    void sendNotification(String message);
}

// Different payment methods with completely different implementations
class WalletPayment implements PaymentMethod {
    private String walletId;
    private double walletBalance;
    private String lastTransactionId;
    
    public WalletPayment(String walletId, double balance) {
        this.walletId = walletId;
        this.walletBalance = balance;
    }
    
    @Override
    public boolean processPayment(double amount, String merchantId) {
        if (walletBalance >= amount) {
            walletBalance -= amount;
            lastTransactionId = "WAL" + System.currentTimeMillis();
            System.out.println("Wallet payment of $" + amount + " to " + merchantId);
            return true;
        }
        return false;
    }
    
    @Override
    public String getTransactionId() {
        return lastTransactionId;
    }
    
    @Override
    public void sendNotification(String message) {
        System.out.println("Wallet SMS: " + message);
    }
}

class BankTransferPayment implements PaymentMethod {
    private String accountNumber;
    private String bankCode;
    private String lastTransactionId;
    
    public BankTransferPayment(String accountNumber, String bankCode) {
        this.accountNumber = accountNumber;
        this.bankCode = bankCode;
    }
    
    @Override
    public boolean processPayment(double amount, String merchantId) {
        // Completely different logic - bank API calls
        System.out.println("Initiating bank transfer of $" + amount);
        System.out.println("From: " + accountNumber + " (Bank: " + bankCode + ")");
        System.out.println("To merchant: " + merchantId);
        lastTransactionId = "BNK" + System.currentTimeMillis();
        return true;
    }
    
    @Override
    public String getTransactionId() {
        return lastTransactionId;
    }
    
    @Override
    public void sendNotification(String message) {
        System.out.println("Bank Email: " + message);
    }
}

class CryptocurrencyPayment implements PaymentMethod {
    private String walletAddress;
    private String cryptoType;
    private String lastTransactionId;
    
    public CryptocurrencyPayment(String walletAddress, String cryptoType) {
        this.walletAddress = walletAddress;
        this.cryptoType = cryptoType;
    }
    
    @Override
    public boolean processPayment(double amount, String merchantId) {
        // Completely different - blockchain transactions
        System.out.println("Broadcasting " + cryptoType + " transaction");
        System.out.println("Amount: " + amount + " to merchant: " + merchantId);
        System.out.println("From wallet: " + walletAddress);
        lastTransactionId = "CRYPTO" + System.currentTimeMillis();
        return true;
    }
    
    @Override
    public String getTransactionId() {
        return lastTransactionId;
    }
    
    @Override
    public void sendNotification(String message) {
        System.out.println("Blockchain notification: " + message);
    }
}

// ============= USAGE DEMONSTRATION =============
class PaymentProcessor {
    // Can process any payment method through interface
    public void processOrder(PaymentMethod paymentMethod, double amount) {
        String merchantId = "MERCHANT_123";
        
        if (paymentMethod.processPayment(amount, merchantId)) {
            String txnId = paymentMethod.getTransactionId();
            paymentMethod.sendNotification("Payment successful. Txn ID: " + txnId);
        } else {
            paymentMethod.sendNotification("Payment failed");
        }
    }
    
    // Can process any card payment through abstract class
    public void processCardPayment(CardPayment card, double amount) {
        if (card.processPayment(amount)) {
            System.out.println("Card payment successful");
        } else {
            System.out.println("Card payment failed");
        }
    }
    
    public static void main(String[] args) {
        PaymentProcessor processor = new PaymentProcessor();
        
        // Using abstract class - cards share common behavior
        CreditCard creditCard = new CreditCard("1234567890123456", "John Doe", 5000);
        DebitCard debitCard = new DebitCard("1234567890123457", "Jane Doe", 2000);
        
        processor.processCardPayment(creditCard, 100);
        processor.processCardPayment(debitCard, 50);
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        // Using interface - completely different payment methods
        WalletPayment wallet = new WalletPayment("WALLET123", 1000);
        BankTransferPayment bank = new BankTransferPayment("ACC789", "BANK001");
        CryptocurrencyPayment crypto = new CryptocurrencyPayment("1A2B3C4D", "Bitcoin");
        
        processor.processOrder(wallet, 75);
        processor.processOrder(bank, 200);
        processor.processOrder(crypto, 150);
    }
}
```


---

## The Core Difference:

**Abstract Class `processPayment`:**

- All card types process payments in a **similar pattern** (validate → authorize → deduct/charge → receipt)
- They share common steps but implement some steps differently
- **Related family** of payment processors

**Interface `processPayment`:**

- Each payment method processes payments in **completely different ways**
- No shared pattern or steps
- **Unrelated classes** that happen to process payments

## Here's the Decision Framework:

```java
// Ask yourself: "Do my classes share ANY common behavior or state?"

// If YES → Abstract Class
abstract class CardPayment {
    // Common state
    protected String cardNumber;
    
    // Common behavior - SAME for all cards
    public boolean validateCard() { /* same logic */ }
    
    // Different behavior - but SAME PATTERN
    public abstract boolean processPayment(double amount);
}

// If NO → Interface  
interface PaymentMethod {
    // Just a contract - no shared behavior
    boolean processPayment(double amount, String merchantId);
}
```

## Real Example to Clear Confusion:

**Scenario: You need to handle Credit Card AND Cryptocurrency payments**

**Option 1: Abstract Class** ❌

```java
abstract class PaymentProcessor {
    public abstract boolean processPayment(double amount);
}

class CreditCardProcessor extends PaymentProcessor {
    public boolean processPayment(double amount) {
        // 1. Validate card
        // 2. Check credit limit  
        // 3. Charge card
        // 4. Generate receipt
    }
}

class CryptocurrencyProcessor extends PaymentProcessor {
    public boolean processPayment(double amount) {
        // 1. Create blockchain transaction
        // 2. Broadcast to network
        // 3. Wait for confirmation
        // No validation, no receipt, completely different!
    }
}
```

**Problem:** Credit cards and crypto have NOTHING in common except the method name. Abstract class adds no value.

**Option 2: Interface** ✅

```java
interface PaymentMethod {
    boolean processPayment(double amount);
}

class CreditCardPayment implements PaymentMethod {
    public boolean processPayment(double amount) {
        // Card-specific logic
    }
}

class CryptocurrencyPayment implements PaymentMethod {
    public boolean processPayment(double amount) {
        // Crypto-specific logic  
    }
}
```

**Correct:** Just a contract - each implements completely differently.

## Simple Decision Rule:

**Ask: "If I remove the abstract class/interface, do my subclasses still share code?"**

- **If YES** → Abstract Class (they're truly related)
- **If NO** → Interface (they just happen to do similar things)

## In Your Payment Example:

- **Cards (Credit/Debit)** → Abstract Class because they share validation, receipt generation, card number format
- **Payment Methods (Card/Wallet/Bank/Crypto)** → Interface because a credit card and Bitcoin have absolutely nothing in common except they can process payments

---

