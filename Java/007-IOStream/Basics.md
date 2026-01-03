
---

# Java I/O Streams


- Java I/O (**Input and Output**) is used to **process the input and produce the output**.
    
- Java uses the concept of a **stream** to make I/O operations fast.
    
- The `java.io` package contains all the classes required for input and output operations.
    
- We can perform **file handling** in Java using the Java I/O API.
    

---

## Stream

A **stream** is a sequence of data.

- In Java, a stream is composed of **bytes**.
    
- It is called a stream because it flows continuously, like **water in a river**.
    

---

## Stream Flow Diagram

![[1.jpeg]]

---

## Types of Streams in Java

Java provides **two types of streams**:

- **Byte Stream**
    
- **Character Stream**
    ![[2.png]]

---

## Carrier Means What?

- **Byte Stream**
    
    - Processes data in terms of **bytes**
        
    - 1 byte = **8 bits**
        
- **Character Stream**
    
    - Processes data in terms of **characters**
        
    - Typically **16 bits per character** in Java (Unicode)
        

---

## Byte vs Character Stream (Time Example)

Assume:

- Processing **1 byte** takes **1 second**
    
- Processing **1 character** (2 bytes) takes **1 second**
    

### Example:

- Processing **10 bytes** using Byte Stream → **10 seconds**
    
- Processing **10 characters** using Character Stream → **20 seconds**
    

### Conclusion:

- Character streams take **more time** because characters use **more memory**
    
- If encoding is simple (like ASCII), **Byte Stream is faster**
    

---

## Byte Stream

📌 Used for **Binary Data (Non-Human Readable)**

### Byte Stream Class Hierarchy



![[3.png]]


![[4.png]]


---

## Important Byte Input Stream Classes 

---

## 1. `FileInputStream`

### 🏭 Industrial Use Case

**Reading binary files from server disk**

### Example Scenario:

- Downloading:
    
    - Images (`.jpg`, `.png`)
        
    - PDFs
        
    - Excel files
        
- Reading files uploaded by users
    

### Why FileInputStream?

- Works with **binary data**
    
- Reads raw bytes
    
- No character conversion
    

👉 Used in:

- File upload/download services
    
- Media servers
    
- Document management systems
    

---

## 2. `ByteArrayInputStream`

### 🏭 Industrial Use Case

**Re-processing data already available in memory**

### Example Scenario:

- File is already read from disk or network
    
- Stored as `byte[]`
    
- Need to read it again without hitting disk
    

Example:

- Validate file
    
- Compress it
    
- Encrypt it
    

### Why ByteArrayInputStream?

- Very fast (RAM based)
    
- No disk I/O
    
- Reusable data
    

👉 Used in:

- Encryption / Decryption
    
- File validation
    
- API request processing
    

---

## 3. `FilterInputStream`

### 🏭 Industrial Use Case

**Adding features like buffering, compression, encryption**

### Example Scenario:

- You read a file
    
- Then want to:
    
    - Buffer it
        
    - Decompress it
        
    - Decode it
        

### Why FilterInputStream?

- Wraps another stream
    
- Adds extra behavior
    

👉 Used in:

- Compression (ZIP, GZIP)
    
- Security layers
    
- Stream pipelines
    

---

## 4. `PipedInputStream`

### 🏭 Industrial Use Case

**Data transfer between threads (Producer–Consumer)**

### Example Scenario:

- Thread-1 reads file from disk
    
- Thread-2 uploads data to server
    

Both work **in parallel**.

### Why PipedInputStream?

- No shared memory
    
- Thread-safe communication
    
- Streaming data between threads
    

👉 Used in:

- Multi-threaded pipelines
    
- Background file processing
    

---

## 5. `ObjectInputStream`

### 🏭 Industrial Use Case

**Reading serialized objects**

### Example Scenario:

- Read objects from:
    
    - Cache
        
    - File
        
    - Network
        

Example:

- Session object
    
- Configuration object
    

### Why ObjectInputStream?

- Reads full Java objects
    
- Restores object state
    

👉 Used in:

- Caching systems
    
- Distributed systems
    
