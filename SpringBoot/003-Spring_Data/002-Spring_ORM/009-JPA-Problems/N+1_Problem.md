# N+1 Query Problem — Hibernate & Spring Boot

> **Complete guide with Order & OrderItem examples**

---



---

## 1. What is the N+1 Problem?

Imagine you are building an e-commerce app. You want to show all orders and the items inside each order.

A naive approach would be:

- **Step 1** — Fetch all orders from the DB → **1 query**
- **Step 2** — For each order, fetch its items → **1 query per order**

So if you have 500 orders, you fire: **1 + 500 = 501 queries.**

> ⚠️ This pattern is called the **N+1 Problem**. Instead of 1 smart query, you fire N+1 small queries. On a large table, this kills performance.

### Real-world impact

| Orders in DB | Queries Fired | Problem Level           |
|-------------|---------------|-------------------------|
| 10          | 11            | Barely noticeable       |
| 100         | 101           | Noticeable slowness     |
| 1,000       | 1,001         | Serious performance issue |
| 10,000      | 10,001        | App becomes unusable    |

---

## 2. Domain Setup — Order & OrderItem

We will use a real e-commerce example throughout these notes.

### Order.java

```java
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    // LAZY = default — Hibernate does NOT load items until accessed
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> items;

    // getters and setters
}
```

### OrderItem.java

```java
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;    // FK column pointing back to orders table

    // getters and setters
}
```

### OrderRepository.java

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
    // No special query — default findAll() for now
}
```

---

## 3. Why the N+1 Problem Happens

### 3.1 Lazy Loading and Hibernate Proxies

When Hibernate loads an entity, it does **NOT** immediately load its relationships. Instead, it creates a **Proxy Object** — a fake placeholder with only the ID filled in.

```java
// You think you have this:
order.getItems()  →  [OrderItem{id=1, product="Book"}, OrderItem{id=2, product="Pen"}]

// Hibernate actually gives you this:
order.getItems()  →  HibernateProxy{ id=1, productName=null, quantity=0 }
//                    ↑ Fake object! Real data not loaded yet.
```

> ℹ️ The proxy only has the ID. Everything else is empty. Hibernate delays the DB call until you actually touch the data. This is called **Lazy Loading**.

---

### 3.2 Where the Problem Actually Fires — The Mapper

The N+1 does **not** happen when you call `findAll()`. It happens **later**, when code accesses the lazy fields. In real projects, this usually happens inside a **Mapper**.

```java
// OrderMapper.java
@Mapping(target = "orderId",   source = "id")                  // ← ID already known, no query
@Mapping(target = "itemCount", source = "items.size")          // ← Proxy touched → Query fires!
@Mapping(target = "firstItem", source = "items[0].productName") // ← Another query!
```

> ✅ The mapper did **not** cause the problem. Hibernate's lazy proxy did. The mapper just happened to be the first place where the proxy was touched.

---

### 3.3 The Service Code That Triggers N+1

```java
// OrderService.java
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public void printAllOrders() {
        // Query 1: SELECT * FROM orders
        List<Order> orders = orderRepository.findAll();

        for (Order order : orders) {
            // EACH LINE BELOW FIRES A NEW QUERY:
            // SELECT * FROM order_items WHERE order_id = ?
            // This runs once per order → N extra queries
            List<OrderItem> items = order.getItems();
            System.out.println(order.getCustomerName() + " → " + items.size() + " items");
        }
    }
}
```

What you see in SQL logs (`spring.jpa.show-sql=true`):

```sql
-- Query 1: fetch all orders
Hibernate: select * from orders

-- Query 2: fetch items for Order #1
Hibernate: select * from order_items where order_id = 1

-- Query 3: fetch items for Order #2
Hibernate: select * from order_items where order_id = 2

-- Query 4: fetch items for Order #3
Hibernate: select * from order_items where order_id = 3

