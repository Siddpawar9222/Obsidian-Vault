
-----
## What is Caching?

Caching is a technique used to store frequently accessed data in a temporary storage area, usually RAM, to reduce the time it takes to access this data in the future.

## Example of Caching

- Netflix caches its plans, which rarely change, to save time.
- Code can check the cache for Netflix plans before querying the database.

## Benefits of Caching

1. **Speed Improvement:**
   - Caching reduces load times for subsequent data accesses by storing fetched data.
   - Example: The "Gaana" app caches transaction history and profile data to improve performance.

2. **Reduced API Calls:**
   - Caching reduces the number of calls made to the database or API, saving resources.

3. **Efficiency in Well-Established Applications:**
   - Applications like Instagram and Amazon use caching to load data quickly.

## Types of Caching

### 1. In-Memory (Local) Caching
- Stores data in the RAM of a single server.
- Fast access but limited to the memory capacity of that server.

### 2. Distributed Caching
- Multiple servers share a cache, which is managed by systems like Redis.
- Provides a scalable solution for large applications.

## Use Cases for Caching

1. **Read-Intensive Applications:**
   - Useful for sites where users read a lot of content, like Twitter or Wikipedia, to reduce database load.
   - Example: Static contents such as HTML and images stored in caches.

2. **Application Server Cache:**
   - Stores database queries, API responses, and function outputs to speed up processing.

3. **Content Delivery Network (CDN):**
   - Used to serve static, unchanging content close to the user to reduce latency.
   - Example: Serving Amazon's logo from geographically closer servers for faster load times.

## Caching in Practice

1. **Direct Data Provision:**
   - The caching layer can provide data directly, reducing the need for repeated database queries.

2. **Caching Strategies:**
   - Code can check the cache first before fetching from the database.
   - Cache updates can be managed through specific functions that update or delete old cache data and fetch the latest information.


# Cache Eviction Strategies

Caching has limited storage capacity, which means old or unnecessary data must be removed over time to make space for new data. This process is known as cache eviction.

## Configuring Cache Expiration Times

Cache expiration times determine how long data remains in the cache before being considered stale and eligible for eviction. These times can be adjusted based on needs, such as reducing a 10-year expiration to 1 year or even shorter periods.

## Cache Miss

A cache miss occurs when the requested data is not found in the cache. This requires the system to fetch the data from the database, which can be slower than retrieving it from the cache.

## Cache Eviction Strategies

### 1. Least Recently Used (LRU)
- **Description:** Deletes data that has not been accessed for the longest time.
- **Use Case:** Suitable for general caching needs where older data is less likely to be reused.
- **Consideration:** Requires additional memory to track access times.

### 2. Most Recently Used (MRU)
- **Description:** Deletes the most recently accessed items.
- **Use Case:** Useful when business logic requires removing the latest data first.

### 3. Least Frequently Used (LFU)
- **Description:** Removes data that has been accessed the least number of times.
- **Use Case:** Ideal for keeping frequently used data in the cache while evicting rarely accessed data.

### 4. First In First Out (FIFO)
- **Description:** Removes the oldest data first, based on the time it was added to the cache.
- **Use Case:** Simple and effective for scenarios where the oldest data is least relevant.

### 5. Last In First Out (LIFO)
- **Description:** Removes the most recently added data first.
- **Use Case:** Useful in specific scenarios where the newest data is less important than older data.

### 6. Random Replacement
- **Description:** Evicts data randomly without any specific probability biases.
- **Use Case:** Provides a balanced approach without favoring any particular data.