
---

### **Jakarta EE / Java EE Annotations**

These annotations are used to manage the lifecycle of beans in Java EE applications.

1. **`@PostConstruct`** - Runs after dependency injection is complete.
    
2. **`@PreDestroy`** - Runs just before the bean is destroyed.
    

### **Spring Framework Annotations**

Spring provides several lifecycle annotations to manage bean initialization and destruction:

3. **`@Bean(initMethod = "methodName", destroyMethod = "methodName")`** - Used in Spring configuration to specify initialization and destruction methods for a bean.
    
4. **`@DependsOn("beanName")`** - Ensures that another bean is initialized before the current bean.
    
5. **`@Lazy`** - Delays bean initialization until it is actually needed.
    

### **JPA (Java Persistence API) Lifecycle Annotations**

For entity lifecycle callbacks in Hibernate and JPA:

6. **`@PrePersist`** - Runs before an entity is saved for the first time.
    
7. **`@PostPersist`** - Runs after an entity has been saved.
    
8. **`@PreUpdate`** - Runs before an entity is updated.
    
9. **`@PostUpdate`** - Runs after an entity has been updated.
    
10. **`@PreRemove`** - Runs before an entity is deleted.
    
11. **`@PostRemove`** - Runs after an entity has been deleted.
    
12. **`@PostLoad`** - Runs after an entity has been loaded from the database.
    

### **CDI (Context and Dependency Injection) Annotations**

Used in Jakarta EE for managing dependency injection lifecycle:

13. **`@Inject`** - Performs dependency injection.
    
14. **`@Produces`** - Defines a producer method for dependency injection.
    
15. **`@Disposes`** - Defines a disposal method for a producer.
    
16. **`@Observes`** - Allows a method to listen for CDI events.


