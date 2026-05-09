
---

# Disadvantages of Overriding `equals()` and `hashCode()`

If we override `equals()` and `hashCode()` when we actually do NOT need logical comparison or uniqueness, it can create unnecessary complexity and bugs.

`equals()` can be also used for other Data Structure like `ArrayList()<>` (for `contains()` method).
---

# 1. Extra Processing Overhead

Whenever an object is used inside:

* `HashMap`
* `HashSet`
* `contains()`
* `remove()`

Java internally calls:

* `hashCode()`
* `equals()`

If object contains many fields, computation becomes expensive.

---

## Example

```java
import java.util.Objects;

class Student {

    int id;
    String name;
    String address;
    String phone;
    String email;

    @Override
    public int hashCode() {
        return Objects.hash(id, name, address, phone, email);
    }
}
```

Here Java must calculate hash using multiple fields every time.

In large applications this can impact performance.

---

# 2. Risk of Bugs Due to Wrong Implementation

Incorrect implementation can completely break collection behavior.

---

## Bad Example

```java
class Student {

    int id;

    @Override
    public boolean equals(Object obj) {
        return true;
    }
}
```

---

## Problem

Now every object becomes equal.

```java
Student s1 = new Student();
Student s2 = new Student();

System.out.println(s1.equals(s2));
```

Output:

```text
true
```

Very dangerous.

HashSet and HashMap behavior becomes incorrect.

---

# 3. Mutable Field Problem (Very Important)

This is one of the most important real-world problems.

---

# Core Idea

When object is inserted into `HashSet` or used as key in `HashMap`:

Java calculates:

```java
hashCode()
```

Then Java decides:

```text
Which bucket should store this object?
```

If later the field used inside `hashCode()` changes,
then hashCode also changes.

But object still remains in old bucket.

Now collection becomes logically corrupted.

---

# Example

```java
import java.util.HashSet;

class Student {

    int id;

    Student(int id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        return id;
    }

    @Override
    public boolean equals(Object obj) {

        if (this == obj) {
            return true;
        }

        if (!(obj instanceof Student)) {
            return false;
        }

        Student s = (Student) obj;

        return this.id == s.id;
    }
}

public class Main {

    public static void main(String[] args) {

        HashSet<Student> set = new HashSet<>();

        Student s = new Student(10);

        set.add(s);

        // changing field used in hashCode()
        s.id = 20;

        System.out.println(set.contains(s));
    }
}
```

---

# Output

```text
false
```

Even though object exists inside HashSet.

---

# Why This Happens

Initially:

```text
hashCode = 10
```

Object stored in:

```text
Bucket 10
```

Later:

```text
id = 20
hashCode = 20
```

Now HashSet searches in:

```text
Bucket 20
```

But object is physically still in:

```text
Bucket 10
```

So object becomes unreachable.

---

# Best Practice

Fields used inside:

* `equals()`
* `hashCode()`

should preferably be immutable (`final`).

---

## Good Example

```java
class Student {

    private final int id;

    Student(int id) {
        this.id = id;
    }
}
```

That is why immutable objects like:

* `String`
* `Integer`
* `UUID`

work perfectly as HashMap keys.

---

# 4. Sometimes Reference Equality Is Enough

Sometimes every object should be treated as unique even if data is same.

In such cases default implementation from `Object` class is better.

---

# Real World Examples

* Thread objects
* Socket connections
* User sessions
* Database entities before persistence

---

# Example

```java
class Student {

    int id;

    Student(int id) {
        this.id = id;
    }
}

public class Main {

    public static void main(String[] args) {

        Student s1 = new Student(10);
        Student s2 = new Student(10);

        System.out.println(s1.equals(s2));
    }
}
```

---

# Output

```text
false
```

Because default `equals()` compares memory addresses.

Sometimes this behavior is exactly what we want.

---

# 5. Maintenance Complexity

Whenever business requirements change,
developer must carefully update BOTH:

* `equals()`
* `hashCode()`

Otherwise contract breaks.

---

# Initial Version

```java
class Student {

    int id;

    @Override
    public boolean equals(Object obj) {

        Student s = (Student) obj;

        return this.id == s.id;
    }

    @Override
    public int hashCode() {
        return id;
    }
}
```

Everything works.

---

# Later Requirement Changes

Manager says:

```text
Two students are equal only if:
- id same
- AND name same
```

Developer updates only `equals()`:

---

## Incorrect Update

```java
@Override
public boolean equals(Object obj) {

    Student s = (Student) obj;

    return this.id == s.id &&
           this.name.equals(s.name);
}
```

But developer forgets to update:

```java
hashCode()
```

Still:

```java
return id;
```

---

# Problem

```java
Student s1 = new Student(10, "A");
Student s2 = new Student(10, "B");
```

Now:

```java
s1.equals(s2)
```

returns:

```text
false
```

But:

```java
s1.hashCode() == s2.hashCode()
```

returns:

```text
true
```

---

# Result

This can cause:

* Too many collisions
* Performance degradation
* Duplicate handling issues
* Difficult debugging
* Production bugs

---

# Golden Rule

Fields used in:

```java
equals()
```

must ALSO be used in:

```java
hashCode()
```

---

# Interview Important Point

Whenever you override:

```java
equals()
```

you should almost always override:

```java
hashCode()
```

And BOTH methods should use SAME fields.

---

# Rule of Thumb

Override `equals()` and `hashCode()` ONLY when:

* objects need logical comparison
* objects are used in `HashMap` / `HashSet`
* uniqueness depends on object data

---