
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
- **Description**: Applicable in web-based applications. A new instance of the bean is created for each HTTP request. This is same as prototype scope.
- **Usage**: Used for beans that need to maintain state for the duration of an HTTP request.

```java
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MyRequestScopedService {
    // This is a request-scoped bean.
}
```

#### 4. Session Scope
- **Description**: Applicable in web-based applications. A new instance of the bean is created for each user session.
- **Usage**: Suitable for maintaining user-specific data throughout a session.

```java
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class MySessionScopedService {
    // This is a session-scoped bean.
}
```

#### 5. Application Scope 
- **Description**: A single instance of the bean is created for the entire web application.
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

- **Singleton** and **Application** scopes both create a single instance, but **Singleton** is broader (covering the entire Spring container), while **Application** is specific to the web application's `ServletContext`. **Singleton** is the default scope, even in Spring Boot web applications.

- **Application Scope** is more commonly used in web applications where you need  to maintain a global state that is tied to the lifecycle of the web application  itself.