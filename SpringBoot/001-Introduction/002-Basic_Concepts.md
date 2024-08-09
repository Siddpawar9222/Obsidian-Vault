
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