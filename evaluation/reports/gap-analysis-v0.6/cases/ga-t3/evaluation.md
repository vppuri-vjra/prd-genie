# GA-T3 Gap Analysis Evaluation

- Result: **pass**
- Run ID: `RUN-T3-GROUND-TRUTH`
- Groundedness: **100.0%**
- Supported claims: 13/13
- Langfuse trace: `e277c0f2afa297cd37d33f243e5dc714`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the Gap Analysis schema. | Pass | Schema valid |
| information_sufficiency matches the approved decision. | Pass | Actual: 'insufficient' |
| generation_allowed matches the approved decision. | Pass | Actual: False |
| recommended_action matches the approved decision. | Pass | Actual: 'request_clarification' |
| A grounded decision reason is present. | Pass | Decision reason present |
| All approved gaps are present. | Pass | Covered 0 approved gaps |
| No unsupported or duplicate gap is introduced. | Pass | No extra gaps |
| Gap item and source-record traceability is preserved. | Pass | Gap links match approved sources |
| Gap severity matches documentation-readiness impact. | Pass | Severity matches |
| Clarification questions are specific and actionable. | Pass | Questions are bounded and non-empty |
| Approved contradictions are preserved without invention. | Pass | Matched 1 contradictions |
| Approved risks are preserved without invention. | Pass | Matched 0 risks |
| Risk source traceability is preserved. | Pass | Risk source IDs match |
