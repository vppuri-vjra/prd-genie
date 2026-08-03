# T3 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T3-1785796843648`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.1-embedded-condition-fix`
- Langfuse trace: `e485cd3c1841c122b03dd110cf507312`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals partial. | Pass | Actual: 'partial' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['functional_requirement', 'non_functional_requirement']; actual: ['functional_requirement', 'non_functional_requirement'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'FR-001': 'FR-001', 'NFR-001': 'NFR-001'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 2 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: silently resolving the contradiction | Pass | Absent |
| Prohibited literal is absent: selecting a refresh implementation | Pass | Absent |

Deterministic evaluation generated 2026-08-03T22:41:51.512132+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
