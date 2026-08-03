# T4 Requirement Extraction Evaluation

- Result: **pass**
- Run ID: `RUN-T4-1785797532181`
- Workflow version: `v0.2.0`
- Prompt version: `extractor-v1.2-generic-user-persona-fix`
- Langfuse trace: `145aae12cb410afe288ed6bc529fe359`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the extraction schema. | Pass | Schema valid |
| Extraction status equals complete. | Pass | Actual: 'complete' |
| All required exact values are preserved. | Pass | All exact values found |
| All required item types are present. | Pass | Required: ['acceptance_criterion', 'functional_requirement']; actual: ['acceptance_criterion', 'functional_requirement'] |
| Every extracted item has verbatim evidence in the source. | Pass | All evidence quotes found in source |
| Every canonical item has a deterministic actual-item match. | Pass | Mapping: {'FR-001': 'FR-001', 'AC-001': 'AC-001', 'AC-002': 'AC-002'} |
| Canonical item relationships are preserved after ID mapping. | Pass | Verified 4 directed links |
| Required contradiction handling is preserved. | Pass | Contradiction expectations satisfied |
| Required missing-information coverage is present. | Pass | No mandatory gaps |
| Prohibited literal is absent: additional acceptance criteria | Pass | Absent |
| Prohibited literal is absent: XLSX | Pass | Absent |

Deterministic evaluation generated 2026-08-03T22:53:18.488819+00:00. Token, cost, or latency values remain zero when they were not supplied to this local evaluator.
