# Power

---

| Problem Name | Comment |
| :--- | :--- |
| [3932. Count K-th Roots in a Range](https://leetcode.com/problems/count-k-th-roots-in-a-range/) | Understood `Math.pow` has precision issues (e.g., `Math.pow(64, 1.0 / 3) ≈ 3.999999`), hence we need to verify/round it.<br>Mathematically need to calculate a broad range using `floor` and `ceil`. Typecasting concepts. |

---
[3954. Sum of Compatible Numbers in Range I](https://leetcode.com/problems/sum-of-compatible-numbers-in-range-i/)
## Understanding Lower Bound (LB) and Upper Bound (UB)

The problem gives us this condition:

$$|n - x| \le k$$

This means the absolute difference between `n` and `x` must be less than or equal to `k`.

We can convert this into a range:

$$-k \le n - x \le k$$

Rearranging:

$$n - k \le x \le n + k$$

Therefore:

- **Lower Bound (LB):** $n - k$
- **Upper Bound (UB):** $n + k$
