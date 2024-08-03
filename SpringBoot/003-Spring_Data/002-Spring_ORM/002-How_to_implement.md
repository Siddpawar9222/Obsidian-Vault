
# Spring ORM, JPA, and Hibernate

## Dependencies
- Spring Data JPA
- MySQL Driver

## Common Interface
The **Repository** interface is a fundamental concept in the Spring Data framework and serves as a central part of Spring Data's data access layer. It provides a set of methods and features for interacting with databases or data sources in a simplified and consistent way.

![SpringJPA](SpringJPA.png)  
![CrudRepoVsJpaRepo](crudrepovsjparepo.png)

## Paging and Sorting
### Paging
When you have a large dataset and want to retrieve data in smaller, manageable portions, you can use pagination. For example, if you have a database of movies, you can use the methods provided by the **PagingAndSortingRepository** to retrieve a specific page of movie records with a fixed number of records on each page. This is useful for displaying data in chunks, such as in search results or long lists.

### Sorting
The **PagingAndSortingRepository** also allows you to sort the data based on one or more fields. You can specify the field(s) and the sorting order (ascending or descending) when querying the database. For instance, you can sort your movie records by release date or title in ascending or descending order.

## CrudRepository Methods
- `<S extends T> save(S entity)` – Saves a single entity.
- `Iterable<S> saveAll(Iterable<S> entities)` – Saves multiple entities.
- `Optional<T> findById(ID id)` – Retrieves an entity by its ID.
- `boolean existsById(ID id)` – Checks whether an entity with the given ID exists.
- `Iterable<T> findAll()` – Finds all entities of a particular type.
- `Iterable<T> findAllById(Iterable<ID> ids)` – Returns all entities with the given IDs.
- `long count()` – Returns the number of entities.
- `void deleteById(ID id)` – Deletes an entity by its ID.
- `void delete(T entity)` – Deletes the given entity.
- `void deleteAll(Iterable<? extends T> entities)` – Deletes multiple entities.
- `void deleteAll()` – Deletes all entities.

## Custom Queries

![CustomQueries](customquries.png)

## Custom JPQL (Java Persistence Query Language) Query

```java
@Modifying
@Transactional
@Query("DELETE FROM SessionStorages s WHERE s.operatorId = :operatorId AND s.sessionId <> :sessionId")
void deleteAllByOperatorIdExceptSessionId(@Param("operatorId") String operatorId, @Param("sessionId") String sessionId);

@Modifying
@Transactional
@Query("DELETE FROM SessionStorages s WHERE s.expirationDate < :expirationDate")
void deleteByExpirationDate(@Param("expirationDate") Date expirationDate);
```

- **@Modifying**: Indicates that the query is not a SELECT query but a modifying query such as an UPDATE or DELETE.
- **@Transactional**: Ensures that the delete operation is executed within a transaction, which is necessary for modifying queries to ensure data integrity.
- **@Query**: Defines the custom JPQL (Java Persistence Query Language) query. The query deletes all records where `operatorId` matches the given `operatorId` and `sessionId` is not equal to the given `sessionId`.

The `<>` symbol in the query represents the "not equal to" operator in JPQL. This operator is used to specify that the `sessionId` should not be equal to a given value.