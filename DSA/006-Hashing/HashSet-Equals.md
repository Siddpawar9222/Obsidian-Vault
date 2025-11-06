
---

```
package I$Hashing;

class Student {
    private int id;
    private String name;

    public Student() {
    }

    public Student(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
    

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + this.id;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Student other = (Student) obj;
        if (id != other.id)
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Student [id=" + id + ", name=" + name + "]";
    }

}
import java.util.HashSet;
import java.util.Set;

public class HashSetClass {

   public static void main(String[] args) {

      Set<Student> set = new HashSet<>();
      set.add(new Student(10, "Manish"));
      set.add(new Student(11, "Ganesh"));
      set.add(new Student(12, "Kanvesh"));
      set.add(new Student(12, "Kanvesh"));
      set.add(new Student());
      set.add(new Student());
      System.out.println(set);

   }

}
```


----


# HashCode and Equals Methods: How They Work Together

## Understanding the Contract

The `hashCode()` and `equals()` methods have a fundamental contract in Java:

1. **If two objects are equal (equals() returns true), they MUST have the same hash code**
2. **If two objects have the same hash code, they MAY OR MAY NOT be equal**
3. **If two objects are not equal, they SHOULD have different hash codes (but it's not mandatory)**

## How HashSet Uses These Methods

When you add objects to a `HashSet`, here's what happens internally:

### Step 1: Calculate Hash Code

```java
int hashCode = object.hashCode();
```

### Step 2: Find the Bucket

The hash code determines which "bucket" (internal array index) the object should go into:

```java
int bucketIndex = hashCode % bucketArray.length;
```

### Step 3: Check for Duplicates

If the bucket already contains objects, `HashSet` uses `equals()` to check if the new object is a duplicate.

## Step-by-Step Execution of Your Code

Let's trace through your code execution:

### Initial State

```java
Set<Student> set = new HashSet<>();
```

- Creates an empty HashSet with internal bucket array

### Adding Student(10, "Manish")

```java
set.add(new Student(10, "Manish"));
```

1. **Calculate hashCode():**
    
    ```java
    result = 31 * 1 + 10 = 41
    ```
    
2. **Find bucket:** `41 % arraySize` → Let's say bucket index 9
    
3. **Check for duplicates:** Bucket is empty, so add the student
    
4. **Result:** Set size = 1
    

### Adding Student(11, "Ganesh")

```java
set.add(new Student(11, "Ganesh"));
```

1. **Calculate hashCode():**
    
    ```java
    result = 31 * 1 + 11 = 42
    ```
    
2. **Find bucket:** `42 % arraySize` → Let's say bucket index 10
    
3. **Check for duplicates:** Bucket is empty, so add the student
    
4. **Result:** Set size = 2
    

### Adding Student(12, "Kanvesh") - First Time

```java
set.add(new Student(12, "Kanvesh"));
```

1. **Calculate hashCode():**
    
    ```java
    result = 31 * 1 + 12 = 43
    ```
    
2. **Find bucket:** `43 % arraySize` → Let's say bucket index 11
    
3. **Check for duplicates:** Bucket is empty, so add the student
    
4. **Result:** Set size = 3
    

### Adding Student(12, "Kanvesh") - Second Time (DUPLICATE!)

```java
set.add(new Student(12, "Kanvesh"));
```

1. **Calculate hashCode():**
    
    ```java
    result = 31 * 1 + 12 = 43  // Same as before!
    ```
    
2. **Find bucket:** `43 % arraySize` → Same bucket index 11
    
3. **Check for duplicates:**
    
    - Bucket contains the previous Student(12, "Kanvesh")
    - Call `equals()` method:
    
    ```java
    // Comparing new Student(12, "Kanvesh") with existing Student(12, "Kanvesh")
    if (this.id != other.id)  // 12 != 12? FALSE
        return false;
    return true;  // They are equal!
    ```
    
4. **Result:** Duplicate detected! Object NOT added. Set size remains 3
    

### Adding Student() - First Empty Student

```java
set.add(new Student());
```

1. **Calculate hashCode():**
    
    ```java
    result = 31 * 1 + 0 = 31  // id defaults to 0
    ```
    
2. **Find bucket:** `31 % arraySize` → Let's say bucket index 15
    
3. **Check for duplicates:** Bucket is empty, so add the student
    
4. **Result:** Set size = 4
    

### Adding Student() - Second Empty Student (DUPLICATE!)

```java
set.add(new Student());
```

1. **Calculate hashCode():**
    
    ```java
    result = 31 * 1 + 0 = 31  // Same as before!
    ```
    
2. **Find bucket:** `31 % arraySize` → Same bucket index 15
    
3. **Check for duplicates:**
    
    - Bucket contains the previous empty Student()
    - Call `equals()` method:
    
    ```java
    // Comparing new Student() with existing Student()
    if (this.id != other.id)  // 0 != 0? FALSE
        return false;
    return true;  // They are equal!
    ```
    
4. **Result:** Duplicate detected! Object NOT added. Set size remains 4
    

## Final Output

```java
System.out.println(set);
```

**Output:**

```
[Student [id=10, name=Manish], Student [id=11, name=Ganesh], Student [id=12, name=Kanvesh], Student [id=0, name=null]]
```

## Key Observations

### Why the Name Doesn't Matter

Notice that even though both Student(12, "Kanvesh") objects have the same name, the `equals()` method in your code **only compares the `id` field**:

```java
@Override
public boolean equals(Object obj) {
    // ... null and type checks ...
    Student other = (Student) obj;
    if (id != other.id)
        return false;
    return true;  // Only comparing id, not name!
}
```

### HashCode Only Uses ID Too

Similarly, `hashCode()` only uses the `id` field:

```java
@Override
public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + this.id;  // Only using id
    return result;
}
```

This maintains the contract: objects with same `id` will have same hash code AND will be equal.

## What Happens Without Proper Implementation?

If you didn't override `hashCode()` and `equals()`, Java would use:

- **Object.hashCode():** Returns different values for different object instances
- **Object.equals():** Returns true only for the same object reference (`this == obj`)

This would mean:

```java
Student s1 = new Student(12, "Kanvesh");
Student s2 = new Student(12, "Kanvesh");
// s1.equals(s2) would be FALSE (different objects)
// s1.hashCode() != s2.hashCode() (different hash codes)
```

Result: HashSet would treat them as different objects and store both!

## Performance Benefits

This two-step process (hashCode → equals) is much faster than checking equality with every existing object:

1. **Fast filtering:** HashCode quickly eliminates most non-duplicate candidates
2. **Precise checking:** Equals method only runs on objects in the same bucket
3. **O(1) average complexity:** Instead of O(n) linear search

## Best Practices

1. **Always override both methods together**
2. **Use the same fields in both methods**
3. **Ensure immutable fields are used (or handle mutability carefully)**
4. **Use prime numbers in hashCode calculation for better distribution**
5. **Consider using IDE-generated implementations or Objects.hash() and Objects.equals()**