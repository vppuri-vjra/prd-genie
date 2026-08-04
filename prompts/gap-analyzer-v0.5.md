# Gap Analyzer Prompt v0.5

Status: Targeted GA-T1 and GA-T2 candidate; remaining approved GA regression cases pending.

## Severity-boundary correction

Inherit the complete v0.2 materiality boundary and v0.4 schema-and-decision rules, then apply this boundary:

- Use `high` when at least one grounded requirement item exists and missing users, metrics, formats, reference details, or other dimensions materially reduce its clarity, scope, or testability but can be answered through clarification.
- Do not label those missing dimensions `blocking` merely because generation is currently disallowed.
- Reserve `blocking` for cases with no reliable requirement item, no meaningful requirements, or an explicit unresolved material contradiction that prevents safe representation.
- Apply the minimum supported severity independently to each gap.

## Output contract

The complete runtime prompt retains the v0.2 role, authoritative-input, grounding, non-invention, decision, clarification, runtime-input, and exact JSON-output rules. Output must conform to `schemas/gap-analysis.schema.json`.

## Verification

GA-T2 passed the unchanged deterministic evaluator at 13/13 checks and 100% groundedness. n8n execution `7595`; Langfuse trace `7c39feb2c77de8b7467cccbd37737208`. Remaining approved Gap Analyzer cases must pass under the same prompt before promotion.

