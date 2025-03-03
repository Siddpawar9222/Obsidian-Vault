
---

### **Bucket Sort ** 

**Bucket Sort** is a sorting algorithm that **distributes elements into multiple "buckets" and sorts them individually**. It works best when input data is **uniformly distributed** over a range.

---

## **🔹 How Bucket Sort Works?**

1. **Create `k` empty buckets** (usually `k = N`, the number of elements).
2. **Distribute elements into buckets** based on a function (e.g., `arr[i] / maxValue`).
3. **Sort each bucket** (using Insertion Sort, Merge Sort, etc.).
4. **Concatenate all sorted buckets** into the final sorted array.

---

## **🔹 Dry Run Example**

### **Given Input Array:**

```
arr = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]
```

✅ **Numbers are between `0` and `1` (uniform distribution).**

---

### **🔹 Step 1: Create Empty Buckets**

Since we have **10 elements**, we create **10 empty buckets (0 to 9)**.

```
Bucket 0: []
Bucket 1: []
Bucket 2: []
Bucket 3: []
Bucket 4: []
Bucket 5: []
Bucket 6: []
Bucket 7: []
Bucket 8: []
Bucket 9: []
```

---

### **🔹 Step 2: Distribute Elements into Buckets**

#### **Formula:**

**Bucket Index = $⌊ Element × 10 ⌋$**

#### **Table:**

| $Element$ | $Computation$       | $Bucket$ |
| --------- | ------------------- | -------- |
| $0.78$    | $⌊ 0.78 × 10 ⌋ = 7$ | $7$      |
| $0.17$    | $⌊ 0.17 × 10 ⌋ = 1$ | $1$      |
| $0.39$    | $⌊ 0.39 × 10 ⌋ = 3$ | $3$      |
| $0.26$    | $⌊ 0.26 × 10 ⌋ = 2$ | $2$      |
| $0.72$    | $⌊ 0.72 × 10 ⌋ = 7$ | $7$      |
| $0.94$    | $⌊ 0.94 × 10 ⌋ = 9$ | $9$      |
| $0.21$    | $⌊ 0.21 × 10 ⌋ = 2$ | $2$      |
| $0.12$    | $⌊ 0.12 × 10 ⌋ = 1$ | $1$      |
| $0.23$    | $⌊ 0.23 × 10 ⌋ = 2$ | $2$      |
| $0.68$    | $⌊ 0.68 × 10 ⌋ = 6$ | $6$      |

This table represents how elements are assigned to different buckets using the given formula. 🚀

📌 **Buckets after distribution:**

```
Bucket 0: []
Bucket 1: [0.17, 0.12]
Bucket 2: [0.26, 0.21, 0.23]
Bucket 3: [0.39]
Bucket 4: []
Bucket 5: []
Bucket 6: [0.68]
Bucket 7: [0.78, 0.72]
Bucket 8: []
Bucket 9: [0.94]
```

---

### **🔹 Step 3: Sort Each Bucket Individually**

We use **Insertion Sort** (or any efficient sorting algorithm) for each bucket.

```
Bucket 1: [0.12, 0.17]
Bucket 2: [0.21, 0.23, 0.26]
Bucket 3: [0.39]
Bucket 6: [0.68]
Bucket 7: [0.72, 0.78]
Bucket 9: [0.94]
```

---

### **🔹 Step 4: Concatenate Buckets**

We merge all sorted buckets to get the final sorted array.

```
Sorted Array: [0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]
```

🎉 **The array is now sorted!**

---

## **🔹 Time and Space Complexity**

- **Best Case:** O(N) → When elements are evenly distributed, and we use Insertion Sort inside small buckets.
- **Worst Case:** O(N2) → If all elements go into the same bucket (behaves like Insertion Sort).
- **Average Case:** O(N+K)→ With `K` buckets and uniform distribution.
- **Space Complexity:** O(N+K) → Need extra space for buckets.

---

## **🔹 When to Use Bucket Sort?**

✅ Best when input is **uniformly distributed** (e.g., floating point numbers, percentages).  
✅ Works well when **bucket size is small** and **sorting inside buckets is fast**.  
❌ **Not good when elements are clustered in a few buckets** (behaves like O(N2).  
❌ **Extra space required** for buckets.

---

## **🔹 Summary**

- **Distribute elements into buckets.**
- **Sort each bucket individually.**
- **Concatenate all sorted buckets to get the final sorted array.**

---
### Reference
[Animation](https://youtube.com/shorts/p50Qh-dZdUY?si=NoPYPGfK7N7aAAC6)

---

### Code 


```java
private static void bucketSort(double[] arr) {
    int n = arr.length;

    // Create buckets of size n
    ArrayList<Double>[] buckets = new ArrayList[n];

    // Initialize buckets
    for (int i = 0; i < n; i++) {
        buckets[i] = new ArrayList<>();
    }

    // Store number at each respective bucket
    for (double num : arr) {
        int index = (int) num * 10;
        buckets[index].add(num);
    }

    // Sort each bucket
    for (ArrayList<Double> bucket : buckets) {
        Collections.sort(bucket);
    }

    // Combine buckets
    double[] ans = new double[n];

    int idx = 0;
    for (ArrayList<Double> bucket : buckets) {
        for (Double num : bucket) {
            ans[idx++] = num;
        }
    }

    // copy element to original array
    for (int i = 0; i < n; i++) {
        arr[i] = ans[i];
    }
}

```

### **General Rule for Choosing the Number of Buckets in Bucket Sort**

The number of buckets plays a crucial role in the efficiency of **Bucket Sort**. Choosing too few or too many buckets can impact performance.

#### **🔹 General Formula:**

`Number of Buckets=⌈Total Elements/K⌉`

Where **K** is a constant that depends on the distribution of data.

---

### **🔹 Common Approaches for Choosing Buckets**

#### **1️⃣ Use `n` Buckets (When Elements Are Uniformly Distributed)**

- If elements are **evenly spread** between a known range, a common heuristic is: Number of Buckets≈n\text{Number of Buckets} \approx n
    - **Example:** If you have **10 elements**, you create **10 buckets**.

#### **2️⃣ Use `√n` Buckets (When Distribution Is Unknown)**

- If the **distribution is not uniform**, using **√n buckets** (square root of total elements) balances performance.
    - **Example:** If `n = 100`, then `√100 = 10` buckets.

#### **3️⃣ Use `Max Element × Constant` (For Fractional Values)**

- When dealing with **floating point numbers** in `[0,1]`, we often multiply by a constant (e.g., **10, 100, or 1000**).
    - **Example:**
        - If values are in `[0,1]`, we use **10 buckets** (`element × 10`).
        - If values are in `[0,100]`, we might use **100 buckets**.

#### **4️⃣ Adaptive Bucket Sizing (For Skewed Distributions)**

- If the **data is skewed**, use **variable bucket sizes** instead of fixed-size buckets.
- This technique is often used in **histogram-based sorting algorithms**.

---

### **🔹 Why Is Choosing the Right Number Important?**

- **Too few buckets** → Larger bucket size → Elements need **more sorting inside buckets** (increases sorting complexity).
- **Too many buckets** → More memory usage and **empty buckets**, reducing efficiency.

---

### **🔹 Summary**

✔ If **uniformly distributed** → Use `n` buckets.  
✔ If **distribution is unknown** → Use `√n` buckets.  
✔ If **values are in `[0,1]`** → Multiply by **10** (or 100 for precision).  
✔ If **data is skewed**, use **adaptive bucket sizing**.

---
