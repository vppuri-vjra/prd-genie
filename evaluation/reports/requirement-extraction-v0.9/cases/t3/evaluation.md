# T3 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T3-1785792893642`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.9-relationships-conflicts-personas`
- Langfuse trace: `cb8bf941fcfe065e0f91d0575f23a9b0`

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

Deterministic evaluation generated 2026-08-03T21:44:13.444979+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