-- ...and so on for EVERY single order
-- 500 orders = 501 queries
```

---

### 3.4 Why Spring Boot Hides This Problem — Open Session In View (OSIV)

This is the important part. N+1 silently hides itself because of how Spring Boot configures the **Hibernate Session lifecycle**.

A Hibernate **Session** is the object that:
- Holds the DB connection
- Manages the L1 (first-level) cache
- Keeps proxies alive and able to fire queries

**Proxies can only fire queries WHILE the Session is open.**

Spring Boot's default setting:

```properties
# application.properties
spring.jpa.open-in-view=true   # This is TRUE by default in Spring Boot
```

What OSIV = true means:

```
HTTP Request arrives
       │
       ▼
Session OPENS  ◄────────────────────────────────────────┐
       │                                                 │
       ▼                                                 │  Session stays
Controller → Service → Repository                        │  open the ENTIRE
       │                                                 │  HTTP request
       ▼                                                 │  lifecycle
Hibernate loads Orders (proxies created for items)       │
       │                                                 │
       ▼                                                 │
Mapper accesses proxy fields ← SESSION STILL OPEN ──────┘
Proxy fires lazy queries silently
       │
       ▼
Response sent to client
       │
       ▼
Session CLOSES
```

> ⚠️ Because the Session is open all the way through the mapper, lazy loading works **anywhere** in the request lifecycle — including your Thymeleaf templates if you use them. This is why you never get a `LazyInitializationException`. But it is also why N+1 **hides itself silently**.

---

### 3.5 What Happens When OSIV is Disabled

```properties
# application.properties
spring.jpa.open-in-view=false
```

Now the Session closes as soon as the `@Transactional` method ends:

```
@Transactional method starts → Session OPENS
       │
       ▼
findAll() → Orders loaded, proxies created for items
       │
       ▼
@Transactional method ends → Session CLOSES
       │
       ▼
Mapper tries to access order.getItems()
Session is CLOSED → proxy cannot fire query
       │
       ▼
💥  LazyInitializationException
```

> ✅ With OSIV off, your app breaks **loudly** at the proxy access — which actually forces you to fix N+1 properly. Many production teams disable OSIV intentionally for this reason.

---

### 3.6 ID Fields Are Special — Why You See Fewer Queries Than Expected

When you access the **ID** of a lazy relationship, Hibernate does **NOT** fire a query. Hibernate stores the FK (foreign key) column inside the parent row itself.

```java
// These do NOT fire extra queries:
order.getId()                        // ID is already in the orders row
orderItem.getOrder().getId()         // order_id FK is already in order_items row

// These DO fire extra queries (non-ID fields):
order.getItems()                     // items are in a separate table
orderItem.getOrder().getCustomerName() // name is not in the order_items row
```

---

## 4. Ways to Solve the N+1 Problem

### Fix 1 — JOIN FETCH in JPQL (Most Common Fix)

Tell Hibernate: fetch Orders **AND** their Items together in one SQL JOIN query.

```java
// OrderRepository.java
public interface OrderRepository extends JpaRepository<Order, Long> {

    // JOIN FETCH forces Hibernate to load items in ONE query
    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.items")
    List<Order> findAllWithItems();
}
```

What Hibernate now runs — just **ONE** query:

```sql
SELECT DISTINCT o.*, oi.*
FROM orders o
INNER JOIN order_items oi ON oi.order_id = o.id
```

Updated Service:

```java
public void printAllOrders() {
    // One query, items already loaded — no extra DB hits
    List<Order> orders = orderRepository.findAllWithItems();

    for (Order order : orders) {
        // No new query here — data is already in memory
        System.out.println(order.getCustomerName() + " → " + order.getItems().size());
    }
}
```

> ℹ️ **Why DISTINCT?** When Hibernate JOINs orders with items, it gets one row per combination — Order #1 with Item A, Order #1 with Item B, etc. Without `DISTINCT`, you get duplicate Order objects in your list. `DISTINCT` tells Hibernate to deduplicate the Java objects. In Hibernate 6+, this happens automatically, but adding `DISTINCT` is still good practice for clarity.

> ✅ Use `JOIN FETCH` for small-to-medium result sets where you need one level of children.

---

### Fix 2 — @EntityGraph (Cleaner, No Raw JPQL)

`@EntityGraph` is Spring Data JPA's cleaner alternative. You just add an annotation — Hibernate handles the JOIN automatically without you writing any SQL.

```java
// OrderRepository.java
public interface OrderRepository extends JpaRepository<Order, Long> {

