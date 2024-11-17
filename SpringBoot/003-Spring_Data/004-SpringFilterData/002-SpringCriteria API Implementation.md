
---

### Step 1: **Understand the Requirement and Define the Data Model**

To use the Criteria API, start by understanding the structure of your **Product** entity and its attributes.

For the product catalog example:
- **Category**: A string (e.g., "Electronics", "Furniture").
- **Price Range**: Two numbers (`minPrice` and `maxPrice`) representing the range.
- **Availability**: A boolean (e.g., `true` for in-stock, `false` for out-of-stock).

Here's a simplified structure of the Product entity:

- **id**: Primary key.
- **name**: Name of the product.
- **category**: Category of the product (e.g., "Electronics").
- **price**: Price of the product.
- **availability**: Boolean indicating stock status.

Define these fields in the `Product` entity as attributes, and ensure the entity is properly annotated with JPA annotations like `@Entity`.

---
### Step 2: **Set Up the Criteria Builder**

The **CriteriaBuilder** is the starting point for creating dynamic queries using the Criteria API. You’ll get it from the **EntityManager**, which is used to interact with the database.

Here’s what you’ll do in this step:

1. **Inject the `EntityManager`**:  
   The `EntityManager` is required to create a `CriteriaBuilder`. You can inject it into your service or repository class.

2. **Create a `CriteriaBuilder`**:  
   Use the `EntityManager` to obtain an instance of `CriteriaBuilder`.

3. **Create a `CriteriaQuery`**:  
   The `CriteriaQuery` defines the structure of your query (e.g., selecting all products that meet the filter criteria).

Here’s the conceptual idea:
- Use `CriteriaBuilder` to construct conditions dynamically.
- Use `CriteriaQuery` to specify the result type (e.g., `Product`).

---

### Step 3: **Define Query Roots and Add Filtering Logic**

In this step, you’ll add dynamic filtering logic using the `CriteriaBuilder` and `Root`. This will allow filtering based on **Category**, **Price Range**, and **Availability**.

Here’s how to proceed:
1. Use the `Root` object to specify attributes (like `category`, `price`, etc.).
2. Build **predicates** using the `CriteriaBuilder` for each filter condition.
3. Combine these predicates dynamically using `CriteriaBuilder.and()`.

---

### Step 4: **Add Sorting Logic (by Price)**

Now that we’ve set up the filtering, let’s move on to **sorting** the results based on the `price` field. We can add sorting dynamically using `CriteriaBuilder`'s `orderBy()` method.

Here’s how you can implement **sorting** based on `price`:

1. Use `CriteriaBuilder.asc()` for ascending order and `CriteriaBuilder.desc()` for descending order.
2. Add sorting as the last step before executing the query.

---

Let’s go step by step with simple real-world analogies for each concept:  

---

### 1. **EntityManager**
**What is it?**
- The **EntityManager** is like the manager of a database store.
- It provides operations to **query, insert, update, or delete** records (entities) in the database.

---

### 2. **CriteriaBuilder**
**What is it?**
- The **CriteriaBuilder** is like a **construction toolkit** used to build queries dynamically.
- It provides methods to define comparisons (`equal`, `greaterThan`, etc.), logical operations (`and`, `or`), sorting, and more.

The **CriteriaBuilder** builds these logical conditions for your query.

---

### 3. **Root**
**What is it?**
- The **Root** represents the **starting point** of your query.  
- It refers to the **entity** (table) you are querying from and lets you access its fields (columns).

In short, the **Root** connects your query to the entity's attributes.

---

### 4. **Predicate**
**What is it?**
- A **Predicate** is like a **filter condition** in your query.
- It defines what you’re looking for in the database.

**Real-world Example:**
- Imagine you are filtering products in an online store:
  - **Predicate 1**: Show products in the "Electronics" category.  
  - **Predicate 2**: Show products with a price **less than $500**.
  - Combine these predicates using **AND** or **OR**:
    - "Give me all Electronics under $500." → `criteriaBuilder.and(predicate1, predicate2)`

In JPA, the **Predicate** represents each condition in your query, and you can combine multiple predicates to build more complex queries.

---

### How They Work Together:
1. **EntityManager**: Acts as the manager to run your query.
2. **CriteriaBuilder**: Acts as the toolkit to define the query’s conditions.
3. **Root**: Acts as the starting point to access the entity’s fields.
4. **Predicate**: Represents the filters applied to the query.

---

| Concept             | Type      | Purpose                                             |
| ------------------- | --------- | --------------------------------------------------- |
| **EntityManager**   | Interface | Manage entities and execute queries.                |
| **CriteriaBuilder** | Interface | Build dynamic queries, conditions, and expressions. |
| **Root**            | Interface | Define the starting point of the query (entity).    |
| **Predicate**       | Interface | Represent a condition or filter in the query.       |
