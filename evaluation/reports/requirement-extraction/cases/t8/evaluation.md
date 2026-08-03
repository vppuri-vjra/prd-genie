# T8 Requirement Extraction Evaluation

- Result: **fail**
- Run ID: `RUN-T8-1785785538033`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.8-dependency-risk-fix`
- Langfuse trace: `0aa11a39d9c1f4a0e8a5f3225edd4706`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Fail | Required: ['functional_requirement', 'persona']; actual: ['functional_requirement'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Fail | Unmatched: ['PER-001', 'PER-002', 'PER-003']; mapping: {'FR-001': 'FR-001', 'FR-002': 'FR-002', 'FR-003': 'FR-003'} |
| Canonical item relationships are preserved after ID mapping. | Fail | FR-001 relation target PER-001 is unmatched; FR-002 relation target PER-002 is unmatched; FR-003 relation target PER-003 is unmatched |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: merging all personas into a generic user | Pass | Absent |

Deterministic evaluation generated 2026-08-03T20:55:25.948209+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
