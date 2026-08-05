# PRD Generator n8n Workflow Design

## Status

Core workflow `v0.1.0` prepared for import and T11 execution. Prompt baseline: `prd-generator-v0.1-grounded-template`.

## Purpose

Run PRD generation as a separate workflow. It consumes an approved Human Approval package, generates one structured PRD using the official ten-section template, validates the output deterministically, and renders matching Markdown.

## Core workflow

```text
Manual Trigger
→ Load Approved T11 Package
→ Validate PRD Entry Contract
→ Create PRD Trace Context
→ PRD Generator Agent
→ Parse and Validate PRD
→ Render PRD Markdown
```

The Agent makes the only model call. Entry validation, output validation and Markdown rendering are deterministic.

## T11 rules

- Preserve `RUN-T1-GROUND-TRUTH`.
- Accept only `HA-R01 / approved / prd_generation`.
- Use only `FR-001`, `NFR-001`, `STK-001`, and `DDL-001`.
- Represent all ten template sections.
- Use explicit TBD or empty arrays when evidence is absent.
- Produce zero unsupported product claims.

## Implementation sequence

1. Import the recovery JSON into n8n.
2. Rebind the existing OpenAI credential if n8n requests it.
3. Execute the core T11 workflow.
4. Compare JSON and Markdown with approved ground truth.
5. Add Langfuse generation and validation observations.
6. Export the verified workflow and record execution evidence.

Groundedness target: **100%**.

