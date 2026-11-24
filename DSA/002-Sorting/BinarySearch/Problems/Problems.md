
---

| Problem Name                                                                                                                                                | Comment                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Traditional Binary Search**                                                                                                                               |                                                                                                      |
| [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)                                                         | s<=e                                                                                                 |
| [34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)       | s<=e                                                                                                 |
| [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)                                            | s<e                                                                                                  |
| [852. Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/)                                                        |                                                                                                      |
| [Find position of an element in a sorted array of infinite numbers](https://www.geeksforgeeks.org/dsa/find-position-element-sorted-array-infinite-numbers/) |                                                                                                      |
| [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/)<br>[367. Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/)                     | Square root of any number always less or equal to x/2.<br>Also understood  importance of typecasting |
| [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)                                                                         |                                                                                                      |

 **Typecasting** 
```java 
long sq = mid * mid;  // here mid * mid still gives integer
long sq = (long) mid * mid; // now here mid * mid still gives long
```

Note : 
When you feel your algorithm logic is correct and the solution is giving you a TLE then you can check is there any typecasting issue or overflow issue in your algorithm.