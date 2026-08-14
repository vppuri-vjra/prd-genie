# PRD Genie S2 v0.3.7 — Acceptance Criteria Alignment

Status: candidate design  
Date: 2026-08-14  
Baseline: accepted v0.3.6 production pipeline

## Objective

Make PRD acceptance criteria useful at feature level while preserving the existing user-story acceptance-criteria capability. Establish deterministic PRD-to-feature-to-story linkage without changing intake, extraction, gap analysis, approval, sizing policy, polling, Agreement Gate, credentials, or export controls.

## v0.3.6 finding

- Stage 5 renders one approved source acceptance criterion in PRD Section 5.
- Stage 6 renders one acceptance criterion for each of 11 user stories.
- Several Stage 6 criteria repeat a multi-part requirement for every story created from that requirement.
- The source identifiers displayed in the accepted PRD Markdown and Story Markdown are not consistently aligned because the packet item identifiers and the hard-coded canonical PRD display identifiers are treated as if they were the same namespace.
- Stage 7 verifies that both Markdown documents exist, but does not verify feature-level acceptance coverage or PRD-to-story criterion linkage.

## Minimal v0.3.7 contract

### Stage 5 — feature acceptance criteria

Section 5 groups testable criteria under the same seven deterministic delivery features used by Stage 6:

| Feature ID | Feature | Source requirements | Required criterion coverage |
|---|---|---|---|
| `FEAT-001` | Dashboard Insights | Core-metrics requirement | Five named metrics are displayed |
| `FEAT-002` | Report Filtering | Filtering requirement | Date range, category, and status filters are supported |
| `FEAT-003` | Controlled Data Refresh | Refresh requirement and applicable constraints | Automatic refresh, manual refresh, last-updated timestamp, and repeated-request protection |
| `FEAT-004` | Role-Based Access | Role-access requirement | Executive and team-lead access boundaries |
| `FEAT-005` | Responsive Web Access | Responsive-access requirement | Responsive access is complete before launch |
| `FEAT-006` | PDF Reporting | PDF requirement and approved PDF criterion | Monthly PDF export and company logo on every page |
| `FEAT-007` | Excel Export | XLSX requirement | Formula preservation and the approved action label |

Each feature criterion has:

- a stable `FAC-*` identifier;
- its parent `FEAT-*` identifier and feature title;
- criterion text;
- source packet item identifiers;
- citation identifiers.

The original approved acceptance-criterion source remains in the structured PRD contract and is incorporated into the applicable feature criteria. It is not discarded.

### Stage 6 — preserve and link story criteria

Stage 6 continues to produce acceptance criteria for all 11 stories. Each story criterion additionally records:

- `parent_feature_id`;
- `feature_acceptance_criteria_ids` referencing one or more Stage 5 `FAC-*` records;
- the source packet item identifiers already used for grounding.

Criterion text may be narrowed to the story scope when a source requirement creates multiple stories. This avoids repeating the full refresh or access requirement under every child story while preserving the existing story-criterion count and grounded evidence.

### Stage 7 — fail-closed alignment validation

Stage 7 must reject the package when any of these conditions occurs:

- a delivery feature has no Stage 5 criterion;
- a Stage 5 criterion references an unknown feature or source item;
- a story has no acceptance criterion;
- a story criterion references an unknown Stage 5 feature criterion;
- a story criterion references a criterion belonging to a different parent feature;
- any Stage 5 feature criterion is unused by all stories under its feature;
- PRD or Story Markdown omits the identifiers required by the structured contract.

## Expected unchanged behavior

- 3 Epics / 7 Features / 11 User Stories
- 11 story acceptance criteria
- non-blocking advisory sizing after Stage 7
- seven Production Output files
- manual parent trigger
- current v0.3.6 production workflows remain unchanged until explicit v0.3.7 promotion approval

## Candidate acceptance checks

1. Seven of seven features have feature-level acceptance criteria.
2. Every `FAC-*` record is grounded in approved source items and known citations.
3. Eleven of eleven stories retain at least one `SBAC-*` criterion.
4. Every `SBAC-*` record links to its parent feature and at least one valid `FAC-*` record.
5. Stage 7 reports feature acceptance coverage and story acceptance linkage as passed.
6. The accepted v0.3.6 Stage 1–4 and sizing workflow references are unchanged.
7. No live workflow is published, archived, deleted, or repointed during candidate construction.
