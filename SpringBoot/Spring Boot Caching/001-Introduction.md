
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