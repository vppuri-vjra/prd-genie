# T8 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T8-1785800070342`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.5-product-fragment-status-boundary`
- Langfuse trace: `not supplied`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['functional_requirement', 'persona']; actual: ['functional_requirement', 'persona'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'PER-001': 'PER-001', 'FR-001': 'FR-001', 'PER-002': 'PER-002', 'FR-002': 'FR-002', 'PER-003': 'PER-003', 'FR-003': 'FR-003'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 6 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: merging all personas into a generic user | Pass | Absent |

Deterministic evaluation generated 2026-08-03T23:36:58.157719+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
