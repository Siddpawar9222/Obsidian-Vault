

---

## Categories of JPA Annotations

| Category | What It Does |
|---|---|
| Entity & Table | Maps class to DB table |
| Primary Key | Defines and generates IDs |
| Column Mapping | Maps fields to columns |
| Relationships | Links between tables (OneToMany, etc.) |
| Fetch & Cascade | Controls loading and propagation |
| Lifecycle Hooks | Runs code before/after DB operations |
| Locking & Versioning | Prevents data conflicts |
| Inheritance | Maps class hierarchies to tables |
| Auditing | Tracks created/updated timestamps |
| Queries | Named queries and native SQL |

---

## 1. Entity & Table Annotations

### `@Entity`

Marks a Java class as a JPA entity — meaning it maps to a database table.

```java
@Entity
public class Employee {
    // fields...
}
```

Every class you want to persist in the DB **must** have `@Entity`.

---

### `@Table`

Specifies the exact table name and schema in the database.

```java
@Entity
@Table(
    name = "employees",
    schema = "hr_schema",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email"})
    },
    indexes = {
        @Index(name = "idx_emp_dept", columnList = "department_id")
    }
)
public class Employee {
    // fields...
}
```

**When to use it:** Always in production. Without it, JPA uses the class name as the table name, which can cause issues in multi-schema databases.

**Real-world use:** In a multi-tenant SaaS app, each tenant might have their own schema — `@Table(schema = "tenant_1")`.

---

## 2. Primary Key Annotations

### `@Id`

Marks a field as the **primary key** of the table.

```java
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    private Long id;
}
```

---

### `@GeneratedValue`

Tells JPA how to **auto-generate** the primary key.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

| Strategy | How It Works | Use When |
|---|---|---|
| `IDENTITY` | DB auto-increments (e.g., MySQL `AUTO_INCREMENT`) | MySQL, PostgreSQL (SERIAL) |
| `SEQUENCE` | Uses a DB sequence object | PostgreSQL, Oracle (best for batch inserts) |
| `TABLE` | Uses a special table to track IDs | Portable but slow — avoid in production |
| `AUTO` | JPA picks the strategy | Not recommended — unpredictable |
| `UUID` | Generates a UUID | Distributed systems, microservices |

---

### `@SequenceGenerator` + `@GeneratedValue(SEQUENCE)`

In production PostgreSQL apps, we almost always use sequences because they are **faster than IDENTITY** for bulk inserts.

```java
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(
        name = "order_seq",
        sequenceName = "order_id_seq",   // actual sequence name in DB
        allocationSize = 50              // fetches 50 IDs at once — improves performance
    )
    private Long id;
}
```

**`allocationSize = 50`** means Hibernate reserves 50 IDs in memory at once, so it doesn't call the DB for every insert. This is a common production optimization.

---

### `@UuidGenerator` (Hibernate 6+)

Used in microservices where IDs must be globally unique across services.

```java
@Id
@UuidGenerator
private UUID id;
```

---

## 3. Column Mapping Annotations

### `@Column`

Maps a field to a specific column in the table, with detailed configuration.

```java
@Column(
    name = "full_name",       // column name in DB
    nullable = false,          // NOT NULL constraint
    length = 100,              // VARCHAR(100)
    unique = false,
    updatable = true,
    insertable = true
)
private String fullName;
```

| Attribute | Meaning |
|---|---|
| `name` | Column name in DB |
| `nullable` | Allows NULL or not |
| `length` | Max length for String fields |
| `unique` | Unique constraint on column |
| `updatable = false` | Column cannot be changed after insert |
| `insertable = false` | Column is excluded during insert |

**Production tip:** Always set `nullable = false` for required fields. Let the DB enforce constraints too — don't rely only on Java validation.

---

### `@Basic`

Controls how a field is loaded. Rarely needed explicitly, but good to know.

```java
@Basic(fetch = FetchType.LAZY)
@Lob
private byte[] profilePicture;   // load image only when accessed
```

---

### `@Lob`

Marks a field as a Large Object — for storing large text (CLOB) or binary data (BLOB).

