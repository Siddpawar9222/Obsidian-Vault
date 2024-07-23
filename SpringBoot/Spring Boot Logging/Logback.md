
By Default Logging for spring boot. 

### How to implement for class ? 
private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeService.class);

We can use @Slf4j annotation directly too.


### What is SLF4J?
**SLF4J (Simple Logging Facade for Java)** is an abstraction layer for various logging frameworks. It allows developers to write logging code that is independent of the actual logging implementation. This means you can switch between different logging frameworks (like Logback, Log4j, etc.) without changing your application code.

### How is it Related to Logback?
**Logback** is one of the implementations of the SLF4J API. When you use SLF4J in your application and configure Logback as your logging implementation, SLF4J will delegate the logging calls to Logback.

### Simple Explanation
- **SLF4J**: Think of it as a universal remote control that can work with different brands of TVs (logging frameworks).
- **Logback**: One of the specific TVs that the universal remote control (SLF4J) can operate.

### Usage in Code
When you write:
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeService.class);
```
You are using SLF4J to create a logger. If Logback is your configured logging framework, SLF4J will send the logging messages to Logback, which will then handle how the messages are actually logged (e.g., to a file, console, etc.).

### In Short :
- **SLF4J**: A flexible API for logging in Java.
- **Logback**: A specific implementation of the SLF4J API.
- **SLF4J + Logback**: SLF4J provides the logging interface, and Logback provides the actual logging implementation.

Logging levels  severity. 
- TRACE  (less danger)
- DEBUG
- INFO
- WARN
- ERROR (high danger)

Customize logging : 
```
#logger  
#logging.level.root=off  
#logging.level.root=debug  
#logging.level.root=warn  
  
# logging for particular package  
logging.level.com.example.SpringLogger_1=trace
```

**#logging.level.root=warn **  means logs with severity equal to warn and greater than warn will be execute. Means logs with warn and error will  be executed. 