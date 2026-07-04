
---

## 💡 Step 1: Understand What “Hidden Test Cases” Are

Hidden test cases are designed to:

- Test **edge conditions** (like empty arrays, duplicates, negative numbers, large inputs)
    
- Catch **incorrect logic that happens to work on simple data**
    
- Check **performance** (e.g., O(n²) vs O(n))
    

👉 So if your code works on visible tests but fails hidden ones,  
it usually means your **logic works by luck, not by rule**.

---

## 💡 Step 2: Recognize the Red Flags (Early Signs Your Logic May Be Wrong)

Here’s how you can **detect problems early**, before submitting:

|🔍 Sign|Example|What it means|
|---|---|---|
|You’re using `swap()` in a problem about “merge”|Like in your code|You’re trying to “fix order” instead of merging sorted data correctly|
|You’re not using both arrays’ sorted property|You just appended nums2|You lost the main advantage (sorted merge)|
|Your loop only makes 1 comparison per element|While merging you need to compare many times||
|Your code doesn’t handle boundary cases|e.g. m=0 or n=0 or all duplicates|Hidden test will fail|
|Time complexity seems higher than O(m+n)|Means inefficiency will show on large tests||

So even if sample tests pass, the **pattern of your logic** already hints it's not fully general.

---

## 💡 Step 3: How to Catch These Before Submitting

Here’s what you can **practice** to avoid wasting time:

### ✅ Step 3.1: Write Your Own Hidden Tests

Before you submit, always test extreme cases manually:

```java
// Edge cases
nums1 = [0], m=0, nums2=[1], n=1 → expect [1]
nums1 = [1], m=1, nums2=[], n=0 → expect [1]
nums1 = [2,0], m=1, nums2=[1], n=1 → expect [1,2]
nums1 = [4,5,6,0,0,0], m=3, nums2=[1,2,3], n=3 → expect [1,2,3,4,5,6]
nums1 = [1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3 → expect [1,2,2,3,5,6]
```

If your logic fails even one of these — you’ve already found your bug ✅  
This habit saves **hours of guessing**.

---

## 💡 Step 4: Understand the Problem Pattern

Every LeetCode problem has a **pattern** (like Two Pointers, Binary Search, etc).  
If your approach doesn’t match the pattern, that’s a warning sign 🚨

For this problem:

- Both arrays are sorted → means **Two Pointer** from **end** or **start**.
    
- Using `swap()` and iterating once → not the right pattern.
    

So even without running, you can tell it’s logically risky.

---

## 💡 Step 5: Learn to Debug Logically, Not Emotionally

When something fails, don’t just “try random fixes”.

Use **dry runs**.

Example:

```java
nums1 = [1,2,3,0,0,0]
nums2 = [2,5,6]
```

Print values of i, j, nums1 before and after swap for 2–3 iterations.  
You’ll see your order breaks after 1-2 swaps.

Once you “see” the break, you fix it logically.

---

## 💡 Step 6: Learn from Pattern Recognition

Next time you see a problem with:

- “sorted arrays” → Think Two Pointer
    
- “merge” → Think “from end to avoid overwriting”
    
- “in-place” → Think “fill from back”
    

Over time, this pattern awareness becomes **intuition** — you’ll know when you’re doing something “hacky”.

---

## 💡 Step 7: Be Proud — You Actually Learned More

Spending 1 hour failing is **not a waste**.  
You now learned:

- How to detect logic gaps early
    
- Why merging from front fails
    
- How to dry-run smarter
    
- How to plan tests like a pro
    

That’s how real developers grow 🚀

---


