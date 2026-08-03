# T2 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T2-1785799953595`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.5-product-fragment-status-boundary`
- Langfuse trace: `not supplied`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals partial. | Pass | Actual: 'partial' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['functional_requirement']; actual: ['functional_requirement'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'FR-001': 'FR-001'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 0 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | Covered: metrics, format, users |
| Prohibited literal is absent: invented reporting requirements | Pass | Absent |
| Prohibited literal is absent: invented competitor capabilities | Pass | Absent |

Deterministic evaluation generated 2026-08-03T23:36:58.147408+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
