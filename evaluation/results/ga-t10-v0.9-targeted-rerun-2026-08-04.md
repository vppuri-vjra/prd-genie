# GA-T10 v0.9 Targeted Rerun — 2026-08-04

## Purpose

Verify the `proceed_with_tbd` path for a grounded SSO requirement whose required authentication service has an explicitly unknown ETA.

## Input and ground truth

- Run ID: `RUN-T10-GROUND-TRUTH`
- Grounded items: `FR-001`, `DEP-001`, `RSK-001`
- Approved decision: `partially_sufficient / true / proceed_with_tbd`
- Approved gap: `dependency_eta`, medium, linked to `DEP-001` and `RSK-001`
- Approved risk: preserve `RSK-001` and link its source risk
- Prohibited: estimated ETA, invented mitigation, dependency-status change, or automatic human approval

Groundedness of the approved test contract: **100%**.

## Initial result

Prompt v0.8 returned `sufficient / true / proceed`, omitted the ETA gap, and emitted a risk without the required `source_risk_ids` array. Strict parsing stopped the workflow before the generation gate and Langfuse sender. The preserved output scored **61.54% (8/13)** in independent evaluation.

## Correction

Prompt v0.9 added a bounded dependency-uncertainty rule requiring an explicit medium TBD gap, exact risk-source traceability, and the `proceed_with_tbd` decision when the requirement is otherwise documentable.

## Final result

| Field | Result |
|---|---|
| n8n execution | `7611` |
| Prompt | `gap-analyzer-v0.9-dependency-uncertainty` |
| Decision | `partially_sufficient / true / proceed_with_tbd` |
| Gate | `eligible_with_tbd / human_review_with_tbd` |
| PRD generation eligible | `true` |
| Human approval required | `true` |
| Gap | `dependency_eta`, medium, linked to `DEP-001` and `RSK-001` |
| Risk | `RSK-001`, medium, linked to `DEP-001`, source risk `RSK-001` |
| Contradictions | Empty |
| Contract validation | Passed |
| Independent evaluator | **Pass — 13/13** |
| Groundedness | **100%** |
| Langfuse trace | `1afc44d756a9c866627facc805b95a7a` |
| Langfuse ingestion | Accepted and authenticated, US region |

All six approved targeted Gap Analyzer cases have now passed. Prompt v0.9 remains a candidate until the unchanged six-case regression passes.

