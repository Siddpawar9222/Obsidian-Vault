
---

### 🔹 Real-world Example

Imagine two people (Alice and Bob) withdrawing money from the same bank account (₹1000 balance):

- **Alice** withdraws ₹500
    
- **Bob** withdraws ₹700
    

If both transactions happen **without isolation**, they might both see ₹1000 and withdraw money → account could wrongly go negative or inconsistent.

With **isolation**, the DB ensures only one transaction’s changes are visible at a time, so the final balance is always correct.

---

### 🔹 Isolation Problems (if not handled properly)

When isolation is weak, these issues can happen:

1. **Dirty Read** – Reading uncommitted data from another transaction.
    
    - Alice transfers money, but before commit, Bob sees the new balance. If Alice cancels (rollback), Bob saw wrong data.
        
2. **Non-Repeatable Read** – Same query gives different results inside one transaction.
    
    - Alice checks her balance twice → first ₹1000, later ₹500 (because Bob withdrew in between).
        
3. **Phantom Read** – A new row appears between queries.
    
    - Alice counts students in a class → 50.
        
    - Later in the same transaction, she checks again → 51 (someone inserted new student).

---

## 🔹 Isolation Levels 

Assume:

- Account balance = ₹1000
    
- Alice wants to withdraw ₹500
    
- Bob wants to withdraw ₹700
    
- Both transactions happen almost at the same time
    

---

### 1️⃣ **Read Uncommitted** (Lowest Isolation)

- Transactions **can see uncommitted changes** from others (dirty reads).
    
- Example:
    
    - Alice withdraws ₹500 (not yet committed).
        
    - Bob’s transaction sees balance as ₹500 (even though Alice might rollback).
        
    - If Alice cancels → Bob has seen wrong data → inconsistency.
        
- 💡 Rarely used in real banking (too unsafe).
    

---

### 2️⃣ **Read Committed** (Most Common)

- Transactions **only see committed changes**.
    
- Example:
    
    - Alice withdraws ₹500 → not visible to Bob until committed.
        
    - Bob sees the original ₹1000 balance.
        
    - When Alice commits, Bob can then check balance → only sees the committed number.
        
- ✅ Safer, fast, and default in many DBs like PostgreSQL.
    

---

### 3️⃣ **Repeatable Read**

- Same read inside a transaction **always gives the same result**.
    
- Prevents **dirty reads** and **non-repeatable reads**.
    
- Example:
    
    - Alice reads balance = ₹1000.
        
    - Bob withdraws ₹700 and commits.
        
    - Alice reads balance again → still sees ₹1000 (for the duration of her transaction).
        
- This prevents “the balance changed while I was reading it twice”.
    

---

### 4️⃣ **Serializable** (Highest Isolation)

- Transactions run as if **one after another**, fully sequential.
    
- Prevents **dirty reads, non-repeatable reads, and phantom reads**.
    
- Example:
    
    - Alice and Bob both try to withdraw at the same time.
        
    - Database **forces one transaction to wait** until the other completes.
        
    - Result is always **predictable and correct**.
        
- ✅ Used in banking for critical operations where **money consistency is crucial**, but slower because transactions can block each other.
    

---

### 🔹 Banking System Example

- **Critical operations** like transferring money → often use **Serializable or Repeatable Read**.
    
- **Non-critical operations** like viewing transaction history → can use **Read Committed** (faster).
    

---

💡 **Tip to remember**:  
Think of isolation as **how strictly the DB makes transactions “ignore each other”**:

- Read Uncommitted → “I see everything, even unconfirmed changes.”
    
- Read Committed → “I only see confirmed changes.”
    
- Repeatable Read → “My reads don’t change while I’m working.”
    
- Serializable → “It’s like I’m the only one in the bank until I finish.”
    

---
## Spring Boot Example : 
## 1️⃣ Entity: DiscountCounter

```java
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class DiscountCounter {

    @Id
    private Long id;

    private int count;
}
```

- This table stores how many discounts have been used.
    
- `id = 1` (singleton row for the promotion).
    

---

## 2️⃣ Repository

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;

public interface DiscountCounterRepository extends JpaRepository<DiscountCounter, Long> {

    // Lock the row for update to ensure isolation
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM DiscountCounter d WHERE d.id = :id")
    DiscountCounter findByIdForUpdate(Long id);
}
```

- **LockModeType.PESSIMISTIC_WRITE** ensures that if two transactions try to update the row at the same time, one waits.
    

---

## 3️⃣ Service

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiscountService {

    private final DiscountCounterRepository repository;

    public DiscountService(DiscountCounterRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public boolean tryGetDiscount() {
        // Lock row for isolation
        DiscountCounter counter = repository.findByIdForUpdate(1L);

        if (counter.getCount() < 500) {
            counter.setCount(counter.getCount() + 1);
            repository.save(counter);
            return true; // discount applied
        } else {
            return false; // no discount
        }
    }
}
```

### 🔹 How it works

1. User tries to get discount → `tryGetDiscount()` runs.
    
2. Database **locks the row** → ensures no other transaction can read it until commit.
    
3. Increment happens safely.
    
4. Transaction commits → next user can check safely.
    

✅ Guarantees: **exactly 500 discounts**, no race conditions.

---

### 4️⃣ Controller (Optional)

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping("/discount")
    public String getDiscount() {
        boolean applied = discountService.tryGetDiscount();
        return applied ? "Discount applied 🎉" : "Sorry, discount finished 😢";
    }
}
```

---

💡 **Key Points**

- **Transactional** ensures the operation is atomic.
    
- **Pessimistic lock** ensures isolation when multiple users hit the endpoint simultaneously.
    
- You can also use **optimistic locking** with a `version` field, but for this “first 500” scenario, pessimistic locking is simpler and safer.
    

---

