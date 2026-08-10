---
title: PRD Genie Story Breakdown Contract
version: 2.0.0
status: Realistic v4 Local Candidate; T12 Control Preserved
last_updated: 2026-08-07
owner: Vipin Puri
---

# Story Breakdown Contract

## Purpose

The Story Breakdown Agent converts an approved PRD into traceable epics, features, user stories, and acceptance criteria. It organizes approved product information; it does not invent personas, benefits, priorities, dependencies, technical tasks, or delivery scope.

## Entry contract

The agent may run only when:

1. the PRD contract passed deterministic validation;
2. the PRD was produced from an approved Human Approval package;
3. the PRD contains only approved requirement IDs and controlled TBDs;
4. `run_id` matches the approved PRD run ID; and
5. the caller identifies the evaluation as `T12`.

The first T12 input is the actual T11/T1 release from n8n execution `8621`, grounded at 100%.

## Output hierarchy

`Epic → Feature → User Story → Acceptance Criteria`

Every level carries approved requirement IDs. Each user story also carries the approved PRD acceptance-criteria IDs used to validate it.

## Grounding rules

- Preserve approved names, numbers, thresholds, units, and requirement text.
- Do not create more hierarchy than the approved PRD supports.
- Use `Unspecified` when priority is absent.
- Use `TBD - stakeholder input required` when a mandatory story component is absent.
- Mark a story `partially_grounded` when it contains a controlled TBD.
- Create an unresolved question for each controlled TBD.
- Use only dependencies explicitly present in the approved PRD.
- Reject any output containing unapproved requirement or acceptance-criteria IDs.
- Require `run_id` and `source_prd_run_id` to match deterministically.

## T12 canonical quantities

For the approved T11/T1 PRD, the canonical structure is one epic, one feature, one user story, two acceptance criteria, and two unresolved questions. These quantities are T12-specific, not global limits.

## Deterministic validation

- JSON validates against `schemas/story-breakdown.schema.json` v1.1.0.
- IDs follow `EPIC-###`, `FEAT-###`, `US-###`, `AC-###`, and `OQ-###` conventions.
- Parent-child arrays are non-empty where required.
- Every semantic item has approved source IDs.
- Story acceptance-criteria IDs match the nested acceptance criteria.
- T12 uses only `FR-001`, `NFR-001`, `AC-001`, and `AC-002` for story content.
- Unsupported-claim count is zero.

Groundedness target: **100%**, treating explicit controlled TBDs as safe missing-information handling rather than factual claims.

## Approval

Contract v1.1.0 and the T12 canonical ground truth were approved by Vipin Puri on 2026-08-05 at **100% groundedness**.

## Realistic v4 production route

The realistic route is separate from the unchanged T12 control. Its sole product-content authority is the signed, synchronized PRD from execution `9725`, trace `f8879ebe22d888152a77f892230c62ba`. Entry validation also preserves approval execution `9724`, packet `SP-REALISTIC-PB-MT-SN-CLAR-V4`, run `RUN-REALISTIC-MULTI-SOURCE-V4`, parent trace `26c7466f817aa1511f4a4e239bb52a62`, all six source hashes, and the complete August 7 decision ledger.

The output contract is `schemas/realistic-story-breakdown.schema.json` v2.0.0. It produces `Epic → Feature → User Story → Acceptance Criteria`, a 19-item coverage ledger, non-active scope dispositions, and copied provenance ledgers. Deferred and superseded decisions cannot become active stories. The controlled budget TBD stays metadata only and cannot create a delivery item.

The local canonical candidate contains 3 epics, 4 features, 7 user stories, and 12 acceptance criteria. Every semantic item has approved PRD references; 19/19 approved items are accounted for as active story content, active constraints, dependency/timeline context, or resolved-source audit evidence. Local acceptance requires zero orphans, JSON/Markdown equivalence, 100% groundedness, and zero unsupported claims.

### v0.2 uniqueness rule

After v0.1 execution `9726` falsely counted repeated parent references as duplicate IDs, v0.2 collects and validates IDs once at each hierarchy level: all Epics, all Features, all User Stories, and all Acceptance Criteria. A parent with multiple children is valid. A true duplicate within any of the four levels fails closed. The v0.1 workflow and execution remain retained failure evidence.
