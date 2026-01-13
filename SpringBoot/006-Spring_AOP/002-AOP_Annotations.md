
-----

### Terminologies in AOP : 

---

### 📝 Simplified Notes on AOP (Aspect Oriented Programming)

| Term                       | Simple Meaning                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Aspect**                 | A **separate class** where we keep common things (cross-cutting concerns) like logging, security, transaction. |
| **Advice**                 | The **actual code** that runs at a specific time (before/after/around a method).                               |
| **Pointcut**               | The **condition/expression** that decides **where** advice should run.                                         |
| **Join Point**             | The **spot in code** where advice can be applied (like method call, exception).                                |
| **Target Object**          | The **main object** whose method you want to run (your business logic).                                        |
| **Proxy (Proxied Object)** | Spring creates a **fake wrapper (proxy)** around the target to add extra behavior (advice).                    |
| **Weaving**                | The process of **joining aspect + target object** together.                                                    |

 ---



 Each terminology applies to Project :

### Aspect
- **Aspect Class**: `LoggingAspect`

### Advice
- **Advice Method**: `logBeforeMethod()`
- **Type of Advice**: `@Before`

### Pointcut
- **Pointcut Expression**: `@Pointcut("within(com.example.springaop_1.service..*)")`

### Join Point
- **Join Point**: The execution of the `authenticate` method in `AuthService`.

### Target Object
- **Target Object**: `AuthService`

### Proxied
- **Proxied Object**: The `AuthService` object is proxied by Spring AOP to apply the logging advice.

### Weaving
- **Weaving Time**: Runtime weaving, as Spring AOP uses dynamic proxies.


### Annotations  : 

### @Aspect
- **Usage**: Applied to a class to indicate that it is an aspect.
- **Purpose**: Marks the class as an aspect that contains cross-cutting concerns (like logging, security, etc.).

### @Before
- **Usage**: Applied to a method to run before the target method executes.
- **Purpose**: Defines advice that executes before a specified join point (e.g., method execution).

### @After
- **Usage**: Applied to a method to run after the target method executes.
- **Purpose**: Defines advice that executes after a specified join point, regardless of the method's outcome.

### @AfterReturning
- **Usage**: Applied to a method to run after the target method successfully returns a result.
- **Purpose**: Defines advice that executes after a join point completes normally (i.e., without throwing an exception).

### @AfterThrowing
- **Usage**: Applied to a method to run if the target method throws an exception.
- **Purpose**: Defines advice that executes if a join point exits by throwing an exception.

### @Around
- **Usage**: Applied to a method to run around the target method execution.
- **Purpose**: Defines advice that executes before and after a join point. It allows you to control the execution of the target method and its result.

### @Pointcut
- **Usage**: Applied to a method to define a reusable pointcut expression.
- **Purpose**: Specifies where advice should be applied. The method itself doesn't contain code to be executed but rather defines an expression to match join points.

### @EnableAspectJAutoProxy
- **Usage**: Applied to a configuration class to enable support for handling components marked with AspectJ's `@Aspect` annotation.
- **Purpose**: Enables Spring's AspectJ support and allows the use of proxy-based AOP.


### Difference between  `execution` and `within` pointcut designators:


### `execution`

- **Purpose**: The `execution` pointcut designator is used to match method execution join points. It specifies the exact methods where advice should be applied based on method signatures.
- **Usage**: It allows you to be very specific about the method's return type, name, parameters, and visibility.
- **Example**: 
  ```java
  @Before("execution(public * com.example.service.*.*(..))")
  public void logBeforeMethod() {
      // Advice code here
  }
  ```
  This pointcut matches the execution of any public method in any class within the `com.example.service` package.

### `within`

- **Purpose**: The `within` pointcut designator is used to match join points within certain types or packages. It specifies all methods within a particular type or package.
- **Usage**: It allows you to broadly target all methods within a class or package, regardless of their signatures.
- **Example**: 
  ```java
  @Before("within(com.example.service..*)")
  public void logBeforeMethod() {
      // Advice code here
  }
  ```
  This pointcut matches all methods within any class in the `com.example.service` package and its sub-packages.

### Summary of Differences
   
- **Use Case**:
  - `execution`: Use when you need to apply advice to specific methods with certain names, return types, or parameters.
  - `within`: Use when you need to apply advice to all methods within a class or package.

- **Syntax**:
  - `execution`: Includes method signature details (return type, method name, parameters).
  - `within`: Includes type or package name, without method signature details.
