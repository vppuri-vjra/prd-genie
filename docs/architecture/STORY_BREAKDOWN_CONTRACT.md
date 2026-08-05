---
title: PRD Genie Story Breakdown Contract
version: 1.1.0
status: Approved for T12 Implementation
last_updated: 2026-08-05
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
