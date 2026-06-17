
---


## What is the N+1 Problem?

Imagine you run a school. You have 10 classes. You want to find all students in every class.

A naive approach would be:

1. First query: fetch all 10 classes → **1 query**
2. Then for each class, fetch its students → **10 more queries**

Total = **1 + 10 = 11 queries**. This is the N+1 problem. Instead of 1 smart query, you fire N+1 dumb queries.

In a real app with 1000 orders, you'd fire **1001 queries**. That kills performance.

---

## Step 1 — Set Up the Domain

Let's model a real e-commerce scenario: **Orders and their Items**.

## Step 2 — Reproduce the Problem

**Entity classes:**

```java
// Order.java
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    // LAZY is default — Hibernate will NOT load items until accessed
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> items;

    // getters and setters
}
```

```java
// OrderItem.java
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
    private Order order;

    // getters and setters
}
```

**Repository:**

```java
// OrderRepository.java
public interface OrderRepository extends JpaRepository<Order, Long> {
    // No special query — just the default findAll()
}
```

**Service — where the N+1 happens:**

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
            // Each line below fires a NEW query:
            // SELECT * FROM order_items WHERE order_id = ?
            // This runs once per order → N extra queries
            List<OrderItem> items = order.getItems();
            System.out.println(order.getCustomerName() + " → " + items.size() + " items");
        }
    }
}
```

**What you'll see in your logs** (with `spring.jpa.show-sql=true`):

```sql
-- Query 1
Hibernate: select * from orders

