# T6 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T6-1785794964825`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.0-fragments-speakers-risk-links`
- Langfuse trace: `c8883c8559a586df17fec30b4969fcb6`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals partial. | Pass | Actual: 'partial' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['constraint', 'deadline']; actual: ['constraint', 'deadline'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'CON-001': 'CON-001', 'CON-002': 'CON-002', 'DDL-001': 'DDL-001'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 2 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: choosing microservices | Pass | Absent |
| Prohibited literal is absent: choosing single-page app | Pass | Absent |

Deterministic evaluation generated 2026-08-03T22:11:51.932412+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
