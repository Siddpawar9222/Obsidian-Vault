
---

There are **two kinds of “game” problems**:

---

## 1. Fake game (like this problem)

Where:

- One player has a **dominating move**
    
- Game ends immediately
    
- No real interaction
    

Example:

- This “[3828](https://leetcode.com/problems/final-element-after-subarray-deletions/) Final Element After Subarray Deletions”
    
- Answer in O(1)
    

No DP, no minimax, no state. 

Means  here player will choose safe option , not letting other player to play and choose game immediately.

---

## 2. Real game (needs DP / minimax)

Where:

- Players alternate many times
    
- Every move changes future options
    
- No one can finish the game instantly
    
- Both players **must react to each other**
    

These are the ones that need **DP**.

---

## Classic DP Game Problem (Prototype)

### Problem type:

> Players pick from ends of array. Each wants to maximize score.

Example:  
**“Predict the Winner”** (LeetCode 486)


---

## How to know if DP is required

Ask yourself:

> Can the first player end the game in one move?

If YES → fake game → greedy  
If NO → real game → DP/minimax

---

## Mental Cheat Sheet

|Situation|Technique|
|---|---|
|One dominating move|Greedy|
|Many rounds, forced alternation|DP|
|Players choose from fixed options|Minimax|
|Score accumulation|DP on intervals|
|Win/Lose only|DP boolean|

---

## Interview Gold Insight

When you see “two players”:

First question to ask:

> Can someone **force the end immediately?**

If yes → stop thinking about DP.  
If no → start building DP.

This single question saves hours of overthinking.