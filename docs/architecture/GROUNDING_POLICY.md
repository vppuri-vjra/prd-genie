# Grounding Policy

## Objective

PRD Genie must transform supplied product evidence without adding plausible but unsupported content. This policy applies to every agent, validation step, and human approval action.

## Rules

1. Use only the current source input or explicitly approved upstream output.
2. Attach at least one verbatim evidence quote to every extracted item.
3. Preserve names, numbers, dates, deadlines, API versions, thresholds, and units exactly.
4. Classify content as `stated`, `suggested`, `ambiguous`, or `contradictory`; do not silently promote proposals or suggestions into approved requirements.
5. Preserve stakeholder viewpoints separately and neutrally.
6. Identify contradictions and request resolution; never choose a winner on behalf of stakeholders.
7. Represent absent mandatory PRD content as `TBD - stakeholder input required` and create an open question.
8. Do not invent personas, priorities, benefits, acceptance criteria, dependencies, scope, milestones, or success metrics.
9. Block PRD generation when no meaningful requirements are extractable.
10. Preserve stable IDs from extraction through PRD sections, stories, and evaluation evidence.

## Generation gate

| Condition | Action |
|---|---|
| Sufficient grounded requirements, no blocking issue | `proceed` |
| Useful requirements exist but template fields are missing | `proceed_with_tbd` |
| Material ambiguity or unresolved contradiction prevents safe generation | `request_clarification` |
| No meaningful requirements are extractable | `block_generation` |

Only `proceed` and `proceed_with_tbd` set `generation_allowed` to `true`. Human approval is still required before PRD generation.

## Deterministic validations

- JSON must validate against its stage schema.
- Every grounded requirement must contain evidence.
- Exact values present in the input must remain unchanged.
- Every grounded PRD statement must reference at least one extraction ID.
- Every epic, feature, and story must reference at least one approved requirement ID.
- A rejected or unapproved item must not appear downstream.
- A `block_generation` decision must not produce a PRD.
- Unsupported-claim count must be zero for a passing baseline run.
