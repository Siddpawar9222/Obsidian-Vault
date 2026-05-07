
---

### 1. **Bucket**

- A **bucket** is a storage location in the internal array of the `HashMap`.
- Each bucket holds the data for keys that hash to the same index.
- If multiple keys hash to the same bucket, they are stored as a **linked list** or a **tree** (Java 8+).

**Example**: If the `HashMap` has 5 buckets (array size is 5), keys that hash to the same index (like 2) will all be stored in bucket `2`.

---

### 2. **Capacity**

- **Capacity** is the total number of buckets available in the internal array of the `HashMap`.
- When a `HashMap` is created, it has an initial capacity (default = **16** in Java).

**Formula for Index**:

index= hashCode % capacity

**Key Points**:

- The capacity increases (doubles) when the `HashMap` is resized due to high load.

---

### 3. **Size**

- The **size** is the number of key-value pairs currently stored in the `HashMap`.
- **Size** does not include empty buckets—it only counts the actual entries.

**Example**: If a `HashMap` has 5 buckets and only 3 key-value pairs are added, the size is **3**.

---

### 4. **Load Factor**

- **Load factor** is a measure of how full the `HashMap` can get before it resizes (expands the capacity).
- It is defined as:

Load Factor= size/capacity

- Default **load factor** in Java is **0.75**.

**Example**: If capacity = 16 and size = 12:

Load Factor= 12/16 = 0.75

**Why Important?**

- If the load factor exceeds **0.75**, the `HashMap` automatically resizes (doubles the capacity) to reduce collisions.

---

### 5. **Rehashing**

- **Rehashing** occurs when the `HashMap` resizes due to high load.
- All existing entries are re-distributed into a larger array.
- The keys’ hash codes are recalculated, and their new indices are determined based on the new capacity.

---

### 6. **Hash Function**

- The **hash function** converts a key into a numeric hash code.
- The hash code is then mapped to an index in the internal array using:

    index= hashCode % capacity

**Good Hash Function**:

- Reduces collisions by distributing keys uniformly across buckets.

---

### 7. **Collision**

- A **collision** happens when two keys hash to the same index (bucket).
- Collisions are resolved using:
    - **Chaining**: Store multiple entries in a linked list/tree at the same bucket.
    - **Open Addressing**: Probe for the next available slot (not used in Java `HashMap`).

---

### Summary Table:

|**Term**|**Description**|
|---|---|
|**Bucket**|A storage location in the array where entries are stored.|
|**Capacity**|Total number of buckets in the `HashMap` (default = 16).|
|**Size**|Current number of key-value pairs in the `HashMap`.|
|**Load Factor**|The threshold ratio to determine when to resize the `HashMap` (default = 0.75).|
|**Rehashing**|Process of redistributing keys into a larger array when the load factor is exceeded.|
|**Hash Function**|Converts a key into a numeric hash code for determining its bucket index.|
|**Collision**|When two keys hash to the same bucket, handled by chaining or other methods.|

---

