# T7 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T7-1785785487491`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.8-dependency-risk-fix`
- Langfuse trace: `a2ad67495b52580a4c7f00d411b27237`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['non_functional_requirement']; actual: ['non_functional_requirement'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'NFR-001': 'NFR-001', 'NFR-002': 'NFR-002', 'NFR-003': 'NFR-003'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 0 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: 10K users | Pass | Absent |
| Prohibited literal is absent: 200ms average | Pass | Absent |
| Prohibited literal is absent: Salesforce v53 | Pass | Absent |

Deterministic evaluation generated 2026-08-03T20:38:14.260853+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