```java
@Lob
@Column(name = "resume_content")
private String resumeContent;    // maps to CLOB in DB

@Lob
@Column(name = "profile_photo")
private byte[] profilePhoto;     // maps to BLOB in DB
```

**Real-world use:** Storing PDF content, images, or large JSON blobs.

---

### `@Transient`

Tells JPA to **ignore this field** — it will not be saved to the database.

```java
@Transient
private String displayName;   // computed at runtime, not stored in DB
```

**Real-world use:** Fields you compute on-the-fly like `getFullName()` combining firstName + lastName.

---

### `@Enumerated`

Maps a Java `enum` to a DB column.

```java
public enum EmployeeStatus {
    ACTIVE, INACTIVE, ON_LEAVE
}

@Enumerated(EnumType.STRING)     // stores "ACTIVE", not 0, 1, 2
@Column(name = "status", nullable = false)
private EmployeeStatus status;
```

**Always use `EnumType.STRING`** in production. Using `ORDINAL` (default) is dangerous — if you reorder your enum values, old DB data becomes wrong.

---

### `@Temporal` (Legacy — for `java.util.Date`)

Maps `java.util.Date` or `java.util.Calendar` to a DB date/time column.

```java
@Temporal(TemporalType.TIMESTAMP)
@Column(name = "created_at")
private Date createdAt;
```

> **Modern approach:** Use `java.time.LocalDate`, `LocalDateTime` instead. They map automatically without `@Temporal`.

```java
private LocalDateTime createdAt;    // no annotation needed in modern JPA
```

---

### `@Embedded` and `@Embeddable`

Used to group related fields into a separate class and **embed** them into the same table.

```java
@Embeddable
public class Address {
    private String street;
    private String city;
    private String pincode;
}

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "home_street")),
        @AttributeOverride(name = "city",   column = @Column(name = "home_city"))
    })
    private Address homeAddress;
}
```

**Real-world use:** Address, Money (amount + currency), GeoLocation — reusable value objects.

---

## 4. Relationship Annotations

### `@OneToMany` + `@ManyToOne`

The most common relationship. One `Department` has many `Employees`.

```java
@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // One Department → Many Employees
    @OneToMany(
        mappedBy = "department",        // field in Employee that owns the FK
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,         // ALWAYS use LAZY for collections
        orphanRemoval = true            // if Employee removed from list, delete from DB
    )
    private List<Employee> employees = new ArrayList<>();

    // Helper method — always add this for bidirectional relationships
    public void addEmployee(Employee employee) {
        employees.add(employee);
        employee.setDepartment(this);
    }

    public void removeEmployee(Employee employee) {
        employees.remove(employee);
        employee.setDepartment(null);
    }
}

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many Employees → One Department
    @ManyToOne(fetch = FetchType.LAZY)   // always LAZY
    @JoinColumn(
        name = "department_id",           // FK column in employees table
        nullable = false
    )
    private Department department;
}
```

**Key rules:**
- `mappedBy` is on the parent side (no FK column here)
- `@JoinColumn` is on the child side (this is where the FK lives)
- Always use `FetchType.LAZY` for both — `EAGER` causes N+1 query problems in production

---

### `@OneToOne`

One entity maps to exactly one other entity.

```java
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JoinColumn(name = "passport_id", unique = true)
    private Passport passport;
}

@Entity
@Table(name = "passports")
public class Passport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "passport")
    private Employee employee;
}
```

---

### `@ManyToMany`

Many employees can belong to many projects.

```java
@Entity
@Table(name = "employees")
public class Employee {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "employee_projects",           // name of the join table
        joinColumns = @JoinColumn(name = "employee_id"),
        inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Set<Project> projects = new HashSet<>();
}

@Entity
@Table(name = "projects")
public class Project {

    @ManyToMany(mappedBy = "projects")
    private Set<Employee> employees = new HashSet<>();
}
```

**Production tip:** Use `Set` instead of `List` for `@ManyToMany` to avoid the Hibernate "delete all + re-insert" problem.

---