-- Query 2 (for Order #1)
Hibernate: select * from order_items where order_id = 1

-- Query 3 (for Order #2)
Hibernate: select * from order_items where order_id = 2

-- Query 4 (for Order #3)
Hibernate: select * from order_items where order_id = 3

-- ...and so on for every single order
```

If you have 500 orders → **501 queries** hit the database.

---

## Step 3 — Fix It (3 Ways, Production Level)

### Fix 1 — JOIN FETCH in JPQL (most common fix)

This tells Hibernate: "Fetch orders AND their items in a single SQL JOIN."

```java
// OrderRepository.java
public interface OrderRepository extends JpaRepository<Order, Long> {

    // JOIN FETCH forces Hibernate to load items in ONE query
    @Query("SELECT o FROM Order o JOIN FETCH o.items")
    List<Order> findAllWithItems();
}
```

**What Hibernate now runs:**

```sql
-- Just ONE query instead of N+1
SELECT o.*, oi.*
FROM orders o
INNER JOIN order_items oi ON oi.order_id = o.id
```

**Service update:**

```java
public void printAllOrders() {
    // One query, items already loaded — no extra hits to DB
    List<Order> orders = orderRepository.findAllWithItems();

    for (Order order : orders) {
        // No new query here — data is already in memory
        System.out.println(order.getCustomerName() + " → " + order.getItems().size());
    }
}
```

> **Production tip:** Use `JOIN FETCH` for small-to-medium result sets. Be careful — if both sides of the join have multiple rows, you can get a Cartesian product. Use `DISTINCT` to avoid duplicates: `SELECT DISTINCT o FROM Order o JOIN FETCH o.items`.

---

### Fix 2 — `@EntityGraph` (cleaner, no raw JPQL)

`@EntityGraph` is Spring Data JPA's cleaner way to say "load this relationship eagerly for this specific query only."

```java
// OrderRepository.java
public interface OrderRepository extends JpaRepository<Order, Long> {

    // attributePaths tells JPA: also load the "items" collection
    @EntityGraph(attributePaths = {"items"})
    List<Order> findAll(); // overrides default findAll() behavior
}
```

No raw SQL, no JPQL — just an annotation. Hibernate handles the JOIN automatically.

> **Production tip:** `@EntityGraph` is preferred over changing `FetchType.EAGER` on the entity itself, because EAGER permanently affects every query on that entity. `@EntityGraph` only applies to this specific repository method.

---

### Fix 3 — Batch Size (for deeply nested graphs)

Sometimes you have chains like `Order → Items → Product → Category`. JOIN FETCH on all of them leads to complex queries. Instead, use **batch fetching** — Hibernate fetches related entities in batches of N, not one-by-one.

```java
// Order.java
@Entity
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    // Instead of 1 query per order, Hibernate batches:
    // SELECT * FROM order_items WHERE order_id IN (1, 2, 3, 4, 5...)
    @BatchSize(size = 50)
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> items;
}
```

Or you can set it globally in `application.properties`:

```properties
# Fetches lazy collections in batches of 50 instead of 1-by-1
spring.jpa.properties.hibernate.default_batch_fetch_size=50
```

Instead of 500 queries, you now get roughly **500 / 50 = 10 queries**. Not perfect, but much better for complex object graphs.

---

## Which Fix to Use When?

|Scenario|Best Fix|
|---|---|
|Simple parent + children, one level deep|`JOIN FETCH` with `DISTINCT`|
|Same, but you prefer clean code over JPQL|`@EntityGraph`|
|Deep object graphs (3+ levels)|`@BatchSize` globally|
|DTO projection (only need specific fields)|JPQL with `new DTO(...)` constructor — avoids loading entities at all|

---

## Production Checklist

Enable SQL logging during development to catch N+1 early:

```properties
# application.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Even better — use this library to detect N+1 automatically
# Add to pom.xml: com.github.gavlyukovskiy:p6spy-spring-boot-starter
```

The **p6spy** library logs every query with the full SQL and parameter values — industry standard for catching N+1 in Spring Boot projects before they hit production.

---




---

## The Problem with `findAll(spec)`

You're using a **JPA Specification** (for dynamic filtering). That makes it slightly different from plain `findAll()`.

If you just override `findAll()` with `@EntityGraph`, it won't catch the `Specification` variant because they are **different method signatures**:

```java
findAll()                    // no spec
findAll(Specification spec)  // different method — EntityGraph won't apply
```

---

## The Fix — `@EntityGraph` on the Specification variant

You need to extend `JpaSpecificationExecutor` and override the spec-based method:

```java
// TicketRepository.java
public interface TicketRepository extends JpaRepository<Ticket, UUID>,
                                          JpaSpecificationExecutor<Ticket> {

    // This covers findById — as you already have
    @EntityGraph(attributePaths = {
        "application",
        "raisedBy",
        "assignedTo"
    })
    @Override
    Optional<Ticket> findById(UUID id);

    // This covers findAll(spec) used in listing APIs
    @EntityGraph(attributePaths = {
        "application",
        "raisedBy",
        "assignedTo"
    })
    @Override
    List<Ticket> findAll(Specification<Ticket> spec);
}
```

Now both calls are covered with a single JOIN query each.

---

## But You Likely Use Pagination Too

In production listing APIs, you almost never return a raw `List` — you paginate. So you probably also have or will have:

```java
Page<Ticket> tickets = ticketRepository.findAll(spec, pageable);
```

Cover that too:

```java
@EntityGraph(attributePaths = {
    "application",
    "raisedBy",
    "assignedTo"
})
@Override
Page<Ticket> findAll(Specification<Ticket> spec, Pageable pageable);
```

---

## Warning — Pagination + Collection Joins is a Trap

This is a **critical production issue** many developers miss.

If your `Ticket` has a collection relationship — say `List<TicketAssignment> assignmentHistory` — and you add it to `@EntityGraph` on a **paginated** query, Hibernate will log this warning:

```
HHH90003004: firstResult/maxResults specified with collection fetch; 
applying in memory
```

This means Hibernate **fetches ALL rows into memory first**, then applies `LIMIT` in Java — not in SQL. On a large table, this is dangerous.

```java
// DANGEROUS — if assignmentHistory is a collection
@EntityGraph(attributePaths = {
    "application",      // single-valued — safe
    "raisedBy",         // single-valued — safe
    "assignedTo",       // single-valued — safe
    "assignmentHistory" // collection — DANGEROUS with pagination
})
Page<Ticket> findAll(Specification<Ticket> spec, Pageable pageable);
```

---

## Production-Safe Pattern for Paginated Lists with Collections

Split it into **two queries**:

```java
// TicketRepository.java

// Query 1 — paginate cleanly, only fetch single-valued relations
@EntityGraph(attributePaths = {
    "application",
    "raisedBy",
    "assignedTo"
})
@Override
Page<Ticket> findAll(Specification<Ticket> spec, Pageable pageable);
```

```java
// Query 2 — after pagination, load collections in batch for the result page only
@EntityGraph(attributePaths = {
    "assignmentHistory",
    "assignmentHistory.assignedTo",
    "assignmentHistory.assignedBy",
    "statusHistory",
    "statusHistory.changedBy"
})
@Query("SELECT t FROM Ticket t WHERE t.id IN :ids")
List<Ticket> findAllWithHistoryByIds(@Param("ids") List<UUID> ids);
```

Then in your service:

```java
@Transactional(readOnly = true)
public Page<TicketResponseDto> getAllTickets(Specification<Ticket> spec, Pageable pageable) {

    // Step 1 — paginate with safe single-valued joins
    Page<Ticket> ticketPage = ticketRepository.findAll(spec, pageable);

    // Step 2 — extract ids from this page only (e.g. 20 ids)
    List<UUID> ids = ticketPage.getContent()
                               .stream()
                               .map(Ticket::getId)
                               .toList();

    // Step 3 — fetch collections only for this page's tickets
    // This fires ONE query with WHERE id IN (...)
    List<Ticket> ticketsWithHistory = ticketRepository.findAllWithHistoryByIds(ids);

    // Step 4 — build a lookup map and merge
    Map<UUID, Ticket> enriched = ticketsWithHistory.stream()
                                                   .collect(Collectors.toMap(Ticket::getId, t -> t));

    // Step 5 — map to DTOs using enriched data
    List<TicketResponseDto> dtos = ticketPage.getContent()
                                             .stream()
                                             .map(t -> ticketMapper.toResponseDto(
                                                     enriched.getOrDefault(t.getId(), t)))
                                             .toList();

    return new PageImpl<>(dtos, pageable, ticketPage.getTotalElements());
}
```

---

## Summary — What to Apply Where

|Method|Has Collections in DTO?|Fix|
|---|---|---|
|`findById(id)`|No|`@EntityGraph` with single-valued paths|
|`findAll(spec)`|No|`@EntityGraph` override for Specification variant|
|`findAll(spec, pageable)`|No|`@EntityGraph` override — safe|
|`findAll(spec, pageable)`|Yes|Two-query pattern — paginate first, load collections second|


---

Great question. Most developers just use `@EntityGraph` without understanding what Hibernate does under the hood. Let me break it down layer by layer.

---

## The Big Picture

When you write this:

```java
@EntityGraph(attributePaths = {"application", "raisedBy", "assignedTo"})
Optional<Ticket> findById(UUID id);
```

You are not writing SQL. You are giving Hibernate a **fetch plan** — a blueprint that says _"when you build the query for this method, also bring these relationships along."_

Hibernate takes that blueprint and changes how it constructs the SQL before it even touches the database.

---

## Step by Step — What Happens Internally

### Step 1 — Spring Data reads the annotation at startup

When your Spring Boot app starts, Spring Data JPA scans all repository interfaces. When it sees `@EntityGraph`, it stores the attribute paths against that method.

It creates a `JpaEntityGraph` object internally:

```
Method: findById
EntityGraph paths: ["application", "raisedBy", "assignedTo"]
```

This is stored in memory — no DB call yet.

---

### Step 2 — You call the method at runtime

```java
ticketRepository.findById(id)
```

Spring Data JPA intercepts this call. Before building the query, it checks: _"Does this method have an `@EntityGraph` attached?"_

Yes — so it takes the stored fetch plan and passes it to the JPA layer as a **query hint**.

Specifically it sets this hint on the query:

```java
query.setHint("jakarta.persistence.fetchgraph", entityGraph);
```

---

### Step 3 — Hibernate receives the fetch graph hint

This is where the real work happens. Hibernate's query builder reads the fetch graph and changes the SQL it was about to generate.

**Without `@EntityGraph`**, Hibernate generates:

```sql
SELECT t.*
FROM tickets t
WHERE t.id = ?
-- application, raisedBy, assignedTo are NOT joined
-- they will be loaded later, lazily, one by one
```

**With `@EntityGraph`**, Hibernate sees the fetch plan and generates:

```sql
SELECT t.*, a.*, rb.*, at.*
FROM tickets t
LEFT JOIN applications a  ON a.id = t.application_id
LEFT JOIN users rb         ON rb.id = t.raised_by_id
LEFT JOIN users at         ON at.id = t.assigned_to_id
WHERE t.id = ?
-- everything loaded in one shot
```

The key thing: **Hibernate rewrites the SQL, not you.**

---

### Step 4 — Hibernate maps the ResultSet into objects

After the single query runs, Hibernate gets back one flat row with columns from all 4 tables joined together.

It then hydrates the object graph:

```
ResultSet row:
[ ticket_id | ticket_title | app_id | app_name | rb_id | rb_name | at_id | at_name ]

Hibernate builds:
Ticket {
    id = ...
    title = ...
    application = Application { id=..., appName=... }  ← already populated
    raisedBy    = User { id=..., name=... }             ← already populated
    assignedTo  = User { id=..., name=... }             ← already populated
}
```

All relationships are now in the **first-level cache (Session cache)**. When your mapper later accesses `ticket.getApplication()`, Hibernate finds it already loaded — no DB call fires.

---

### Step 5 — Proxy objects are bypassed

Normally with `FetchType.LAZY`, Hibernate wraps relationships in **proxy objects**:

```java
ticket.getApplication()
// returns a Proxy, not a real Application object
// actual DB call fires only when you call proxy.getId() or proxy.getAppName()
```

When `@EntityGraph` is active, Hibernate skips proxy creation for those paths. It puts the **real, fully initialized object** directly into the field. The proxy never exists for those relationships.

---

## Two Modes — `fetchgraph` vs `loadgraph`

`@EntityGraph` has a `type` attribute you rarely see but should know:

```java
// Default — FETCH graph
@EntityGraph(attributePaths = {"application", "raisedBy"}, 
             type = EntityGraph.EntityGraphType.FETCH)

// Alternative — LOAD graph
@EntityGraph(attributePaths = {"application", "raisedBy"}, 
             type = EntityGraph.EntityGraphType.LOAD)
```

The difference is subtle but important:

||`FETCH` (default)|`LOAD`|
|---|---|---|
|Paths you specify|Loaded eagerly|Loaded eagerly|
|Paths you did NOT specify|**Forced LAZY** regardless of entity config|**Respect entity's own FetchType**|

So if your `Ticket` entity has `FetchType.EAGER` on some field, and you use `FETCH` graph without listing that field — it will be loaded **lazily anyway**. `FETCH` overrides everything.

`LOAD` is safer when you have a mix of EAGER/LAZY on your entity and you only want to add specific paths on top.

In production, **always use the default `FETCH`** and be explicit about what you need. Avoid relying on EAGER on entities — it leads to over-fetching.

---

## What `@EntityGraph` Does NOT Do

This is equally important to understand:

**It does not cache across requests.** Every call to `findById` runs a fresh JOIN query. The fetch graph is a per-query instruction, not a persistent cache.

**It does not prevent N+1 on collections with pagination.** As discussed earlier — joining a collection with `LIMIT` causes in-memory pagination. `@EntityGraph` does not protect you from this automatically.

**It does not work transitively by default.** If you write:

```java
@EntityGraph(attributePaths = {"assignmentHistory"})
```

This loads the `assignmentHistory` list. But if each `TicketAssignment` inside that list has a lazy `assignedTo` user, those are **not** loaded. You have to be explicit:

```java
@EntityGraph(attributePaths = {
    "assignmentHistory",
    "assignmentHistory.assignedTo",  // you must go one level deeper explicitly
    "assignmentHistory.assignedBy"
})
```

---

## Full Internal Flow Visualized

```
Your code calls findById(id)
         │
         ▼
Spring Data JPA intercepts the call
Checks: does this method have @EntityGraph?
         │
         Yes
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
Hibernate hydrates the Ticket object
Populates application, raisedBy, assignedTo
with real objects — no proxies for these fields
         │
         ▼
Objects stored in Session (L1) cache
         │
         ▼
Mapper accesses ticket.getApplication()
Hibernate checks L1 cache → already there
No DB call fires
         │
         ▼
TicketResponseDto returned
```

---

## One Line Summary

`@EntityGraph` tells Hibernate to change its SQL generation for that specific method — turning what would have been multiple lazy proxy lookups into a single JOIN query — by passing a fetch plan as a query hint before execution.


---


## Tip 1 — Cartesian Product with JOIN FETCH

Imagine this data in your DB:

```
Order #1  →  Item A, Item B, Item C
Order #2  →  Item X, Item Y
```

When you do a SQL JOIN, the DB combines every order row with every item row:

```
Order #1  |  Item A
Order #1  |  Item B   ← Order #1 appears 3 times
Order #1  |  Item C
Order #2  |  Item X
Order #2  |  Item Y   ← Order #2 appears 2 times
```

**5 rows returned for 2 orders.** This is the Cartesian product — one row per combination.

Without `DISTINCT`, Hibernate maps this into:

```java
[Order#1, Order#1, Order#1, Order#2, Order#2]  // 5 objects, duplicates!
```

With `DISTINCT`:

```java
SELECT DISTINCT o FROM Order o JOIN FETCH o.items
```

Hibernate deduplicates in memory → you get back `[Order#1, Order#2]` — clean.

> The `DISTINCT` here is not really for SQL — it's a signal to Hibernate to deduplicate the Java objects. Hibernate 6+ does this automatically, but adding `DISTINCT` is still good practice for clarity.

---

## Tip 2 — `FetchType.EAGER` vs `@EntityGraph`

Think of it this way:

`FetchType.EAGER` on the entity is a **global rule** — it applies to every single query, everywhere, forever.

```java
// Order.java — EAGER set on entity
@OneToMany(fetch = FetchType.EAGER)  // ← affects ALL queries
private List<OrderItem> items;
```

Now **every** query on `Order` — whether you need items or not — will always JOIN and load items:

```java
orderRepository.findById(id);        // loads items — you needed it ✔
orderRepository.findByCustomerId();  // loads items — you didn't need it ✘
orderRepository.existsById(id);      // loads items — wasteful ✘
orderRepository.count();             // still loads items — pointless ✘
```

You have no control. EveWhat are the ways to solve this ry query becomes heavier.

---

`@EntityGraph` is a **per-method rule** — only that specific method gets the JOIN:

```java
// Entity stays LAZY — safe default
@OneToMany(fetch = FetchType.LAZY)
private List<OrderItem> items;

// Only THIS method joins items — everything else stays lean
@EntityGraph(attributePaths = {"items"})
Optional<Order> findById(UUID id);
```

```java
orderRepository.findById(id);        // loads items — you asked for it ✔
orderRepository.findByCustomerId();  // does NOT load items — lean ✔
orderRepository.existsById(id);      // does NOT load items — lean ✔
```

---

**One line summary:**

> `FetchType.EAGER` is a blunt hammer — hits every query. `@EntityGraph` is a scalpel — only cuts where you aim it. Always keep entities `LAZY` by default and use `@EntityGraph` surgically where needed.



---

## First — Understand How Hibernate Loads Data

When you do `findById(id)`, Hibernate does **not** immediately load every related object. Instead, it gives you **proxy objects** for relationships.

A proxy is a fake placeholder object that Hibernate creates:

```java
Ticket ticket = ticketRepository.findById(id).get();

// What you think you have:
ticket.getRaisedBy()  →  User { id=5, name="John", email="john@example.com" }

// What Hibernate actually gives you:
ticket.getRaisedBy()  →  UserProxy { id=5, name=null, email=null }
//                        ↑ fake object, real data not loaded yet
```

The proxy only has the **ID**. Everything else is empty. This is called **Lazy Loading** — Hibernate delays the DB call until you actually need the data.

---

## Why Does Hibernate Do This?

Because it doesn't know what you need. Consider this:

```java
// Maybe you only need the ticket title
String title = ticket.getTitle();  // No need to load raisedBy, assignedTo, application

// Maybe you need everything
ticket.getRaisedBy().getName();    // Now you need the user
```

If Hibernate eagerly loaded every relationship upfront, every `findById` would JOIN 5-6 tables even when you only needed one field. That would be wasteful.

So the default strategy is: **load nothing until touched.**

---

## Now — When Does the N+1 Actually Fire?

The proxy is smart. The moment you call **any field other than ID** on it, it fires a DB query:

```java
Ticket ticket = ticketRepository.findById(id).get();
// SQL 1: SELECT * FROM tickets WHERE id = ?
// Hibernate creates proxies for application, raisedBy, assignedTo

ticket.getRaisedBy().getId();     // ← proxy returns ID directly, NO query (ID already known)
ticket.getRaisedBy().getName();   // ← proxy doesn't have name → fires Query 2
ticket.getApplication().getId();  // ← proxy returns ID directly, NO query
ticket.getApplication().getName();// ← proxy doesn't have name → fires Query 3
ticket.getAssignedTo().getName(); // ← proxy doesn't have name → fires Query 4
```

This is exactly what happens inside your mapper:

```java
// TicketMapper — each source field access triggers a proxy lookup
@Mapping(target = "applicationId",   source = "application.id")      // ID only → no query
@Mapping(target = "applicationName", source = "application.appName") // name → Query 2 fires
@Mapping(target = "raisedBy",        source = "raisedBy")            // accesses user → Query 3 fires
@Mapping(target = "assignedTo",      source = "assignedTo")          // accesses user → Query 4 fires
```

**The mapper didn't cause the problem. Hibernate's lazy proxy did.** The mapper just happened to be the place where the proxies were first touched.

---

## Why Does This Happen in Spring Boot Specifically

This is the important part. This problem exists because of how Spring Boot configures the **Hibernate Session lifecycle**.

### The Session is the key

A Hibernate **Session** is the object that:

- Holds the DB connection
- Manages the L1 cache
- Keeps proxies alive and able to fire queries

Proxies can only fire queries **while the Session is open.**

### Spring Boot's default — Open Session in View

By default, Spring Boot enables a pattern called **Open Session in View (OSIV)**:

```properties
# This is TRUE by default in Spring Boot
spring.jpa.open-in-view=true
```

What this means:

```
HTTP Request comes in
        │
        ▼
Session OPENS  ←─────────────────────────────────┐
        │                                         │
        ▼                                         │
Controller → Service → Repository                 │
        │                                         │  Session stays
        ▼                                         │  open the whole
Hibernate loads Ticket (proxies created)          │  time
        │                                         │
        ▼                                         │
Mapper accesses proxy fields                      │
Proxy fires lazy queries ← SESSION STILL OPEN ───┘
        │
        ▼
Response sent to client
        │
        ▼
Session CLOSES
```

Because the session stays open all the way through the mapper and even into the view layer, **lazy loading works anywhere** — in service, in mapper, even in your Thymeleaf template if you use one.

This is why you don't get a `LazyInitializationException`. The session is still alive when the mapper touches the proxy.

**But this is also why N+1 silently sneaks in.** You never notice it because everything "works fine" — it's just firing hidden queries behind the scenes.

### If OSIV is disabled

```properties
spring.jpa.open-in-view=false
```

Now the session closes as soon as the `@Transactional` method ends:

```
@Transactional method starts → Session OPENS
        │
        ▼
findById → Ticket loaded, proxies created
        │
        ▼
@Transactional method ends → Session CLOSES
        │
        ▼
Mapper accesses proxy.getName()
Session is CLOSED → proxy cannot fire query
        │
        ▼
💥 LazyInitializationException
```

With OSIV off, your app breaks loudly at the proxy access — which actually **forces you to fix N+1 properly.** Many production teams disable OSIV intentionally for this reason.

---

## The Full Picture in One Flow

```
Spring Boot starts
Hibernate sees @OneToMany, @ManyToOne
Sets them as LAZY by default
                │
                ▼
findById(id) called
Hibernate fires: SELECT * FROM tickets WHERE id = ?
Creates Ticket object
For each relationship → creates a Proxy (empty shell with just ID)
                │
                ▼
OSIV keeps Session open
                │
                ▼
Mapper runs toResponseDto(ticket)
Accesses ticket.getApplication().getAppName()
                │
                ▼
Hibernate checks: is Application loaded?
No → fires SELECT * FROM applications WHERE id = ?
                │
                ▼
Accesses ticket.getRaisedBy().getName()
Hibernate checks: is User loaded?
No → fires SELECT * FROM users WHERE id = ?
                │
                ▼
Accesses ticket.getAssignedTo().getName()
No → fires SELECT * FROM users WHERE id = ?
                │
                ▼
Total: 4 queries for 1 ticket
In a list of 100 tickets → 301 queries
```

---

## Why You Specifically Saw 3 Extra Queries

Your `TicketResponseDto` maps exactly these 3 lazy relationships:

```java
application.appName   → lazy proxy → Query 2
raisedBy.name         → lazy proxy → Query 3
assignedTo.name       → lazy proxy → Query 4
```

`application.id`, `raisedBy.id`, `assignedTo.id` — these don't fire queries because **Hibernate stores the FK id inside the Ticket row itself.** The proxy already knows the ID without going to DB.

That is precisely why you saw **3 extra queries**, not 6.

---

## One Line Summary

> Spring Boot keeps the Hibernate Session open by default (OSIV), which allows lazy proxies to silently fire individual DB queries whenever any non-ID field is accessed — this is why N+1 hides itself so well and only shows up when you check your SQL logs. 
