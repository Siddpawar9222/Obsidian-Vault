
### Pagination

**What is Pagination?**
- Pagination is the process of breaking down a large dataset into smaller, manageable parts, called pages. It helps in retrieving and displaying only a portion of the data at a time, which improves performance and user experience.

**Why Use Pagination?**
- **Performance:** It reduces the data processed at once, improving speed and lowering memory use.
- **User Experience:** Data is shown in smaller, easier-to-handle portions.
- **Scalability:** Large datasets can be handled more effectively by loading just a part at a time.

**Key Concepts**
- **Page:** A small subset of data displayed at one time.
- **Page Number:** The index of the page being retrieved (starting from zero).
- **Page Size:** Number of items displayed per page.
- **Total Items:** The total number of items in the dataset.
- **Total Pages:** The number of pages needed to show all items.

**Basic Pagination Structure**
- **Request Parameters:**
  - `page`: The page number to retrieve (starting from zero).
  - `size`: Number of items per page.
- **Response Structure:**
  - `items`: The list of items on the current page.
  - `currentPage`: The current page number.
  - `totalItems`: The total number of items.
  - `totalPages`: The total number of pages.
  - `pageSize`: The number of items per page.

**Internal Mechanism**
- **Spring Data JPA:** Provides powerful tools for pagination and sorting using the `Pageable` and `PageRequest` interfaces.
  - **Pageable:** Interface for pagination details (page number, size, sorting).
  - **PageRequest:** Implementation of `Pageable` to set pagination and sorting.

**PaginationAndSortingRepository**
- An interface in Spring Data JPA that extends `CrudRepository` and provides extra methods for pagination and sorting. This makes it easier to handle paginated and sorted queries without custom repository methods.

**Handling Pagination Details**
- Use methods like `getTotalPages()`, `getNumber()`, `getTotalElements()`, `getSize()`, and `getContent()` from the `Page` object to manage pagination details.

### Sorting

**What is Sorting?**
- Sorting arranges data in a specific order. In databases, sorting makes data presentation meaningful and organized.
  - **Ascending Order:** Smallest to largest (e.g., A to Z, oldest to newest).
  - **Descending Order:** Largest to smallest (e.g., Z to A, newest to oldest).

**Sorting by Multiple Fields**
- Data can be sorted by multiple fields (e.g., first by name, then by price). This is useful for hierarchical ordering.

### Pagination with Sorting

**Controller**
- The controller processes sorting parameters with pagination and passes them to the service layer for sorted and paginated data.

**Service**
- The service converts sorting direction and fields into a `Sort` object, which is used to create a `PageRequest`.