### `@JoinColumn`

Defines the **Foreign Key column** in the owning entity's table.

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(
    name = "department_id",          // FK column name in this table
    referencedColumnName = "id",     // PK column in the referenced table
    nullable = false,
    foreignKey = @ForeignKey(name = "fk_employee_department")   // named FK constraint
)
private Department department;
```

**Always name your FK constraints** in production — it makes error messages and DB migrations readable.

---

## 5. Fetch & Cascade

### `FetchType.LAZY` vs `FetchType.EAGER`

| | LAZY | EAGER |
|---|---|---|
| Loads data | Only when you access the field | Always, even if you don't need it |
| Performance | Better for production | Can cause N+1 and memory issues |
| Default for | `@OneToMany`, `@ManyToMany` | `@ManyToOne`, `@OneToOne` |
| When to override | Rarely | Almost never — use JPQL JOIN FETCH instead |

**Production rule:** Always use `FetchType.LAZY`. Load related data explicitly with `JOIN FETCH` in queries when needed.

---

### `CascadeType`

Tells JPA what to do to the related entity when you do something to the parent.

```java
@OneToMany(cascade = CascadeType.ALL)
private List<OrderItem> items;
```

| CascadeType | What Happens |
|---|---|
| `PERSIST` | Saving parent also saves children |
| `MERGE` | Updating parent also updates children |
| `REMOVE` | Deleting parent also deletes children |
| `REFRESH` | Refreshing parent also refreshes children |
| `DETACH` | Detaching parent also detaches children |
| `ALL` | All of the above |

**Production tip:**
- Use `CascadeType.ALL` only on `@OneToMany` where children have no meaning without parent (e.g., `OrderItem` without `Order`)
- Never use `CascadeType.REMOVE` on `@ManyToMany` — you'll delete shared entities

---

## 6. Lifecycle Hooks (Callback Annotations)

These run your code **automatically** at certain points in the entity's lifecycle.

```java
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;

    @PrePersist
    public void beforeInsert() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void beforeUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PostPersist
    public void afterInsert() {
        System.out.println("Order saved with ID: " + this.id);
        // send event, update cache, etc.
    }

    @PreRemove
    public void beforeDelete() {
        System.out.println("Order is about to be deleted: " + this.id);
        // audit log, cleanup, etc.
    }
}
```

| Annotation | When It Runs |
|---|---|
| `@PrePersist` | Before first insert to DB |
| `@PostPersist` | After first insert to DB |
| `@PreUpdate` | Before an update |
| `@PostUpdate` | After an update |
| `@PreRemove` | Before deletion |
| `@PostRemove` | After deletion |
| `@PostLoad` | After entity is loaded from DB |

**Real-world use:** Auto-setting `createdAt`, `updatedAt`, writing audit logs, sending events.

---

## 7. Versioning & Optimistic Locking

### `@Version`

Prevents **lost updates** when two users update the same record at the same time.

```java
@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal balance;

    @Version
    private Long version;   // JPA manages this automatically
}
```

**How it works:**
1. User A reads account — version = 1
2. User B reads account — version = 1
3. User A updates — version becomes 2
4. User B tries to update — JPA sees version is now 2, not 1 → throws `OptimisticLockException`

This is called **optimistic locking** — assume no conflict, but check before committing.

**Real-world use:** Bank transactions, inventory updates, ticket booking systems.

---

## 8. Named Queries

### `@NamedQuery` and `@NamedNativeQuery`

Pre-defined, reusable JPQL or SQL queries at the entity level. They are **validated at startup** — typos are caught immediately.

```java
@Entity
@Table(name = "employees")
@NamedQueries({
    @NamedQuery(
        name = "Employee.findByDepartment",
        query = "SELECT e FROM Employee e WHERE e.department.id = :deptId AND e.status = :status"
    ),
    @NamedQuery(
        name = "Employee.findActiveCount",
        query = "SELECT COUNT(e) FROM Employee e WHERE e.status = 'ACTIVE'"
    )
})
@NamedNativeQuery(
    name = "Employee.findByCustomSQL",
    query = "SELECT * FROM employees WHERE department_id = ? AND ROWNUM <= 10",
    resultClass = Employee.class
)
public class Employee {
    // ...
}
```

Usage in repository:
```java
TypedQuery<Employee> query = em.createNamedQuery("Employee.findByDepartment", Employee.class);
query.setParameter("deptId", 10L);
query.setParameter("status", EmployeeStatus.ACTIVE);
List<Employee> employees = query.getResultList();
```

---

## 9. Inheritance Mapping

When you have a class hierarchy, JPA gives you three strategies to map it to the DB.

```java
public abstract class Vehicle { }
public class Car extends Vehicle { }
public class Truck extends Vehicle { }
```

### Strategy 1: `SINGLE_TABLE` (default)

All classes stored in **one table** with a discriminator column.

```java
@Entity
@Table(name = "vehicles")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "vehicle_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}

