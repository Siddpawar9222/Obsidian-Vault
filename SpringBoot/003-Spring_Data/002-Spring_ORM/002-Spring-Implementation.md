
---

## Dependencies

- Spring Data JPA
    
- MySQL Driver
    

## Common Interface

The **Repository** interface is a fundamental concept in the Spring Data framework and serves as a central part of Spring Data's data access layer. It provides a set of methods and features for interacting with databases or data sources in a simplified and consistent way.

![SpringJPA](SpringJPA.png)  

![CrudRepoVsJpaRepo](crudrepovsjparepo.png)

---

## Paging and Sorting

### Paging

When you have a large dataset and want to retrieve data in smaller, manageable portions, you can use pagination.

For example, if you have a database of movies, you can use the methods provided by **PagingAndSortingRepository** to retrieve a specific page of movie records with a fixed number of records on each page.

This is useful for displaying data in chunks, such as search results or long lists.

### Sorting

The **PagingAndSortingRepository** also allows you to sort data based on one or more fields.

You can specify the field(s) and sorting order (ascending or descending) when querying the database.

For instance, you can sort movie records by release date or title in ascending or descending order.

---

## CrudRepository Methods

- `<S extends T> save(S entity)` – Saves a single entity.
    
- `Iterable<S> saveAll(Iterable<S> entities)` – Saves multiple entities.
    
- `Optional<T> findById(ID id)` – Retrieves an entity by its ID.
    
- `boolean existsById(ID id)` – Checks whether an entity with the given ID exists.
    
- `Iterable<T> findAll()` – Finds all entities of a particular type.
    
- `Iterable<T> findAllById(Iterable<ID> ids)` – Returns all entities with the given IDs.
    
- `long count()` – Returns the total number of entities.
    
- `void deleteById(ID id)` – Deletes an entity by its ID.
    
- `void delete(T entity)` – Deletes the given entity.
    
- `void deleteAll(Iterable<? extends T> entities)` – Deletes multiple entities.
    
- `void deleteAll()` – Deletes all entities.
    

---

## Writing Custom Methods Rules : 

![CustomQueries](customquries.png)

---

## Custom JPQL (Java Persistence Query Language) Query : 

> JPQL is needed when the query becomes too complex for method naming conventions.Also Helpful for Complex Joins / Aggregations / Bulk Updates.

  ## Example : 
  
```java
@Modifying
@Transactional
@Query("DELETE FROM SessionStorages s WHERE s.operatorId = :operatorId AND s.sessionId <> :sessionId")
void deleteAllByOperatorIdExceptSessionId(
        @Param("operatorId") String operatorId,
        @Param("sessionId") String sessionId);

@Modifying
@Transactional
@Query("DELETE FROM SessionStorages s WHERE s.expirationDate < :expirationDate")
void deleteByExpirationDate(@Param("expirationDate") Date expirationDate);
```

### Important Notes About `@Query`

 `@Query`  Used for **SELECT**, **UPDATE**, and **DELETE** operations.

#### SELECT Query

```java
@Query(...)
List<Employee> findEmployees(...);
```

- No `@Modifying` annotation is required.
    
- Usually no explicit `@Transactional` annotation is required because it is a read operation.
    

#### UPDATE / DELETE Query

```java
@Modifying
@Transactional
@Query(...)
void updateOrDelete(...);
```

- `@Modifying` is required.
    
- `@Transactional` is required.
    

#### CREATE Operation

There is no JPQL INSERT support like SQL.

For creating new records, we normally use:

```java
repository.save(entity);
```


### Why is @Modifying Required?

Internally, Spring Data JPA assumes that a method annotated with `@Query` is a SELECT query and executes it using `executeQuery()`.

For UPDATE and DELETE statements, Spring must instead use `executeUpdate()`.

The `@Modifying` annotation tells Spring Data JPA that the query modifies data and should be executed as an UPDATE/DELETE operation rather than a SELECT operation.


---

#### Annotations Used Here : 

#### @Modifying

Indicates that the query is not a SELECT query but a modifying query such as an UPDATE or DELETE.

#### @Transactional

Ensures that the operation is executed within a transaction. This is necessary for UPDATE and DELETE queries to maintain data integrity.

#### @Query

Defines a custom JPQL (Java Persistence Query Language) query.

The query below deletes all records where `operatorId` matches the given value and `sessionId` is not equal to the given session ID.

```java
DELETE FROM SessionStorages s
WHERE s.operatorId = :operatorId
AND s.sessionId <> :sessionId
```

The `<>` symbol represents the **"not equal to"** operator in JPQL.

---

### Native Query (`nativeQuery = true`)

<font color="#ffc000">When JPQL Is Not Enough</font>

Examples:

- Database-specific functions.
    
    - `LIMIT`
        
    - `ILIKE`
        
    - `JSONB`
        
    - Window Functions
        
- Very complex joins.
    
- Performance-optimized SQL queries.
    
- Legacy database queries.
    
- Database-specific features not supported by JPQL.
    

Example:

```java
@Query(
    value = "SELECT * FROM employee ORDER BY created_at DESC LIMIT 5",
    nativeQuery = true
)
List<Employee> findLatestEmployees();
```


Characteristics:

- Works with actual database table names.
    
- Uses actual database column names.
    
- Database specific (MySQL, PostgreSQL, Oracle, etc.).
    
- Sent directly to the database.
---