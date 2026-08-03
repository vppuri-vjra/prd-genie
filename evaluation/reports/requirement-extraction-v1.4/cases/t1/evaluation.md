# T1 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T1-1785799162938`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.4-bidirectional-relationship-audit`
- Langfuse trace: `2fd30f89209d1e35befda538496b5600`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['deadline', 'functional_requirement', 'non_functional_requirement', 'stakeholder']; actual: ['deadline', 'functional_requirement', 'non_functional_requirement', 'stakeholder'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'FR-001': 'FR-001', 'NFR-001': 'NFR-001', 'STK-001': 'STK-001', 'DDL-001': 'DDL-001'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 1 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: requirements not present in the input | Pass | Absent |

Deterministic evaluation generated 2026-08-03T23:20:44.723080+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
