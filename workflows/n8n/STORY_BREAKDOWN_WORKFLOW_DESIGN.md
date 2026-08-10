# Story Breakdown n8n Workflow Design

## Realistic v4 isolated child candidate

`prd-genie-realistic-v4-story-breakdown-child-v0.1.json` is a seven-node, six-connection unpublished child candidate derived only from approved PRD execution `9725`:

`Execute Workflow Trigger → Load Approved PRD 9725 → Validate Approved PRD Entry → Build and Validate Deterministic Breakdown → Build Story Breakdown Trace → Send Story Trace to Langfuse → Return Story Breakdown`

The trigger explicitly uses `inputSource: passthrough`. It returns synchronized JSON/Markdown content, full lineage, 19/19 coverage and copied provenance. It fails closed on entry, scope, orphan, grounding, or trace-ingestion failure. Native import must preserve the export definition; bind the HTTP node to `Langfuse US - PRD Genie`. No n8n identity or runtime trace is claimed until that verification occurs.

### v0.2 remediation

The import-ready v0.2 export retains the same seven-node topology and passthrough trigger. Its deterministic validator creates independent `epicIds`, `featureIds`, `storyIds`, and `criterionIds` arrays and checks uniqueness within each. This replaces the v0.1 loop that repeated parent IDs per child story. The v0.2 candidate is not executed or published.

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

## Connected child

`prd-genie-story-breakdown-child-v1.0.json` is the integration wrapper. It accepts only a passed, 100%-grounded T11 `prd_generation` stage envelope, derives the approved T12 package from that live PRD output, preserves the connected `run_id` and parent trace, enforces canonical T12 coverage, sends a child-stage Langfuse trace, and returns `next_route: final_validation`. It does not replace or modify the standalone release-evidence workflow.

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

## Observable release checkpoint

Workflow v0.2 was imported as n8n workflow `sYjmLbuEQNhrm6xK`. Execution `8788` completed all 11 nodes, passed the exact T12 contract at **100% groundedness**, recorded zero unsupported claims, rendered Markdown, and sent accepted Langfuse US trace `8e2078937f42afa208b3b2dc8d0f159b`.
