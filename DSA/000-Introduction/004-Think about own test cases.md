
---

## 1. Goal & Mindset

> [!TIP]
> Test cases are not meant to confirm: *"Does my code work?"*  
> They are meant to answer: **"Where does my code break?"**

When designing your own test cases, think like an interviewer or an automated test system:
> *"What input can I feed this program to make it fail?"*

This adversarial mindset immediately exposes weak assumptions and strengthens your algorithm.

---

## 2. The 4 Levels of Test Cases

Using **Merge Sorted Array** as a concrete example, structure your tests into 4 progressive levels:

### 🧩 Level 1: Normal Case (Happy Path)
The standard, balanced input provided in the problem description.

- **Example:**
  ```java
  nums1 = [1, 2, 3, 0, 0, 0], m = 3
  nums2 = [2, 5, 6],          n = 3
  Output: [1, 2, 2, 3, 5, 6]
  ```
- **Purpose:** Sanity check to confirm the core logic works on typical input.

---

### ⚙️ Level 2: Boundary & Edge Cases
Inputs at the extreme limits of the problem constraints.

Ask yourself:
- What if one input is empty?
- What if inputs have only 1 element?
- What if all elements are identical?
- What if all elements in one array are strictly smaller than the other?

- **Example 1 (Second array empty):**
  ```java
  nums1 = [1], m = 1, nums2 = [], n = 0 → Output: [1]
  ```
- **Example 2 (First array empty):**
  ```java
  nums1 = [0], m = 0, nums2 = [1], n = 1 → Output: [1]
  ```
- **Example 3 (All elements identical):**
  ```java
  nums1 = [2, 2, 2, 0, 0, 0], m = 3, nums2 = [2, 2, 2], n = 3 → Output: [2, 2, 2, 2, 2, 2]
  ```
- **Example 4 (All nums2 elements strictly smaller):**
  ```java
  nums1 = [4, 5, 6, 0, 0, 0], m = 3, nums2 = [1, 2, 3], n = 3 → Output: [1, 2, 3, 4, 5, 6]
  ```
- **Example 5 (All nums1 elements strictly smaller):**
  ```java
  nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [4, 5, 6], n = 3 → Output: [1, 2, 3, 4, 5, 6]
  ```
- **Purpose:** Ensure pointer boundary checks, empty conditions, and index limits don't throw errors.

---

### 🧪 Level 3: Special & Tricky Cases
Scenarios designed to confuse pointer logic, conditions, or comparisons.

Consider:
- Duplicate values across arrays.
- Negative numbers and zero values.
- Interleaved values with varying step sizes.
- Single element overlaps.

- **Example 1 (Negative numbers & zeros):**
  ```java
  nums1 = [-3, -2, -1, 0, 0, 0], m = 3
  nums2 = [-2, -1,  0],          n = 3
  Output: [-3, -2, -2, -1, -1, 0]
  ```
- **Example 2 (Interleaved values):**
  ```java
  nums1 = [1, 2, 4, 0, 0, 0], m = 3
  nums2 = [2, 3, 5],          n = 3
  Output: [1, 2, 2, 3, 4, 5]
  ```
- **Purpose:** Catch hidden off-by-one errors and comparison mistakes that simple positive numbers conceal.

---

### 🧮 Level 4: Performance & Large Inputs
Tests designed to check whether your time and space complexity scale properly.

- **Example:**
  ```java
  nums1 = [1, 2, 3, ..., 100000, 0, 0, ..., 0], m = 100000
  nums2 = [1, 2, 3, ..., 100000],             n = 100000
  ```
- **Purpose:** Ensure an $O(n^2)$ brute force or accidental quadratic loop does not hit Time Limit Exceeded (TLE).

---

## 3. Universal 5-Type Formula

For **any** DSA problem, quickly construct test cases using this 5-point checklist:

| # | Test Type | What to Test | Example (`nums1`, `nums2`) |
| :-: | :--- | :--- | :--- |
| **1** | **Normal** | Common, typical input | `[1, 2, 3]`, `[2, 5, 6]` |
| **2** | **Empty / Minimal** | One or both inputs empty or size 1 | `[1]`, `[]` |
| **3** | **Duplicates** | Identical values throughout | `[2, 2, 2]`, `[2, 2]` |
| **4** | **Reversed Order** | All elements in one source smaller or larger | `[4, 5, 6]`, `[1, 2, 3]` |
| **5** | **Extreme Values** | Negative numbers, maximum constraints, large scale | `[-3, -1]`, `[-2, -1]` |

---

## 4. Real-World Analogy: How Engineers Test in Production

Imagine merging two **sorted log files** on a server:
- ✅ **Normal:** Files with regular log data.
- ⚙️ **Empty:** One log file is empty.
- 🧪 **Duplicates:** Both files contain records with identical timestamps.
- 💡 **Skewed:** One file contains only older records; the other contains only newer records.
- 🚀 **Scale:** Very large files tested to ensure memory doesn't crash and CPU doesn't spike.

Writing DSA test cases follows the exact same engineering principle: anticipating real-world edge conditions.

---

## 5. Summary Cheat Sheet

| Step | Core Question | Primary Objective |
| :--- | :--- | :--- |
| **1️⃣ Normal** | Does my code work on basic input? | Sanity check |
| **2️⃣ Edge** | What happens at the boundaries ($0$, $1$, empty, limits)? | Stability |
| **3️⃣ Tricky** | Can negatives, duplicates, or interleaving break it? | Robustness |
| **4️⃣ Large** | Will it scale within time limits without TLE? | Performance |
| **5️⃣ Pattern** | Does the logic follow the canonical DSA pattern? | Algorithmic correctness |