@Entity
@DiscriminatorValue("CAR")
public class Car extends Vehicle {
    private int numberOfDoors;
}

@Entity
@DiscriminatorValue("TRUCK")
public class Truck extends Vehicle {
    private double payloadCapacity;
}
```

| Strategy | Pros | Cons | Use When |
|---|---|---|---|
| `SINGLE_TABLE` | Fast queries, simple | Many nullable columns | Shallow hierarchy, performance matters |
| `JOINED` | Normalized DB, no nulls | Joins needed | Deep hierarchy, clean schema required |
| `TABLE_PER_CLASS` | Each class fully independent | No polymorphic queries | Rarely used in production |

---

## 10. Auditing Annotations (Spring Data JPA)

Spring Data JPA provides built-in auditing annotations. Add `@EnableJpaAuditing` to your config class.

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig { }
```

```java
@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)   // required for auditing to work
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;
}
```

| Annotation | What It Does |
|---|---|
| `@CreatedDate` | Set automatically when entity is first saved |
| `@LastModifiedDate` | Updated automatically on every save |
| `@CreatedBy` | Who created it (from `AuditorAware`) |
| `@LastModifiedBy` | Who last modified it |

**Real-world use:** Every entity in a production app should have these 4 audit fields.

---

## 11. Multi-Tenant & Schema Annotations

### `@Filter` and `@FilterDef` (Hibernate)

Dynamically add WHERE conditions to queries — great for multi-tenancy, soft deletes.

```java
@Entity
@Table(name = "employees")
@FilterDef(
    name = "tenantFilter",
    parameters = @ParamDef(name = "tenantId", type = Long.class)
)
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class Employee {

    @Column(name = "tenant_id")
    private Long tenantId;
}
```

Enable the filter per request:
```java
Session session = em.unwrap(Session.class);
session.enableFilter("tenantFilter").setParameter("tenantId", currentTenantId);
```

---

### `@Where` (Hibernate — Soft Delete)

Automatically adds a WHERE clause to every query for this entity.

```java
@Entity
@Table(name = "employees")
@Where(clause = "is_deleted = false")   // always exclude soft-deleted records
public class Employee {

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
```

Now every `findAll()`, `findById()` will automatically exclude deleted records — no extra code needed.

---

## 12. Performance Annotations

### `@BatchSize`

Controls how many records Hibernate loads in one SQL IN clause. Prevents N+1 queries for collections.

```java
@Entity
@Table(name = "departments")
public class Department {

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    @BatchSize(size = 20)   // load 20 departments' employees in one query
    private List<Employee> employees;
}
```

---

### `@Cache` (Second-Level Cache)

Stores frequently read, rarely changed data in memory (e.g., Ehcache, Redis).

```java
@Entity
@Table(name = "countries")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)   // for data that never changes
public class Country {
    // ...
}
```

| Strategy | Use When |
|---|---|
| `READ_ONLY` | Data never changes (countries, currencies) |
| `READ_WRITE` | Data changes but rarely |
| `NONSTRICT_READ_WRITE` | Eventual consistency is OK |
| `TRANSACTIONAL` | Strict consistency needed |

---

## Complete Production Entity Example

