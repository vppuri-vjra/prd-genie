# T5 Requirement Extraction Evaluation

- Result: **needs_review**
- Run ID: `RUN-T5-1785792616560`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.9-relationships-conflicts-personas`
- Langfuse trace: `7561ef94ccd7cbf2c879d53e76b78baf`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals partial. | Pass | Actual: 'partial' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: []; actual: ['functional_requirement', 'risk'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 0 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | Semantic review required for: dashboard scope, real-time behavior |
| Prohibited literal is absent: invented dashboard scope | Pass | Absent |
| Prohibited literal is absent: invented budget | Pass | Absent |
| Prohibited literal is absent: invented real-time requirement | Pass | Absent |
| Additional actual items require semantic review. | Pass | Additional item IDs: ['FR-001', 'RSK-001'] |

Deterministic evaluation generated 2026-08-03T21:44:13.447820+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
