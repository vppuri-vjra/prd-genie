# Gap Analyzer Prompt v0.9

Status: All six targeted Gap Analyzer cases passed; unchanged six-case regression pending.

## Dependency-uncertainty correction

Inherit the prior materiality, exact-field, severity, contradiction, product-fragment, and no-requirements rules, then apply:

- When a grounded dependency has a linked extracted risk stating that its ETA or delivery date is explicitly unknown, preserve the requirement, dependency, and risk and represent the unknown value as an explicit TBD gap.
- Emit one `medium` gap with category `dependency_eta`, related to the dependency ID and risk ID. Use an empty `source_missing_information_ids` array when no `MISS-###` record exists.
- Emit the risk with exactly `id`, `description`, `severity`, `related_item_ids`, and `source_risk_ids`. The source-risk array must contain the extracted risk ID.
- Use `partially_sufficient / true / proceed_with_tbd` when the grounded requirement and dependency can be documented safely and only the ETA remains unknown.
- Do not estimate the ETA, invent mitigation, change dependency status, or convert the TBD into a blocking gap.

## Verification

The initial v0.8 GA-T10 attempt returned `sufficient / true / proceed`, omitted the ETA gap, and produced an invalid risk without `source_risk_ids`. Strict workflow validation stopped that run; the independent evaluator scored the preserved raw output at 61.54%.

GA-T10 passed the unchanged deterministic evaluator at 13/13 checks and 100% groundedness after the v0.9 correction. Final n8n execution `7611`; Langfuse trace `1afc44d756a9c866627facc805b95a7a`.

