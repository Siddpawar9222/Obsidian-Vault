
---

Logging in Spring Boot is important because it helps developers understand what their application is doing. Here are the main reasons why logging is needed:

1. **Debugging**: When something goes wrong, logs can show you what happened and help you find and fix the problem.
2. **Monitoring**: Logs provide insights into the application's performance and behavior, helping you keep track of its health.
3. **Auditing**: Logs can record important actions taken by users or the system, which is useful for security and compliance.
4. **Troubleshooting**: When users report issues, logs can help you see the sequence of events that led to the problem.
5. **Development**: During development, logs can help you understand the flow of your application and ensure it behaves as expected.

In simple terms, logging acts like a diary for your application, recording important events and actions, which makes it easier to manage and maintain the software.

---
### Understand Meaning of Log : 
Log entry is a typical startup log message in a Spring Boot application, providing crucial information about the startup environment, including the application name, Java version, machine name, process ID, user who started the application, and file paths involved. 

### Log Message
```
2024-05-29 08:43:06.076  INFO 16336 --- [           main] c.b.axiom.AxiomProtectApplication        : Starting AxiomProtectApplication using Java 18.0.1.1 on DESKTOP-P8OVUBH with PID 16336 (E:\Destop\Company\BB\BB Work\AxiomProtect-master - v2\AxiomProtect-master\AxiomProtect\target\classes started by hp in E:\Destop\Company\BB\BB Work\AxiomProtect-master - v2\AxiomProtect-master\AxiomProtect)
```

### Breakdown

1. **Timestamp:**
   ```
   2024-05-29 08:43:06.076
   ```
   - This is the date and time when the log message was generated. It indicates that the log entry was created on May 29, 2024, at 08:43:06.076 AM.

2. **Log Level:**
   ```
   INFO
   ```
   - This indicates the severity level of the log. In this case, it is an informational message (`INFO`), which typically signifies routine information about application operation.

3. **Process ID (PID):**
   ```
   16336
   ```
   - The process ID (PID) of the running Java process is 16336. This can be useful for identifying which instance of the application generated the log entry, especially if multiple instances are running.

4. **Thread:**
   ```
   [           main]
   ```
   - This indicates that the log entry was generated by the `main` thread, which is the primary thread for running the application.

5. **Logger Name:**
   ```
   c.b.axiom.AxiomProtectApplication
   ```
   - This is the fully qualified name of the class that generated the log message. In this case, it's the `AxiomProtectApplication` class in the `c.b.axiom` package.

6. **Message:**
   ```
   Starting AxiomProtectApplication using Java 18.0.1.1 on DESKTOP-P8OVUBH with PID 16336 (E:\Destop\Company\BB\BB Work\AxiomProtect-master - v2\AxiomProtect-master\AxiomProtect\target\classes started by hp in E:\Destop\Company\BB\BB Work\AxiomProtect-master - v2\AxiomProtect-master\AxiomProtect)
   ```
   - This is the actual log message providing detailed information about what is happening:
     - **Starting AxiomProtectApplication:** Indicates that the `AxiomProtectApplication` is starting.
     - **using Java 18.0.1.1:** Specifies the version of Java being used to run the application.
     - **on DESKTOP-P8OVUBH:** The hostname of the machine where the application is running.
     - **with PID 16336:** Repeats the process ID for clarity.
     - **E:\Destop\Company\BB\BB Work\AxiomProtect-master - v2\AxiomProtect-master\AxiomProtect\target\classes:** The location of the application's compiled classes.
     - **started by hp:** The username (`hp`) who initiated the application.
     - **in E:\Destop\Company\BB\BB Work\AxiomProtect-master - v2\AxiomProtect-master\AxiomProtect:** The working directory from which the application was started.



---

1. **Logback**: A popular logging framework that is the default in many Spring Boot applications. It offers flexible configuration and good performance.

    It provides a good balance between simplicity and flexibility. When you create a Spring Boot project, you don't need to manually set up Logback because Spring Boot has already done it for you.(default for spring boot)

2. **Log4j2**: Another widely used logging framework with features like asynchronous logging and support for various output formats.

3. **Java Util Logging (JUL)**: The default logging framework included in the Java Standard Edition (part of the JDK). While it's less feature-rich than some third-party frameworks, it is simple and part of the Java platform.


Logging levels help categorize log statements based on their severity. The common logging levels are:
- TRACE
- DEBUG
- INFO
- WARN
- ERROR

By default, logging is enabled for:
- INFO
- WARN
- ERROR

Spring Boot provides annotations like `@Slf4j` that you can use to automatically inject logger instances into your classes.

---