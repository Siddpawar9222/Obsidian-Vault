
---- 

## Caching Annotations

### @EnableCaching
- **Purpose**: Enables Spring's annotation-driven cache management capability.
- **Usage**: Add this annotation to a configuration class to enable caching in your Spring application.
- **Example**:
  ```java
  @Configuration
  @EnableCaching
  public class CacheConfig {
  }
  ```

### @Cacheable
- **Purpose**: Indicates that the result of invoking a method (or all methods in a class) can be cached.
- **Attributes**:
  - `cacheNames`: Names of the caches where the method results will be stored.
  - `key`: SpEL (Spring Expression Language) expression for computing the cache key dynamically.
- **Usage**: Add this annotation to a method whose result should be cached.
- **Example**:
  ```java
  @Cacheable(cacheNames = "employees", key = "#id")
  public Employee getEmployeeById(Long id) {
      // Method implementation
  }
  ```

### @CachePut
- **Purpose**: Updates the cache with the method's return value. Used to refresh the cache without interfering with the method invocation.
- **Attributes**:
  - `cacheNames`: Names of the caches where the method results will be stored.
  - `key`: SpEL expression for computing the cache key dynamically.
- **Usage**: Add this annotation to a method whose result should update the cache.
- **Example**:
  ```java
  @CachePut(cacheNames = "employees", key = "#id")
  public Employee updateEmployee(Long id, Employee employee) {
      // Method implementation
      return employee;
  }
  ```

### @CacheEvict
- **Purpose**: Indicates that one or more entries should be removed from the cache.
- **Attributes**:
  - `cacheNames`: Names of the caches from which entries should be evicted.
  - `key`: SpEL expression for computing the cache key dynamically.
- **Usage**: Add this annotation to a method that performs cache eviction.
- **Example**:
  ```java
  @CacheEvict(cacheNames = "employees", key = "#id")
  public void deleteEmployee(Long id) {
      // Method implementation
  }
  ```

---