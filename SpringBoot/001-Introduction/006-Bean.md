
----

#### Bean
- **Definition**: An object that is instantiated, assembled, and managed by the Spring IoC (Inversion of Control) container.
- **Details**: 
  - A bean is simply a Java object.
  - Often, it is a POJO (Plain Old Java Object), meaning it has no dependencies on Spring and is just a regular Java class.

---
### IoC Container

- **Purpose**: Manages the lifecycle and configuration of application beans.

### 1. BeanFactory

  This is the simplest and most basic container:

 - **Lazy initialization**: Only creates beans when they're explicitly requested, not when the container starts
  - **Lightweight**: Uses minimal memory and resources
 - **Limited features**: Provides basic dependency injection and bean lifecycle management
 - **Typically used**: For resource-constrained environments or when memory consumption is a critical concern

## 2. ApplicationContext

This is the more advanced and commonly used container (especially in Spring Boot):

- **Eager initialization**: Creates singleton beans at startup by default
- **Feature-rich**: Extends BeanFactory with additional enterprise features
- **Built-in capabilities**:
    - International messaging/text support (i18n)
    - Event publication mechanism
    - Application layer specific contexts (WebApplicationContext for web apps)
    - AOP (Aspect-Oriented Programming) integration
    - Advanced bean configuration options

## In Spring Boot Context

Spring Boot almost always uses the ApplicationContext container, specifically:

- For web applications: `AnnotationConfigServletWebServerApplicationContext`
- For reactive applications: `AnnotationConfigReactiveWebServerApplicationContext`
- For non-web applications: `AnnotationConfigApplicationContext`

These specialized ApplicationContext implementations provide additional functionality tailored to different application types while handling auto-configuration, component scanning, and embedded server initialization.

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
- **Description**: <font color="#ffff00">Applicable in web-based applications</font>. A new instance of the bean is created for each HTTP request. This is same as prototype scope.
- **Usage**: Used for beans that need to maintain state for the duration of an HTTP request.

```java
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MyRequestScopedService {
    // This is a request-scoped bean.
}
```

#### 4. Session Scope
- **Description**: <font color="#ffff00">Applicable in web-based applications</font>. A new instance of the bean is created for each user session.
- **Usage**: Suitable for maintaining user-specific data throughout a session.

```java
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MySessionScopedService {
    // This is a session-scoped bean.
}
```

#### 5. Application Scope 
- **Description**: <font color="#ffff00">Applicable in web-based applications</font>.  A single instance of the bean is created for the entire web application.
- **Usage**: Create global session beans for Portlet applications..

```java
@Scope(value = WebApplicationContext.SCOPE_APPLICATION, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MyApplicationScopedService {
    // This is an application-scoped bean.
}
```


---

**<span style="background:#ff4d4f">Note:</span>** 

 A portlet is a small web application that runs inside a larger web portal. Think of it as a widget or mini-application that provides a specific piece of functionality within a web page. Each portlet operates independently but can be part of a larger page with multiple portlets.

### Example:

Imagine you are visiting a web portal for a news website. On the homepage, you see different sections: latest news, weather updates, stock market information, and sports scores. Each of these sections can be considered a portlet.

- **News Portlet:** Displays the latest news headlines.
- **Weather Portlet:** Shows the current weather and forecasts.
- **Stock Market Portlet:** Provides updates on stock prices.
- **Sports Portlet:** Lists recent sports scores and updates.

Each portlet can be developed, deployed, and managed separately, allowing for modularity and flexibility.

When deployed to a portlet container (like Apache Pluto or Liferay), this portlet will display the weather information as a small section within a larger portal page.


---

`ServletContext` is an interface provided by the Java Servlet API that represents the context of a web application within a servlet container (like Tomcat, Jetty, etc.). It provides a way for servlets to interact with the servlet container and share information across different parts of a web application.

