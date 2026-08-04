# GA-T10 Gap Analysis Evaluation

- Result: **fail**
- Run ID: `RUN-T10-GROUND-TRUTH`
- Groundedness: **61.54%**
- Supported claims: 8/13
- Langfuse trace: `not supplied`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the Gap Analysis schema. | Fail | risks/0: 'source_risk_ids' is a required property |
| information_sufficiency matches the approved decision. | Fail | Expected 'partially_sufficient'; actual 'sufficient' |
| generation_allowed matches the approved decision. | Pass | Actual: True |
| recommended_action matches the approved decision. | Fail | Expected 'proceed_with_tbd'; actual 'proceed' |
| A grounded decision reason is present. | Pass | Decision reason present |
| All approved gaps are present. | Fail | Missing gap keys: [((), 'dependency_eta')] |
| No unsupported or duplicate gap is introduced. | Pass | No extra gaps |
| Gap item and source-record traceability is preserved. | Pass | Gap links match approved sources |
| Gap severity matches documentation-readiness impact. | Pass | Severity matches |
| Clarification questions are specific and actionable. | Pass | Questions are bounded and non-empty |
| Approved contradictions are preserved without invention. | Pass | Matched 0 contradictions |
| Approved risks are preserved without invention. | Pass | Matched 1 risks |
| Risk source traceability is preserved. | Fail | Risk source IDs differ |
