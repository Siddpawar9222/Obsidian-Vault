
---

Unit test  Encourage test driven development.
For unit test in java mainly we use junit , assertJ and mockito libraries. 
Spring boot test dependency provides this in budled . 
we can use h2 in-memory database for repo and service layer.


---

### Difference between  jUnit , assertJ and mockito :

### 1. **JUnit**
   - **Purpose**: JUnit is the primary framework used to write and run tests in Java.
   - **What it does**: It provides the foundational structure for creating test cases with annotations like `@Test`, `@BeforeEach`, and `@AfterEach`.
   - **Where it’s used**: You use JUnit to write unit tests for individual methods or classes. It’s also used to structure and manage the lifecycle of tests.

   **Example Use Case**:
   - Let’s say you have a method called `calculateTotal()` that adds two numbers. You would use JUnit to set up the test and run the method with a few inputs to check if it returns the correct total.

   ```java
   @Test
   public void testCalculateTotal() {
       Calculator calculator = new Calculator();
       int result = calculator.calculateTotal(10, 20);
       assertEquals(30, result); // Basic assertion
   }
   ```

   **Common JUnit Annotations**:
   - `@Test`: Marks a method as a test.
   - `@BeforeEach` / `@AfterEach`: Run code before or after each test method.
   - `@BeforeAll` / `@AfterAll`: Run code once before or after all tests in the class.

   **When to Use JUnit**:
   - Use JUnit whenever you write tests for Java methods or classes. It’s the base framework, so you’ll always need it, regardless of whether you’re also using AssertJ or Mockito.

---

### 2. **AssertJ**
   - **Purpose**: AssertJ is a fluent assertion library that provides advanced, readable, and more powerful assertions compared to JUnit’s built-in assertions.
   - **What it does**: It helps you make your test results more readable and descriptive with methods like `isEqualTo`, `isGreaterThan`, or `contains`.
   - **Where it’s used**: AssertJ is used alongside JUnit, not as a replacement. It’s great for making complex assertions, such as checking the contents of a collection or multiple conditions on an object.

   **Example Use Case**:
   - If you want to verify that a `List` contains exactly three elements, and one of those elements matches specific properties, AssertJ makes it easy to write and read these checks.

   ```java
   List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
   assertThat(names)
       .hasSize(3)
       .contains("Alice")
       .doesNotContain("Daniel");
   ```

   **When to Use AssertJ**:
   - Use AssertJ when you need to make detailed or complex assertions.
   - It’s especially helpful when asserting properties on collections, comparing custom objects, or performing multiple checks in a single line. While JUnit’s `assertEquals` and `assertTrue` are great for simple checks, AssertJ enhances readability for complex cases.

---

### 3. **Mockito**
   - **Purpose**: Mockito is a mocking framework that allows you to create mock (fake) objects of classes. This lets you isolate the code under test from its dependencies.
   - **What it does**: Mockito enables you to simulate the behavior of dependencies, such as services or databases, which you don’t want to interact with directly during a test.
   - **Where it’s used**: It’s used in situations where a class has dependencies that you don’t want to involve in the test, such as database connections, API calls, or external services.

   **Example Use Case**:
   - Suppose you’re testing a `CartService` class that depends on an `InventoryService`. You can mock `InventoryService` to provide fake data, so you can test `CartService` independently without actually calling the inventory system.

   ```java
   @ExtendWith(MockitoExtension.class)
   public class CartServiceTest {
       @Mock
       private InventoryService inventoryService;

       @InjectMocks
       private CartService cartService;

       @Test
       public void testCalculateTotalWithMocks() {
           when(inventoryService.getItemPrice("apple")).thenReturn(2.0);
           double result = cartService.calculateTotal("apple", 5);
           assertEquals(10, result);
       }
   }
   ```

   **Common Mockito Methods**:
   - `@Mock`: Creates a mock object.
   - `@InjectMocks`: Injects mocks into the class under test.
   - `when(...)`: Defines mock behavior (e.g., what a mock should return when a specific method is called).
   - `verify(...)`: Verifies if a method was called on the mock with expected arguments.

   **When to Use Mockito**:
   - Use Mockito whenever you need to isolate the unit under test from its dependencies.
   - It’s perfect for service classes, controller tests, or any place where you want to simulate external services or complex dependencies.

---
