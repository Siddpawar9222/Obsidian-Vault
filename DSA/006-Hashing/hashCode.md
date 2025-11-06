
---

### What is `hashCode`?

In Java, `hashCode` is a method in the `Object` class that returns an **integer value** representing the memory address or a unique identifier for an object. It is primarily used in<font color="#ffff00"> hash-based data structures like **HashMap**, **HashSet**, and **Hashtable**.</font>

A **hashCode** is not the <font color="#ffff00">actual memory address</font> but a number that helps Java determine where to place the object in a hash-based data structure.

---

### Key Characteristics of `hashCode`:

1. **Uniqueness**: Ideally, different objects should have unique hash codes, but it's not guaranteed.
2. **Consistency**: If an object does not change, its `hashCode` value remains the same.
3. **Relation with `equals`**:
    - If two objects are **equal** (`obj1.equals(obj2)` returns true), their `hashCode` values must also be the same.
    - However, two objects with the same `hashCode` are **not necessarily equal**.

---

### Default `hashCode` Implementation:

By default, `hashCode` is implemented in the `Object` class and typically returns a number derived from the object's memory address.

For example:

```java
Object obj = new Object();
System.out.println(obj.hashCode()); // Outputs a hash code like 1234567
```

---

### Why is `hashCode` Important?

The **hashCode** determines where an object will be stored in a hash-based collection like a `HashMap` or `HashSet`. The `hashCode` helps locate an object quickly, making operations like `put` and `get` very efficient.

---

