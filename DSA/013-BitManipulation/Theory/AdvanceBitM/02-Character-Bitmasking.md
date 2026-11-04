---
aliases:
  - CharacterBitmasking
  - StringBitmasking
tags:
  - dsa
  - bit-manipulation
  - strings
---

# Level 2: Character & String Bitmasking

> [!NOTE] Core Intuition
> The English alphabet has **26 lowercase letters** (`'a'` to `'z'`). A standard 32-bit `int` in Java has **32 bits**. 
> Instead of using a `HashSet<Character>` or a `boolean[26]` array, we can use a **single 32-bit integer** as a complete set of characters with $O(1)$ space and instant bitwise comparisons.

---

## 1. Mapping Characters to Bit Positions

We map each character `'a'` through `'z'` to bit position `0` through `25`:

$$\text{Bit Position } k = (\text{ch} - 'a')$$
$$\text{Character Mask } = 1 \ll (\text{ch} - 'a')$$

| Character | ASCII Offset (`ch - 'a'`) | Mask in Binary | Decimal Value |
| :---: | :---: | :--- | :---: |
| `'a'` | $0$ | `...0000 0001` | $2^0 = 1$ |
| `'b'` | $1$ | `...0000 0010` | $2^1 = 2$ |
| `'c'` | $2$ | `...0000 0100` | $2^2 = 4$ |
| `'z'` | $25$ | `...0010 0000 0000 ... 0000` | $2^{25} = 33,554,432$ |

### Converting a Word to a Bitmask
For a word `s = "cab"`:
```java
int mask = 0;
for (char ch : s.toCharArray()) {
    mask |= (1 << (ch - 'a'));
}
```
- For `'c'`: `000100`
- For `'a'`: `000001`
- For `'b'`: `000010`
- Combined (`|`): `000111` (decimal `7`). Bits 0, 1, and 2 are set!

---

## 2. The 4 Essential Character Masking Operations

| Operation | Code Snippet | Purpose |
| :--- | :--- | :--- |
| **Set Character** | `mask \|= (1 << (ch - 'a'))` | Insert character into the set |
| **Check Presence**| `(mask & (1 << (ch - 'a'))) != 0` | Returns `true` if character is present |
| **Remove Character** | `mask &= ~(1 << (ch - 'a'))` | Delete character from the set |
| **Toggle Character** | `mask ^= (1 << (ch - 'a'))` | Flips presence (present $\leftrightarrow$ absent) |

---

## 3. Practical Pattern 1: Duplicate Detection in $O(1)$ Space

To check if a string contains all unique characters (assuming lowercase English letters):

```java
public boolean hasAllUniqueChars(String s) {
    int mask = 0;
    for (char ch : s.toCharArray()) {
        int bit = 1 << (ch - 'a');
        
        // If the bit is already set, we saw this character before
        if ((mask & bit) != 0) {
            return false; // Duplicate found!
        }
        
        // Mark character as seen
        mask |= bit;
    }
    return true; // All characters are unique
}
```

- **Time Complexity**: $O(N)$
- **Space Complexity**: $O(1)$ auxiliary memory (a single 4-byte primitive integer, no heap allocations).

---

## 4. Practical Pattern 2: Checking Common Characters Between Two Words in $O(1)$

If two words share at least one character, their bitmasks will have a set bit at the same position. 

$$\text{Common Characters Exist} \iff (\text{mask}_A \ \& \ \text{mask}_B) \neq 0$$
$$\text{No Common Characters (Disjoint)} \iff (\text{mask}_A \ \& \ \text{mask}_B) == 0$$

### LeetCode 318: Maximum Product of Word Lengths
> **Problem**: Given a string array `words`, find the maximum value of `length(word[i]) * length(word[j])` where the two words do not share any common letters.

```java
class Solution {
    public int maxProduct(String[] words) {
        int n = words.length;
        int[] masks = new int[n];
        int[] lens = new int[n];

        // Step 1: Precompute bitmask and length for every word
        for (int i = 0; i < n; i++) {
            int mask = 0;
            for (char ch : words[i].toCharArray()) {
                mask |= (1 << (ch - 'a'));
            }
            masks[i] = mask;
            lens[i] = words[i].length();
        }

        // Step 2: Compare all pairs in O(1) bitwise operations
        int maxProd = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                // If AND is 0, they share NO letters
                if ((masks[i] & masks[j]) == 0) {
                    maxProd = Math.max(maxProd, lens[i] * lens[j]);
                }
            }
        }
        return maxProd;
    }
}
```
- **Time Complexity**: $O(N \cdot L + N^2)$ where $L$ is word length. Comparing two words takes $O(1)$ instead of $O(L)$!

---

## 5. Practical Pattern 3: Palindrome Permutation (Parity Masking via XOR)

A string can be rearranged into a palindrome if and only if **at most one character has an odd frequency**.

Instead of counting frequencies in a hash map, we **toggle** bits using XOR (`^`):
- Each time character `ch` appears, toggle its bit.
- If it appears an even number of times: `bit ^ bit == 0` (turns OFF).
- If it appears an odd number of times: bit remains `1` (turns ON).

```java
public boolean canPermutePalindrome(String s) {
    int mask = 0;
    for (char ch : s.toCharArray()) {
        mask ^= (1 << (ch - 'a')); // Toggle parity bit
    }
    
    // Palindrome check: at most one bit is set
    // Either mask == 0 (all even) OR mask is a power of 2 (exactly one odd)
    return (mask & (mask - 1)) == 0;
}
```

---

## 📝 Practice & Revision Checklist

- [x] How many bits are required for all lowercase English characters? *(Answer: 26 bits, fits in a 32-bit `int`)*.
- [x] What if the string contains both lowercase and uppercase letters (52 chars)? *(Answer: Use a 64-bit `long`)*.
- [x] How do you check if two words are completely disjoint? *(Answer: `(maskA & maskB) == 0`)*.
- [x] [LeetCode 771: Jewels and Stones](https://leetcode.com/problems/jewels-and-stones/)
- [x] [LeetCode 318: Maximum Product of Word Lengths](https://leetcode.com/problems/maximum-product-of-word-lengths/)

