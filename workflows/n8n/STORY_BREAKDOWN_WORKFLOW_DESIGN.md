# Story Breakdown n8n Workflow Design

## Purpose

Run T12 as a separate workflow that consumes the approved actual T11/T1 PRD, generates the canonical epic-feature-story hierarchy, validates it deterministically, renders readable Markdown, sends an observable trace to Langfuse US, and records the release result.

## Planned workflow

```text
Manual Trigger
→ Load Approved T12 Package
→ Validate Story Entry Contract
→ Create Story Trace Context
→ Story Breakdown Agent
   ↳ OpenAI Story Model
→ Parse and Validate Story Breakdown
→ Render Story Markdown
→ Build Story Langfuse Trace
→ Send Story Trace to Langfuse
→ Record Story Release Result
```

The workflow contains 11 nodes including the model node. The Story Breakdown Agent makes the only model call. Entry validation, output validation, Markdown rendering, trace construction, and final release recording are deterministic.

## Entry validation

- `test_id` is `T12`.
- Input type is `approved_prd`.
- T11 contract status is `passed`.
- T11 groundedness is `100`.
- Story generation authorization is `true`.
- `run_id` is valid and preserved.
- Approved requirement IDs are exactly `FR-001` and `NFR-001`.
- Approved acceptance-criteria IDs are exactly `AC-001` and `AC-002`.

## Output validation

- Output matches Story Breakdown schema v1.1.0.
- `run_id` equals `source_prd_run_id`.
- Canonical T12 quantities are 1 epic, 1 feature, 1 story, 2 criteria, and 2 unresolved questions.
- Only approved IDs appear.
- Exact requirement, performance, and acceptance-criteria text is preserved.
- Benefit remains the controlled TBD.
- Persona specificity and benefit questions are present.
- Dependencies remain empty.
- Unsupported-claim count is zero.

## Observability

Langfuse receives:

- parent trace `prd-genie-story-breakdown`;
- generation observation `story-breakdown-agent`;
- deterministic validation/render observation;
- run, workflow, prompt, model, test, and groundedness metadata; and
- failure evidence through the existing Failure Observer when execution stops.

Prompt version: `story-breakdown-v0.1-t12-canonical`.

## Release condition

T12 may be promoted only when the actual n8n output passes the schema and canonical evaluator at **100% groundedness**, Langfuse accepts the trace, and the actual JSON and Markdown are preserved in `evaluation/actual/story-breakdown/t12/`.
