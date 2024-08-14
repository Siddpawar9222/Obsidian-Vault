
---
### What is Redis?

- **Overview**:
  - Redis (Remote Dictionary Server) is an open-source, in-memory data structure store, used as a database, cache, and message broker.
  - It is known for its high performance, providing sub-millisecond response times.

- **Data Structures**:
  - Redis supports various data structures such as strings, lists, sets, sorted sets, hashes, bitmaps, hyperloglogs, and geospatial indexes.
  - This versatility makes Redis suitable for a wide range of applications, from caching to session management, real-time analytics, and more.

- **Persistence**:
  - Although Redis is an in-memory store, it offers persistence options to save data on disk, ensuring that data is not lost in case of a server restart.
  - It supports two persistence methods: 
    - **Snapshotting**: Takes a snapshot of the dataset at specified intervals.
    - **Append-only file (AOF)**: Logs every write operation received by the server.

- **Use Cases**:
  - **Caching**: Due to its speed, Redis is commonly used to cache frequently accessed data, reducing the load on the primary database.
  - **Session Management**: Storing session data in Redis allows for quick access and retrieval, making it ideal for web applications.
  - **Real-time Analytics**: Redis’s ability to handle large amounts of data quickly makes it suitable for real-time analytics applications.
  - **Message Queuing**: Redis’s list and pub/sub features allow it to be used as a message broker for distributed systems.

- **Redis Clients**:
  - Redis can be accessed and managed through various clients available in multiple programming languages such as Java, Python, C#, and more.

  #####   For Java : 
  -  **Jedis**: A popular, straightforward, and synchronous Redis client for Java.
  - **Lettuce**: A scalable, thread-safe, and non-blocking Redis client that supports both synchronous and asynchronous communication.

- **Redis CLI**:
  - Redis comes with a command-line interface (CLI) tool, allowing you to interact with the Redis server directly. This tool can be used to execute commands, manage data, and configure the server.

---

### Redis Commands and Their Usage

1. **Update and Install Redis**:
   - `sudo apt-get update`: Updates the package list on your Linux system.
   - `sudo apt-get install redis-server`: Installs the Redis server on your machine.

2. **Start the Redis Server**:
   - `sudo service redis-server start`: Starts the Redis server.

3. **Access Redis CLI**:
   - `redis-cli`: Opens the Redis command-line interface (CLI) to interact with the Redis server.

4. **Basic Redis Commands**:
   - `PING`: Checks if the Redis server is running. If successful, it returns `PONG`.
   - `SET keyName value`: Sets the value for a specified key. Example: `SET myKey "Hello, Redis!"`.
   - `GET keyName`: Retrieves the value of a specified key. Example: `GET myKey` returns `"Hello, Redis!"`.
   - `DEL keyName`: Deletes the specified key. Example: `DEL myKey` removes the key `myKey`.
   - `KEYS *`: Lists all keys currently stored in Redis. Use this to see all keys in the database.
   - `EXISTS keyName`: Checks if a key exists. Returns `1` if the key exists, `0` otherwise.
   - `FLUSHALL`: Deletes all keys in all databases. Use this to clear all data from Redis.
   - `FLUSHDB`: Deletes all keys in the currently selected database.
   - `TTL keyName`: Returns the remaining time to live of a key that has an expiration set, in seconds.
   - `EXPIRE keyName seconds`: Sets a timeout on the specified key. After the timeout, the key will be automatically deleted.
   - `INCR keyName`: Increments the value of a key by 1. If the key does not exist, it is set to 0 before performing the increment operation.

-----

###  Issues Faced and Solutions : 

1. **Default Serialization Issue**:
   - **Problem**: By default, Spring Boot uses `JdkSerializationRedisSerializer`, which serializes objects into a binary format. If you're expecting to store and retrieve plain strings, this can cause issues, as the data won’t be in a readable format.
   - **Solution**: Use `StringRedisSerializer` to ensure that keys and values are stored and retrieved as plain strings.

---

### Redis Hash : 
Redis Hashes as a form of **nested** key-value pairs within Redis.

#### Example of Nested Structure

Imagine you have a Redis Hash for a user profile:

1. **Top-level key (HashKey)**: `"user:1000"`
   - This is like the name of the collection or the overall key that identifies the user.

2. **Nested key-value pairs within that Hash**:
   - `"name"` → `"John Doe"`
   - `"email"` → `"john@example.com"`
   - `"address"` → `{ "street": "123 Main St", "city": "Springfield" }`

- **HashKey**: The key that identifies the entire collection of nested key-value pairs.
- **Fields and Values**: The nested key-value pairs inside the Redis Hash.

This nested structure allows Redis to efficiently store and manage collections of related data under a single top-level key.


---

### What is TTL?

- **TTL (Time-to-Live)**: It specifies the duration for which a cache entry is considered valid. After this time period expires, the cache entry is automatically removed from the cache.
