# GA-T10 Gap Analysis Evaluation

- Result: **pass**
- Run ID: `RUN-T10-GROUND-TRUTH`
- Groundedness: **100.0%**
- Supported claims: 13/13
- Langfuse trace: `3ba5da4fb2b9ac3e9a6a00c1beb7bb6d`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the Gap Analysis schema. | Pass | Schema valid |
| information_sufficiency matches the approved decision. | Pass | Actual: 'partially_sufficient' |
| generation_allowed matches the approved decision. | Pass | Actual: True |
| recommended_action matches the approved decision. | Pass | Actual: 'proceed_with_tbd' |
| A grounded decision reason is present. | Pass | Decision reason present |
| All approved gaps are present. | Pass | Covered 1 approved gaps |
| No unsupported or duplicate gap is introduced. | Pass | No extra gaps |
| Gap item and source-record traceability is preserved. | Pass | Gap links match approved sources |
| Gap severity matches documentation-readiness impact. | Pass | Severity matches |
| Clarification questions are specific and actionable. | Pass | Questions are bounded and non-empty |
| Approved contradictions are preserved without invention. | Pass | Matched 0 contradictions |
| Approved risks are preserved without invention. | Pass | Matched 1 risks |
| Risk source traceability is preserved. | Pass | Risk source IDs match |
