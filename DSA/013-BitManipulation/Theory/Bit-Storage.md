# Bit Storage in Memory: Powers of 2, Data Types, and Char Conversion

---

## 1. How Bits Represent Numbers (Powers of 2)

Bits are not stored only in blocks of 8 bits. Depending on the data type and hardware architecture, numbers can be represented in **8-bit, 16-bit, 32-bit, 64-bit**, or even larger formats.

In binary, every bit represents a **power of 2**, determined by its position.

### The 0-Indexed Position Rule

> [!IMPORTANT]
> **The $0$ to $n-1$ Rule:**
> If a number has $n$ bits, its bit positions are indexed from **$0$ to $n - 1$** (from right to left).
> - An 8-bit number has positions **$0$ through $7$** (not 1 through 8).
> - A 32-bit number has positions **$0$ through $31$**.

### 8 Bits = 1 Byte: Position & Value Table

| Bit Position | Power of 2 | Calculation | Decimal Value |
| :---: | :---: | :---: | :---: |
| **7** (MSB) | $2^7$ | $2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2$ | **128** |
| **6** | $2^6$ | $2 \times 2 \times 2 \times 2 \times 2 \times 2$ | **64** |
| **5** | $2^5$ | $2 \times 2 \times 2 \times 2 \times 2$ | **32** |
| **4** | $2^4$ | $2 \times 2 \times 2 \times 2$ | **16** |
| **3** | $2^3$ | $2 \times 2 \times 2$ | **8** |
| **2** | $2^2$ | $2 \times 2$ | **4** |
| **1** | $2^1$ | $2$ | **2** |
| **0** (LSB) | $2^0$ | $1$ | **1** |

---

## 2. What Comes After $2^7$?

After $2^7 = 128$, powers of 2 continue to double:

```text
2⁰  = 1
2¹  = 2
2²  = 4
2³  = 8
2⁴  = 16
2⁵  = 32
2⁶  = 64
2⁷  = 128
2⁸  = 256   ← requires bit position 8 (9th bit)
2⁹  = 512
2¹⁰ = 1024
```

### Highest Bit Position Across Different Bit Widths

The number of bits determines the **highest power of 2** you can represent with a single bit position:

| Bit Width | Valid Bit Positions | Highest Bit Position | Highest Power of 2 (Single Bit) |
| :---: | :---: | :---: | :---: |
| **8 bits** (1 byte) | $0$ to $7$ | Position $7$ | $2^7 = 128$ |
| **16 bits** (2 bytes) | $0$ to $15$ | Position $15$ | $2^{15} = 32{,}768$ |
| **32 bits** (4 bytes) | $0$ to $31$ | Position $31$ | $2^{31} = 2{,}147{,}483{,}648$ |
| **64 bits** (8 bytes) | $0$ to $63$ | Position $63$ | $2^{63} \approx 9.22 \times 10^{18}$ |

> [!NOTE]
> The value $256$ is $2^8$. It sits at bit position $8$. Because an 8-bit container only has positions $0$ to $7$, you need at least a **9th bit** (e.g., a 16-bit or 32-bit integer) to store the number 256.

---

## 3. How Java Stores Primitive Data Types

Java provides several primitive integer and floating-point types of varying bit sizes:

| Data Type | Bit Size | Signed / Unsigned | Highest Bit Position | Range | Notes |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **`byte`** | 8 bits | Signed | 7 | $-128$ to $+127$ | Standard 1-byte integer |
| **`short`** | 16 bits | Signed | 15 | $-32{,}768$ to $+32{,}767$ | 2-byte integer |
| **`char`** | 16 bits | **Unsigned** | 15 | $0$ to $65{,}535$ | Stores UTF-16 code units |
| **`int`** | 32 bits | Signed | 31 | $-2^{31}$ to $2^{31} - 1$ | Default integer type in Java |
| **`float`** | 32 bits | Signed | 31 | IEEE 754 floating point | 32-bit floating point encoding |
| **`long`** | 64 bits | Signed | 63 | $-2^{63}$ to $2^{63} - 1$ | 8-byte integer (suffix `L`) |
| **`double`** | 64 bits | Signed | 63 | IEEE 754 floating point | 64-bit floating point encoding |

### Example: Storing 256 in a 32-Bit Java `int`

```java
int a = 256;
```

In memory, this 32-bit `int` is stored as:

