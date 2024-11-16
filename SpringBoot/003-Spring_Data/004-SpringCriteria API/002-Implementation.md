
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

