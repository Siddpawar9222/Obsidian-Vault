
---

# LeetCode 338 — Counting Bits

## Intuition

Let's write the binary representations of numbers from `0` to `5` and count the number of set bits (`1`s) in each number.

|Number|Binary|Number of set bits|
|---|---|---|
|0|`0`|0|
|1|`1`|1|
|2|`10`|1|
|3|`11`|2|
|4|`100`|1|
|5|`101`|2|
|6|`110`|2|
|7|`111`|3|

Now, let's observe a property of binary numbers.

- **Even numbers** always have `0` as their least significant bit (LSB).
    
- **Odd numbers** always have `1` as their least significant bit (LSB).

For example:

- `6 = 110` is even and ends with `0`.
    
- `5 = 101` is odd and ends with `1`.

How can we use this observation to solve the problem efficiently?

## Understanding the relationship between a number and its set bits

Consider the number `6`.

```
6 = 110  → 2 set bits
3 = 11   → 2 set bits
```

When we divide `6` by `2`, we get `3`. In binary, this is equivalent to shifting all bits one position to the right, which removes the least significant bit.

Since the removed bit was `0`, the number of set bits remains unchanged.

Therefore:

`countBits(6) = countBits(6 / 2) = countBits(3) = 2`

Now, consider the number `5`.

```
5 = 101  → 2 set bits
2 = 10   → 1 set bit
```

When we divide `5` by `2`, we get `2`. The removed least significant bit was `1`, so the original number has one more set bit than the resulting number.

Therefore:

`countBits(5) = countBits(5 / 2) + 1 = countBits(2) + 1 = 2`

This gives us our key observation:

- If a number is even, dividing it by `2` does not change its number of set bits.
    
- If a number is odd, dividing it by `2` reduces its number of set bits by exactly one.

## Why does division by 2 work?

For non-negative integers, integer division by `2` is equivalent to a right shift by one position.

Consider `6`:

```
Binary representation of 6:  110
Right shift by one:           11
Result:                        3
```

The least significant bit is removed, and all remaining bits shift one position to the right.

In Java, we use the `>>` operator for a right shift:

```
6 >> 1  // 3
5 >> 1  // 2
```

We can also determine whether the removed bit was `0` or `1` using the bitwise AND operator:

```
i & 1
```

- If `i` is even, `i & 1` returns `0`.
    
- If `i` is odd, `i & 1` returns `1`.

## Deriving the formula

Let `ans[i]` represent the number of set bits in the binary representation of `i`.

Using our observation, we can calculate the answer for `i` from the answer for `i / 2`.

The recurrence is:

`ans[i] = ans[i >> 1] + (i & 1)`

Here:

- `i >> 1` removes the least significant bit.
    
- `i & 1` tells us the value of the removed bit.
    
- `ans[i >> 1]` gives us the number of set bits in the remaining binary representation.

Because `i >> 1` is always smaller than `i` for positive integers, its answer has already been calculated when we iterate from `1` to `n`.

This allows us to reuse previously calculated results instead of counting every bit from scratch.

## Java solution

```
class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];

        // ans[0] is 0 because binary 0 contains no set bits.

        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i >> 1] + (i & 1);
        }

        return ans;
    }
}
```

## Complexity analysis

- **Time complexity: O(n)** — We traverse the numbers from `1` to `n` once, performing constant-time operations for each number.
    
- **Space complexity: O(n)** — We create an array of size `n + 1` to store the answers. The auxiliary space beyond the required output array is `O(1)`.

## Key takeaway

The important insight is that we don't need to count the set bits of every number independently. We can use the answer for a smaller number and add the contribution of the bit we removed.

This is an example of **dynamic programming combined with bit manipulation**, where previously computed results help us solve the problem efficiently.