
-----

## **Spring Boot Main annotations:**

`@SpringBootApplication`:
This annotation is often used on the main class of a Spring Boot application. It combines three other annotations: `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. It is a convenient way to set up a Spring Boot application and configure various settings automatically. It marks the starting point of your Spring Boot application. It tells Java that this is where your application begins.

`@ComponentScan`:
This annotation is used to specify the base packages for Spring to scan for components (such as Spring beans, controllers, services, etc.). Spring scans these packages to find and register beans within the application context. By default, Spring Boot enables component scanning for the package where the main application class is located. If we do not specify a custom package in the parent package, we have to use this `@ComponentScan` annotation above the main class.

`@EnableAutoConfiguration`:
This annotation is used to enable Spring Boot's auto-configuration feature. Auto-configuration automatically configures various components and beans based on the classpath dependencies and the application's configuration. It greatly reduces the manual configuration effort required when setting up a Spring Boot application. It helps developers focus on business logic instead of configuration.

`@Configuration`:
This annotation indicates that a class defines one or more `@Bean` methods. Beans defined in a `@Configuration` class are registered in the Spring application context, and their instances can be retrieved using dependency injection. This annotation is typically used for Java-based configuration in Spring applications.

`@Bean`:
This annotation is used within a `@Configuration` class to declare a method as a bean definition. The method should return an object that will be managed by the Spring container as a bean. The name of the bean is the name of the method.

## **Stereotype annotations:**

These annotations are used to indicate the role of a class within the Spring application context. All annotations extend `@Component`, which is used to create a bean.

`@Component`:
This annotation indicates that a class is a Spring component. Spring will automatically detect and register classes with this annotation as Spring beans during component scanning. These beans can then be wired and used in other parts of the application.

`@Service`:
This annotation is a specialization of `@Component`. It indicates that a class is a service bean. It's often used to mark classes that provide business logic or service-oriented functionality.

`@Repository`:
This annotation is also a specialization of `@Component`. It's used to indicate that a class is a <font color="#ffc000">data access or repository bean</font>. It's often applied to classes that interact with the database or other data storage mechanisms.

`@Controller`:
This annotation indicates that a class is a Spring MVC controller. It's used in web applications to handle HTTP requests and manage the flow of data between the user interface and the business logic.

`@ResponseBody`: 
When you return a value from a controller method, **Spring expects you are returning a View name** (like a webpage).

Example:

```java
@Controller
public class MyController {

    @GetMapping("/hello")
    public String sayHello() {
        return "hello"; // Spring will search for hello.jsp or hello.html page to show
    }
}
```

Here, `"hello"` means: **Find and render a page named `hello`**.

When you add `@ResponseBody`, **Spring will not look for a view**.  
**It will directly return the data** (like plain text, JSON, etc.) to the browser or client.

Example:

```java
@Controller
public class MyController {

    @GetMapping("/hello")
    @ResponseBody
    public String sayHello() {
        return "Hello, World!";
    }
}
```

Now, **Spring will return the text `Hello, World!` directly** in the browser.

You will **see "Hello, World!" as response**, not any HTML page. It can be object (json) as well


- `@ResponseBody` tells Spring: **"Don't search for a view, just send the return data directly to the client."**

If you want to build REST APIs, instead of `@Controller + @ResponseBody`, you can also use `@RestController` — it does the same thing automatically!



`@RestController`:
This is a specialization of `@Controller` that combines the `@Controller` and `@ResponseBody` annotations. It's used to create RESTful web services, where the methods return data directly to the response body.

`@Autowired`:
This annotation is used to inject dependencies automatically. It can be applied to fields, constructors, or methods. Spring will automatically look for a bean of the required type and inject it into the annotated element.

`@Qualifier`:
When multiple beans of the same type are available for injection, the `@Qualifier` annotation can be used with `@Autowired` to specify which particular bean should be injected.

`@Primary`:
When multiple beans of the same type are available for injection, the `@Primary` annotation can be used to specify which particular bean should be prioritized first.

`@Lazy`:
This annotation is used to indicate that a bean should be initialized lazily, i.e., only <font color="#ffc000">when it is first requested, rather than during the application startup. </font>By default, Spring Boot is eager-loaded, meaning it creates beans automatically.

`@Scope`:
This annotation is used to define the scope of a bean. It determines the<font color="#ffc000"> lifecycle and visibility of a bean.</font> Common scopes include `singleton` (default), `prototype`, `request`, `session`, etc.

`@Value`:
This annotation is used to inject values from property sources (e.g., properties files) into fields or constructor parameters. It can be used to inject simple values or expressions.

`@PropertySource`:
 This annotation Used on class level and  used to specify the location of property files that Spring should use to resolve property values. It's often used in conjunction with the `@Value` annotation to inject properties.

`@ConfigurationProperties`:
This annotation can be used on class level as well as on method level(rare case) and used to bind external properties directly to a Java bean. It allows you to group multiple properties under a single Java class and inject them into your application.

`@Profile`:
This annotation can be used with class or method level and  used to define a profile for beans. <font color="#ffc000">Beans annotated with `@Profile` will only be registered and created if the specified profiles are active.</font>

`@ControllerAdvice`:
This annotation is used to define global exception handlers and advice for controllers. Use `@ControllerAdvice` when dealing with traditional web applications that return both views and data. Use `@RestControllerAdvice` when building APIs where your controllers return data in formats like JSON or XML.

`@RestControllerAdvice`:
`@RestControllerAdvice` is an annotation in Spring used to define a global exception handler class. It's typically placed on a class that contains methods for handling exceptions thrown by controllers across the entire application. It combines the functionality of `@ControllerAdvice` and `@ResponseBody`, which means it can handle exceptions and return responses in a RESTful format (usually JSON) suitable for APIs.

`@ExceptionHandler`:
`@ExceptionHandler` is an annotation used within a class annotated with `@RestControllerAdvice` to define methods that handle specific types of exceptions.

`@ResponseStatus`:
`@ResponseStatus` is an annotation used to specify the HTTP status code that should be sent in the response when a particular exception is handled.
