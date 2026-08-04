# GA-T5 Gap Analysis Evaluation

- Result: **fail**
- Run ID: `RUN-T5-GROUND-TRUTH`
- Groundedness: **76.92%**
- Supported claims: 10/13
- Langfuse trace: `48447a07fae762b7c5a8ec59136cd566`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the Gap Analysis schema. | Pass | Schema valid |
| information_sufficiency matches the approved decision. | Pass | Actual: 'insufficient' |
| generation_allowed matches the approved decision. | Pass | Actual: False |
| recommended_action matches the approved decision. | Pass | Actual: 'request_clarification' |
| A grounded decision reason is present. | Pass | Decision reason present |
| All approved gaps are present. | Fail | Missing gap keys: [(('MISS-001',), 'dashboard_scope'), (('MISS-003',), 'budget')] |
| No unsupported or duplicate gap is introduced. | Fail | Unexpected gap keys: [(('MISS-001',), 'scope')] |
| Gap item and source-record traceability is preserved. | Pass | Gap links match approved sources |
| Gap severity matches documentation-readiness impact. | Fail | GAP-002: severity 'high' != 'blocking' |
| Clarification questions are specific and actionable. | Pass | Questions are bounded and non-empty |
| Approved contradictions are preserved without invention. | Pass | Matched 0 contradictions |
| Approved risks are preserved without invention. | Pass | Matched 0 risks |
| Risk source traceability is preserved. | Pass | Risk source IDs match |
