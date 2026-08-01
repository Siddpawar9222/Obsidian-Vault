
---

# Problem Intuition

In this game:

- Two players (Alice and Bob) play optimally.
- There is an array of coins.
- On each turn, a player can pick **either the leftmost or rightmost coin**.
- Alice plays first.
- The goal is to maximize the total value of coins collected by Alice.

The biggest challenge is understanding **how to think about the opponent's turn** while writing the recursion.

---

# Define the Meaning of the Recursive Function

Before writing recursion, clearly define what your function returns.

For this problem:

```text
solve(i, j)
```

means:

> **The maximum coins Alice can collect from the subarray `arr[i…j]`.**

This definition is extremely important because every recursive transition depends on it.

---

# Alice's Turn

Alice has two possible choices:

- Pick the left coin.
- Pick the right coin.

Since Alice wants the maximum possible score, she will choose the better option.

Conceptually:

```java
Alice = max(leftChoice, rightChoice)
```

---

# Why Bob Uses `min()`

After Alice picks a coin, it becomes Bob's turn.

Bob also has two choices:

- Pick the left coin.
- Pick the right coin.

However, our recursive function is **not calculating Bob's score**.

Instead, Bob's move is only used to determine **how much Alice can collect in the future**.

Because Bob plays optimally against Alice, he will always choose the move that leaves Alice with the **smallest future score**.

Therefore:

```java
Bob = min(…)
```

---

# Why Bob's Coin Value Is Not Added

This is the most common confusion.

Suppose Alice picks the left coin.

A wrong thought is:

```java
arr[left] +
min(
    arr[left+1] + solve(…),
    arr[right] + solve(…)
)
```

This is incorrect.

## Why?

The recursive function represents **Alice's total score only**.

When Bob picks a coin:

- Bob keeps that coin.
- Alice never receives its value.

Therefore, Bob's coin should **not** be added.

We only simulate **which choice Bob makes**, not how many coins Bob collects.

Correct idea:

```java
Alice's coin
+
minimum future score Alice can obtain
```

---

# What Bob Actually Does

After Alice picks a coin:

Bob can remove either end coin.

Bob chooses whichever move leaves Alice with the smaller future result.

For example:

```java
Alice picks left

Bob chooses:

Left
Remaining:
solve(i+2, j)

or

Right
Remaining:
solve(i+1, j-1)
```

Bob selects:

```java
min(
    solve(i+2, j),
    solve(i+1, j-1)
)
```

Notice:

- Bob's coin value is never added.
- Only the remaining game state matters.

---

# The Complete Decision

If Alice picks the left coin:

```java
left =
arr[i] +
min(
    solve(i+2, j),
    solve(i+1, j-1)
)
```

If Alice picks the right coin:

```java
right =
arr[j] +
min(
    solve(i+1, j-1),
    solve(i, j-2)
)
```

Finally:

```java
answer =
max(left, right)
```

---

# Mental Model

Think of the game like this:

- Alice wants to maximize her total score.
- Bob wants to make Alice's future score as small as possible.

So every turn follows this pattern:

```java
Alice → max(…)
Bob   → min(…)
```

---

# Why We Care About Bob's Choices Instead of Bob's Score

The recursive function only tracks **Alice's total**.

Therefore:

- We care about **which move Bob chooses**.
- We do **not** care about **how many coins Bob collects**.

A good way to think about it:

> Bob's score is irrelevant for this recursive function. Bob only exists to reduce Alice's future score.

---

# Common Mistakes

## Adding Bob's Coin

Incorrect:

```java
arr[i] +
min(
    arr[i+1] + solve(…),
    arr[j] + solve(…)
)
```

Why it is wrong:

- Those coins belong to Bob.
- The function only computes Alice's score.

---

## Forgetting Bob Plays Optimally

Writing:

```java
arr[i] + solve(i+1, j)
```

is incorrect because it assumes Alice plays again immediately.

In reality:

- Alice moves.
- Bob moves.
- Only then does Alice get another turn.

Bob's move must be simulated before the next recursive call.

---

# Real-World Analogy

Imagine a game where:

- You collect money.
- Your opponent's only goal is to reduce how much money you can collect later.

Your opponent's own money does not matter for your calculation.

Instead, you only ask:

> "Which move will hurt me the most?"

That is exactly why we use `min()`.

---
