# GA-T2 Gap Analysis Evaluation

- Result: **needs_review**
- Run ID: `RUN-T2-GROUND-TRUTH`
- Groundedness: **92.31%**
- Supported claims: 12/13
- Langfuse trace: `7039c601e0ddb9bdc0775db53a65d0cd`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the Gap Analysis schema. | Pass | Schema valid |
| information_sufficiency matches the approved decision. | Pass | Actual: 'insufficient' |
| generation_allowed matches the approved decision. | Pass | Actual: False |
| recommended_action matches the approved decision. | Pass | Actual: 'request_clarification' |
| A grounded decision reason is present. | Pass | Decision reason present |
| All approved gaps are present. | Pass | Covered 4 approved gaps |
| No unsupported or duplicate gap is introduced. | Pass | No extra gaps |
| Gap item and source-record traceability is preserved. | Pass | Gap links match approved sources |
| Gap severity matches documentation-readiness impact. | Fail | GAP-003: severity 'blocking' != 'high'; GAP-001: severity 'blocking' != 'high'; GAP-002: severity 'blocking' != 'high'; GAP-004: severity 'blocking' != 'high' |
| Clarification questions are specific and actionable. | Pass | Questions are bounded and non-empty |
| Approved contradictions are preserved without invention. | Pass | Matched 0 contradictions |
| Approved risks are preserved without invention. | Pass | Matched 0 risks |
| Risk source traceability is preserved. | Pass | Risk source IDs match |
