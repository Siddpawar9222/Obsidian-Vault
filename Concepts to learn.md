
@conditionalonproperty annotation on method
- **`@PrePersist`** sets `createDate` and generates a UUID for `ledgerHeadId` when the entity is first inserted.
- **`@PreUpdate`** sets `updateDate` every time the entity is updated after the initial insert.


### Mapper: Using Spring Dependency Injection

If you want to use Spring to inject the mapper automatically, add `componentModel = "spring"` to the `@Mapper` annotation:

```java
@Mapper(componentModel = "spring")
public interface LedgerHeadMapper {
    LedgerHeadDto ledgerHeadToLedgerHeadDto(LedgerHead ledgerHead);
    LedgerHead ledgerHeadDtoToLedgerHead(LedgerHeadDto ledgerHeadDto);
}
```

Then, in the service, inject it:

```java
@Service
public class LedgerHeadService {

    private final LedgerHeadRepository ledgerHeadRepository;
    private final LedgerHeadMapper ledgerHeadMapper;

    public LedgerHeadService(LedgerHeadRepository ledgerHeadRepository, LedgerHeadMapper ledgerHeadMapper) {
        this.ledgerHeadRepository = ledgerHeadRepository;
        this.ledgerHeadMapper = ledgerHeadMapper;
    }

    public LedgerHeadDto getLedgerHeadById(String id) {
        return ledgerHeadRepository.findById(id)
                .map(ledgerHeadMapper::ledgerHeadToLedgerHeadDto)
                .orElseThrow(() -> new RuntimeException("LedgerHead not found with id: " + id));
    }
}
```
