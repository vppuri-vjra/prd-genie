# PRD Generator n8n Workflow Design

## Status

Core workflow `v0.1.0` imported as n8n workflow `eQRkZR8t6VS4q1Xu`. Prompt candidate: `prd-generator-v0.2-exact-schema`.

## First T11 execution

The first core execution reached the PRD parser after a successful model call, then stopped correctly. The response remained source-grounded but used a generic PRD structure instead of the approved contract: it introduced unsupported top-level structures such as `problem_statement`, `goals_and_success_metrics`, `user_stories`, and `dependencies_and_assumptions`, while omitting the required separate arrays.

The deterministic validator rejected the result. No invalid PRD was accepted. Prompt v0.2 now enumerates the exact approved top-level and nested field structure and explicitly prohibits the generic aliases observed in the failed run.

The v0.2 rerun completed all nodes but did not pass independent T11 review. It exposed incomplete nested validation: invalid document metadata and sourced-text status values, omitted approved goal/metric/acceptance-criterion content, and an invalid milestone shape were not rejected. This execution is recorded as a failed candidate. The approved T11 ground truth remains unchanged, and Langfuse will not be added until both the prompt and nested validator pass.

Prompt v0.3 was imported into a new clean eight-node workflow, ID `NcqReOJGoKkyNh4S`. It corrected all earlier content and metadata defects. The remaining output differences are limited to an object-versus-array error for `success_metrics` and missing `feature` fields on both acceptance criteria. The strict validator stopped the workflow, although its wrong-type path must be hardened to avoid an iterator `TypeError`. Prompt v0.4 and the validator hardening are the next targeted correction.

Prompt v0.4 corrected the two remaining output shapes. Core execution `8620` completed with contract passed, 100% groundedness, nested schema valid, approved IDs only, canonical T11 coverage true, all ten sections, and rendered Markdown. The live Trace Context remained labelled v0.3 because only the Agent prompt was updated in place. The recovery export contains the correct v0.4 label. An unchanged rerun with synchronized trace metadata is required before Langfuse and release promotion.

## Observable release checkpoint

The 11-node workflow was imported cleanly as `PRD Genie - PRD Generator + Langfuse v0.1`, workflow ID `30ZYQxRHWggFgrAe`. The unchanged T11 release run completed through generation, strict validation, Markdown rendering, Langfuse US ingestion, and final result recording.

- contract status: `passed`;
- groundedness: **100%**;
- nested schema and canonical coverage: `true`;
- template sections: `10`;
- prompt metadata: `prd-generator-v0.4-array-and-feature-shape`;
- Langfuse ingestion: HTTP `200`, accepted; and
- Langfuse trace: `05e9aa534e4286e17ec65512a72e48ff`.

Token usage was not exposed by the n8n chain output and is recorded as unavailable rather than estimated.

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

## Connected child v1.0

`prd-genie-prd-generator-child-v1.0.json` is the integration wrapper for the validated T11/T1 baseline. It replaces the manual loader with an Execute Sub-workflow Trigger and consumes the actual `human_approval` stage envelope. It accepts only a passed `prd_generation` route at 100% groundedness, maps only human-approved extraction IDs, preserves the parent and Human Approval trace IDs, and returns a standard `prd_generation` stage envelope with `next_route: story_breakdown`.

The standalone workflow remains unchanged for regression evidence. The connected child passed the fresh connected T1-to-T11 canary on 2026-08-06. It preserved the run and parent trace IDs, passed the strict ten-section T11 validator, recorded an accepted Langfuse trace, maintained 100% groundedness, and returned `story_breakdown` as the next route.
