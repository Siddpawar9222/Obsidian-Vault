
---


![[hibernate-jpa.png]]



### 🔁 Hibernate vs JPA mapping

| Hibernate      | JPA                             |
| -------------- | ------------------------------- |
| Configuration  | Persistence Unit                |
| SessionFactory | EntityManagerFactory            |
| Session        | EntityManager                   |
| Transaction    | EntityTransaction               |
| Query          | Query                           |
| Criteria       | CriteriaBuilder / CriteriaQuery |

 SAME responsibility, different names.

## Example 

### JPA way (standard)

```java
@PersistenceContext
EntityManager em;
```

### Hibernate internally converts to:

```java
Session session = em.unwrap(Session.class);
```

 - EntityManager is just a **wrapper**  
 - Session does the real work


### Real-World Usage of Hibernate Session

In our multi-tenant application, each tenant should only be able to access its own data. To enforce this at the database query level, we used Hibernate Filters.

Since JPA's EntityManager does not provide support for enabling or disabling Hibernate filters, we unwrapped the underlying Hibernate Session from the EntityManager.

Using Spring AOP, we intercepted repository read operations and enabled the tenant filter before the query execution.

Flow:
```text
Request  
↓  
AOP Intercepts Repository Method  
↓  
EntityManager.unwrap(Session.class)  
↓  
session.enableFilter("tenantFilter")  
↓  
Set tenantId and tenantEntityId  
↓  
Repository Query Executes  
↓  
Hibernate Automatically Adds Tenant Conditions  
↓  
Database
```

As a result, every query executed within that session is automatically filtered by tenant information, preventing cross-tenant data access.

This approach avoids manually adding:

WHERE tenant_id = ?

to every repository query and provides a centralized tenant isolation mechanism.