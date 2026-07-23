

---- 

## Intuition

---




### Think of the matrix as a "virtual" 1D array

Suppose the matrix is

```
1   3   5   7
10 11 16 20
23 30 34 60
```

Imagine numbering every element.

```
Index : Value

0  -> 1
1  -> 3
2  -> 5
3  -> 7
4  -> 10
5  -> 11
6  -> 16
7  -> 20
8  -> 23
9  -> 30
10 -> 34
11 -> 60
```

Notice something?

The indices are perfectly sorted.

So if binary search works on this imaginary array, why can't we simply binary search on the **indices**?

---

### The only missing piece

Suppose binary search gives you

```
mid = 7
```

Now ask yourself:

> Where is index 7 inside the matrix?

You don't know immediately.

So now think about the pattern.

```
Columns = 4

Index 0 -> (0,0)
Index 1 -> (0,1)
Index 2 -> (0,2)
Index 3 -> (0,3)

Index 4 -> (1,0)
Index 5 -> (1,1)
Index 6 -> (1,2)
Index 7 -> (1,3)

Index 8 -> (2,0)
…
```

Can you see the relationship?

Every **4 indices** (number of columns) we move to the next row.

That should remind you of something…

When we divide by 4,

```
0/4 = 0
1/4 = 0
2/4 = 0
3/4 = 0

4/4 = 1
5/4 = 1
6/4 = 1
7/4 = 1

8/4 = 2
```

The quotient tells you the row.

Now look at the remainder.

```
0 % 4 = 0
1 % 4 = 1
2 % 4 = 2
3 % 4 = 3

4 % 4 = 0
5 % 4 = 1
6 % 4 = 2
7 % 4 = 3
```

The remainder tells you the column.

So a virtual index can always be converted into

* **row = ?**
* **column = ?**

without creating another array.

---

### Now imagine binary search

Suppose there are

```
m = 3
n = 4
```

Total elements

```
12
```

Instead of searching from

```
0 to 2 rows
```

or

```
0 to 3 columns
```

search from

```
0 to 11
```

Exactly like a normal sorted array.

Every time binary search picks a `mid`,

you simply ask:

> Which matrix cell does this virtual index represent?

Then compare that matrix value with the target.

Nothing else changes.

---

### Why this works

Normally binary search needs one thing:

> Given an index, I should be able to access the element in O(1).

Here, although there isn't a physical 1D array,

```
virtualIndex
      ↓
(row, column)
      ↓
matrix[row][column]
```

takes constant time.

So from binary search's perspective, it **looks exactly like a sorted 1D array**.

---