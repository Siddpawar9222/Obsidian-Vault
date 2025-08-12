
---

- How to keep when we render back to component
     - React Context with `locatStorage.get`
     - Redux (Work well)
     - query (keep for filter data as it is when navigate back )
       
       
    React Context is not "global memory" — it’s just a way to share state **in memory while a component tree exists**. Once the provider unmounts, the state is gone.

[Medium Blog](https://medium.com/@tristan.wyl/4-common-ways-to-keep-state-of-react-pages-when-navigating-through-routes-c139c71c4c)