
---

### Dry Run Example:

Let’s create a `HashMap` with:

- **Keys**: Names of people (`"Alice"`, `"Bob"`, `"Charlie"`, etc.).
- **Values**: Their corresponding gym ID cards (`1001`, `1002`, etc.).
- **Initial Capacity**: 5 (i.e., an array with 5 buckets).

---

### Step-by-Step Process:

#### **1. Initialization**

The `HashMap` starts with an **array of size 5**. Each bucket in the array can hold a **linked list** to handle collisions.

```plaintext
Array: [ null, null, null, null, null ]
```

---

#### **2. Adding Entries**

Let’s add key-value pairs one by one:

1. **Add `"Alice"` with ID `1001`:**
    
    - Calculate the **hash code** for `"Alice"` → e.g., `hash("Alice") = 12`.
    - Find the index: index=hash%capacity = 12 % 5 = 2
    - Insert `"Alice"` into bucket `2`.
    
    ```plaintext
    Array: [ null, null, ["Alice" -> 1001], null, null ]
    ```
    
2. **Add `"Bob"` with ID `1002`:**
    
    - Calculate the **hash code** for `"Bob"` → `hash("Bob") = 7`.
    - Find the index: index=7 \% 5 = 2
    - Collision occurs because bucket `2` is already occupied by `"Alice"`.
    - Add `"Bob"` to the linked list at bucket `2`.
    
    ```plaintext
    Array: [ null, null, ["Alice" -> 1001 -> "Bob" -> 1002], null, null ]
    ```
    
3. **Add `"Charlie"` with ID `1003`:**
    
    - Calculate the **hash code** for `"Charlie"` → `hash("Charlie") = 14`.
    - Find the index: index= 14 \% 5 = 4
    - Bucket `4` is empty, so insert `"Charlie"` there.
    
    ```plaintext
    Array: [ null, null, ["Alice" -> 1001 -> "Bob" -> 1002], null, ["Charlie" -> 1003] ]
    ```
    

---

#### **3. Retrieving Entries**

To retrieve a value, the process involves:

1. Calculating the hash index.
2. Searching the linked list at the index (if needed).

Example:

- Retrieve the ID for `"Bob"`:
    - Calculate `hash("Bob") = 7`.
    - Find the index: `7 % 5 = 2`.
    - Look in bucket `2`. Traverse the linked list:
        - `"Alice"` -> `"Bob"` (found!).
    - Return the value: `1002`.

---

#### **4. Handling Collisions**

Collisions are resolved using **chaining**:

- If multiple keys map to the same index, they are stored as nodes in a **linked list** at that index.
- When retrieving a value, the list is traversed to find the correct key.

---

#### **5. Rehashing**

If the number of entries exceeds a threshold (e.g., 75% of the capacity), the `HashMap`:

1. Doubles the array size.
2. Recomputes hash indices for all keys.
3. Redistributes entries into the new array.

---

### Final State of the Array:

After adding `"Alice"`, `"Bob"`, and `"Charlie"`, the `HashMap` looks like this:

```plaintext
Array: [ null, null, ["Alice" -> 1001 -> "Bob" -> 1002], null, ["Charlie" -> 1003] ]
```

---

### Key Takeaways:

- The **hash function** determines the index for a key.
- **Collisions** are resolved using **chaining** (linked lists).
- Retrieval involves recalculating the index and searching the linked list.