- Legacy RMI systems
    

---

# FilterInputStream Related Classes

---

## 6. `DataInputStream`

### 🏭 Industrial Use Case

**Reading structured binary data**

### Example Scenario:

- Read:
    
    - Transaction amount (double)
        
    - User ID (int)
        
    - Timestamp (long)
        

All stored in binary format.

### Why DataInputStream?

- Reads primitive data safely
    
- Maintains data order
    

👉 Used in:

- Network protocols
    
- Binary file formats
    
- Game engines
    

---

## 7. `BufferedInputStream`

### 🏭 Industrial Use Case

**Performance optimization**

### Example Scenario:

- Reading large files
    
- Network streams with slow I/O
    

### Why BufferedInputStream?

- Reduces disk access
    
- Reads chunks instead of single byte
    

👉 Used in:

- File servers
    
- Streaming applications
    
- Large data processing
    

---

## 8. `PushBackInputStream`

### 🏭 Industrial Use Case

**Parsing binary data with look-ahead**

### Example Scenario:

- Reading binary file
    
- Need to check header bytes
    
- If not valid → push back bytes
    

### Why PushBackInputStream?

- Supports look-ahead parsing
    
- Prevents data loss
    

👉 Used in:

- File format validators
    
- Protocol parsers
    
- Compiler design (low level)
    

---

## 🔑 Interview One-Line Summary (Very Useful)

| Class                | Industrial Usage       |
| -------------------- | ---------------------- |
| FileInputStream      | Binary file reading    |
| ByteArrayInputStream | In-memory data         |
| FilterInputStream    | Add features           |
| PipedInputStream     | Thread communication   |
| ObjectInputStream    | Object deserialization |
| DataInputStream      | Structured binary data |
| BufferedInputStream  | Performance            |
| PushBackInputStream  | Look-ahead parsing     |

---

## Character Stream

📌 Used for **Human Readable Text Data**  
Example: HTML files, Java source code

📌 **(Attach Image Here – Character Stream hierarchy)**
![[5.png]]
---![[6.png]]

### Important Character Reader Classes


## 1. `BufferedReader`

### 🏭 Industrial Use Case

**Reading large log files or configuration files**

### Example Scenario:

- Your Spring Boot application writes logs into a `.log` file.
    
- You want to **analyze logs line by line** to find errors or warnings.
    

### Why BufferedReader?

- Reads data **line by line**
    
- Very **fast** for large files
    
- Low memory usage
    

👉 Used in:

- Log analysis tools
    
- Batch processing jobs
    
- Reading `.properties`, `.yml`, `.txt` files
    

---

## 2. `CharArrayReader`

### 🏭 Industrial Use Case

**Processing in-memory text data without hitting disk**

### Example Scenario:

- You receive text data from an API.
    
- You convert it into a `char[]`.
    
- You want to parse or validate that data.
    

### Why CharArrayReader?

- No file I/O
    
- Very fast (RAM based)
    
- Good for **temporary text processing**
    

👉 Used in:

- Data validation modules
    
- Parsing engines
    
- Rule engines
    

---

## 3. `StringReader`

### 🏭 Industrial Use Case

**Parsing JSON / XML / SQL queries stored as Strings**

### Example Scenario:

- Your backend receives a **JSON string** from frontend or Kafka.
    
- You want to read and process it character by character.
    

### Why StringReader?

- Works directly with `String`
    
- No need to create temp files
    

👉 Used in:

- JSON / XML parsers
    
- Expression evaluators
    
- Template engines
    

---

## 4. `FileReader`

### 🏭 Industrial Use Case

**Reading text files stored on server**

### Example Scenario:

- Read:
    
    - `.csv` files for data migration
        
    - `.txt` files for batch jobs
        
    - `.sql` files for DB scripts
        

### Why FileReader?

- Simple way to read text files
    
- Works well with `BufferedReader`
    

👉 Used in:

- File upload processing
    
- Batch processing systems
    
- Data migration tools
    

---

## 5. `PipedReader`

### 🏭 Industrial Use Case

**Thread-to-thread communication inside one application**

### Example Scenario:

