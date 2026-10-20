

---

## 1. Overview: Default Sorting vs. Custom Sorting

In Java, sorting is mainly done using two utility classes:
- **`Arrays.sort()`** — used for sorting **arrays** (both primitive arrays like `int[]` and object arrays like `Integer[]` or `String[]`).
- **`Collections.sort()`** — used for sorting **collections** (specifically lists like `ArrayList`).

### Comparison Table

| Method Call | Sorting Behavior |
| :--- | :--- |
| `Arrays.sort(intArray)` | Sorts primitive integers in **ascending** order |
| `Arrays.sort(objectArray)` | Sorts objects using their **natural ordering** (`Comparable`) |
| `Arrays.sort(objectArray, comparator)` | Sorts objects using **custom logic** defined by the `Comparator` |
| `Collections.sort(list)` | Sorts list elements using their **natural ordering** (`Comparable`) |
| `Collections.sort(list, comparator)` | Sorts list elements using **custom logic** defined by the `Comparator` |

### Default Sorting Example

```java
int[] numbers = {5, 2, 8, 1};
Arrays.sort(numbers);
// Result: [1, 2, 5, 8] (sorted in ascending order without a comparator)
```

> [!NOTE]
> Java chooses the most efficient sorting algorithm depending on the data type:
> - For **primitive arrays**, it uses a tuned **Dual-Pivot Quicksort** (optimized for speed and memory).
> - For **object arrays and collections**, it uses **TimSort** (a stable, adaptive merge sort).

If we want custom sorting—such as sorting a list of students by their marks or sorting intervals by their start times—we supply a **`Comparator`**.

---

## 2. Understanding `Comparator`

A `Comparator` is used when we want to define a **custom sorting order** for objects without altering the class itself.

For example, suppose we have a `Student` class with fields like `name`, `marks`, and `age`. We might want to sort students by marks in one place, by name in another place, or by age in yet another. A `Comparator` allows us to define these different rules independently.

### How `compare(a, b)` Works

A comparator works by implementing a single method: `compare(a, b)`. It compares two objects and returns an integer:

$$\text{Conceptually: } \text{compare}(a, b) = a - b$$

| Return Value | Meaning | Resulting Order |
| :--- | :--- | :--- |
| **Negative (`< 0`)** | `a` is smaller than `b` | `a` comes **first** |
| **Zero (`0`)** | `a` and `b` are equal for sorting | No change in relative order |
| **Positive (`> 0`)** | `a` is greater than `b` | `b` comes **first** |

#### Easy Trick to Remember
- `compare(a, b) < 0` $\rightarrow$ **`a` comes first**.
- `compare(a, b) == 0` $\rightarrow$ **equal** (keep order).
- `compare(a, b) > 0` $\rightarrow$ **`b` comes first**.

---

### Ascending vs. Descending Sorting

- **Ascending Order (Smallest to Largest):**
  ```java
  Comparator<Integer> ascending = (a, b) -> Integer.compare(a, b);
  ```

- **Descending Order (Largest to Smallest):**
  ```java
  Comparator<Integer> descending = (a, b) -> Integer.compare(b, a);
  ```

> [!WARNING]
> **Avoid `a - b` because of Integer Overflow!**
> Never write `(a, b) -> a - b` when comparing integers. If `a` is a large negative number and `b` is a positive number (e.g., $a = -2{,}147{,}483{,}648$ and $b = 1$), the subtraction overflows to a positive number, producing an incorrect sorting order.
> 
> **Always use `Integer.compare(a, b)`** because it handles extreme values safely without overflow.

---

### Example: Sorting a List of Students

```java
// List of students
List<Student> students = new ArrayList<>(
    List.of(s1, s2, s3, s4)
);

// Define custom comparator: Sort by marks in ascending order
Comparator<Student> myComparator = (s1, s2) ->
    Integer.compare(s1.getMarks(), s2.getMarks());

// Sort the list
Collections.sort(students, myComparator);
```

Here:
- `students`: The `List` that we want to sort.
- `myComparator`: Defines the sorting rule (compares marks using `Integer.compare`).
- `Collections.sort()`: Uses that comparator to rearrange the elements in-place.

---

## 3. How `Collections.sort()` Works Internally (Generics & `? super T`)

The method signature of `Collections.sort()` is:

```java
public static <T> void sort(
    List<T> list,
    Comparator<? super T> comparator
)
```

### Breakdown of the Signature

| Part | Meaning |
| :--- | :--- |
| `<T>` | Generic type representing the type of elements in the list |
| `List<T> list` | The list to be sorted containing elements of type `T` |
| `Comparator<? super T>` | A comparator that can compare objects of type `T` or any superclass (parent) of `T` |
| `void` | Sorts the list in-place; does not return a new list |

---

### What Does `? super T` Mean?

`? super T` means the comparator can accept type `T` **or any superclass (ancestor class) of `T`**.

Suppose we have an inheritance hierarchy:

```java
class Person {
    // Parent class
}

class Student extends Person {
    // Child class
}
```

Because `Student` extends `Person`, every `Student` **is a** `Person`. Therefore, a comparator designed to compare `Person` objects can also compare `Student` objects:

```java
Comparator<Person> personComparator = ...;

List<Student> students = new ArrayList<>();

// Valid! A Comparator<Person> can sort a List<Student>
Collections.sort(students, personComparator);
```