    // attributePaths tells JPA: also load the "items" collection
    @EntityGraph(attributePaths = {"items"})
    List<Order> findAll();   // overrides default findAll() behavior
}
```

No raw SQL, no JPQL — just an annotation.

> ✅ `@EntityGraph` is preferred over `FetchType.EAGER` on the entity. `EAGER` permanently affects **every** query on that entity. `@EntityGraph` applies only to that specific repository method.

---

### Fix 3 — @BatchSize (For Deep or Complex Object Graphs)

Sometimes you have chains like `Order → Items → Product → Category → Supplier`. JOIN FETCH on all of them leads to complex, hard-to-read queries. Batch fetching is a better option here.

Instead of 1 query per order, Hibernate fetches related entities in batches:

```sql
-- Without @BatchSize:
SELECT * FROM order_items WHERE order_id = 1
SELECT * FROM order_items WHERE order_id = 2
SELECT * FROM order_items WHERE order_id = 3
-- ... 500 queries

-- With @BatchSize(size = 50):
SELECT * FROM order_items WHERE order_id IN (1, 2, 3, ..., 50)
SELECT * FROM order_items WHERE order_id IN (51, 52, ..., 100)
-- ... only 10 queries for 500 orders
```

Apply `@BatchSize` on the entity:

```java
// Order.java
@Entity
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @BatchSize(size = 50)
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> items;
}
```

Or set it globally in `application.properties`:

```properties
# Fetches lazy collections in batches of 50 instead of 1-by-1
spring.jpa.properties.hibernate.default_batch_fetch_size=50
```

---

### Which Fix to Use When?

| Scenario                                      | Best Fix                                                   |
| --------------------------------------------- | ---------------------------------------------------------- |
| Simple parent + children, one level deep      | `JOIN FETCH` with `DISTINCT`                               |
| Same, but you prefer clean code over JPQL     | `@EntityGraph`                                             |
| Deep object graphs (3+ levels)                | `@BatchSize` globally                                      |
| Only need specific fields (not full entities) | JPQL DTO projection — `new OrderDTO(o.id, oi.productName)` |

---

## 5. Solving N+1 When Using Specification\<T\>

### 5.1 The Problem with findAll(spec)

When you use JPA Specification (for dynamic filtering), there is a trap that most developers miss.

If you override `findAll()` with `@EntityGraph`, it will **NOT** cover the Specification variant because they are **different method signatures**:

```java
findAll()                       // no spec — EntityGraph works here
findAll(Specification<T> spec)  // different method — EntityGraph does NOT apply here
```

> ⚠️ Simply overriding `findAll()` is **NOT** enough. You must explicitly override the Specification variant too.

---

### 5.2 The Fix — Override the Specification Variant

Your repository must extend `JpaSpecificationExecutor`, and you must override the spec-based method:

```java
// OrderRepository.java
public interface OrderRepository extends JpaRepository<Order, Long>,
                                          JpaSpecificationExecutor<Order> {

    // Covers findById — loads items eagerly
    @EntityGraph(attributePaths = {"items"})
    @Override
    Optional<Order> findById(Long id);

    // Covers findAll(spec) — used in listing APIs with filters
    @EntityGraph(attributePaths = {"items"})
    @Override
    List<Order> findAll(Specification<Order> spec);
}
```

---

### 5.3 Covering Pagination Too

In production, you almost never return a raw `List` — you paginate. So cover that too:

```java
@EntityGraph(attributePaths = {"items"})
@Override
Page<Order> findAll(Specification<Order> spec, Pageable pageable);
```

---

### 5.4 The Pagination + Collection JOIN Trap

> ⚠️ This is a **critical production issue**. If your `Order` has a collection (e.g., `List<OrderStatusHistory>`), and you add it to `@EntityGraph` on a **paginated** query, Hibernate will log this warning:

```
HHH90003004: firstResult/maxResults specified with collection fetch;
applying in memory
```

This means Hibernate **fetches ALL rows into memory first**, then applies `LIMIT` in Java — NOT in SQL. On a large table, this is dangerous and can cause an `OutOfMemoryError`.

```java
// DANGEROUS — if statusHistory is a collection
@EntityGraph(attributePaths = {
    "items",           // collection  — DANGEROUS with pagination ⚠️
    "statusHistory"    // collection  — DANGEROUS with pagination ⚠️
})
Page<Order> findAll(Specification<Order> spec, Pageable pageable);
```

---

### 5.5 Production-Safe Two-Query Pattern

The correct approach is to split into **two queries**:

- **Query 1** — Paginate cleanly, only join single-valued (non-collection) relationships.
- **Query 2** — After pagination, load collections for only the current page's IDs.

**Step 1 — Repository methods:**

```java
// OrderRepository.java

