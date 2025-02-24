
----

### **Radix Sort 

Radix Sort is a **non-comparative sorting algorithm** that sorts numbers **digit by digit**, starting from the **least significant digit (LSD)** to the **most significant digit (MSD)**. It uses **Counting Sort as a subroutine** to sort based on each digit.

---

## **Step-by-Step Explanation**

1. **Find the maximum number** → This tells us the number of digits we need to process.
2. **Sort numbers digit by digit using Counting Sort** → Start from the **least significant digit (LSD)** and move to the **most significant digit (MSD)**.
3. **Repeat until all digits are processed** → The numbers will be fully sorted.

---

## **Dry Run Example**

### **Input Array:**

```
arr = [170, 45, 75, 90, 802, 24, 2, 66]
```

### **Step 1: Find Maximum Number**

- The maximum number is **802** (3 digits), so we sort based on **units, tens, and hundreds place**.

---

### **Step 2: Sorting by Each Digit Using Counting Sort**

#### **🔹 Pass 1 → Sorting by Least Significant Digit (Units place)**

We sort based on the **rightmost digit** (1s place).

|Number|LSD (Units)|
|---|---|
|170|0|
|45|5|
|75|5|
|90|0|
|802|2|
|24|4|
|2|2|
|66|6|

Sorting based on these values → **[170, 90, 802, 2, 24, 45, 75, 66]**

---

#### **🔹 Pass 2 → Sorting by Tens place**

Now we sort based on the **second digit (tens place)**.

|Number|Tens Place|
|---|---|
|170|7|
|90|9|
|802|0|
|2|0|
|24|2|
|45|4|
|75|7|
|66|6|

Sorting based on these values → **[802, 2, 24, 45, 66, 170, 75, 90]**

---

#### **🔹 Pass 3 → Sorting by Hundreds place**

Now we sort based on the **third digit (hundreds place)**.

|Number|Hundreds Place|
|---|---|
|802|8|
|2|0|
|24|0|
|45|0|
|66|0|
|170|1|
|75|0|
|90|0|

Sorting based on these values → **[2, 24, 45, 66, 75, 90, 170, 802]** ✅ **Sorted!**

---

### **Final Sorted Output**

```
[2, 24, 45, 66, 75, 90, 170, 802]
```

✅ **Numbers are now completely sorted!**

---

## **Time and Space Complexity**

- **Time Complexity:**
    
    - O(d×(N+K)) where:
        - d = max number of digits in the largest number
        - N = number of elements
        - K = range of digits (0-9 → constant **10**)
    - Since K=10  is constant, the complexity is usually **O(N⋅d).
    - Faster than **Comparison Sorts** like Quick Sort O(Nlog⁡N) when d is small.
- **Space Complexity:**
    
    - O(N+K) due to Counting Sort’s temporary arrays.

---

## **Key Takeaways**

✅ **No comparisons needed** (uses digit-based sorting).  
✅ **Stable sorting algorithm** (preserves order of equal elements).  
✅ **Best for numbers with small digit lengths** (e.g., IDs, phone numbers).  
❌ **Not in-place** (requires extra space).  
❌ **Not efficient for very large numbers with many digits** (e.g., floating points).

---
#### Reference:
[Animation](https://youtube.com/shorts/ZHjCj0Oz6hk?si=XMipSDUF4hg9VfR6)

---

### Code:

```java

```
