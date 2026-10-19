

---



# Java Comparator, Generics, and Sorting

## Understanding `Comparator` with `Collections.sort()`

A `Comparator` is used when we want to define a custom sorting order for objects.

For example, suppose we have a `Student` class with fields such as `name` and `marks`. We might want to sort students by marks, name, or age. A `Comparator` allows us to define these different sorting rules without changing the `Student` class.

### Example: Sorting a list of students

```
List<Student> students = new ArrayList<>(
    List.of(s1, s2, s3, s4)
);

Collections.sort(students, myComparator);
```

Here:

- `students` is the list that we want to sort.
    
- `myComparator` defines the sorting logic.
    
- `Collections.sort()` uses that comparator to arrange the elements.

The comparator could be declared as:

```
Comparator<Student> myComparator = (s1, s2) ->
    Integer.compare(s1.getMarks(), s2.getMarks());
```

This sorts students by marks in ascending order.

## Understanding `Collections.sort()` internally

The relevant method signature is conceptually:

```
public static <T> void sort(
    List<T> list,
    Comparator<? super T> comparator
)
```

Let's understand each part.

|Part|Meaning|
|---|---|
|`<T>`|A generic type representing the list element type|
|`List<T> list`|The list containing elements of type `T`|
|`Comparator<? super T>`|A comparator that can compare objects of type `T` or a suitable superclass of `T`|
|`void`|The method does not return a new list; it sorts the supplied list|

The important part of your notes is:

```
Comparator<? super T>
```

### What does `? super T` mean?

It means a comparator of type `T` or any superclass of `T`.

Suppose we have this inheritance hierarchy:

```
class Person {
}

class Student extends Person {
}
```

Because `Student` extends `Person`, a `Comparator<Person>` can also compare `Student` objects, provided its comparison logic works for them.

```
Comparator<Person> personComparator = …;

List<Student> students = new ArrayList<>();

Collections.sort(students, personComparator);
```

This is allowed because the comparator accepts `Person` objects, and every `Student` is also a `Person`.

However, a `Comparator<Object>` is not the only valid option. A `Comparator<Student>` also works.

Remember: `? super T` makes the API flexible by allowing comparators that accept the element type or a broader type.

## Sorting a 2D array using `Arrays.sort()`

Consider the following array:

```
int[][] intervals = {
    {2, 3},
    {2, 6},
    {1, 4}
};
```

Each inner array represents an interval:

- `{2, 3}` means an interval starting at `2` and ending at `3`.
    
- `{2, 6}` means an interval starting at `2` and ending at `6`.
    
- `{1, 4}` means an interval starting at `1` and ending at `4`.

Suppose we want to sort these intervals according to their starting values.

### Using a comparator

```
Arrays.sort(intervals, (a, b) ->
    Integer.compare(a[0], b[0])
);
```

Output:

```
[1, 4]
[2, 3]
[2, 6]
```

Here, `a` and `b` represent two inner arrays being compared.

- `a[0]` accesses the starting value of the first interval.
    
- `b[0]` accesses the starting value of the second interval.
    
- `Integer.compare(a[0], b[0])` compares those starting values.

If the first value is smaller, it comes first. This sorts the intervals in ascending order by their starting values.

### Understanding the method signature

The relevant overloaded method is conceptually:

```
public static <T> void sort(
    T[] a,
    Comparator<? super T> c
)
```

In this example:

```
int[][] intervals;
```

The outer array contains elements of type `int[]`.

Therefore, Java infers:

```
T = int[]
```

So the comparator effectively has a type compatible with:

```
Comparator<? super int[]>
```

This is why a comparator can be used to sort a 2D primitive array.

### Important clarification about arrays and generics

Your handwritten notes mention that arrays are reference types. That is correct, but there is an important distinction.

|Declaration|Element type|Can use `Comparator` with `Arrays.sort()`?|
|---|---|---|
|`int[]`|`int` (primitive)|No|
|`Integer[]`|`Integer` (reference type)|Yes|
|`int[][]`|`int[]` (reference type)|Yes|
|`String[]`|`String` (reference type)|Yes|

Although `int[]` contains primitive integers, the array itself is an object and therefore a reference type in Java.

That is why `int[][]` can be sorted using a comparator: its elements are `int[]` objects.

## Why does `Arrays.sort(int[])` not accept a comparator?

Consider this example:

```
int[] numbers = {1, 4, 3, 2, 9};

Arrays.sort(numbers);
```

This works because Java provides a specialized overload for primitive arrays.

It sorts the numbers in ascending order:

```
[1, 2, 3, 4, 9]
```

But this does not compile:

```
Arrays.sort(numbers, comparator);
```

Why?

Because Java's `Arrays.sort()` API does not provide a comparator-based overload for primitive arrays such as `int[]`, `double[]`, or `long[]`.

A comparator requires a reference type as its generic type argument. Java generics do not support primitive type arguments such as `int`.

### How to sort integers using a custom comparator

If you need a custom ordering for individual numbers, use the wrapper class `Integer`:

```
Integer[] numbers = {1, 4, 3, 2, 9};

Arrays.sort(numbers, (a, b) ->
    Integer.compare(b, a)
);
```

Output:

```
[9, 4, 3, 2, 1]
```

This sorts the numbers in descending order.

The difference is:

```
int[]       // Primitive array
Integer[]   // Reference-type array
```

`Integer` is a wrapper class for the primitive type `int`.

## Default sorting vs. custom sorting

|Method|Sorting behavior|
|---|---|
|`Arrays.sort(intArray)`|Sorts primitive integers in ascending order|
|`Arrays.sort(objectArray)`|Uses the elements' natural ordering|
|`Arrays.sort(objectArray, comparator)`|Uses the supplied custom comparison logic|
|`Collections.sort(list)`|Uses the list elements' natural ordering|
|`Collections.sort(list, comparator)`|Uses the supplied custom comparison logic|

For example:

```
int[] numbers = {5, 2, 8, 1};
Arrays.sort(numbers);
```

This sorts the numbers in ascending order without requiring a comparator.

But if we want to sort a list of students by marks, or intervals by their starting values, we can supply a comparator.

Java's sorting implementation uses the appropriate algorithm for the particular overload and data type; the default primitive-array sort is optimized for primitive values.

## Quick revision notes

- `Comparator<T>`: Defines custom sorting logic for objects of type `T`.
    
- `Comparator<? super T>`: Accepts a comparator for `T` or one of its supertypes.
    
- `Collections.sort()`: Sorts a `List`.
    
- `Arrays.sort()`: Sorts an array.
    
- `int[]`: An array containing primitive integers; supports default sorting but not comparator-based sorting.
    
- `Integer[]`: An array of wrapper objects; supports comparator-based sorting.
    
- `int[][]`: An array whose elements are `int[]` objects; supports comparator-based sorting.
    
- `Integer.compare(a, b)`: Compares two integer values safely without relying on subtraction.

### Interview takeaway

The key concept is that the type of the elements being sorted determines which `Arrays.sort()` overload can be used.

For a 2D array, the outer array's element type is `int[]`, which is a reference type. For a one-dimensional `int[]`, the element type is primitive `int`, so Java does not allow a `Comparator` for that overload.