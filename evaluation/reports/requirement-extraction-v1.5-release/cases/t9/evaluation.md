# T9 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T9-1785800094102`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.5-product-fragment-status-boundary`
- Langfuse trace: `not supplied`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals no_requirements. | Pass | Actual: 'no_requirements' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: []; actual: [] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 0 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | Covered: request a source containing product requirements |
| Prohibited literal is absent: generated requirements | Pass | Absent |
| Prohibited literal is absent: generated PRD content | Pass | Absent |

Deterministic evaluation generated 2026-08-03T23:36:58.158931+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
