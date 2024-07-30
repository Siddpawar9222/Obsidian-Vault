
----

### Why Use Spring AOP (Aspect-Oriented Programming) ?

Spring AOP (Aspect-Oriented Programming) allows you to define cross-cutting concerns separately from your business logic. This helps in improving code modularity and reduces redundancy. Here are some key reasons and a simple example to illustrate:

#### Key Reasons to Use Spring AOP:

1. **Separation of Concerns**: Allows you to separate different concerns of your application, such as logging, security, and transaction management, from the main business logic.
2. **Code Reusability**: Common functionalities can be reused across multiple classes without duplicating code.
3. **Simplifies Maintenance**: Easier to maintain and update common functionalities as they are centralized in one place.
4. **Improved Readability**: Reduces clutter in the business logic, making the code easier to read and understand.

#### Example

 Spring AOP can be used for logging method executions. Through logging we can get information about each method(or api), when it started and  ended. It  helps to avoid written repeated logs for each method and improve code readability.


### Step-by-Step Guide to Implement Spring AOP in Maven

#### 1. Set Up Your Maven Project

**Manually Set Up the `pom.xml`**:
Ensure your `pom.xml` includes the necessary Spring Boot and AOP dependencies.

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

#### 2. Enable AspectJ Auto Proxy

Create a configuration class to enable AspectJ auto proxy.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class AopConfig {
} 
or
In main driver class
```

#### 3. Create AspectConfig class

Define an aspect class

```java
import org.aspectj.lang.annotation.Aspect;


@Aspect
@Component
public class AspectConfig {
}
```