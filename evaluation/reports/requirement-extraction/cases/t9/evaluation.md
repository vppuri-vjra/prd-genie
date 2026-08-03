# T9 Requirement Extraction Evaluation

- Result: **needs_review**
- Run ID: `RUN-T9-1785785556246`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.8-dependency-risk-fix`
- Langfuse trace: `80818c6cc83d5d01dc3d89dacc021f85`

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
| Required missing-information coverage is present. | Pass | Semantic review required for: request a source containing product requirements |
| Prohibited literal is absent: generated requirements | Pass | Absent |
| Prohibited literal is absent: generated PRD content | Pass | Absent |

Deterministic evaluation generated 2026-08-03T20:38:14.263415+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