// Query 1 — paginate cleanly with safe single-valued joins
// (assuming Order has a @ManyToOne Customer — single-valued, safe)
@EntityGraph(attributePaths = {"customer"})
@Override
Page<Order> findAll(Specification<Order> spec, Pageable pageable);

// Query 2 — load collections for a specific set of IDs
@EntityGraph(attributePaths = {
    "items",
    "items.product",
    "statusHistory"
})
@Query("SELECT o FROM Order o WHERE o.id IN :ids")
List<Order> findAllWithDetailsByIds(@Param("ids") List<Long> ids);
```

**Step 2 — Service layer:**

```java
// OrderService.java
@Transactional(readOnly = true)
public Page<OrderResponseDto> getAllOrders(Specification<Order> spec, Pageable pageable) {

    // Step 1 — paginate with safe single-valued joins
    // SQL: SELECT o.* FROM orders o LEFT JOIN customers c ON ... LIMIT 20 OFFSET 0
    Page<Order> orderPage = orderRepository.findAll(spec, pageable);

    // Step 2 — extract only the IDs from this page (e.g., 20 IDs)
    List<Long> ids = orderPage.getContent()
                              .stream()
                              .map(Order::getId)
                              .toList();

    // Step 3 — fetch collections for these 20 orders only
    // SQL: SELECT o.* FROM orders o JOIN items i ON ... WHERE o.id IN (1,2,...,20)
    List<Order> enrichedOrders = orderRepository.findAllWithDetailsByIds(ids);

    // Step 4 — build a Map for quick lookup
    Map<Long, Order> enrichedMap = enrichedOrders.stream()
                                                 .collect(Collectors.toMap(Order::getId, o -> o));

    // Step 5 — map to DTOs using enriched data
    List<OrderResponseDto> dtos = orderPage.getContent()
                                           .stream()
                                           .map(o -> orderMapper.toDto(
                                               enrichedMap.getOrDefault(o.getId(), o)))
                                           .toList();

    return new PageImpl<>(dtos, pageable, orderPage.getTotalElements());
}
```

---

### Summary — What Applies Where

| Method | Has Collections in DTO? | Fix |
|--------|------------------------|-----|
| `findById(id)` | No | `@EntityGraph` with single-valued paths |
| `findAll(spec)` | No | `@EntityGraph` override for Specification variant |
| `findAll(spec, pageable)` | No | `@EntityGraph` override — safe |
| `findAll(spec, pageable)` | Yes | Two-query pattern — paginate first, load collections second |

---

## 6. How @EntityGraph Works Internally

Most developers just use `@EntityGraph` without understanding what Hibernate does under the hood. This section explains it layer by layer.

### 6.1 The Big Picture

When you write this:

```java
@EntityGraph(attributePaths = {"items"})
List<Order> findAll(Specification<Order> spec);
```

You are **not** writing SQL. You are giving Hibernate a **Fetch Plan** — a blueprint that says: *"when you build the query for this method, also bring these relationships along."*

> ℹ️ Hibernate takes that blueprint and **rewrites the SQL** before it even touches the database.

---

### 6.2 Step-by-Step Internal Flow

#### Step 1 — Spring Data reads the annotation at startup

When Spring Boot starts, Spring Data JPA scans all repository interfaces. When it sees `@EntityGraph`, it stores the attribute paths against that method:

```
Method: findAll(Specification<Order> spec)
EntityGraph paths: ["items"]
// Stored in memory — no DB call yet
```

#### Step 2 — You call the method at runtime

```java
orderRepository.findAll(spec)
```

Spring Data JPA intercepts this call. Before building the query, it checks: *Does this method have an `@EntityGraph` attached?*

Yes — so it passes the fetch plan to Hibernate as a **query hint**:

```java
query.setHint("jakarta.persistence.fetchgraph", entityGraph);
```

#### Step 3 — Hibernate rewrites the SQL

Without `@EntityGraph`, Hibernate generates:

```sql
SELECT o.*
FROM orders o
WHERE <spec conditions>
-- items are NOT joined — will be loaded lazily, one by one
```

With `@EntityGraph`, Hibernate rewrites it to:

```sql
SELECT o.*, oi.*
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE <spec conditions>
-- everything loaded in ONE shot
```

> ✅ The key thing: **Hibernate rewrites the SQL automatically** — you don't have to write the JOIN yourself.

#### Step 4 — Hibernate maps the ResultSet into objects

After the single query runs, Hibernate gets back one flat row with all columns joined together. It hydrates the object graph:

```
ResultSet row:
[ order_id | customer_name | item_id | product_name | quantity ]