#### Why does Java do this?
- For `List<Student>`, any comparator from `Comparator<Student>` up to `Comparator<Object>` is valid.
- This makes the API flexible and reusable: you don't need to write a new comparator for every subclass if a parent-class comparator already exists.

---

## 4. Sorting 1D Arrays with `Arrays.sort()`

### Sorting Primitive Arrays (`int[]`)

```java
int[] numbers = {1, 4, 3, 2, 9};

Arrays.sort(numbers);
// Result: [1, 2, 3, 4, 9] (natural ascending order)
```

This works because Java provides a dedicated primitive overload: `Arrays.sort(int[] a)`.

---

### Why Does `Arrays.sort(int[])` NOT Accept a Comparator?

If you try to pass a comparator to a primitive array:

```java
Arrays.sort(numbers, comparator); // ❌ COMPILE ERROR!
```

#### Why does it fail?
1. Java generics (`<T>`) **only work with reference types (objects)**, such as `Integer`, `String`, or custom classes.
2. Java generics **do not support primitive types** like `int`, `double`, or `long`.
3. Because `Comparator<T>` requires an object type, Java has no `Arrays.sort(int[], Comparator)` method.

---

### How to Sort Integers with a Custom Comparator

To use a custom comparator with integers, use the wrapper class **`Integer`** instead of the primitive `int`:

```java
// Use Integer[] (Reference type), not int[] (Primitive)
Integer[] numbers = {1, 4, 3, 2, 9};

// Sort in descending order
Arrays.sort(numbers, (a, b) ->
    Integer.compare(b, a)
);

// Result: [9, 4, 3, 2, 1]
```

#### The Difference:
- `int[]`: Array of primitives $\rightarrow$ Supports default ascending sort only.
- `Integer[]`: Array of objects (wrapper class) $\rightarrow$ Supports custom comparators.

---

## 5. Sorting 2D Arrays using `Arrays.sort()`

A common DSA pattern (such as in Interval problems) is sorting a 2D array:

```java
int[][] intervals = {
    {2, 3},
    {2, 6},
    {1, 4}
};
```

Each inner array represents a range:
- `{2, 3}` $\rightarrow$ Start: `2`, End: `3`
- `{2, 6}` $\rightarrow$ Start: `2`, End: `6`
- `{1, 4}` $\rightarrow$ Start: `1`, End: `4`

Suppose we want to sort these intervals in ascending order by their **starting values**.

### Code

```java
Arrays.sort(intervals, (a, b) ->
    Integer.compare(a[0], b[0])
);
```

### Output:
```java
[1, 4]
[2, 3]
[2, 6]
```

### How the Comparator Works Here:
- `a` and `b` represent two inner 1D arrays being compared (e.g., `{2, 3}` and `{1, 4}`).
- `a[0]` is the starting value of the first interval.
- `b[0]` is the starting value of the second interval.
- `Integer.compare(a[0], b[0])` compares the start values. If `a[0] < b[0]`, interval `a` comes before interval `b`.

---

### Why Does `int[][]` Accept a Comparator While `int[]` Does Not?

Look at the generic method signature of `Arrays.sort()`:

```java
public static <T> void sort(
    T[] a,
    Comparator<? super T> c
)
```

In `int[][] intervals`:
- The outer array contains inner arrays of type `int[]`.
- Therefore, Java infers:
  $$T = \text{int[]}$$
- The comparator has the type:
  $$\text{Comparator}<? \text{ super int[]}>$$

> [!IMPORTANT]
> **Arrays are Objects in Java!**
> Even though `int` is a primitive type, an array `int[]` is an **Object** (a reference type).
> Because `int[][]` is an array of objects (`int[]`), it satisfies the generic type `<T>` and can be sorted using a `Comparator`.

### Summary of Arrays and Generics Compatibility

| Declaration | Element Type | Is Element a Reference Type? | Can Use `Comparator` with `Arrays.sort()`? |
| :--- | :--- | :--- | :--- |
| `int[]` | `int` | ❌ No (primitive) | ❌ **No** |
| `Integer[]` | `Integer` | ✅ Yes (wrapper object) | ✅ **Yes** |
| `int[][]` | `int[]` | ✅ Yes (array object) | ✅ **Yes** |
| `String[]` | `String` | ✅ Yes (object) | ✅ **Yes** |

---

## 6. Quick Revision Cheat Sheet

- **`Collections.sort(list)` vs. `Arrays.sort(array)`**:
  - `Collections.sort()` sorts lists (`List<T>`).
  - `Arrays.sort()` sorts arrays (`T[]` or primitive arrays).
- **`Comparator<T>`**: Defines custom sorting logic for objects of type `T`.
- **`compare(a, b)` Return Rules**:
  - Negative (`< 0`) $\rightarrow$ `a` comes first.
  - Zero (`0`) $\rightarrow$ equal (keep relative position).
  - Positive (`> 0`) $\rightarrow$ `b` comes first.
- **Safety Rule**: Prefer `Integer.compare(a, b)` over `a - b` to prevent arithmetic overflow with large negative numbers.
- **`Comparator<? super T>`**: Accepts a comparator defined for type `T` or any of its superclasses (e.g., `Comparator<Person>` or `Comparator<Object>` can sort `Student`).
- **Primitive Array Limitation (`int[]`)**: Cannot use custom comparators because generics do not accept primitive types.
- **Wrapper Class Solution (`Integer[]`)**: Can use custom comparators because `Integer` is a reference type.
- **2D Arrays (`int[][]`)**: Can use custom comparators because each row `int[]` is an object in Java.
