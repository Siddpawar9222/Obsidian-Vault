

---

### 🧠 Sorting Algorithms Summary Table (Forever Memory Table)

|**Algorithm**|**Real-World Analogy**|**Best Case**|**Average Case**|**Worst Case**|**Space**|**Advantages**|**Disadvantages**|
|---|---|---|---|---|---|---|---|
|**1. Selection Sort**|Like selecting the _smallest person from a crowd_ repeatedly and putting them in order.|O(n²)|O(n²)|O(n²)|O(1)|Simple to understand, no extra memory.|Very slow for large data, always compares all elements.|
|**2. Insertion Sort**|Like _arranging playing cards in your hand_ — you pick one and insert it in the right position.|O(n)|O(n²)|O(n²)|O(1)|Good for small or nearly sorted data.|Poor performance on large unsorted data.|
|**3. Bubble Sort**|Like _bubbling up the largest soap bubble_ — repeatedly swap adjacent out-of-order elements.|O(n)|O(n²)|O(n²)|O(1)|Easy to code, good for learning.|Very inefficient, not used in real apps.|
|**4. Merge Sort**|Like _dividing books into piles, sorting each pile, and then merging them_.|O(n log n)|O(n log n)|O(n log n)|O(n)|Very stable, works well for large data.|Needs extra memory, slower for small arrays.|
|**5. Quick Sort**|Like _organizing clothes around a pivot shirt_ (smaller on one side, larger on the other).|O(n log n)|O(n log n)|O(n²)|O(log n)|Very fast, used in many libraries (e.g., Arrays.sort).|Unstable, worst case on already sorted data (unless randomized).|
|**6. Cyclic Sort**|Like _students standing in roll number order without swapping repeatedly_ — each goes to its right spot directly.|O(n)|O(n)|O(n)|O(1)|Super efficient when range = [1…n].|Works only for special cases (like missing numbers, duplicates).|
|**7. Counting Sort**|Like _counting how many students got each mark and arranging by frequency_.|O(n + k)|O(n + k)|O(n + k)|O(k)|Very fast for small integer range.|Not good for large number ranges or negative numbers.|
|**8. Radix Sort**|Like _sorting ID cards digit by digit_ (units, tens, hundreds).|O(nk)|O(nk)|O(nk)|O(n + k)|Works great for integers/strings, no comparison needed.|Needs stable sort (like counting) inside, only for numbers/strings.|
|**9. Bucket Sort**|Like _putting balls into buckets based on color/size and sorting each bucket_.|O(n + k)|O(n + k)|O(n²)|O(n + k)|Very efficient for uniform data distribution.|Fails if data is unevenly distributed.|
|**10. Heap Sort**|Like _building a max-heap (pyramid)_ — biggest element always on top, remove one by one.|O(n log n)|O(n log n)|O(n log n)|O(1)|No extra memory, consistent O(n log n).|Not stable, slower than merge/quick in practice.|

---

### 🧩 Tip to Remember Easily

|**Type**|**Examples**|**Key Idea**|
|---|---|---|
|**Simple Comparison Sorts**|Selection, Insertion, Bubble|Compare and swap manually like human sorting.|
|**Divide & Conquer Sorts**|Merge, Quick|Break array, sort smaller parts, combine.|
|**Special Case Sorts**|Cyclic, Counting, Radix, Bucket|Use math logic or counting — not comparison-based.|
|**Heap-based Sort**|Heap Sort|Uses binary heap structure to pick max/min repeatedly.|

---




---

Would you like me to make a **visual version of this table** (like a color-coded cheat sheet image you can save or print)?  
It’ll help you revise much faster visually.