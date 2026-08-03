# T10 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T10-1785798676817`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.3-complete-optional-clarification`
- Langfuse trace: `6d3c0b104278449a9d30ade9940edf1e`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['dependency', 'functional_requirement', 'risk']; actual: ['dependency', 'functional_requirement', 'risk'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'FR-001': 'FR-001', 'DEP-001': 'DEP-001', 'RSK-001': 'RSK-001'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 4 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: invented ETA | Pass | Absent |
| Prohibited literal is absent: invented auth-service status | Pass | Absent |

Deterministic evaluation generated 2026-08-03T23:12:25.053497+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
