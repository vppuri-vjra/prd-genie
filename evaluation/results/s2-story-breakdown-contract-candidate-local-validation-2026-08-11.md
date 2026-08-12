# S2 Story Breakdown Contract Candidate — Local Validation

## Scope

This evidence covers the additive, inactive **S2 Dynamic Story Breakdown v0.2 — Epic Feature User Story Contract Candidate**. Production parent v0.3.3 and the existing Story Breakdown child remain unchanged.

## Contract implemented

```text
Epic
└── Feature
    └── User Story
        └── Acceptance Criteria
```

Each hierarchy level carries a description, status, approved item IDs, and citations. User stories additionally carry persona, capability, benefit, canonical story text, priority, dependencies, and acceptance criteria. Stakeholders and deadlines remain separate governance mappings. Missing persona specificity and user benefit remain explicit open questions.

## T12-S2 local result

| Artifact/control | Result |
|---|---:|
| Epics | 1 |
| Features | 1 |
| User stories | 1 |
| Acceptance criteria | 2 |
| Governance mappings | 2 |
| Open questions | 2 |
| Approved-item coverage | 4/4 |
| Groundedness | 100% |
| Unsupported claims | 0 |
| JSON/Markdown synchronization | Pass |
| Candidate state | Inactive local export |

## 1. Epic — EPIC-001: Report Filtering

Users should be able to filter reports by date range, category, and status. Results must load in under 2 seconds.

### 1.1 Feature — FEAT-001: Filter Reports

Users should be able to filter reports by date range, category, and status.

#### 1.1.1 User Story — US-001

**As a user, I want to filter reports by date range, category, and status so that TBD - stakeholder input required.**

| Story field | Value |
|---|---|
| Persona | `user` |
| Capability | `filter reports by date range, category, and status` |
| Benefit | `TBD - stakeholder input required` |
| Priority | `Unspecified` |
| Status | `partially_grounded` |
| Approved items | `FR-001`, `NFR-001` |
| Citations | `CIT-T11-01`, `CIT-T11-02` |

**Acceptance criteria**

| # | ID | Criterion | Source |
|---:|---|---|---|
| 1 | `AC-001` | When the user selects a date range, category, or status filter, the displayed report results reflect the selected filter. | `FR-001` |
| 2 | `AC-002` | Report results are displayed in under 2 seconds. | `NFR-001` |

## 2. Governance Mappings

- `GOV-001` stakeholder: Sarah is the PM. (`STK-001`, `CIT-T11-03`)
- `GOV-002` deadline: The deadline is Q3. (`DDL-001`, `CIT-T11-04`)

## 3. Open Questions

- `OQ-001`: Which specific user persona needs report filtering?
- `OQ-002`: What user benefit should report filtering deliver?

## 4. Traceability and Validation Summary

| Control | Result |
|---|---:|
| Approved-item coverage | 4/4 |
| Citation validity | Pass |
| Orphan PRD elements | 0 |
| Orphan delivery items | 0 |
| Unsupported claims | 0 |
| Groundedness | 100% |
| JSON/Markdown synchronization | Pass |

## Native n8n checkpoint

The approved numbered candidate was imported into a fresh inactive n8n workflow and executed against the pinned T12-S2 fixture.

| Field | Result |
|---|---|
| n8n workflow ID | `gEsRGR9NXul5jU4v` |
| n8n execution | `10735` — succeeded in `1.676 s` |
| Approved-item coverage | `4/4` |
| Story-item coverage | `2/2` |
| Governance-item coverage | `2/2` |
| JSON/Markdown synchronization | `true` |
| Orphan PRD elements | `0` |
| Orphan delivery items | `0` |
| Unsupported claims | `0` |
| Groundedness | `100%` |
| Decision / route | `continue` → `final_validation` |
| State | Inactive and unpublished |

Execution `10735` confirms that the professional `1` → `1.1` → `1.1.1` hierarchy renders in the generated Markdown without changing the approved T12-S2 scope or counts.

## Independent Langfuse checkpoint

The numbered contract was combined with the proven Story Breakdown trace transport in a separate inactive candidate. The first run exposed a false-negative contract mismatch in the existing Code Evaluator: it assumed stakeholder and deadline records belonged inside user stories. The approved delivery contract correctly places them in Governance Mappings.

The trace input now projects only story-bearing functional and non-functional requirements into `prd_elements` for the existing Code Evaluator. Stakeholder and deadline records remain authoritative in `source_packet` and remain visible in `governance_mappings`; no generated content or native validation rule was weakened.

| Field | Result |
|---|---|
| n8n candidate workflow ID | `u5265QdzOuF08QF6` |
| Corrected n8n execution | `10737` — succeeded in `2.48 s` |
| Langfuse trace | `46eed7fe423ea35cb5e211ad6563abe8` |
| LLM faithfulness | `1.00` |
| LLM hallucination | `0.00` |
| Code schema valid | `true` |
| Code item coverage | `true` |
| Code citation coverage | `true` |
| Code unsupported claims zero | `true` |
| Code overall evaluation | `true` |
| Candidate state | Inactive and unpublished |

### Acceptance-criteria quality refinement

The inactive candidate was subsequently refined so acceptance criteria express observable or measurable outcomes instead of generic requirement restatements. The final validated wording is:

| ID | Acceptance criterion | Source |
|---|---|---|
| `AC-001` | When the user selects a date range, category, or status filter, the displayed report results reflect the selected filter. | `FR-001` |
| `AC-002` | Report results are displayed in under 2 seconds. | `NFR-001` |

Final validation references:

| Field | Result |
|---|---|
| n8n execution | `10739` — succeeded in `2.45 s` |
| Langfuse trace | `e07d7ce8fccd47e57911ee35134e1d6b` |
| LLM faithfulness | `1.00` |
| LLM hallucination | `0.00` |
| All five Code Evaluator controls | `true` |

## Safety boundary and remaining decision

Local controls, native n8n execution, and independent Langfuse evaluation are complete and green. Production parent v0.3.3 and the existing published Story Breakdown child remain unchanged. Publication, any parent-reference change, and production adoption still require explicit approval after final human review.

## Human acceptance

| Field | Decision |
|---|---|
| Reviewer | Vipin Puri |
| Decision date | 2026-08-11 |
| Accepted candidate | S2 Story Breakdown v0.2.1 numbered contract |
| Accepted execution | `10739` |
| Accepted Langfuse trace | `e07d7ce8fccd47e57911ee35134e1d6b` |
| Decision | Approved as the validated Phase 2 candidate |
| Production authorization | Not granted by this decision |

The human acceptance covers the professional Epic/Feature/User Story hierarchy, the refined observable acceptance criteria, governance mappings, open questions, and the recorded three-layer evaluation results. The workflow remains inactive and unpublished pending a separate production-adoption decision.
