# ADR-002: Strict Structured Contracts Between Agents

- **Status:** Accepted
- **Date:** 2026-07-31

## Context

PRD Genie's agents depend on upstream outputs. Free-form prose between stages would make validation, grounding, n8n routing, evaluation, and failure diagnosis unreliable.

## Decision

Use standalone JSON Schema Draft 2020-12 contracts for workflow input, requirement extraction, gap analysis, human review, PRD output, story breakdown, and evaluation results.

All schemas:

- Use an explicit `schema_version`
- Reject unknown properties
- Restrict status and decision fields to controlled values
- Require source evidence or source requirement IDs for grounded content
- Encode safe generation-gate relationships
- Preserve stable identifiers throughout the workflow

## Rationale

- n8n nodes receive predictable inputs and outputs.
- Invalid LLM responses fail visibly before reaching downstream agents.
- Evaluation checks can be deterministic where possible.
- Graders can inspect and reproduce the contracts independently of the n8n canvas.
- Evidence-linked identifiers demonstrate the required grounding behavior.

## Consequences

- Prompts must instruct models to produce schema-compatible JSON.
- Schema changes require versioning and regression validation.
- Semantic checks such as unsupported-claim detection remain necessary in addition to structural validation.
