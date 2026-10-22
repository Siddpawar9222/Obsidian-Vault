
---


- checks whether the last bit is `1`.  
   ```java
   if ((n & 1) == 1) {
    // odd
   }
   ```

Remove the lowest set bit 

```
n & (n - 1)

Example : 
n     = 1011000
n - 1 = 1010111

AND
      1010000
```


Isolate the lowest set bit  : 

isolating the lowest set bit means finding the rightmost `1` bit in a binary number and keeping only that `1`, while making all other bits `0`.
```
n & -n

Example : 

n = 1011000

-n = 0101000   // two's complement representation

n & -n
   ↓
0010000
```


- XOR properties  : Similar bit  gives 0 

```java
x ^ 0 = x
x ^ x = 0
x ^ x ^ x = x 
a ^ b ^ a = b
```

[268. Missing Number](https://leetcode.com/problems/missing-number/)

 NOT  : 

```
~x = -x - 1

e.g. 
~5 = -6
```


Left shift `<<` : 

``` java
x << k ≈ x * 2^k

eg : 
5 << 1

0101 → 1010

= 10
```



Check power of 2  
A power of 2 contains exactly one set bit. 


```
1     = 0001
2     = 0010
4     = 0100
8     = 1000
16    = 10000 

Hence if we reset righmost set bit entire binary will be zero


n > 0 && (n & (n - 1)) == 0
```


Divide Trick : 

```java
6 = 110  → 2 set bits
3 = 11   → 2 set bits
```

Observe : When we divide number by 2. It shift right by 1 

