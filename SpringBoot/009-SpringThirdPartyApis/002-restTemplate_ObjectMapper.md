
---
## Jackson:
- Jackson is a **library** for converting between **Java objects** and **JSON**.
- It makes it easy to **serialize** (Java to JSON) and **deserialize** (JSON to Java).
- Jackson is widely used in Spring Boot applications for working with JSON in REST APIs.

---

## ObjectMapper

`ObjectMapper` is a class from the Jackson library used to convert Java objects to JSON and vice versa. It helps with **serialization** (converting Java objects to JSON) and **deserialization** (converting JSON to Java objects).

### Key Uses of `ObjectMapper`:

1. **Convert Java Objects to JSON (Serialization)**:
   - If you have a Java object (like a `User` object), and you want to turn it into a JSON string to send it in an API response, you can use `ObjectMapper`.

   Example:
   ```java
   User user = new User("John", 25);
   ObjectMapper objectMapper = new ObjectMapper();
   String jsonString = objectMapper.writeValueAsString(user);
   System.out.println(jsonString);  // Output: {"name":"John","age":25}
   ```

2. **Convert JSON to Java Objects (Deserialization)**:
   - If you receive a JSON response from an API and want to convert it to a Java object for easier processing, you can use `ObjectMapper` to do that.

   Example:
   ```java
   String json = "{\"name\":\"John\", \"age\":25}";
   ObjectMapper objectMapper = new ObjectMapper();
   User user = objectMapper.readValue(json, User.class);
   System.out.println(user.getName());  // Output: John
   ```

### Why is `ObjectMapper` important?

- **Ease of Use**: `ObjectMapper` automatically converts between JSON and Java objects, so you don't need to manually write complex code to handle the transformation.
- **Common in APIs**: When working with REST APIs in Spring Boot, most of the time, your input/output will be in JSON. `ObjectMapper` helps handle this conversion easily.
- **Customization**: You can customize how `ObjectMapper` works. For example, you can ignore certain fields, change date formats, or handle missing fields gracefully.

### How Does Spring Boot Use `ObjectMapper`?
Spring Boot automatically uses Jackson's `ObjectMapper` under the hood when you work with JSON in REST APIs. When you send or receive JSON in a `@RestController`, Spring Boot uses `ObjectMapper` to handle the conversion for you.

Example in a Spring Boot controller:
```java
@RestController
public class UserController {

    @PostMapping("/createUser")
    public User createUser(@RequestBody User user) {
        // Spring Boot automatically converts the incoming JSON to a User object
        return user;
    }
}
```
Here, Spring Boot uses `ObjectMapper` to convert the JSON request body into the `User` object automatically.

In summary, `ObjectMapper` is a tool that helps you work with JSON easily in Spring Boot applications by converting between Java objects and JSON.


--- 

## Steps to handle response data :

1. **Take Data as String (For Safety)**
   - By fetching the response as a raw `String`, you ensure that you capture the response exactly as it is. This is useful in cases where the API response might not always match the expected format or when there might be additional metadata or error details that you want to inspect.
   - You can log or debug the raw string response before moving forward with deserialization to better understand the API behavior.

   ```java
   ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
   String rawResponse = response.getBody();
   ```

2. **Convert into an Object**
   - Once you've safely captured the raw string, you can use a JSON parsing library like Jackson to convert the string into an object, typically using `ObjectMapper`.


   ```java
   ObjectMapper objectMapper = new ObjectMapper();
   JsonNode rootNode = objectMapper.readTree(rawResponse);  // Converts to JsonNode or object for observation
   ```

3. **Observe the Data**
   - By converting the raw string into a generic structure (like `JsonNode` in Jackson), you can explore the structure of the response.
   - For instance, in your case, you noticed that the data can be converted into a `List<Object>`, but before doing so, it's good practice to observe whether the data is structured as a list, map, or object.
   - By inspecting `JsonNode`, you can check if the response is an array, an object, or contains certain fields, and adjust your parsing logic accordingly.

   ```java
   if (rootNode.isArray()) {
       // You can safely convert it to a list of objects
       List<MyObject> dataList = objectMapper.convertValue(rootNode, new TypeReference<List<MyObject>>() {});
   }
   ```

4. **Filter Data Using `ListNode` or `JsonNode`**
   - If the API returns a large amount of data and you only need specific fields or want to filter it, you can use `JsonNode` or `ListNode` (a subclass of `JsonNode` for arrays in Jackson) to extract the relevant fields.
   - This avoids deserializing unnecessary fields and lets you focus on only the parts of the response you care about.

   Example: Using `ListNode` to filter and extract specific fields:

   ```java
   if (rootNode.isArray()) {
       ArrayNode arrayNode = (ArrayNode) rootNode;
       for (JsonNode node : arrayNode) {
           // Extract only the required fields from each object
           String requiredField = node.get("fieldName").asText();
           System.out.println(requiredField);  // Or save it to a new filtered list
       }
   }
   ```

### Steps In Short:

1. **Get Data as String**: First, fetch the API response as a plain string to capture it exactly as it is. This gives you flexibility and safety.

2. **Convert String to JSON Object**: Use a JSON library (like Jackson) to convert the string into a JSON object. This lets you explore the structure of the data.

3. **Check Data Structure**: After converting, check if the data is a list (array) or object. This helps you understand how to handle the data.

4. **Filter Required Fields**: Use JSON parsing (like `JsonNode`) to extract only the fields you need, like filtering a large list to get specific values.

5. **Return Filtered Data**: Once filtered, convert the data into your required format (like a list of objects) and return it.


## Note :

### Why Use `String.class` with `RestTemplate`:

1. **Flexibility**: Captures the raw response as a string, allowing you to inspect and process it before deserialization.

2. **Better Error Handling**: Allows you to handle deserialization errors and response inconsistencies by checking the raw data first.

3. **Complex Responses**: Helps handle dynamic or complex structures by giving you the raw data to determine the appropriate deserialization approach.

4. **Control Over Deserialization**: Provides manual control over how data is deserialized, useful for custom mappings or format handling.

5. **API Standardization**: Ensures you receive the response as a string, accommodating variations in API responses.

6. **Pagination and Metadata**: Allows you to inspect headers and metadata (like pagination links) before processing the body.

### When to Use Direct Deserialization:

- **Known Response Structure**: If the response format is fixed and predictable, you can directly deserialize to classes like `List`, `Map`, or custom objects.
  
  Example:
  ```java
  ResponseEntity<List<MyObject>> response = restTemplate.exchange(url, HttpMethod.GET, entity, new ParameterizedTypeReference<List<MyObject>>() {});
  ```