- One thread **produces text data**
    
- Another thread **consumes and processes** it
    

Example:

- Thread-1: Reads file
    
- Thread-2: Filters content
    

### Why PipedReader?

- No shared data structures
    
- Safe inter-thread communication
    

👉 Used in:

- Multi-threaded data pipelines
    
- Producer–Consumer systems
    

---

## 6. `InputStreamReader`

### 🏭 Industrial Use Case

**Reading text from network or binary sources**

### Example Scenario:

- Read data from:
    
    - HTTP response
        
    - Socket
        
    - FileInputStream
        

But data comes as **bytes**, not characters.

### Why InputStreamReader?

- Converts **bytes → characters**
    
- Handles encoding (UTF-8, UTF-16)
    

👉 Used in:

- REST API clients
    
- Reading request/response bodies
    
- Network applications
    

---

## 7. `FilterReader`

### 🏭 Industrial Use Case

**Custom text filtering**

### Example Scenario:

- You want to:
    
    - Remove sensitive data (passwords)
        
    - Mask phone numbers
        
    - Ignore comments in files
        

### Why FilterReader?

- Base class for custom readers
    
- Modify text while reading
    

👉 Used in:

- Security modules
    
- Data masking
    
- Pre-processing pipelines
    

---

## 8. `LineNumberReader`

### 🏭 Industrial Use Case

**Error reporting with line numbers**

### Example Scenario:

- Reading:
    
    - Java source code
        
    - SQL scripts
        
    - Config files
        

When error occurs, you must show **line number**.

### Why LineNumberReader?

- Automatically tracks line count
    

👉 Used in:

- Compilers
    
- Script validators
    
- Config file parsers
    

---

## 🔑 Interview One-Line Summary (Very Important)

|Class|Industry Usage|
|---|---|
|BufferedReader|Large file & log reading|
|CharArrayReader|In-memory text processing|
|StringReader|JSON / XML parsing|
|FileReader|Server file reading|
|PipedReader|Thread communication|
|InputStreamReader|Network & byte data|
|FilterReader|Custom text filtering|
|LineNumberReader|Error reporting|

---

If you want next:

- ✅ **When NOT to use each Reader**
    
- ✅ **Which Reader is used in Spring Boot**
    
- ✅ **Real Java code example for each (simple)**
    

Just say 👍
---

## Internal Stream Usage

- Java uses **Byte Streams** for:
    
    - Binary data
        
    - Low-level I/O operations
        
- Java uses **Character Streams** for:
    
    - Text data
        
    - Encoding handling
        

---

## Console I/O Operations in Java

### Reading Input

- `BufferedReader`
    
- `Scanner`
    
- `Console`
    

### Writing Output

- `print()` and `println()`
    
- `write()`
    

---

## Default Streams in Java

Every Java program creates **3 streams automatically**:

- `System.out` → Standard output
    
- `System.in` → Standard input
    
- `System.err` → Error output
    

### Note:

- `System.in` is an instance of `InputStream`
    
- Connected to **keyboard input**
    

---

## File Class

- Located in `java.io`
    
- Represents a **file or directory**
    
- Used for:
    
    - Create
        
    - Read
        
    - Update
        
    - Delete files or folders
        

---

## RandomAccessFile

- Allows **read/write at any position**
    
- No need to read file sequentially
    
- Useful for:
    
    - Updating specific file parts
        
    - Non-continuous data access
        

---

## FileDescriptor

- Low-level file handle
    
- Platform dependent
    
- Rarely used directly
    
- Mostly internal use
    

---

## Console Class

- Introduced in **Java 6**
    
- Secure and efficient console input/output
    
- Useful for password input
    

---

## Serialization & Deserialization

![[7.gif]]

- Used to convert object → byte stream and back
    
- Helps in:
    
    - File storage
        
    - Network transfer
        

---

## Unicode

Unicode is a system that allows computers to **represent characters from all world languages**.

- Acts like a **global alphabet**
    
- Supports multiple languages and scripts
    

---

## Reference Sources

[Java IO](http://www.btechsmartclass.com/java/java-Stream.html)

