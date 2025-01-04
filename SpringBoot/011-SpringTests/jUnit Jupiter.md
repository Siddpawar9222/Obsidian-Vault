

---


**JUnit Jupiter** is the name of the programming and extension model for **JUnit 5**, the modern version of the JUnit testing framework used in Java.

JUnit 5 is divided into three main modules:

1. **JUnit Platform**:
    
    - The foundation for launching testing frameworks on the JVM.
    - Provides support for discovery and execution of tests.
2. **JUnit Jupiter**:
    
    - Provides the programming model and API for writing tests.
    - Introduces new annotations and features not available in earlier versions (like JUnit 4).
    - Supports features such as lambda expressions, dynamic tests, and parameterized tests.
3. **JUnit Vintage**:
    
    - Provides backward compatibility for running JUnit 3 and JUnit 4 tests in the JUnit 5 environment.

---

### **Features of JUnit Jupiter**

- **New Annotations**:
    
    - `@Test`: Marks a test method.
    - `@BeforeEach`: Runs before each test method.
    - `@AfterEach`: Runs after each test method.
    - `@BeforeAll`: Runs once before all tests in the class (must be static).
    - `@AfterAll`: Runs once after all tests in the class (must be static).
    - `@Disabled`: Disables a test or class temporarily.
    - `@DisplayName`: Provides a custom name for a test.
- **Assertions**:
    
    - `assertEquals()`: Asserts two values are equal.
    - `assertTrue()`: Asserts a condition is `true`.
    - `assertThrows()`: Asserts that a specific exception is thrown.
- **Parameterization**:
    
    - Supports parameterized tests with the `@ParameterizedTest` annotation.
- **Dynamic Tests**:
    
    - Allows creating tests dynamically at runtime using `DynamicTest`.

---

### **Example: A Simple Test with JUnit Jupiter**

```java
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }

    @Test
    void testAddition() {
        int result = calculator.add(2, 3);
        assertEquals(5, result);
    }

    @Test
    void testSubtraction() {
        int result = calculator.subtract(5, 2);
        assertEquals(3, result);
    }

    @AfterEach
    void tearDown() {
        calculator = null;
    }
}
```

---

### **Advantages of JUnit Jupiter**

- Modernized syntax, leveraging Java 8 features like lambdas.
- More flexible and modular compared to JUnit 4.
- Backward compatibility with JUnit 4 tests using the JUnit Vintage module.
- Advanced test configurations and dynamic test creation.

Let me know if you'd like a deeper dive into any part of JUnit Jupiter!