Hibernate builds:
Order {
    id = ...
    customerName = ...
    items = [
        OrderItem { id=..., productName="Book", quantity=2 },  ← already populated
        OrderItem { id=..., productName="Pen",  quantity=5 }   ← already populated
    ]
}
```

All relationships are stored in the **L1 (Session) cache**. When your mapper later accesses `order.getItems()`, Hibernate finds it already loaded — no DB call fires.

#### Step 5 — Proxy objects are bypassed

Normally with `FetchType.LAZY`, Hibernate wraps relationships in proxy objects. When `@EntityGraph` is active, Hibernate **skips proxy creation** for those paths entirely. It puts the real, fully initialized object directly into the field.

---

### 6.3 Full Internal Flow Diagram

```
Your code calls findAll(spec)
        │
        ▼
Spring Data JPA intercepts
Checks: does this method have @EntityGraph?
        │ Yes
        ▼
Builds JPA EntityGraph object from attributePaths
Sets query hint: jakarta.persistence.fetchgraph
        │
        ▼
Hibernate Query Builder receives hint
Reads the fetch plan
Adds LEFT JOINs for each path into the SQL
        │
        ▼
Single SQL query fires against DB
ResultSet contains columns from all joined tables
        │
        ▼
Hibernate hydrates the Order objects
Populates items with real objects — no proxies
Stores in L1 (Session) cache
        │
        ▼
Mapper accesses order.getItems()
Hibernate checks L1 cache → already there
No DB call fires
        │
        ▼
OrderResponseDto returned — clean!
```

---

### 6.4 Two Modes — FETCH vs LOAD

`@EntityGraph` has a `type` attribute you rarely see but should know:

```java
// Default mode — FETCH graph
@EntityGraph(attributePaths = {"items"}, type = EntityGraph.EntityGraphType.FETCH)

