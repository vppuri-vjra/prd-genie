# PRD Orchestrator v0.3.8 — Accepted Submission Candidate

This release package preserves the complete nine-workflow v0.3.8 candidate and the evidence from the first accepted end-to-end run.

## Accepted run

| Field | Value |
|---|---|
| Parent execution | `11901` |
| Run ID | `RUN-S2-11902-16e7090e` |
| Agreement Gate | Release authorized |
| Duration | 2m 33.201s |
| Delivery contract | 3 Epics / 7 Features / 11 Stories / 11 Story AC |
| Sizing | 11/11, advisory and non-blocking |
| Fully loaded usage | 545,467 tokens / `$1.474409` |
| Protected fallback | v0.3.7 remains unchanged |

## Reviewer-facing artifacts

- [Business Requirements Document](final-artifacts/business-requirements-document.md)
- [Product Requirements Document](final-artifacts/product-requirements-document.md)
- [Architecture Design](final-artifacts/architecture-design.md)
- [Validated Full PRD Review](<evidence/PRD Genie — Validated Full PRD Review — RUN-S2-11902-16e7090e.md>)
- [Validated Epic, Feature, and User Story Review](<evidence/PRD Genie — Validated Epic Feature User Story Review — RUN-S2-11902-16e7090e.md>)
- [Proposed T-Shirt Sizing Review](<evidence/PRD Genie — Proposed T-Shirt Sizing Review — RUN-S2-11902-16e7090e.md>)
- [Source-to-Delivery Citation Traceability Matrix](<evidence/PRD Genie — Source-to-Delivery Citation Traceability Matrix — RUN-S2-11902-16e7090e.md>)
- [Complete 145-Citation Disposition Ledger](<evidence/PRD Genie — Complete Citation Disposition Ledger — RUN-S2-11902-16e7090e.md>)
- [v0.3.8 n8n Workflow Inventory](evidence/workflow-inventory-v0.3.8.md)

## Machine-readable accepted-run evidence

- [Run summary](evidence/run-summary.json)
- [Final PRD Markdown](evidence/final-prd.md)
- [Story breakdown](evidence/story-breakdown.json)
- [Traceability and lineage](evidence/traceability.json)

## Complete workflow export set

| Order | Workflow export | Live n8n ID | Runtime disposition |
|---:|---|---|---|
| 0 | [Main Orchestrator](workflows/00-main-orchestrator.json) | `YCgHHBa8xUvSOYGI` | Accepted parent |
| 1 | [Drive Intake and Clarification Gate](workflows/01-drive-intake-clarification-gate.json) | `CQEgz6G2sPHhehjW` | Candidate snapshot; stable runtime reference retained |
| 2 | [Requirement Extractor](workflows/02-requirement-extractor.json) | `YcNGjVHdyAJgZeod` | Candidate snapshot; retained logical contract |
| 3 | [Gap Analyzer](workflows/03-gap-analyzer.json) | `6F4ANeRIDJVkA28C` | Candidate snapshot; retained logical contract |
| 4 | [Human Approval](workflows/04-human-approval.json) | `uMSo2zvHLGWcM2vo` | Candidate snapshot; stable runtime reference retained |
| 5 | [Production PRD](workflows/05-production-prd.json) | `ocoEGqFDyzzFYf3U` | v0.3.8 workflow invoked |
| 6 | [Story Breakdown](workflows/06-story-breakdown.json) | `kswPN0mT0u7rp4vq` | v0.3.8 workflow invoked |
| 7 | [Final Validator and Export](workflows/07-final-validator-export.json) | `gU24pjEsig7u60S4` | Candidate snapshot; stable runtime reference retained |
| 8 | [Story Sizing](workflows/08-story-sizing.json) | `cFuv8QCLpLhtX6A6` | v0.3.8 workflow invoked; post-export advisory stage |

## Authoritative runtime path

The accepted parent intentionally uses a minimal-change hybrid call graph. Stable v0.3.7 intake, approval, and validator controls remain protected, while the corrected v0.3.8 Production PRD, Story Breakdown, and Story Sizing workflows are invoked by their live workflow IDs. Candidate copies of every stage are included above to make the submission reproducible and auditable.

## External runtime evidence

The seven accepted outputs remain available in Google Drive. Their file IDs and the corresponding n8n and Langfuse evidence are recorded in the [workflow inventory](evidence/workflow-inventory-v0.3.8.md).