Here is a real-world `Order` entity combining everything:

```java
package com.company.ecommerce.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "orders",
    schema = "ecommerce",
    indexes = {
        @Index(name = "idx_order_customer", columnList = "customer_id"),
        @Index(name = "idx_order_status",   columnList = "status")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Where(clause = "is_deleted = false")
@NamedQuery(
    name = "Order.findByCustomerAndStatus",
    query = "SELECT o FROM Order o WHERE o.customerId = :customerId AND o.status = :status"
)
public class Order {

    // Primary Key with Sequence
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "order_id_seq", allocationSize = 50)
    private Long id;

    // Column Mapping
    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    // Enum Mapping
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private OrderStatus status;

    // Embedded Value Object
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street",  column = @Column(name = "shipping_street")),
        @AttributeOverride(name = "city",    column = @Column(name = "shipping_city")),
        @AttributeOverride(name = "pincode", column = @Column(name = "shipping_pincode"))
    })
    private Address shippingAddress;

    // Relationship — One Order has Many Items
    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @BatchSize(size = 20)
    private List<OrderItem> items = new ArrayList<>();

    // Soft Delete
    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    // Optimistic Locking
    @Version
    private Long version;

    // Auditing
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false, length = 50)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    // Lifecycle Hook
    @PrePersist
    public void beforeInsert() {
        if (this.status == null) {
            this.status = OrderStatus.PENDING;
        }
    }

    // Helper Method for Bidirectional Relationship
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    // Getters and Setters...
}
```

---

## Quick Reference Cheat Sheet

| Annotation | Purpose | Common Attribute |
|---|---|---|
| `@Entity` | Class = DB table | — |
| `@Table` | Set table name/schema | `name`, `schema`, `indexes` |
| `@Id` | Primary key | — |
| `@GeneratedValue` | Auto-generate ID | `strategy` |
| `@SequenceGenerator` | Define sequence | `allocationSize` |
| `@Column` | Map field to column | `name`, `nullable`, `length` |
| `@Enumerated` | Map enum | `EnumType.STRING` always |
| `@Lob` | Large text/binary | — |
| `@Transient` | Skip field | — |
| `@Embedded` | Embed value object | — |
| `@Embeddable` | Make class embeddable | — |
| `@OneToMany` | Parent-to-children | `mappedBy`, `cascade`, `fetch` |
| `@ManyToOne` | Child-to-parent | `fetch = LAZY` |
| `@OneToOne` | One-to-one | `cascade`, `fetch = LAZY` |
| `@ManyToMany` | Many-to-many | `@JoinTable` |
| `@JoinColumn` | Define FK column | `name`, `nullable` |
| `@Version` | Optimistic locking | — |
| `@PrePersist` | Before insert | — |
| `@PostPersist` | After insert | — |
| `@PreUpdate` | Before update | — |
| `@CreatedDate` | Auto set create time | — |
| `@LastModifiedDate` | Auto set update time | — |
| `@Where` | Soft delete filter | `clause` |
| `@BatchSize` | Prevent N+1 | `size` |
| `@Cache` | Second-level cache | `usage` |
| `@NamedQuery` | Reusable JPQL | `name`, `query` |
| `@Inheritance` | Class hierarchy | `strategy` |

---

## Production Rules to Always Follow

1. **Always use `FetchType.LAZY`** — never rely on EAGER loading in production
2. **Always name your FK constraints** — helps during DB migrations and error debugging
3. **Always use `EnumType.STRING`** — never `ORDINAL`
4. **Use `@SequenceGenerator` with `allocationSize`** — for batch insert performance
5. **Add audit fields to every entity** — `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
6. **Use `@Version` for entities with concurrent updates** — bank accounts, inventory, bookings
7. **Use helper methods for bidirectional relationships** — `addChild()` / `removeChild()`
8. **Never use `CascadeType.ALL` on `@ManyToMany`** — you'll accidentally delete shared data
9. **Use `@Where` for soft deletes** — cleaner than filtering in every query
10. **Validate with `@Column(nullable = false)`** — let the DB enforce constraints too

---
