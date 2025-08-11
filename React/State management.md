
---

- How to keep when we render back to component
     - React Context with `locatStorage.get`
     - Redux (Work well)
     - query (keep for filter data as it is when navigate back )
       
       
    React Context is not "global memory" — it’s just a way to share state **in memory while a component tree exists**. Once the provider unmounts, the state is gone.