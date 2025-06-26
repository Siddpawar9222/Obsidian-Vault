

---

### 📏 How Deep Can Recursion Go in Java?

Java doesn’t give a fixed **"recursion limit"**, but it’s based on:

- 🧵 **Stack size per thread**
    
- 📦 **Memory usage per recursive call**
    
- ⚙️ **JVM settings**
    

---

### ✅ By Default (on most systems):

- Java allows about **~10,000 recursion calls** before throwing a  
    `StackOverflowError`.
    

But this number can change depending on:

|Factor|Explanation|
|---|---|
|🧠 Size of each recursive frame|If your method has lots of variables or uses large objects, fewer calls fit.|
|🛠 JVM Stack size|You can set it with `-Xss` option (e.g., `-Xss1m`, `-Xss512k`)|
|📱 System Architecture|32-bit JVM allows less stack than 64-bit JVM|
|🧵 Thread stack vs heap|Recursion uses **stack**, not **heap**, so GC won’t help|

---

### 🔥 What happens if you go over the limit?

```java
Exception in thread "main" java.lang.StackOverflowError
```

This means:

> Your method called itself **too many times** without returning — stack memory is full.

---

### ⚙️ Want to test the limit?

Here’s a fun experiment you can run:

```java
public class TestRecursionLimit {
    static int count = 0;

    public static void recurse() {
        count++;
        System.out.println("Recursion depth: " + count);
        recurse();
    }

    public static void main(String[] args) {
        recurse();
    }
}
```

Try it — you’ll likely see the error around 8,000 to 10,000 calls.

---

### 💡 How to Avoid StackOverflowError?

|Method|How it Helps|
|---|---|
|Use iteration|Avoids recursion, no stack usage|
|Use memoization + bottom-up DP|Avoids deep call chain|
|Use tail recursion + optimization|Not supported by Java (⚠️ unlike some languages)|

---

### 📊 Let’s summarize the **main factors**:

|🔍 Factor|🧠 What It Means|
|---|---|
|**JVM Stack Size (`-Xss`)**|This sets the memory limit for each thread's stack. A larger stack means more recursion calls possible. Default is often 512k or 1MB.|
|**Size of Each Stack Frame**|Every recursive call creates a "frame" with its own variables. If your method has many or large local variables, the frame is bigger = fewer calls fit.|
|**Method Signature**|More parameters = more memory used per call. Simpler methods go deeper.|
|**System Architecture**|64-bit JVMs allow bigger stack sizes than 32-bit.|
|**Thread**|Stack size is per thread. Different threads may have different stack sizes.|

---

### 🧪 Example:

Two functions:

```java
// Simple
void recurse1() {
    recurse1();
}

// Heavy
void recurse2(int[] arr, String str, List<Integer> list) {
    recurse2(arr, str, list);
}
```

Both are infinite, but **`recurse2` will hit stack overflow faster** because each call uses more memory!

---

### 🧠 Key Insight

> More memory per call = fewer recursive calls allowed  
> Less memory per call = deeper recursion possible

---

### ⚙️ Can I Increase Recursion Depth?

Yes! You can run your Java program with a larger stack size:

```bash
java -Xss2m MyProgram
```

This gives each thread a 2MB stack instead of default (e.g., 1MB).

Be careful — setting this too high may crash your system or reduce the number of threads you can create.

---
