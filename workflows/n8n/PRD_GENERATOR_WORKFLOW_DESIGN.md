# PRD Generator n8n Workflow Design

## Status

Core workflow `v0.1.0` imported as n8n workflow `eQRkZR8t6VS4q1Xu`. Prompt candidate: `prd-generator-v0.2-exact-schema`.

## First T11 execution

The first core execution reached the PRD parser after a successful model call, then stopped correctly. The response remained source-grounded but used a generic PRD structure instead of the approved contract: it introduced unsupported top-level structures such as `problem_statement`, `goals_and_success_metrics`, `user_stories`, and `dependencies_and_assumptions`, while omitting the required separate arrays.

The deterministic validator rejected the result. No invalid PRD was accepted. Prompt v0.2 now enumerates the exact approved top-level and nested field structure and explicitly prohibits the generic aliases observed in the failed run.

The v0.2 rerun completed all nodes but did not pass independent T11 review. It exposed incomplete nested validation: invalid document metadata and sourced-text status values, omitted approved goal/metric/acceptance-criterion content, and an invalid milestone shape were not rejected. This execution is recorded as a failed candidate. The approved T11 ground truth remains unchanged, and Langfuse will not be added until both the prompt and nested validator pass.

Prompt v0.3 was imported into a new clean eight-node workflow, ID `NcqReOJGoKkyNh4S`. It corrected all earlier content and metadata defects. The remaining output differences are limited to an object-versus-array error for `success_metrics` and missing `feature` fields on both acceptance criteria. The strict validator stopped the workflow, although its wrong-type path must be hardened to avoid an iterator `TypeError`. Prompt v0.4 and the validator hardening are the next targeted correction.

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
