# Connected Orchestrator T1 → T11 PRD Generation Canary

## Result

| Field | Result |
|---|---|
| Date | 2026-08-06 |
| Parent workflow | `PRD Genie - Connected Orchestrator v0.3` |
| Source test | `T1` |
| PRD test | `T11` |
| Run ID | `RUN-T1-CONNECTED-1786024618558` |
| Final completed stage | `prd_generation` |
| Next route | `story_breakdown` |
| Groundedness | **100%** |
| Contract result | Passed |

## Connected path exercised

```text
T1 source
→ Requirement Extractor Child
→ Gap Analyzer Child
→ Generation Gate
→ Human Approval Checkpoint Child
→ signed human approval form submitted
→ PRD Generator Child
→ deterministic PRD validation
→ story_breakdown route
```

## PRD validation

| Check | Result |
|---|---|
| Structurally valid | `true` |
| Nested schema valid | `true` |
| Run ID preserved | `true` |
| Approved IDs only | `true` |
| Canonical T11 coverage | `true` |
| Template sections | `10` |
| Validated at | `2026-08-06T14:07:53.262Z` |

The generated Markdown contains all ten PRD template sections. Unsupported sections remain explicitly empty, and the missing business goal is represented as controlled TBD content rather than an invented claim.

## Observability

| Field | Value |
|---|---|
| Parent trace ID | `bf02a72bc3e9bf90963c0baebf15f367` |
| PRD stage trace ID | `16e338b742209d0345456aa43dbdf565` |
| Prompt version | `prd-generator-v0.4-array-and-feature-shape` |
| Langfuse ingestion accepted | `true` |
| Stage recorded at | `2026-08-06T14:07:54.035Z` |
| Parent result recorded at | `2026-08-06T14:07:54.112Z` |

## Parent checks

| Check | Result |
|---|---|
| Run ID preserved | `true` |
| Parent trace ID preserved | `true` |
| PRD generation passed | `true` |
| Expected route reached | `true` |
| Langfuse ingestion accepted | `true` |

## Human conclusion

**Approved connected canary.** The parent invoked each required child in sequence, paused for an actual signed human decision, generated a grounded PRD only after approval, validated the T11 contract, recorded the PRD trace in Langfuse, and correctly handed control to the Story Breakdown route.

