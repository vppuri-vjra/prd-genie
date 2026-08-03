# T10 Requirement Extraction Evaluation

- Result: **fail**
- Run ID: `RUN-T10-1785792744501`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v0.9-relationships-conflicts-personas`
- Langfuse trace: `4d39707bb72aaf3c455ba5d4254da79c`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Fail | items/3/id: 'RISK-001' does not match '^(FR\|NFR\|AC\|PER\|STK\|DDL\|DEP\|CON\|ASM\|RSK)-[0-9]{3}$' |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['dependency', 'functional_requirement', 'risk']; actual: ['dependency', 'functional_requirement', 'risk', 'stakeholder'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'FR-001': 'FR-001', 'DEP-001': 'DEP-001', 'RSK-001': 'RISK-001'} |
| Canonical item relationships are preserved after ID mapping. | Fail | DEP-001 does not link to RISK-001 |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: invented ETA | Pass | Absent |
| Prohibited literal is absent: invented auth-service status | Pass | Absent |
| Additional actual items require semantic review. | Pass | Additional item IDs: ['STK-001'] |

Deterministic evaluation generated 2026-08-03T21:44:13.454859+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
