# T1 Requirement Extraction Evaluation

- Result: **fail**
- Run ID: `RUN-T1-1785784795912`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.8-dependency-risk-fix`
- Langfuse trace: `6458a575491564c119c686bc6d401379`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['deadline', 'functional_requirement', 'non_functional_requirement', 'stakeholder']; actual: ['deadline', 'functional_requirement', 'non_functional_requirement', 'stakeholder'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'FR-001': 'FR-001', 'NFR-001': 'NFR-001', 'STK-001': 'STK-001', 'DDL-001': 'DDL-001'} |
| Canonical item relationships are preserved after ID mapping. | Fail | NFR-001 does not link to FR-001 |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: requirements not present in the input | Pass | Absent |

Deterministic evaluation generated 2026-08-03T20:55:25.935056+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
