

---

- **Spring Boot enables transaction management automatically**, so you **do not need** `@EnableTransactionManagement` in most cases.
- **Use it only when overriding default behavior** or managing multiple transaction managers.
- **For normal Spring Boot + JPA applications, just use `@Transactional`, and transactions will work.**