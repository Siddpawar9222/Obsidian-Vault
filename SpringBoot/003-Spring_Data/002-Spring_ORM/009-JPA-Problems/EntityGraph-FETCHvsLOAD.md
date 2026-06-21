
---

`@EntityGraph` has a `type` attribute you rarely see but should know:


### Suppose we have this entity

```java
@Entity
public class Order {

    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    private Customer customer;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> items;

    @OneToOne(fetch = FetchType.EAGER)
    private Payment payment;
}
```

### Default behavior

When you load an Order:

```java
Order order = orderRepository.findById(1L).get();
```

JPA loads:

```text
customer  -> EAGER -> loaded
payment   -> EAGER -> loaded
items     -> LAZY  -> not loaded
```

---

### What <font color="#ffc000">FETCH</font> Graph does

Suppose:

```java
@EntityGraph(
    attributePaths = {"items"},
    type = EntityGraph.EntityGraphType.FETCH
)
Order findById(Long id);
```

Now you are telling Hibernate:

```text
Ignore all fetch settings on entity.
Only load what I explicitly mention.
```

So Hibernate sees:

```text
Listed:
    items

Not listed:
    customer
    payment
```

Result:

```text
items     -> loaded immediately
customer  -> treated as LAZY
payment   -> treated as LAZY
```

Even though:

```java
customer = EAGER
payment  = EAGER
```

FETCH graph overrides them.

---

## SQL Generated

Without EntityGraph:

```sql
SELECT *
FROM orders o
LEFT JOIN customer c
LEFT JOIN payment p
WHERE o.id = 1;
```

With FETCH graph:

```sql
SELECT *
FROM orders o
LEFT JOIN order_items i
WHERE o.id = 1;
```

Customer and payment are skipped.

---

## What <font color="#ffc000">LOAD</font> Graph does

Now:

```java
@EntityGraph(
    attributePaths = {"items"},
    type = EntityGraph.EntityGraphType.LOAD
)
Order findById(Long id);
```

LOAD graph means:

```text
Load items eagerly,
but keep existing EAGER/LAZY settings for everything else.
```

Result:

```text
customer -> EAGER -> loaded
payment  -> EAGER -> loaded
items    -> explicitly loaded
```

Everything gets loaded.

---

## Visual Comparison

### FETCH Graph

```java
@EntityGraph(attributePaths = {"items"}, type = FETCH)
```

```text
customer -> NOT loaded
payment  -> NOT loaded
items    -> loaded
```

Think:

```text
"Load ONLY what I specify."
```

---

### LOAD Graph

```java
@EntityGraph(attributePaths = {"items"}, type = LOAD)
```

```text
customer -> loaded (because EAGER)
payment  -> loaded (because EAGER)
items    -> loaded (because specified)
```

Think:

```text
"Load what I specify PLUS whatever entity mapping says."
```

---

## Why FETCH is preferred in production

Imagine:

```java
@Entity
class User {

    @OneToOne(fetch = EAGER)
    private Profile profile;

    @OneToMany(fetch = EAGER)
    private List<Address> addresses;

    @OneToMany(fetch = EAGER)
    private List<Orders> orders;
}
```

Years later another developer adds:

```java
@OneToMany(fetch = EAGER)
private List<Notifications> notifications;
```

Suddenly:

```java
userRepository.findById(id);
```

starts fetching notifications too.

Performance changes without touching repository code.

---

With FETCH graph:

```java
@EntityGraph(
    attributePaths = {
        "profile",
        "orders"
    },
    type = FETCH
)
```

You explicitly control:

```text
profile -> yes
orders -> yes
addresses -> no
notifications -> no
```

No surprises.

---

## Real Production Rule

Most experienced Hibernate developers follow:

```text
Entity mappings:
    Almost everything LAZY

Repository query:
    Decide exactly what to fetch using
    EntityGraph or JOIN FETCH
```

Example:

```java
@Entity
class Order {

    @ManyToOne(fetch = LAZY)
    private Customer customer;

    @OneToMany(fetch = LAZY)
    private List<OrderItem> items;
}
```

For Order Details page:

```java
@EntityGraph(attributePaths = {
    "customer",
    "items"
})
Order findById(Long id);
```

For Order List page:

```java
Order findById(Long id);
```

without graph.

This gives maximum control and avoids N+1 queries as well as over-fetching.

### Easy memory trick

**FETCH Graph**

```text
Forget entity fetch types.
Use only my graph.
```

**LOAD Graph**

```text
Load my graph
+
respect entity fetch types.
```


---
