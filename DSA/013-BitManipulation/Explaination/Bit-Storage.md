No, bits are not stored only in blocks of 8 bits. You can have 8-bit, 16-bit, 32-bit, 64-bit representations, and more.

You're calculating powers of 2 correctly. The key is to understand that the number of bits determines the highest power of 2 you can represent with a single bit position.

## Understanding powers of 2 in binary

Let's start with 8 bits, which is called 1 byte.

### 2⁽7⁾

128

### 2⁽6⁾

64

### 2⁽5⁾

32

### 2⁽4⁾

16

### 2⁽3⁾

8

### 2⁽2⁾

4

### 2⁽1⁾

2

### 2⁽0⁾

1

8 bits = 1 byte

Each position represents a power of 2:

| Bit position | Power     | Decimal value |
| ------------ | --------- | ------------- |
| 7            | \\(2^7\\) | 128           |
| 6            | \\(2^6\\) | 64            |
| 5            | \\(2^5\\) | 32            |
| 4            | \\(2^4\\) | 16            |
| 3            | \\(2^3\\) | 8             |
| 2            | \\(2^2\\) | 4             |
| 1            | \\(2^1\\) | 2             |
| 0            | \\(2^0\\) | 1             |

Notice that we start from position 0, so 8 bits have positions 0 through 7.

## What comes after \\(2^7\\)?

Yes! The next power is \\(2^8 = 256\\).

```
2⁰ = 1
2¹ = 2
2² = 4
2³ = 8
2⁴ = 16
2⁵ = 32
2⁶ = 64
2⁷ = 128
2⁸ = 256  ← next position
2⁹ = 512
2¹⁰ = 1024
```

But there is an important distinction:

- In 8 bits, the highest position is \\(2^7\\).
- In 16 bits, the highest position is \\(2^{15}\\).
- In 32 bits, the highest position is \\(2^{31}\\).
- In 64 bits, the highest position is \\(2^{63}\\).

The next position after \\(2^7\\) is \\(2^8\\), but you need a ninth bit to represent that position directly.

## How does this work in Java?

Java has primitive integer types with different sizes.

## 8

bits

`byte`

Signed range: −128 to 127

Highest bit position: 7

## 16

bits

`short` / `char`

`short`: signed; `char`: unsigned

Highest bit position: 15

## 32

bits

`int` / `float`

Both use 32 bits, but encode values differently

Highest bit position: 31

## 64

bits

`long` / `double`

Both use 64 bits, but encode values differently

Highest bit position: 63

## One important example: Java `int`

Consider:

```
int a = 256;
```

Its binary representation is:

```
00000000 00000000 00000001 00000000
```

The `1` is at bit position 8, because:

\\[ 256 = 2^8 \\]

So the value `256` needs the ninth bit position, even though the `int` itself contains 32 bits.

Remember this rule for bit manipulation:

If a number has \\(n\\) bits, its bit positions range from \\(0\\) to \\(n-1\\).

That is why an 8-bit number ends at position 7, not position 8.

---

 ## Char Unicode Storage : 

```java
char a = (char) -12345;
System.out.println(a);
```

The important thing is that **`char` cannot store negative values**, because Java `char` is an unsigned 16-bit type.

So what happens?

### Start with `-12345`

`-12345` is an `int` by default.

Java's `int` is 32-bit signed two's complement:

```text
-12345
```

Conceptually, its 32-bit representation is:

```text
11111111 11111111 11001111 11000111
```

### Then `(char)` conversion happens

You explicitly tell Java:

```java
(char) -12345
```

Java converts the `int` to a **16-bit `char`**.

During narrowing conversion, Java keeps the **lowest 16 bits** and discards the upper 16 bits.

```text
int (-12345)

11111111 11111111 11001111 11000111
^^^^^^^^ ^^^^^^^^
discard these

11001111 11000111
^^^^^^^^^^^^^^^^
keep these 16 bits
```

So the resulting `char` contains:

```text
11001111 11000111
```

Now interpret those 16 bits as an **unsigned number**:

```text
11001111 11000111
```

which is:

```text
53191
```

So internally:

```java
char a = (char) -12345;
```

is essentially:

```text
char a = 53191;
```

### Then `System.out.println(a)`

Because `a` is a `char`, Java doesn't print:

```text
53191
```

It interprets `53191` as a UTF-16 character and prints the corresponding character.

So you may see a Unicode character that looks unusual, depending on your terminal/font.

---

### The important concept

This is **not** converting `-12345` mathematically into a positive `char`.

Instead, you're effectively saying:

```text
int (32 bits)
        ↓
take lower 16 bits
        ↓
char (16 bits, unsigned)
```

You can prove it:

```java
char a = (char) -12345;

System.out.println(a);
System.out.println((int) a);
```

The second line prints:

```text
53191
```

because once the value is inside a `char`, it is **unsigned**.

### Why 53191?

This is the key formula for narrowing a negative `int` to `char`:

```text
(-12345) mod 2^16
```

```text
65536 - 12345
= 53191
```

Therefore:

```text
(char) -12345
        ↓
      53191
        ↓
  Unicode character
```

This is a very useful example because it connects **two's complement → narrowing conversion → unsigned `char` → Unicode**.