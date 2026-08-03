# T7 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T7-1785800055215`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.5-product-fragment-status-boundary`
- Langfuse trace: `not supplied`

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

Deterministic evaluation generated 2026-08-03T23:36:58.155839+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
