
---

### Understanding Libraries and Frameworks

A **library** is like hiring a specialized team of workers for different tasks when building a house. For example, you might hire a team just to lay the foundation. They come with all the expertise and tools needed for that specific job, allowing you to focus on other parts of the project. Similarly, in programming, a library is a collection of pre-written code that you can use in your own programs to perform specific tasks. For example, if you need to work with dates in your program, you can use a date library that already has all the code for handling dates.


A **framework** is like hiring a team of builders to help you construct your house. Instead of just giving them tools, you also give them a blueprint or a plan to follow. This blueprint tells them how to build the house step by step, what materials to use, and where everything should go. Similarly, in programming, a framework is a set of rules and guidelines that help you build your application. It provides a structure for your code, dictates how different parts of your application should interact, and often comes with pre-built components to speed up development.



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

**Other API Paradigms**

While REST is popular, there are other types of APIs, such as SOAP and GraphQL. Each has its own set of rules and uses.

---
**Another Example**
Imagine you want to borrow a book from the library. You approach the librarian for help. In this scenario:

- **Librarian**: The librarian represents the API, handling your requests and providing responses.
- **Actions (Get and Submit a Book)**: The actions you perform (like getting a book or submitting a book) represent RESTful API operations.



**REST API:**

![[rest.pdf]]


---

### HTTP status codes : 

HTTP status codes are three-digit numbers that provide information about the outcome of a client's request to a server. They are part of the HTTP protocol and are included in the response header when a server responds to a client's request. Status codes fall into different classes, each indicating a different category of response.

Here are some common classes of HTTP status codes and their meanings:

1. **1xx - Informational**:
   - These status codes indicate that the request was received, the process is continuing, or is in progress.

   **Example**:
   - 100 Continue: The initial part of the request has been received, and the client should proceed with the request.

2. **2xx - Success**:
   - These status codes indicate that the request was successfully received, understood, and accepted.

   **Examples**:
   - 200 OK: The request was successful.
   - 201 Created: The request resulted in a new resource being successfully created.

3. **3xx - Redirection**:
   - These status codes indicate that further action needs to be taken to complete the request.

   **Examples**:
   - 301 Moved Permanently: The requested resource has been permanently moved to a different location.
   - 302 Found (or 307 Temporary Redirect): The requested resource has been temporarily moved to a different location.

4. **4xx - Client Errors**:
   - These status codes indicate that there was a problem with the client's request.

   **Examples**:
   - 400 Bad Request: The server cannot process the request because the client's request is malformed.
   - 401 Unauthorized: The request requires user authentication.
   - 404 Not Found: The server cannot find the requested resource.

5. **5xx - Server Errors**:
   - These status codes indicate that there was an error on the server's side.

   **Examples**:
   - 500 Internal Server Error: A generic error message returned when an unexpected condition was encountered on the server.
   - 503 Service Unavailable: The server is not ready to handle the request. Common causes include maintenance or temporary overloading.