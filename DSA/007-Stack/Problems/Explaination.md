
---
# What makes a valid parentheses string ?

Consider

```text
(())
```

If you scan from **left to right**, at **any point**:

```text
number of ')' <= number of '('
```

For example,

```text
(
open = 1

()
open = 0

(()
open = 1

(())
open = 0
```

Notice that **open never becomes negative**.

If it ever becomes negative,

```text
)(
```

At the first character,

```text
open = -1
```

Impossible to fix.

This is the basic rule behind the classic Valid Parentheses problem.

---

# But here we have unlocked characters

Suppose

```text
s      = ))((
locked = 0011
```

The first two characters are unlocked.

So

```text
))
```

can become

```text
((
```

or

```text
()
```

or

```text
)(
```

or

```text
))
```

We don't know yet.

So instead of asking

> Is this character '(' ?

we ask

> Can this character behave like '(' if needed?

---

# Left to Right intuition

Suppose we scan

```text
))((
```

with

```text
0011
```

Let's define

```java
open
```

as

> Maximum possible unmatched opening brackets.

Now look at this code

```java
if(s.charAt(i) == '(' || locked.charAt(i) == '0'){
    open++;
}
else{
    open--;
}
```

Why?

---

## Case 1

Locked '('

```text
(
```

Definitely helps us.

```text
open++
```

---

## Case 2

Unlocked

```text
0
```

Even if current character is

```text
)
```

we can change it into

```text
(
```

So we optimistically assume

```text
"I'll use this as '(' if I ever need it."
```

Hence

```text
open++
```

---

## Case 3

Locked ')'

Now we have

```text
)
```

This must consume one opening bracket.

So

```text
open--
```

---

# What does open represent?

It is **NOT**

Actual number of '('

It is

> Maximum possible number of unmatched '(' available till now.

Think of unlocked characters as

```text
Wildcards
```

that we temporarily treat as '('.

---

# Example

```
s      = ))()
locked = 0011
```

Scan

First

```
)
```

Unlocked

Treat as '('

```
open = 1
```

Second

```
)
```

Unlocked

Treat as '('

```
open = 2
```

Third

```
(
```

Locked

```
open = 3
```

Fourth

```
)
```

Locked

Consumes one

```
open = 2
```

Never negative.

Left scan succeeds.

---

# But why isn't one scan enough?

Consider

```
((((
```

locked

```
1111
```

Left scan

```
1
2
3
4
```

Never negative.

Looks good.

But clearly

```
((((
```

is invalid.

Why?

Because there aren't enough

```
)
```

later.

So left scan only checks

> Too many ')' early?

It does **not** check

> Too many '(' at the end?

---

# That's why we scan Right to Left

Now imagine reversing the thinking.

A valid string also satisfies

From right to left

```
number of '(' <= number of ')'
```

Equivalent rule.

---

Now define

```java
close
```

meaning

Maximum possible unmatched ')' from the right.

---

Code

```java
if(s.charAt(i)==')' || locked.charAt(i)=='0'){
    close++;
}
else{
    close--;
}
```

Exactly symmetric.

---

Suppose

```
((((
1111
```

Right scan

Last

```
(
```

Locked

Needs closing bracket

```
close = -1
```

Immediately fail.

Perfect.

---

# Why treat unlocked as ')' now?

Earlier we were checking

> Can I always find enough '(' ?

Now we are checking

> Can I always find enough ')' ?

So every unlocked character is assumed to become

```
)
```

if required.

---

