# T6 Requirement Extraction Evaluation

- Result: **fail**
- Run ID: `RUN-T6-1785785469598`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.8-dependency-risk-fix`
- Langfuse trace: `4fce9e18c478ff7a2543045d9cb5e2af`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals partial. | Pass | Actual: 'partial' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['constraint', 'deadline']; actual: ['constraint', 'deadline'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'CON-001': 'CON-001', 'CON-002': 'CON-002', 'DDL-001': 'DDL-001'} |
| Canonical item relationships are preserved after ID mapping. | Fail | CON-001 does not link to CON-002; CON-002 does not link to CON-001 |
| Required contradiction handling is preserved. | Fail | No unresolved contradiction links ['CON-001', 'CON-002'] |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: choosing microservices | Pass | Absent |
| Prohibited literal is absent: choosing single-page app | Pass | Absent |

Deterministic evaluation generated 2026-08-03T20:55:25.944448+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
