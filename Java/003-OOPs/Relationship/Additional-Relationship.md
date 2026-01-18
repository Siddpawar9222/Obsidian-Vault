
---

Relationship :  
Defines how different classes interact with or depend on each other.

## **🔗 Complete OOP Relationships:**

### **Already Covered:**

1. **Dependency** - "depends-on" (weakest)
2. **Association** - "uses-a"
3. **Aggregation** - "has-a"
4. **Composition** - "part-of"
5. **Inheritance** - "is-a"

### **🆕 Additional Relationships:**

### **6. 🎭 Realization/Implementation**

**"implements"** - Class implements an interface contract

- **Example**: `CreditCardProcessor implements PaymentProcessor`
- **Nature**: Class must fulfill interface contract

### **7. 🏷️ Generalization**

**"is-a-kind-of"** - Same as inheritance but used in UML modeling

- **Example**: `Dog` generalizes to `Animal`
- **Nature**: Parent-child relationship (just different terminology)

### **8. 🔄 Self-Association**

**"relates-to-itself"** - Class has relationship with itself

- **Example**: `Employee` manages other `Employee` objects
- **Nature**: Recursive relationship

```java
class Employee {
    private Employee manager;     // Self-association
    private List<Employee> subordinates;
}
```

### **9. 🔢 Multiplicity Relationships**

**"one-to-many", "many-to-many"** - Defines how many objects can be related

- **Example**: One `Teacher` teaches many `Students`
- **Nature**: Quantifies the relationship

## **📊 Final Complete List:**

```
1. Dependency      ∼∼∼depends-on∼∼∼>
2. Association     ∼∼∼∼∼uses∼∼∼∼∼>
3. Aggregation     ────has────────>
4. Composition     ═══owns═══════>
5. Inheritance     ═══is-a═══════>
6. Realization     ═══implements═══>
7. Self-Association ↻ (points to itself)
8. Multiplicity    1:n, n:n (quantifies relationship)
```

**Most important for coding:** First 5 relationships **Most important for design:** All 8 relationships

These cover **all** the fundamental ways objects can relate to each other in OOP!