# Realistic PB+MT+SN Gap Analysis Canary v0.1 — Pass

## Authoritative evidence

| Field | Result |
|---|---|
| n8n workflow | `PRD Genie - Realistic Gap Analysis Canary v0.1` |
| n8n workflow ID | `7Z9TRF8RIyqWNDCe` |
| n8n execution | `9667` |
| Gap Analyzer child | `PRD Genie - Gap Analyzer Child v1.0` — `wGBE80XMjD5rTKql` |
| Run ID | `RUN-REALISTIC-GAP-1786058431706` |
| Langfuse trace | `a727f4397ede1de96d15e18a78d6bdd0` |
| Langfuse ingestion | Accepted |
| Prompt | `gap-analyzer-v1.0-missing-information-coverage` |
| Result | Passed |
| Groundedness | **100%** |
| Unsupported claims | **0** |

## Accepted result

- Information sufficiency: `partially_sufficient`
- Generation allowed: `false`
- Recommended action: `request_clarification`
- Generation Gate route: `clarification`
- Gaps: 14
- Missing-information coverage: 12/12
- Contradiction preservation: 4/4
- Source-risk preservation: 2/2
- Human Approval invoked: no; the clarification route stops before Human Approval and PRD generation.

The 14 gaps consist of one or more traceable clarifications for each of the 12 upstream missing-information records, plus a grounded deadline-deliverable clarification and an unresolved rendering-architecture decision linked to approved upstream items. No contradiction was resolved and no unsupported answer was introduced.

## Integration defects recorded separately

1. The first diagnostic execution stopped before model invocation because Gap Analyzer Child v1.0 requires the schema-optional `extractor_notes` field. The canary adapter now supplies an empty array without changing approved facts.
2. Updating the first imported canvas caused n8n to merge nodes rather than replace the stale branch. That canvas, `a7jOgippMt3Ovhfb`, is diagnostic-only. The clean accepted canvas is `7Z9TRF8RIyqWNDCe`.

Neither defect was a grounding failure.
