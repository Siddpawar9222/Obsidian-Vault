
---
### **`@SpringBootTest`**

- **Purpose**:
    
    - It tells Spring Boot to load the complete application context for testing.
    - It ensures all beans are created and dependencies are injected, just as they would be in a running application.
- **When to Use**:
    
    - For testing the application as a whole, including all configurations and dependencies.
    - When you need to test components that rely on the Spring context, such as services, repositories, or controllers.
- **How It Works**:
    
    - By default, it starts the entire application context, including embedded servers (like Tomcat) for web applications.
    - You can configure it to customize the environment, e.g., disable server startup, use specific properties, etc.

Example:

```java
@SpringBootTest
public class MyServiceTest {
    @Autowired
    private MyService myService;

    @Test
    void testServiceLogic() {
        // Your test logic here
    }
}
```

---

- we dont right test cases for method which are already implemented.  Tests cases already written by those methods
- The _Surefire Plugin_(maven plugin) is used during the test phase of the build lifecycle to execute the unit tests of an application. `mvn test`
- code coverage is used to get  report for test (how many lines are covered)

