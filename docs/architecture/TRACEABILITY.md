# Traceability Model

## Chain of evidence

```text
Source quote
  -> Extracted item ID
    -> Human approval
      -> PRD requirement ID
        -> Epic / feature / story IDs
          -> Evaluation checks and Langfuse trace
```

## Identifier conventions

| Artifact | Format | Example |
|---|---|---|
| Workflow run | `RUN-*` | `RUN-T1-001` |
| Functional requirement | `FR-###` | `FR-001` |
| Non-functional requirement | `NFR-###` | `NFR-001` |
| Acceptance criterion | `AC-###` | `AC-001` |
| Persona | `PER-###` | `PER-001` |
| Stakeholder | `STK-###` | `STK-001` |
| Deadline | `DDL-###` | `DDL-001` |
| Dependency | `DEP-###` | `DEP-001` |
| Constraint | `CON-###` | `CON-001` |
| Assumption | `ASM-###` | `ASM-001` |
| Risk | `RSK-###` | `RSK-001` |
| Contradiction | `CTR-###` | `CTR-001` |
| Missing information | `MISS-###` | `MISS-001` |
| Gap | `GAP-###` | `GAP-001` |
| Open question | `OQ-###` | `OQ-001` |
| Epic | `EPIC-###` | `EPIC-001` |
| Feature | `FEAT-###` | `FEAT-001` |
| User story | `US-###` | `US-001` |

## Review behavior

Human approval records the exact extraction IDs that may proceed. If a reviewer modifies a requirement, both original and revised text plus the reason are retained. Downstream agents receive only the approved view, while the trace preserves the earlier extraction.
