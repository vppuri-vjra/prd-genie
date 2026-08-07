---
title: PRD Generator Contract
version: 0.1
status: Approved
last_updated: 2026-08-05
owner: Vipin Puri
approved_by: Vipin Puri
approved_on: 2026-08-05
---

# PRD Generator Contract

## Purpose

The PRD Generator converts an approved, grounded product-information package into the official ten-section PRD structure. It formats and organizes approved content; it does not approve requirements, resolve gaps, estimate missing values, or introduce product facts.

## Authoritative sources

| Source | Contract use |
|---|---|
| `Resources/prd_template.md` | Official ten-section PRD structure |
| `schemas/prd-output.schema.json` | Canonical structured output contract |
| `schemas/human-review.schema.json` | Approval decision, approved IDs, conditions and controlled TBDs |
| Approved Requirement Extraction | Source-backed product content and relationships |
| Approved Gap Analysis | Gaps, risks, contradictions and clarification questions |
| Deterministic generation gate | Eligibility and route |
| Human Approval result | Final authority over downstream content |

## Entry contract

| Field | Requirement |
|---|---|
| `schema_version` | `1.0.0` |
| `run_id` | Must equal the extraction, Gap Analysis and Human Approval `run_id` |
| `test_id` | Evaluation identifier, initially `T11` |
| `source_test_id` | Approved upstream source test, initially `T1` |
| `source` | Authoritative source name, location and exact source text |
| `extraction` | Approved Requirement Extraction object |
| `gap_analysis` | Approved Gap Analysis object |
| `generation_gate` | Approved deterministic gate result |
| `human_approval` | Valid Human Approval result |
| `template` | Official template name and version |

## Mandatory entry validation

The PRD Generator may run only when all conditions pass:

1. all stage `run_id` values match;
2. the extraction and Gap Analysis have passed their approved evaluations;
3. the gate route is `human_review` or `human_review_with_tbd`;
4. Human Approval is `approved` or `approved_with_conditions`;
5. Human Approval routes to `prd_generation` or `prd_generation_with_conditions` consistently;
6. every approved item ID exists in the extraction;
7. rejected and unreviewed items are excluded;
8. every controlled TBD and condition is explicitly approved; and
9. the official PRD template and `prd-output.schema.json` are available.

Any failure stops generation visibly. The generator must not repair or guess an invalid entry package.

## Output contract

The generator returns exactly one JSON object conforming to `schemas/prd-output.schema.json` and renders the same content as Markdown using the official ten-section template.

| Output area | Rule |
|---|---|
| Document metadata | Operational metadata may use deterministic values: version `0.1`, author `PRD Genie`, execution date, status `Draft`; an unknown product name remains `TBD - stakeholder input required` |
| Product overview | Grounded summary of approved content, or explicit TBD when no supported overview can be written |
| Goals and objectives | Use approved evidence only; missing business goal, user goal or success metrics remain explicit TBDs |
| User personas | Include only approved persona items; otherwise return an empty array |
| Functional requirements | Include only approved functional-requirement IDs and preserve source traceability |
| Non-functional requirements | Include only approved non-functional-requirement IDs and exact targets |
| Acceptance criteria | Include only approved acceptance-criterion content or a directly testable restatement of an approved requirement without adding behavior |
| Out of scope | Include only explicitly approved exclusions; otherwise return an empty array |
| Dependencies | Include only approved dependencies; unknown fields remain visibly TBD |
| Assumptions | Include only explicit approved assumptions; otherwise return an empty array |
| Open questions | Include approved Gap Analysis questions and controlled TBDs only |
| Timeline | Include approved deadlines exactly; do not convert quarters, months or unknown dates into invented calendar dates |

## Grounding and transformation rules

- Every factual PRD element must link to one or more approved upstream IDs.
- Preserve names, numbers, dates, deadlines, qualifiers, thresholds, API versions and explicitly unknown values exactly.
- A required template field without approved support must use the schema-approved TBD representation or an empty array, never plausible prose.
- A TBD is not a requirement, fact, commitment or estimate.
- Do not infer personas from generic users unless a persona item was approved.
- Do not infer priorities; use `Unspecified` unless an approved source provides one.
- Do not create acceptance criteria that add behavior, scope or thresholds.
- Do not transfer capabilities between personas.
- Do not hide approved risks, gaps, conditions or controlled TBDs.
- Rejected or unreviewed IDs must never appear in the PRD.

## T11 baseline definition

T11 is the required PRD-generation evaluation. It consumes the approved T1 package after `HA-R01 / approved` and produces all ten PRD sections.

| T11 input fact | Approved source |
|---|---|
| Filter reports by date range, category and status | `FR-001` |
| Results load in under 2 seconds | `NFR-001` |
| Sarah is the PM | `STK-001` |
| Deadline is Q3 | `DDL-001` |

All other product facts remain empty or explicit TBD. T11 must not invent a product name, business outcome, success KPI, persona characteristics, current workaround, exclusions, dependencies, assumptions, exact Q3 dates, or additional functionality.

## Evaluation requirements

T11 passes only when:

- the output is schema-valid;
- all ten template sections are represented;
- all approved T1 facts are preserved;
- every factual element is traceable to an approved ID;
- unsupported-claim count is zero;
- exact-value preservation is 100%;
- controlled-TBD handling is correct;
- Markdown and JSON representations agree; and
- the LLM call and validation result are observable in Langfuse.

Contract groundedness target: **100%**.

## August 7 stakeholder-decision coverage

For realistic packet v4, the future PRD input must include the signed `effective_decision_ids` and `decision_disposition_allowlist`. Every effective decision must be represented according to its single disposition, while superseded decisions remain audit evidence and must not be emitted as active requirements.

Each PRD representation must cite the stable decision ID and `Stakeholder Clarification, Vipin, 2026-08-07`, plus original PB/MT/SN evidence where supplied by the decision record. Validation fails closed for less than 100% effective-decision coverage, duplicate or conflicting dispositions, missing citations, stale superseded content, or unsupported PRD content. PRD Generation has not been invoked for this package.

The isolated realistic v4 implementation is deterministic and produces exactly one `prd-output.schema.json` object plus a synchronized Markdown rendering and provenance ledger. Its entry is pinned to Human Approval execution `9724` and trace `f4e298e120d6503b5dfac4688adae1db`. It requires 19/19 approved-item coverage, 17/17 dispositions, 15/15 effective decisions, 2/2 superseded audit-only records, and 6/6 source manifests. The workflow stops before Story Breakdown.
