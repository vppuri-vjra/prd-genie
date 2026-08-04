# GA-T9 Gap Analysis Evaluation

- Result: **fail**
- Run ID: `RUN-T9-GROUND-TRUTH`
- Groundedness: **84.62%**
- Supported claims: 11/13
- Langfuse trace: `940c126590cf41bcf204b6772feb8195`

| Check | Result | Evidence |
|---|---|---|
| Actual output conforms to the Gap Analysis schema. | Pass | Schema valid |
| information_sufficiency matches the approved decision. | Pass | Actual: 'insufficient' |
| generation_allowed matches the approved decision. | Pass | Actual: False |
| recommended_action matches the approved decision. | Pass | Actual: 'block_generation' |
| A grounded decision reason is present. | Pass | Decision reason present |
| All approved gaps are present. | Fail | Missing gap keys: [(('MISS-001',), 'requirements')] |
| No unsupported or duplicate gap is introduced. | Fail | Unexpected gap keys: [(('MISS-001',), 'requirements_source')] |
| Gap item and source-record traceability is preserved. | Pass | Gap links match approved sources |
| Gap severity matches documentation-readiness impact. | Pass | Severity matches |
| Clarification questions are specific and actionable. | Pass | Questions are bounded and non-empty |
| Approved contradictions are preserved without invention. | Pass | Matched 0 contradictions |
| Approved risks are preserved without invention. | Pass | Matched 0 risks |
| Risk source traceability is preserved. | Pass | Risk source IDs match |
