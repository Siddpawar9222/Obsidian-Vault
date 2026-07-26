
---


## Why two Recursion Call inside 1 method : 

The short answer is:

> **Because moving `n` disks cannot be completed in one recursive phase.**  
> You must first **free the largest disk**, then **move it**, then **restore the smaller disks**. These are three separate tasks, and **two of them are identical recursive problems.**

Let's understand it from first principles.

---

# The Goal

Suppose we have 3 disks.

```
Source (A)        Auxiliary (B)      Destination (C)

    1
    2
    3
```

We want

```
A  ---------->  C
```

Rules:

- Move only one disk at a time.
    
- Never place a larger disk on a smaller disk.

---

# Think about the largest disk

Suppose the largest disk is **3**.

Can you move it immediately?

```
1
2
3
```

No.

Because disks **1** and **2** are on top of it.

So first we must remove them.

This becomes another Tower of Hanoi problem.

Move

```
2 disks
A → B
```

This is exactly the same problem with smaller input.

So we write

```java
solve(n-1, source, destination, auxiliary);
```

This is the **first recursive call**.

---

# After that

Now the situation becomes

```
Source

3

Auxiliary

1
2

Destination
```

Now disk 3 is free.

Move it.

```
move(source, destination);
```

No recursion here.

Just one move.

---

# Now what?

Disk 3 is at destination.

But disks 1 and 2 are still sitting on the auxiliary rod.

```
Auxiliary

1
2

Destination

3
```

Our final goal is

```
1
2
3
```

How do we do that?

Move the two disks

```
B → C
```

Again…

This is **another Tower of Hanoi problem**.

Exactly the same problem.

Only the rods are different.

So we write

```java
solve(n-1, auxiliary, source, destination);
```

This becomes the **second recursive call**.

---

# Why isn't one recursive call enough?

Imagine we only write

```java
solve(n-1);

moveLargestDisk();
```

Then after moving the largest disk

```
Destination

3

Auxiliary

1
2
```

The smaller disks are still on the auxiliary rod.

Who will move them onto disk 3?

Nobody.

The algorithm stops.

The puzzle is incomplete.

---

# Visual Flow

For 3 disks

```
Move(3)

↓

Move top 2 disks
A → B
      (Recursive Call #1)

↓

Move disk 3
A → C

↓

Move top 2 disks
B → C
      (Recursive Call #2)
```

Without the second recursion

```
Move top 2
↓

Move biggest

↓

STOP
```

Result

```
B

1
2

C

3
```

Wrong answer.

---

# Real-life analogy

Imagine moving a stack of books.

```
Small
Medium
Large
```

You want to move them to another table.

First

```
Remove Small
Remove Medium
```

Now

```
Move Large
```

Now the small books are still on the old table.

You must again

```
Move Medium
Move Small
```

The work before and after moving the largest book is **the same type of problem**.

That's why recursion naturally appears **twice**.

---

# General Formula

For `n` disks:

```
Move(n)

=
Move(n-1) to auxiliary
+
Move largest disk
+
Move(n-1) to destination
```

In code:

```java
void tower(int n, char source, char auxiliary, char destination) {

    if (n == 1) {
        System.out.println(source + " -> " + destination);
        return;
    }

    // Step 1: Free the largest disk
    tower(n - 1, source, destination, auxiliary);

    // Step 2: Move the largest disk
    System.out.println(source + " -> " + destination);

    // Step 3: Place smaller disks back on top
    tower(n - 1, auxiliary, source, destination);
}
```

---

# Key Insight

Recursion in Tower of Hanoi represents **two independent subproblems**:

- **First recursive call:** Move the top `n-1` disks out of the way so the largest disk can be moved.
    
- **Move the largest disk:** A single direct move.
    
- **Second recursive call:** Move those `n-1` disks onto the largest disk at the destination.

Each recursive call solves a different phase of the overall task. Omitting either one leaves the puzzle unfinished.