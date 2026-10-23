Exactly. The important question is **why does Java use two's complement to represent negative numbers?**

The short answer is:

> **Two's complement allows the CPU to use the same binary addition circuitry for both positive and negative numbers.**

Let's build the intuition.

### First: the problem with negative numbers

Suppose we have 4 bits.

For positive numbers:

```text
0000 = 0
0001 = 1
0010 = 2
0011 = 3
0100 = 4
...
0111 = 7
```

We need to represent negative numbers too.

One simple idea would be to use the first bit as a **sign bit**:

```text
0 = positive
1 = negative
```

So:

```text
0001 = +1
1001 = -1
```

This is called **sign-magnitude representation**.

But this creates problems.

For example:

```text
+1 = 0001
-1 = 1001
```

Now imagine the CPU wants to calculate:

```text
1 + (-1)
```

With normal binary addition:

```text
  0001
+ 1001
------
  1010
```

That's not `0`.

So the CPU would need **special logic** to handle negative numbers.

---

## Two's complement solves this

With two's complement, `-1` is represented differently.

For 4 bits:

```text
+1 = 0001
```

To get `-1`:

```text
0001
  ↓ invert bits
1110
  ↓ add 1
1111
```

Therefore:

```text
-1 = 1111
```

Now look at:

```text
  0001   (+1)
+ 1111   (-1)
------
1 0000
```

We only have 4 bits, so the extra carry is discarded:

```text
0000
```

And:

```text
0000 = 0
```

🎯 **This is the big reason two's complement is used.**

The CPU can perform:

```text
addition
```

and automatically get correct results for negative numbers too.

It doesn't need a completely separate addition mechanism for:

```text
positive + positive
positive + negative
negative + positive
negative + negative
```

---

## Another beautiful property

Consider 4-bit numbers:

```text
0000 =  0
0001 =  1
0010 =  2
0011 =  3
0100 =  4
0101 =  5
0110 =  6
0111 =  7

1000 = -8
1001 = -7
1010 = -6
1011 = -5
1100 = -4
1101 = -3
1110 = -2
1111 = -1
```

Notice something interesting:

```text
0111 = +7
1000 = -8
```

There is no `+8`.

That's why a signed 4-bit number has:

```text
-8 to +7
```

Similarly, Java's 32-bit `int` has:

```text
-2³¹  to  2³¹ - 1
```

or:

```text
-2,147,483,648
to
 2,147,483,647
```

---

## Why specifically "two's complement"?

Because the negative value is mathematically obtained using:

```text
2ⁿ - |value|
```

For a 4-bit number, `n = 4`.

For `-1`:

```text
2⁴ - 1
= 16 - 1
= 15
```

15 in binary:

```text
1111
```

For `-2`:

```text
16 - 2
= 14

1110
```

For `-5`:

```text
16 - 5
= 11

1011
```

That's why:

```text
-5 = 1011
```

in 4-bit two's complement.

---

## Why not one's complement?

There was another approach called **one's complement**.

For `+1`:

```text
0001
```

Invert:

```text
1110
```

So:

```text
1110 = -1
```

But there's a problem.

You get **two representations of zero**:

```text
0000 = +0

1111 = -0
```

That's undesirable.

Two's complement fixes this:

```text
0000 = 0
```

There is only **one zero**.

---

## The main reason to remember

Don't memorize:

> "Java uses two's complement because that's the standard."

Understand this instead:

```text
Two's complement
       ↓
negative numbers have a special binary representation
       ↓
ordinary binary addition works
       ↓
CPU doesn't need separate arithmetic logic for negative numbers
       ↓
efficient hardware
```

That's the real reason.

And this is why your previous question about:

```text
Integer.MAX_VALUE
01111111 11111111 11111111 11111111
```

is connected to two's complement.

The MSB is the sign bit:

```text
0 → positive
1 → negative
```

So the largest positive number is:

```text
01111111 11111111 11111111 11111111
```

while the smallest negative number is:

```text
10000000 00000000 00000000 00000000
```

Understanding **this connection between MSB + two's complement + integer range** will make the rest of bit manipulation much easier.