# Gap Analyzer Contract

## Purpose

The Gap Analyzer is PRD Genie's selected extended capability. It consumes the validated Requirement Extractor output directly, preserves the same `run_id`, identifies grounded missing or ambiguous information, carries contradictions and risks forward, and recommends whether PRD generation may proceed.

## Input

The input is one JSON object conforming to `schemas/requirement-extraction.schema.json`. No additional wrapper or duplicate run identifier is required.

## Output decision

The output conforms to `schemas/gap-analysis.schema.json` and contains:

- `information_sufficiency`: `sufficient`, `partially_sufficient`, or `insufficient`.
- `generation_allowed`: machine-readable eligibility for the generation gate.
- `recommended_action`: `proceed`, `proceed_with_tbd`, `request_clarification`, or `block_generation`.
- `decision_reason`: mandatory grounded explanation for the decision.
- `gaps`, `contradictions`, and `risks`: structured issue collections.

The schema enforces valid combinations among sufficiency, generation permission, and recommended action.

## Gap traceability

Every gap contains:

- A `GAP-###` identifier.
- Category, description, severity, and neutral clarification question.
- Required `related_item_ids`, including an explicit empty array when no extracted item exists.
- Required `source_missing_information_ids`, linking back to `MISS-###` records when applicable.

## Contradictions

Contradictions preserve unresolved conflicts without choosing a side. They use `CTR-###` identifiers and link all affected extracted item IDs. The Gap Analyzer may assess severity but must not invent a conflict from mere proximity or association.

## Risks

Risks must be grounded in the extraction or in explicitly supported uncertainty. Each risk uses an `RSK-###` identifier, links affected items, and includes required `source_risk_ids`; an empty source array explicitly indicates a downstream assessment rather than a copied extractor risk.

## Guardrails

- Do not invent requirements, answers, personas, owners, dates, budgets, priorities, dependencies, contradictions, or risks.
- Do not resolve stakeholder disagreements.
- Do not convert missing information into an approved fact.
- Do not permit PRD generation when doing so would require unsupported content.
- Preserve source IDs so every clarification and decision remains auditable through Langfuse and human review.

## Validation checkpoint

The updated schema and all repository contract examples passed `scripts/validate_contracts.py` on 2026-08-03: 7 schemas and 15 examples validated.