```text
Bit position:
 31                            15       8       0
  ↓                             ↓       ↓       ↓
00000000 00000000 00000001 00000000
```

- The `1` is located at **bit position 8** because $256 = 2^8$.
- Even though `256` only requires 9 bits (positions 0 to 8), Java's `int` pads the remaining upper 23 bits with `0`s.


> [!NOTE]
> In an n-bit signed integer, the maximum positive value is \\(2^{n-1}-1\\), because one bit position contributes a negative weight in two's complement representation.  Dry run int a =  -128;  How does it store in memory using two's complement. MSB reserved for -ve number. 

---

## 4. Deep Dive: `char` Storage and Narrowing Casts

Consider this Java code snippet:

```java
char a = (char) -12345;
System.out.println(a);
```

### The Key Rule of Java `char`
Java's `char` is an **unsigned 16-bit data type** (range: $0$ to $65{,}535$). It **cannot store negative numbers**.

So what actually happens when we cast a negative number to `char`?

---

### Step-by-Step Execution Breakdown

#### Step 1: Start with `-12345` (32-bit Signed `int`)
In Java, integer literals are 32-bit `int`s by default, stored using **two's complement**:

```text
Decimal: -12345
32-bit Binary:
11111111 11111111 11001111 11000111
```

#### Step 2: Explicit Cast `(char) -12345` (Narrowing Conversion)
When casting from a 32-bit `int` to a 16-bit `char`, Java performs a **narrowing primitive conversion**:
- It **discards the upper 16 bits**.
- It **preserves only the lower 16 bits**.

```text
32-bit int (-12345):
11111111 11111111 11001111 11000111
^^^^^^^^ ^^^^^^^^
[ Discard upper 16 bits ]

Lower 16 bits kept:
11001111 11000111
```

#### Step 3: Interpret Remaining 16 Bits as Unsigned
Because `char` is **unsigned**, Java does not treat the leading `1` as a negative sign. Instead, it calculates the raw binary value:

```text
Binary:  11001111 11000111
Decimal: 53191
```

Internally, variable `a` now holds:

```java
char a = 53191;
```

#### Step 4: Printing with `System.out.println(a)`
When `System.out.println(a)` runs:
- Java sees that `a` is of type `char`.
- Instead of printing the number `53191`, it looks up the character at **UTF-16 code point 53191** and prints that character (often a special/unusual symbol depending on system font).

---

### Proving the Behavior with Code

```java
char a = (char) -12345;

System.out.println(a);         // Prints the Unicode character for 53191
System.out.println((int) a);    // Prints: 53191
```

Casting `a` back to `(int)` reveals the underlying unsigned value: **`53191`**.

---

### Why Exactly 53191? (The Mathematical Formula)

When a negative integer is narrowed to a 16-bit unsigned type, the value is computed using modulo arithmetic:

$$\text{Result} = (-12345) \pmod{2^{16}}$$

Since $2^{16} = 65{,}536$:

$$65{,}536 - 12{,}345 = 53{,}191$$

```text
(char) -12345
      ↓
Truncate to 16 bits
      ↓
    53191 (Unsigned value)
      ↓
Unicode character at UTF-16 code point 53191
```

> [!TIP]
> This example connects four foundational concepts in computer science:
> **Two's complement representation** $\rightarrow$ **Narrowing conversion (bit truncation)** $\rightarrow$ **Unsigned binary interpretation** $\rightarrow$ **Unicode character mapping**.

---

## 5. Quick Revision Summary

- **Bit Positions**: Always 0-indexed. An $n$-bit number occupies positions from **$0$ to $n - 1$**.
- **Powers of 2**: Position $k$ represents $2^k$. Position $0 = 1$, position $7 = 128$, position $8 = 256$.
- **Java Integer Sizes**:
  - `byte`: 8 bits (positions 0–7)
  - `short` / `char`: 16 bits (positions 0–15)
  - `int` / `float`: 32 bits (positions 0–31)
  - `long` / `double`: 64 bits (positions 0–63)
- **`char` is Unsigned**: Java's only unsigned integer primitive type ($0$ to $65{,}535$).
- **Narrowing Casts Truncate**: Casting `(char)` on an `int` simply keeps the lowest 16 bits and discards the upper 16 bits.
- **Negative to Unsigned Formula**: Casting negative $-x$ to `char` produces $(2^{16} - |x|)$.