// Alternative — LOAD graph
@EntityGraph(attributePaths = {"items"}, type = EntityGraph.EntityGraphType.LOAD)
```

| Mode | Paths You Listed | Paths You Did NOT List |
|------|-----------------|------------------------|
| **FETCH** (default) | Loaded eagerly | Forced LAZY regardless of entity config |
| **LOAD** | Loaded eagerly | Respect entity's own `FetchType` setting |

So if your `Order` entity has `FetchType.EAGER` on some field, and you use `FETCH` graph without listing that field — it will be loaded **lazily anyway**. `FETCH` overrides everything.

`LOAD` is safer when you have a mix of EAGER/LAZY on your entity and you only want to add specific paths on top.

> ✅ In production, **always use the default `FETCH` mode** and be explicit about what you need. Avoid relying on `EAGER` on entities — it leads to over-fetching.

---

### 6.5 What @EntityGraph Does NOT Do

- **Does NOT cache across requests** — every call runs a fresh JOIN query. It is a per-query instruction, not a persistent cache.

- **Does NOT prevent in-memory pagination** — joining a collection with `LIMIT` causes Hibernate to paginate in memory. Use the two-query pattern for this.

- **Does NOT work transitively by default** — you must be explicit about nested levels.

Example of explicit nested paths:

```java
// WRONG — only loads items, not the product inside each item
@EntityGraph(attributePaths = {"items"})

// CORRECT — explicitly go one level deeper
@EntityGraph(attributePaths = {
    "items",
    "items.product",           // load the Product inside each OrderItem
    "items.product.category"   // and the Category inside each Product
})
```

---

## 7. FetchType.EAGER vs @EntityGraph

### FetchType.EAGER — Global Rule

`EAGER` set on the entity affects **every single query, everywhere, forever**.

```java
// Order.java — EAGER set on entity
@OneToMany(fetch = FetchType.EAGER)  // ← affects ALL queries
private List<OrderItem> items;

// Now EVERY query on Order loads items — whether you need them or not:
orderRepository.findById(id);          // loads items — you needed it ✔
orderRepository.findByCustomerId();    // loads items — you didn't need it ✘
orderRepository.existsById(id);        // loads items — wasteful ✘
orderRepository.count();               // loads items — pointless ✘
```

### @EntityGraph — Per-Method Rule

Only the specific method gets the JOIN. Everything else stays lean.

```java
// Entity stays LAZY — safe default
@OneToMany(fetch = FetchType.LAZY)
private List<OrderItem> items;

// Only THIS method joins items
@EntityGraph(attributePaths = {"items"})
Optional<Order> findById(Long id);

// Result:
orderRepository.findById(id);          // loads items — you asked for it ✔
orderRepository.findByCustomerId();    // does NOT load items — lean ✔
orderRepository.existsById(id);        // does NOT load items — lean ✔
orderRepository.count();               // does NOT load items — lean ✔
```

> ✅ **One-line summary:** `FetchType.EAGER` is a blunt hammer — hits every query. `@EntityGraph` is a scalpel — only cuts where you aim it. **Always keep entities `LAZY` by default** and use `@EntityGraph` surgically where needed.

---

## 8. Production Checklist

Enable SQL logging during development to catch N+1 early:

```properties
# application.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Even better — use the **p6spy** library to detect N+1 automatically:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.github.gavlyukovskiy</groupId>
    <artifactId>p6spy-spring-boot-starter</artifactId>
    <version>1.9.0</version>
</dependency>
```

> ✅ p6spy logs every query with full SQL and parameter values. It is the **industry standard** for catching N+1 in Spring Boot projects before they hit production.

### Quick Reference Checklist

- Enable `show-sql=true` in development **only** — never in production
- Add p6spy for automatic N+1 detection with full query logs
- Keep all entities `LAZY` by default
- Use `@EntityGraph` surgically per method
- Override both `findAll(spec)` and `findAll(spec, pageable)` if using Specifications
- Use the two-query pattern for paginated queries that need collections
- Consider disabling OSIV (`spring.jpa.open-in-view=false`) to catch lazy loading issues early


---



