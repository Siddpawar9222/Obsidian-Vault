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


## Spring Boot Application Startup Flow

When you run a Spring Boot application, several important processes happen behind the scenes. :

1. **Application Launch**: You trigger the application start (via IDE, command line, etc.)
    
2. **Bootstrap Phase**:
    - Spring Boot identifies the main class (with `@SpringBootApplication`)
    - Creates the Spring ApplicationContext (the core container that holds all components)
    - Sets up initial configuration from properties files, environment variables, etc.
    - 
3. **Auto-configuration Magic**:
    - Spring Boot scans your classpath for libraries and dependencies
    - Automatically configures components based on what it finds
    - For example, if it finds database libraries, it sets up database connections
4. **Component Scanning**:
    - Searches through your project packages for Spring components
    - Finds classes marked with annotations like `@Component`, `@Service`, `@Controller`, etc.
    - Registers these as beans in the application context
5. **Dependency Injection**:
    - Connects all your beans together based on their dependencies
    - Resolves `@Autowired` fields and constructor parameters
    - Creates a complete network of connected components
<font color="#c0504d">6. **Application Events**:</font>
    - Fires various events during startup (e.g., ApplicationStartedEvent)
    - Runs any registered event listeners
7. **Embedded Server Startup** (for web applications):
    - Creates and configures an embedded web server (Tomcat by default)
    - Sets up servlets, filters, and other web components
    - Starts the server on the configured port (default 8080)
8. **Ready State**:
    - Application is fully initialized and ready to handle requests
    - Logs "Started Application in X seconds" message

This entire process is what makes Spring Boot so powerful - it handles all this complex setup automatically, letting you focus on writing your business logic instead of configuration.

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