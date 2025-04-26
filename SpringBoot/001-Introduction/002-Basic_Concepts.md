
---

### Understanding Libraries and Frameworks

A **library** is like hiring a specialized team of workers for different tasks when building a house. For example, you might hire a team just to lay the foundation. They come with all the expertise and tools needed for that specific job, allowing you to focus on other parts of the project. Similarly, in programming, <font color="#ffff00">a library is a collection of pre-written code that you can use in your own programs to perform specific tasks.</font> For example, if you need to work with dates in your program, you can use a date library that already has all the code for handling dates.


A **framework** is like hiring a team of builders to help you construct your house. Instead of just giving them tools, you also give them a blueprint or a plan to follow. This blueprint tells them how to build the house step by step, what materials to use, and where everything should go. Similarly, in programming, <font color="#ffff00">a framework is a set of rules and guidelines that help you build your application.</font> It provides a structure for your code, dictates how different parts of your application should interact, and often comes with pre-built components to speed up development.



![[libraryVsframework.png]]



---
### Understanding APIs and REST

**API (Application Programming Interface)**

An API is a way for different pieces of software to communicate with each other. Imagine you have two friends who speak different languages. They want to talk, but they need someone to help them understand each other. That someone is like an API.

In web development, an API often refers to how we retrieve information from an online service. The API documentation provides a list of URLs, query parameters, and details on how to make requests. It also explains what kind of responses to expect.

**REST (Representational State Transfer)**

REST is a set of rules for building web APIs. REST provides guidelines for structuring APIs. This makes it easier for developers to create and use APIs. REST ensures that APIs are built in a standard way, saving time and making them easier to understand.


**Key Differences**

- **<font color="#c00000">API</font>** :<font color="#ffff00"> An API is  the way two pieces of software communicate with each other. It's like a bridge that allows them to exchange information and requests.</font>

- **<font color="#c00000">REST</font>** : <font color="#ffff00">REST API involves a set of rules or constraints. These rules are specifically for how web APIs should be structured and how requests and responses should be formatted. REST is a type of API.</font>

#### **Other API Paradigms**

### 1. **REST API**

- Uses **HTTP**.
    
- Data in **JSON** format.
    
- Simple and fast.
    
- Example:
    
    - `GET /users`
        
    - `POST /products`
        

 Most common in modern apps.

---

### 2. **SOAP API**

- Uses **XML**.
    
- Heavy and strict.
    
- Used in **banking and enterprise systems**.
    

---

### 3. **GraphQL API**

- **Client can choose** what data to fetch.
    
- Only one endpoint (usually `/graphql`).
    
- Use case: Facebook uses GraphQL.
    

---

### 4. **WebSocket API**

- For **real-time communication** (chat, notifications).
    
- Keeps a **constant connection** between client and server.

---
**Another Example**
Imagine you want to borrow a book from the library. You approach the librarian for help. In this scenario:

- **Librarian**: The librarian represents the API, handling your requests and providing responses.
- **Actions (Get and Submit a Book)**: The actions you perform (like getting a book or submitting a book) represent RESTful API operations.



**REST API:**

![[rest.pdf]]


---

### HTTP status codes : 

<font color="#ffc000">HTTP  codes are three-digit numbers that provide information about the outcome of a client's request to a server.</font> They are part of the HTTP protocol and are included in the response header when a server responds to a client's request. Status codes fall into different classes, each indicating a different category of response.

Here are some common classes of HTTP status codes and their meanings:

#### Informational (1xx)
- **100 Continue**: The server has received the request headers, and the client should proceed to send the request body.
- **101 Switching Protocols**: The requester has asked the server to switch protocols, and the server is acknowledging that it will do so.

#### Success (2xx)
- **200 OK**: The request was successful.
- **201 Created**: The request was successful, and a new resource was created as a result.
- **202 Accepted**: The request has been accepted for processing, but the processing is not complete.
- **204 No Content**: The server successfully processed the request, but there is no content to return.

#### Redirection (3xx)
- **301 Moved Permanently**: The requested resource has been permanently moved to a new URL.
- **302 Found**: The requested resource has been temporarily moved to a different URL.
- **304 Not Modified**: The resource has not been modified since the last request.

#### Client Errors (4xx)
- **400 Bad Request**: The server could not understand the request due to invalid syntax.
- **401 Unauthorized**: The client must authenticate itself to get the requested response.
- **403 Forbidden**: The client does not have access rights to the content.
- **404 Not Found**: The server can not find the requested resource.
- **405 Method Not Allowed**: The request method is known by the server but has been disabled and cannot be used.
- **409 Conflict**: The request could not be completed due to a conflict with the current state of the resource.
- **429 Too Many Requests**: The user has sent too many requests in a given amount of time.

#### Server Errors (5xx)
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.
- **501 Not Implemented**: The server does not support the functionality required to fulfill the request.
- **502 Bad Gateway**: The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- **503 Service Unavailable**: The server is not ready to handle the request, usually due to maintenance or overload.
- **504 Gateway Timeout**: The server, while acting as a gateway or proxy, did not get a response in time from the upstream server.

---
## **1. What are HTTP Headers?**