[Difference between ServletConfig and ServletContext](https://www.geeksforgeeks.org/difference-between-servletconfig-and-servletcontext-in-java-servlet/)

# Singleton Scope vs. Application Scope in Spring Boot

## Singleton Scope

- **Default scope** in Spring for all beans
- Creates **exactly one instance** per Spring IoC container
- Shared across the **entire application context**
- **Created** when the application context loads or when first requested (depending on lazy-loading configuration)
- **Destroyed** when the application context is shut down
- Defined using `@Scope("singleton")` or by default without any scope annotation

## Application Scope

- Only applicable in **web applications**
- Creates one instance per **ServletContext** (web application)
- Shared across **all Spring application contexts** within the same web application
- Useful when you have **multiple Spring contexts** in a single web application (which is uncommon in typical Spring Boot apps)
- Defined using `@Scope("application")`
- Stored as an attribute in the ServletContext

## Key Difference

The main difference becomes apparent when you have multiple Spring application contexts within a single web application:

- **Singleton beans** are unique to each Spring application context
- **Application-scoped beans** are shared across all Spring contexts within the same web application

---

### Multiple Spring application contexts in the same Spring Boot project 
 this is less common than having a single application context.

## Common Scenarios for Multiple Contexts

1. **Parent-Child Context Relationships**: A parent context containing shared services and infrastructure beans, with child contexts for specific modules or features
    
2. **Testing**: Creating separate contexts for integration tests
    
3. **Custom Module Systems**: Applications that need isolation between components
    
4. **Web + Batch Processing**: Having separate contexts for web components and batch processing components
    

## How to Create Multiple Contexts

### Method 1: Programmatic Creation

```java
// Creating the first application context
AnnotationConfigApplicationContext context1 = new AnnotationConfigApplicationContext();
context1.register(AppConfig1.class);
context1.refresh();

// Creating the second application context
AnnotationConfigApplicationContext context2 = new AnnotationConfigApplicationContext();
context2.register(AppConfig2.class);
context2.refresh();
```

### Method 2: Using Spring Boot's SpringApplication

```java
// First context
SpringApplication app1 = new SpringApplication(App1Config.class);
ConfigurableApplicationContext context1 = app1.run();

// Second context
SpringApplication app2 = new SpringApplication(App2Config.class);
ConfigurableApplicationContext context2 = app2.run();
```

### Method 3: Parent-Child Relationship

```java
// Create parent context
AnnotationConfigApplicationContext parentContext = new AnnotationConfigApplicationContext();
parentContext.register(ParentConfig.class);
parentContext.refresh();

// Create child context with parent reference
AnnotationConfigApplicationContext childContext = new AnnotationConfigApplicationContext();
childContext.setParent(parentContext);
childContext.register(ChildConfig.class);
childContext.refresh();
```


Here's what these classes typically look like:

```java
@Configuration
@ComponentScan("com.example.module1")
public class AppConfig1 {
    // Bean definitions specific to the first context
    @Bean
    public Service1 service1() {
        return new Service1Impl();
    }
    
    @Bean
    public Repository1 repository1() {
        return new Repository1Impl();
    }
}
```

```java
@Configuration
@ComponentScan("com.example.module2")
public class AppConfig2 {
    // Bean definitions specific to the second context
    @Bean
    public Service2 service2() {
        return new Service2Impl();
    }
    
    @Bean
    public Repository2 repository2() {
        return new Repository2Impl();
    }
}
```

Each configuration class:

- Uses `@Configuration` to mark it as a source of bean definitions
- May use `@ComponentScan` to specify which packages to scan for components
- Contains `@Bean` methods that define individual beans
- May include properties, profiles, and other Spring configuration elements

These configuration classes allow you to create completely separate contexts with different beans, different component scanning paths, and different configurations, all within the same application.
## Important Considerations

1. **Bean Visibility**: Beans in a child context can see beans in the parent context, but not vice versa
    
2. **Resource Management**: Each context manages its own resources, so you need to close each context separately
    
3. **Increased Complexity**: Multiple contexts make your application more complex and harder to debug
    
4. **Startup Time**: Multiple contexts will increase your application's startup time
    
5. **Memory Usage**: Each context consumes additional memory
    

---
### ApplicationContext : 

1. **ApplicationContext**: The modern, feature-rich Spring IoC container used in most Spring applications (including Spring Boot)
    
2. **Types of ApplicationContext**:
    
    - For REST APIs: `AnnotationConfigServletWebServerApplicationContext` (traditional) or `AnnotationConfigReactiveWebServerApplicationContext` (reactive)
    - For web-based applications: `WebApplicationContext` which extends the base ApplicationContext
3. **ServletContext Access**:
    
    - The `WebApplicationContext` provides access to the ServletContext
    - This makes web-specific scopes like "request", "session", and "application" possible
    - The application scope is specifically tied to the ServletContext's lifecycle
4. **Scope Relationship**:
    
    - Singleton scope: One instance per Spring ApplicationContext
    - Application scope: One instance per ServletContext (web application)

In most Spring Boot applications with a single ApplicationContext and a single ServletContext, singleton and application scopes behave essentially the same. The distinction becomes important only when you have multiple Spring contexts within a single web application.

---
