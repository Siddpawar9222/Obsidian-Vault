
----

#### Bean
- **Definition**: An object that is instantiated, assembled, and managed by the Spring IoC (Inversion of Control) container.
- **Details**: 
  - A bean is simply a Java object.
  - Often, it is a POJO (Plain Old Java Object), meaning it has no dependencies on Spring and is just a regular Java class.

#### IoC Container
- **Purpose**: Manages the lifecycle and configuration of application beans.
- **Types**:
  1. **BeanFactory Container**: 
     - Basic container that provides fundamental functionalities for managing beans.
     - Lightweight and suitable for simple applications.
  2. **ApplicationContext Container**: 
     - Provides more advanced features like event propagation, declarative mechanisms to create a bean, and various ways to look up.
     - Typically used in enterprise applications.
  3. **WebApplicationContext**: 
     - Specialized version of `ApplicationContext` for web applications.
     - Designed to handle web-related beans and specific configurations needed for web applications.


---
### Bean Scopes in Spring Boot

In Spring Boot, you can define the scope of a bean, which determines its lifecycle and visibility within the Spring application context. Here are the main scopes available:

#### 1. Singleton Scope (Default)
- **Description**: Only one instance of the bean per Spring container (application context).
- **Usage**: Shared across the entire application.

```java
@Service
public class MyService {
    // This is a singleton bean.
}
```

#### 2. Prototype Scope
- **Description**: A new instance of the bean is created each time it's requested from the Spring container.
- **Usage**: Suitable for stateful beans or when a new instance is needed for each request.

```java
@Scope("prototype")
@Service
public class MyPrototypeService {
    // This is a prototype bean.
}
```

#### 3. Request Scope
- **Description**: Applicable in web-based applications. A new instance of the bean is created for each HTTP request.
- **Usage**: Used for beans that need to maintain state for the duration of an HTTP request.

```java
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MyRequestScopedService {
    // This is a request-scoped bean.
}
```

#### 4. Session Scope
- **Description**: Specific to web applications. A new instance of the bean is created for each user session.
- **Usage**: Suitable for maintaining user-specific data throughout a session.

```java
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MySessionScopedService {
    // This is a session-scoped bean.
}
```

#### 5. Application Scope (Singleton in WebApplicationContext)
- **Description**: A single instance of the bean is created for the entire web application.
- **Usage**: Used when you want to maintain global application-level state.

```java
@Scope(value = WebApplicationContext.SCOPE_APPLICATION, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MyApplicationScopedService {
    // This is an application-scoped bean.
}
```

These scopes allow you to control the lifecycle and sharing of your beans, making your Spring application more flexible and adaptable to various requirements.