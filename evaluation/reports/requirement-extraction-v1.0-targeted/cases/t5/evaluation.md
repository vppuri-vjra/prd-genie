# T5 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T5-1785794903638`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.0-fragments-speakers-risk-links`
- Langfuse trace: `9ba51ddb42d0f302ff30cf2f76d61ef6`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals partial. | Pass | Actual: 'partial' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: []; actual: [] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 0 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | Covered: dashboard scope, real-time behavior, budget |
| Prohibited literal is absent: invented dashboard scope | Pass | Absent |
| Prohibited literal is absent: invented budget | Pass | Absent |
| Prohibited literal is absent: invented real-time requirement | Pass | Absent |

Deterministic evaluation generated 2026-08-03T22:11:51.877072+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
