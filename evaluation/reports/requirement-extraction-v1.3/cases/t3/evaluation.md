# T3 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T3-1785798435351`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.3-complete-optional-clarification`
- Langfuse trace: `fd1518598dcf4d0fea83729e2bf8085b`

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

Deterministic evaluation generated 2026-08-03T23:12:25.040854+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
