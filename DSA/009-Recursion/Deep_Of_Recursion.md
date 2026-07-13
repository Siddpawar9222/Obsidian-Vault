
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

## What is tail recursion : 
**Tail recursion** is a type of recursion where the **recursive call is the last operation performed by the function**. This means there is no additional work left to do after the recursive call returns.

### Example of Tail Recursion

```python
def factorial(n, result=1):
    if n == 0:
        return result
    return factorial(n - 1, result * n)
```

**How it works:**

* `factorial(5, 1)`
* `factorial(4, 5)`
* `factorial(3, 20)`
* `factorial(2, 60)`
* `factorial(1, 120)`
* `factorial(0, 120)` → returns `120`

Notice that the recursive call is the **last statement** in the function.

---

### Example of Non-Tail Recursion

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
```

Here, after `factorial(n - 1)` returns, the function still needs to multiply the result by `n`. Since work remains after the recursive call, this is **not** tail recursion.

---

### Advantages of Tail Recursion

* Can be optimized by some programming language compilers/interpreters into a loop (**Tail Call Optimization (TCO)**).
* Uses constant stack space when TCO is supported.
* Helps avoid stack overflow for deep recursion.

### Note

Languages like **Scheme**, **Scala**, and some functional languages support tail call optimization. **Python does not perform tail call optimization**, so tail-recursive functions still consume stack space just like other recursive functions.

**In simple terms:**

> A recursive function is **tail recursive** if the recursive call is the **last thing the function does** before returning.




The short answer is:

> **Java supports writing tail-recursive functions, but the JVM does NOT perform Tail Call Optimization (TCO).**

So, although you can write tail recursion in Java, **it does not provide the main benefit** (constant stack usage).

---

## Example in Java

### Tail Recursive Function

```java
public class Main {

    static int factorial(int n, int result) {
        if (n == 0) {
            return result;
        }

        return factorial(n - 1, result * n);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5, 1));
    }
}
```

Notice that:

```java
return factorial(n - 1, result * n);
```

is the **last statement**.

There is nothing left to execute after the recursive call returns.

---

### Non-Tail Recursive Function

```java
public class Main {

    static int factorial(int n) {
        if (n == 0) {
            return 1;
        }

        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}
```

Here,

```java
return n * factorial(n - 1);
```

is **not** tail recursion because after `factorial(n - 1)` returns, Java still has to perform:

```
result = n * returnedValue;
```

So every recursive call must remain on the stack.

---

# Why doesn't Java optimize tail recursion?

The JVM specification does **not require** tail call optimization.

The designers of Java chose:

* predictable stack traces
* easier debugging
* better exception handling

over automatically converting tail recursion into loops.

Therefore each recursive call creates a **new stack frame**, even if it is tail recursive.

---

## What happens internally?

Suppose:

```java
factorial(100000, 1);
```

Even though it's tail recursive:

```
factorial(100000)
    ↓
factorial(99999)
    ↓
factorial(99998)
    ↓
...
```

The JVM creates **100,000 stack frames**.

Eventually you'll get:

```
Exception in thread "main"
java.lang.StackOverflowError
```

---

## Languages that optimize tail recursion

These languages perform Tail Call Optimization (TCO):

* Scala (with `@tailrec` when applicable)
* Scheme
* Clojure (limited via `recur`)
* Haskell
* F#

Java does **not**.

---

## In production Java applications

In Java (including Spring Boot projects), developers generally **prefer loops over recursion** for problems that may recurse deeply.

For example, instead of:

```java
sum(n);
```

they write:

```java
int sum = 0;

for (int i = 1; i <= n; i++) {
    sum += i;
}
```

because:

* ✅ no risk of `StackOverflowError`
* ✅ constant memory usage
* ✅ often faster
* ✅ easier for the JVM to optimize (JIT)

---

### Summary

| Feature                               | Java                  |
| ------------------------------------- | --------------------- |
| Can write tail-recursive methods?     | ✅ Yes                 |
| JVM performs Tail Call Optimization?  | ❌ No                  |
| Tail recursion uses constant stack?   | ❌ No                  |
| Risk of `StackOverflowError`?         | ✅ Yes                 |
| Preferred approach for deep recursion | ✅ Use loops/iteration |

So in Java, **tail recursion is mainly a coding style, not a performance optimization**, because the JVM does not eliminate the recursive stack frames.
