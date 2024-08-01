### Spring Boot Architecture:

![[spring-boot-architecture.png]]

![[Pasted image 20240728130212.png]]

#### Presentation Layer
- **Role**: Handles HTTP requests, translates JSON parameters to objects, authenticates requests, and transfers them to the business layer.
- **Components**: Views (frontend part), Controllers.

#### Business Layer
- **Role**: Manages all business logic, uses service classes, and provides services to the data access layers. It also performs authorization and validation.
- **Components**: Service classes, Business logic.

#### Persistence Layer
- **Role**: Manages storage logic and translates business objects from and to database rows.
- **Components**: Repositories, DAOs (Data Access Objects).

#### Database Layer
- **Role**: Performs CRUD (Create, Retrieve, Update, Delete) operations.
- **Components**: Database tables and entities.

### How Spring Internally Works:

1. **Starting the Application**:
   - Uses a main class with `@SpringBootApplication`, which includes `@EnableAutoConfiguration` to trigger automatic configuration.

2. **Auto-Configuration**:
   - Sets up the application based on its dependencies and configuring beans accordingly.

3. **Spring IoC Container**:
   - Manages beans annotated with `@Component`, `@Service`, `@Repository`, or `@Controller`.

4. **Application Context**:
   - Creates a container for managing beans and handling dependency injection.

5. **Component Scanning**:
   - Automatically scans for components in the main application class's package and sub-packages.

6. **Dependency Injection**:
   - Injects dependencies between beans using `@Autowired` or constructor injection.

7. **Web Server Initialization**:
   - Initializes an embedded web server (like Tomcat) if web dependencies are present.

8. **Auto-Configuration of Web Components**:
   - Configures web components like `DispatcherServlet` for handling web requests, customizable via properties.

9. **External Configuration**:
   - Configures the application using external files or environment variables, with the option to override defaults.

10. **Running the Application**:
    - The `main` method in the main class initializes the context, performs auto-configuration, and starts the embedded web server.

11. **Handling Requests**:
    - Uses `DispatcherServlet` to manage incoming HTTP requests, directing them to appropriate controllers.

12. **Response Rendering**:
    - Controllers prepare responses, which can be views, JSON, etc., with Spring Boot selecting a suitable view resolver.

13. **Shutting Down**:
    - Gracefully shuts down the embedded web server and releases resources when the application stops.

### Spring Boot Internal Architecture:

**For Spring MVC:**

![[SpringbootintenalArchi1.jpeg]]
#### Handler Mapping:
- **Purpose**: Determines which controller should handle an incoming request based on the request URL.
- **Functionality**: Maps URLs to controller methods using annotations like `@RequestMapping`.
- **Types**:
  - `RequestMappingHandlerMapping`: Default handler mapping using annotations.
  - `BeanNameUrlHandlerMapping`: Maps URLs based on controller bean names.
  - **Custom Implementations**: Possible for specific requirements.

#### DispatcherServlet:
- **Purpose**: Acts as the front controller of a Spring MVC application, dispatching incoming requests to the appropriate handler.
- **Functionality**: Receives requests, consults `HandlerMapping` to determine the appropriate handler, and delegates the request for processing.
- **Request Processing Workflow**:
  - Consults `HandlerMapping` to find the handler.
  - Invokes the handler method.
  - Handler processes the request and returns a `ModelAndView` or suitable result.
  - May apply interceptors before and after invoking the handler.