When your browser or app communicates with a server (like Spring Boot), they send and receive **HTTP requests and responses**.

An **HTTP Header** is like a **label** or **tag** that provides **extra information** about the request or response (it can information about body, request authentication etc) .


---

## **2. Why are headers important for PDF or CSV download?**

When your Spring Boot backend sends a file (like PDF or CSV), you need to **tell the browser**:

- What kind of file it is (PDF, CSV, image, etc.)
    
- How the browser should treat it (Open it? Or download it?)
    

This is done using headers like:

- `Content-Type`
    
- `Content-Disposition`
    

---

##  Important Headers for File Downloads

### **a. Content-Type**

This tells the browser **what kind of file** is being sent.

Examples:

- PDF: `application/pdf`
    
- CSV: `text/csv`
    
- Excel: `application/vnd.ms-excel`
    
- Word: `application/msword`
    

### ** Content-Disposition**

This tells the browser how to **handle** the file:

- Show it in browser
    
- OR download it with a specific name
    

Example:

```http
Content-Disposition: attachment; filename="mydata.csv"
```

- `attachment`: Tells browser to download the file.
    
- `filename`: Suggested name of the file when downloading.
    

---

## **4. Example in Spring Boot (CSV download)**

Here is a **Java code example** to generate and download a CSV file:

```java
@GetMapping("/download-csv")
public ResponseEntity<byte[]> downloadCsv() {
    String csvContent = "Name,Email\nJohn,john@example.com\nJane,jane@example.com";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.TEXT_PLAIN); // CSV is plain text
    headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"users.csv\"");

    return new ResponseEntity<>(csvContent.getBytes(), headers, HttpStatus.OK);
}
```

### Output:

When you hit `http://localhost:8080/download-csv`, browser will:

- Get a CSV file
    
- Automatically download it as `users.csv`
    

---

## **5. Example for PDF download**

```java
@GetMapping("/download-pdf")
public ResponseEntity<byte[]> downloadPdf() {
    // Sample PDF content (normally, you generate real PDF bytes using iText or other libraries)
    byte[] pdfBytes = ...; // Generate or load your PDF bytes here

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"report.pdf\"");

    return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
}
```

---


Nowadays most APIs use **JSON**, but **XML** is still used in some systems (like banking, legacy systems, or integrations with SOAP-based APIs).


---

## **1. Add dependency**

If you're using **Spring Boot with Spring Web**, you don’t need any extra dependency because it already includes support for XML using **Jackson** and **JAXB**.

If not working, you can add this to your `pom.xml`:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

---

## **2. Create a Java class (POJO)**

To convert Java objects into XML, annotate your class with `@XmlRootElement`.

```java
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class User {
    private String name;
    private String email;

    // Default constructor is required
    public User() {}

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

---

## **3. Create Controller to return XML**

```java
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping(value = "/user", produces = MediaType.APPLICATION_XML_VALUE)
    public User getUser() {
        return new User("Siddhesh", "siddhesh@example.com");
    }

    @PostMapping(value = "/user", consumes = MediaType.APPLICATION_XML_VALUE)
    public String createUser(@RequestBody User user) {
        return "Received XML for user: " + user.getName();
    }
}
```

---

## **4. How to test?**

You can use **Postman**, **curl**, or your frontend app.

### For GET request (to receive XML):

Hit:

```
GET http://localhost:8080/api/user
Accept: application/xml
```

You will receive:

```xml
<user>
    <name>Siddhesh</name>
    <email>siddhesh@example.com</email>
</user>
```

### For POST request (send XML):

Send:

```
POST http://localhost:8080/api/user
Content-Type: application/xml

<user>
    <name>Siddhesh</name>
    <email>siddhesh@example.com</email>
</user>
```

---

## **Summary**

|Task|What to use|
|---|---|
|Send XML|`produces = MediaType.APPLICATION_XML_VALUE`|
|Receive XML|`consumes = MediaType.APPLICATION_XML_VALUE`|
|Java Object to XML|Use `@XmlRootElement` and getter/setters|
|Dependency (optional)|`jackson-dataformat-xml`|

---

###  Content-Type vs MediaType

Both refer to the **type of data** being sent or expected in an HTTP request or response.

| Term           | Meaning                                                                            | Where it's used                                 |
| -------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| `Content-Type` | **Header** in HTTP request/response that says **what kind of data** is being sent. | Used in actual HTTP communication               |
| `MediaType`    | **Java class** (in Spring framework) that represents different **Content-Types**.  | Used in Java code (like Spring Boot controller) |


---

### Example 2: API request

Let’s say your frontend sends a POST request with a JSON body:

#### HTTP (Browser or Postman)

```http
POST /api/user
Content-Type: application/json
```

#### In Spring Boot Controller

```java
@PostMapping(value = "/api/user", consumes = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<String> createUser(@RequestBody User user) {
    // handle request
}
```

- `"application/json"` → this is the **Content-Type header**.
    
- `MediaType.APPLICATION_JSON_VALUE` → this is how you use it in **Java code** with Spring.
    

  When a client (like frontend or Postman) sends a request with JSON data, both should **match** so that Spring Boot knows how to handle it.
---
