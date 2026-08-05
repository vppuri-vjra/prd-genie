# HA-R02 Human Review — Changes Requested

## Purpose

Verify that a schema-valid, review-eligible package with a known semantic classification and relationship defect is returned to controlled correction rather than entering PRD generation.

## Grounded source

| Source | Location | Exact evidence |
|---|---|---|
| `Resources/eval_prdgenie_inputs.txt` | T4 | “Users need to export reports as PDF and CSV.” |
| Same source | T4 | “PDF must include company logo.” |
| Same source | T4 | “CSV must preserve formulas.” |

## Defect under review

| Item | Presented classification | Ground-truth classification | Review result |
|---|---|---|---|
| `FR-001` report export | Functional requirement | Functional requirement | Approve |
| `FR-002` PDF logo condition | Functional requirement | Acceptance criterion linked to `FR-001` | Reject and correct |
| `FR-003` CSV formula condition | Functional requirement | Acceptance criterion linked to `FR-001` | Reject and correct |

The controlled input reproduces T4’s documented historical semantic defect. It changes no source value and introduces no unsupported claim. Gap Analysis remains `sufficient / proceed` because the information is present; semantic classification and relationship approval remain Human Review responsibilities.

## Expected deterministic decision

| Field | Expected value |
|---|---|
| Review status | `changes_requested` |
| Approved IDs | `FR-001` |
| Rejected IDs | `FR-002`, `FR-003` |
| Failed evidence check | `relationships_verified=false` |
| Next route | `correction` |
| PRD-generation eligible | `false` |
| Model call | None |
| Groundedness target | **100%** |

## Human approval record

| Field | Value |
|---|---|
| Status | **Approved** |
| Reviewer | Vipin |
| Approval date | 2026-08-04 |
| Approval statement | “Approve HA-R02” |
| Case | `HA-R02` |
| Source test | T4 |
