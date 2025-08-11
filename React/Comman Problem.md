
---

query (keep for filter data as it is when navigate back ) 

Initialize state directly from query params 

```
const [searchParams] = useSearchParams();

const initialStatuses = React.useMemo(() => {
  const statusFromQuery = searchParams.get("status");
  return statusFromQuery ? statusFromQuery.split(",").filter(Boolean) : [];
}, [searchParams]);

const [selectedStatuses, setSelectedStatuses] = React.useState(initialStatuses);
```