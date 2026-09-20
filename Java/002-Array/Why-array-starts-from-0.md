
---

# Array Memory Layout & 0-Based Indexing

## 📌 Core Questions Covered
1. [[#1. Why Does Array Indexing Start at 0?|Why does array indexing start at 0?]]
2. [[#2. How Are Arrays Stored in Memory and Why Is Access O(1)?|How are arrays stored in memory and why is access O(1)?]]
3. [[#3. Pointer (C/C++) vs. Reference (Java)|What is the difference between a Pointer and a Reference?]]
4. [[#4. What Does an Array Variable Actually Point To in Memory?|What does an array variable actually point to in memory?]]
5. [[#5. How Do Object Arrays (e.g., Student[]) Work in Memory & Garbage Collection?|How do Object Arrays work in memory & Garbage Collection?]]
6. [[#6. Why Is Accessing an Object Array Still O(1)?|Why is accessing an object array still O(1)?]]

---

## 1. Why Does Array Indexing Start at 0?

Array indices do not represent ordinal counters ("1st item", "2nd item"); they represent **memory offsets** (<font color="#ffc000">the distance / number of elements away from the starting memory address</font>).

### The Math Behind Memory Access
The memory address of any element is computed using:

$$\text{Address of } A[i] = \text{Base Address} + (i \times \text{Size of One Element})$$

- `marks[0]` $\rightarrow \text{Base} + (0 \times \text{size}) = \text{Base}$ (0 steps away, located directly at the base address).
- `marks[1]` $\rightarrow \text{Base} + (1 \times \text{size})$ (1 element away).
- `marks[2]` $\rightarrow \text{Base} + (2 \times \text{size})$ (2 elements away).

> [!NOTE] **Why Not 1-Based Indexing?**
> If indexing started at 1, every memory lookup would require an extra subtraction step:
> $$\text{Address} = \text{Base Address} + ((i - 1) \times \text{Size})$$
> Starting at 0 avoids this extra CPU calculation on every single element access, keeping access fast and minimal at the hardware level.

---

## 2. How Are Arrays Stored in Memory and Why Is Access O(1)?

When you declare an array in Java:

```java
int[] marks = new int[5];
```

1. **Contiguous Allocation**: Java allocates one single, continuous block of memory in the heap with no gaps between elements.
2. **Fixed Element Size**: Each primitive `int` occupies exactly 4 bytes. 5 integers require a continuous 20-byte block.
3. **Constant Time ($O(1)$) Access**: To fetch `marks[2]`, the JVM does not loop or search. It executes the arithmetic formula in a single CPU instruction:
   $$\text{Address} = 1000 + (2 \times 4) = 1008$$
   Because calculation takes a fixed number of operations regardless of whether the array has 5 elements or 5,000,000 elements, access time is always **$O(1)$**.

![[array_memory_layout.png]]

---

## 3. Pointer (C/C++) vs. Reference (Java)

Both pointers and references locate data in memory, but they differ fundamentally in **developer control** and **memory safety**.

| Feature                     | Pointer (C / C++)                               | Reference (Java)                                     |
| :-------------------------- | :---------------------------------------------- | :--------------------------------------------------- |
| **What It Stores**          | Raw physical memory address                     | Managed memory reference (address abstracted by JVM) |
| **Pointer Arithmetic**      | Allowed (`ptr++`, `ptr + 4`)                    | Forbidden (`ref++` results in a compilation error)   |
| **Arbitrary Memory Access** | Yes (can read/write arbitrary memory addresses) | No (restricted strictly to object boundaries)        |
| **Safety / Risk**           | High risk (memory corruption, buffer overflow)  | Safe (only risk is `NullPointerException`)           |
| **Control Level**           | Developer                                       | JVM                                                  |


![[pointer_vs_reference.png]]

---

## 4. What Does an Array Variable Actually Point To in Memory?

In Java, `marks` is a **reference**, but internally it holds the memory address of the **Array Object Header** in the heap, not just the first element.

```
marks (Stack) ───► [ Object Header (Class Metadata + Length) | marks[0] | marks[1] | ... ] (Heap)
```

1. **Array Header**: Contains JVM metadata, such as array component type (`int`) and array length (`5`).
2. **Contiguous Elements**: The elements sit directly after the header in contiguous order.
3. **Index Element** : <font color="#ffc000">Check Array object metaspace, check length and access first element and calculate index element.</font>
4. **Garbage Collection (GC)**: 
   - An array is allocated as **one single heap object**.
   - GC tracks whole objects, not individual elements.
   - As long as `marks` is reachable, the entire array object and all its elements remain in memory.
   - Setting `marks = null` removes the reference to the array object, allowing GC to collect the whole block at once.

---

## 5. How Do Object Arrays (e.g., Student[]) Work in Memory & Garbage Collection?

When creating an array of custom objects:

```java
Student[] students = new Student[3];
students[0] = new Student("Rahul", 92, 20);
students[1] = new Student("Priya", 88, 21);
students[2] = new Student("Amit", 76, 22);
```

### Two-Level Heap Architecture
Java does **not** store `Student` objects inside the array block because objects vary in size. Instead:
- **Level 1 (Array Object in Heap)**: A contiguous block of **references (addresses)**. On a 64-bit JVM, each slot is a fixed 8 bytes.
- **Level 2 (Individual Objects in Heap)**: Each `new Student(...)` call independently allocates memory anywhere in the heap. The array slots hold pointers to those locations.

### Garbage Collection Reachability Chain
```
students (Stack) ──► Array Object (Heap) ──► Student Objects (Heap)
```
- **When `students` is alive**: The Array Object is reachable, which keeps all referenced `Student` objects reachable.
- **When `students = null`**: The Array Object becomes unreachable and is collected by GC.
- **Cascading Collection**: Once the Array Object is removed, if the individual `Student` objects have no other references pointing to them, GC reclaims them as well.

![[student_array_full_heap_layout.png]]

---

## 6. Why Is Accessing an Object Array Still O(1)?

When accessing an element like `students[1].name`, the JVM performs two consecutive jumps:

1. **Step 1 ($O(1)$) — Formula Jump**: 
   $$\text{Address of } \text{students}[1] = \text{Base Address} + (1 \times 8\text{ bytes})$$
   Reads the reference address stored at slot `[1]` (e.g., `3200`).
2. **Step 2 ($O(1)$) — Reference Jump**:
   Follows reference `3200` directly to the `Student` object in heap memory to read `.name`.

$$\text{Total Time} = O(1) + O(1) = O(1)$$

Both steps perform a fixed number of operations regardless of array size (3 or 3,000,000 elements).

![[custom_object_o1_access.png]]

---

## 7. Summary: Primitive Array vs. Object Array

| Characteristic             | Primitive Array (`int[]`)                   | Object Array (`Student[]`)                                                   |
| :------------------------- | :------------------------------------------ | :--------------------------------------------------------------------------- |
| **Values in Array Slots**  | Actual values (e.g., `10`, `25`)            | References / memory addresses (e.g., `3000`, `3200`)                         |
| **Slot Size**              | Primitive size (4 bytes for `int`)          | 8 bytes (on 64-bit JVM)                                                      |
| **Heap Objects Created**   | **1 object** (the array itself)             | **$1 + N$ objects** (1 array object + $N$ distinct objects)                  |
| **Lookup Steps**           | 1 jump (Formula $\rightarrow$ direct value) | 2 jumps (Formula $\rightarrow$ Reference $\rightarrow$ Heap Object)          |
| **Access Time Complexity** | $O(1)$                                      | $O(1)$                                                                       |
| **Garbage Collection**     | Array and values collected together         | Array collected first; unreferenced objects collected via reachability chain |

---
