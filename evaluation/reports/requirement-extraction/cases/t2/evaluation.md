# T2 Requirement Extraction Evaluation

- Result: **fail**
- Run ID: `RUN-T2-1785785349585`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.8-dependency-risk-fix`
- Langfuse trace: `26c2b3b387205a095feab2d51694fa50`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals partial. | Pass | Actual: 'partial' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Fail | Required: ['functional_requirement']; actual: [] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Fail | Unmatched: ['FR-001']; mapping: {} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 0 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Fail | Not found: metrics, format |
| Prohibited literal is absent: invented reporting requirements | Pass | Absent |
| Prohibited literal is absent: invented competitor capabilities | Pass | Absent |

Deterministic evaluation generated 2026-08-03T20:38:14.253764+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
