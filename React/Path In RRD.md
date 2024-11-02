
---

```jsx
// Example structure
/course           // parent route
/course/java     // child route
/course/python   // another child route
```

Let's look at different scenarios:

1. **Absolute paths** (starting with `/`):
```jsx
<Link to="/course/java">Java</Link>
```
This will always point to `/course/java` regardless of current location

2. **Relative paths** (without starting `/`):
```jsx
// If you're already in /course
<Link to="java">Java</Link>
```
This will append to current path

3. **Parent navigation** (using `..`):
```jsx
// If you're in /course/java
<Link to="..">Back to Courses</Link>  // Goes to /course
```

Here's a more complete example:

```jsx
function CourseLayout() {
  return (
    <div>
      {/* These are equivalent when rendered inside /course */}
      <Link to="java">Java</Link>
      <Link to="/course/java">Java</Link>
      
      {/* Navigate to sibling routes */}
      <Link to="../python">Python</Link>  
      
      {/* Navigate to nested routes */}
      <Link to="java/basics">Java Basics</Link>
    </div>
  );
}
```

Key points:
- If path starts with `/`, it's absolute from root
- If path doesn't start with `/`, it's relative to current route
- Use `..` to go up one level
- Use `../` multiple times to go up multiple levels
- You can combine these: `../sibling/nested`

Best practice is to:
- Use absolute paths when linking across different sections of your app
- Use relative paths when linking within the same feature/section
- Consider the maintainability if routes structure changes