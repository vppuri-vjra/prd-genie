# PRD Genie S2 v0.3.7 — Acceptance Criteria Alignment

Status: candidate design  
Date: 2026-08-14  
Baseline: accepted v0.3.6 production pipeline

## Inactive n8n candidates

| Stage | Candidate | Live n8n ID | State |
|---:|---|---|---|
| 5 | S2_ Dynamic Production PRD v0.2.2 - Feature Acceptance Criteria Candidate | `gZSMQFpQsGqD87Kb` | Superseded initial candidate; unpublished |
| 6 | S2_ Dynamic Story Breakdown v0.2.6 - Feature Acceptance Linkage Candidate | `1bcsB4FVVqzR9rK6` | Superseded initial candidate; unpublished |
| 7 | S2_ Dynamic Final Validator and Export v0.4 - Acceptance Alignment Candidate | `GotMdQ0eX6zbYwki` | Saved, unpublished |
| Parent | S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.7 - Acceptance Alignment Candidate | `aYhgzgSqO8bmv9IO` | Saved manual-trigger candidate, unpublished |
| 5 corrected | S2_ Dynamic Production PRD v0.2.2 - Feature Acceptance Criteria Candidate | `Ru10SyTRsErg8rFT` | Corrected fresh candidate; unpublished |
| 6 corrected | S2_ Dynamic Story Breakdown v0.2.6 - Feature Acceptance Linkage Candidate | `MH7mokMz6lrBDZCp` | Corrected fresh candidate; unpublished |
| 5 final | S2_ Dynamic Production PRD v0.2.2 - Feature Acceptance Criteria Candidate | `FszzWnuH2GEljqsC` | Final logo-evidence candidate; unpublished |
| 6 final | S2_ Dynamic Story Breakdown v0.2.6 - Feature Acceptance Linkage Candidate | `F146WpcfZZVomhq0` | Final logo-evidence candidate; unpublished |
| Parent final | S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.7 - Acceptance Alignment Candidate | `EQ5eV8mGkDUwahmu` | Final logo-evidence parent; unpublished |
| Extractor reconciliation final | S2_ Dynamic Requirement Extractor v0.1.2 - Acceptance Reconciliation Candidate Final | `q7pJlvr8eNHd0g9H` | Inactive packet-scoped deterministic candidate; unpublished |
| Extractor reconciliation incomplete | S2_ Dynamic Requirement Extractor v0.1.2 - Acceptance Reconciliation Candidate | `lXyJD2RBt78epFy9` | Inactive editor attempt; do not use; not published or deleted |
| Gate reconciliation candidate | S2_ Dynamic Drive and Clarification Gate v0.2.5 - Acceptance Reconciliation Candidate | `bi4Gvq9tNWcQ2wfR` | Inactive; points only its extractor call to `q7pJlvr8eNHd0g9H` |
| Parent reconciliation canary | S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.7 - Deterministic Acceptance Canary | `UfN7nVXaSipRgNz0` | Inactive; points only its gate call to `bi4Gvq9tNWcQ2wfR` |

The accepted v0.3.6 parent and published Stage 5–7 workflows remain unchanged.

## Initial canary evidence

- First attempt: parent execution `11346`; failed closed in the unchanged clarification gate because the extractor returned malformed JSON. No Stage 5–7, sizing, or delivery execution occurred.
- Controlled retry: parent execution `11349`; correlated run `RUN-S2-11350-16e7090e`; succeeded in 2m 41.468s.
- Stage 5 execution `11354`, Stage 6 execution `11355`, Stage 7 execution `11356`, and unchanged sizing execution `11357` all succeeded.
- Agreement Gate: Release Authorized.
- Structure: 3 Epics / 7 Features / 11 User Stories / 11 story acceptance criteria.
- Stage 7 reported feature acceptance coverage and story acceptance linkage as passed.
- Seven Production Output files were delivered.
- PRD hash for the acceptance-aligned document: `sha256:63be9faa84ec21b988b2fce24b0643ca9b579c95f06d60f9df96c53803563fe6`.

### Human artifact review disposition

The canary passed its machine controls but is **not accepted for promotion**. Visual review identified three corrections:

1. PRD Section 5 displays packet source IDs while Section 4 displays canonical PRD requirement IDs, producing visible mismatches such as `FR-002` versus `FR-001` for Dashboard Insights.
2. Story Markdown preserves all 11 `SBAC-*` criteria but does not display their `FAC-*` linkage.
3. Stories split from the refresh and access requirements repeat the complete parent requirement rather than using story-scoped criterion text.

The next candidate revision must correct all three issues and rerun before GitHub publication or production promotion.

### Final logo-evidence candidate attempts

- Parent execution `11395`: Stages 5 and 6 passed; held safely at Langfuse score polling before Stage 7; no delivery.
- Parent execution `11402`: Stages 5 and 6 passed; held safely at Langfuse score polling before Stage 7; no delivery.
- Third attempt, correlated run `RUN-S2-11410-16e7090e`: Stage 5 failed closed because the current extractor output omitted the required PDF-logo acceptance evidence. Error: `Missing required acceptance evidence for FEAT-006 / Export monthly board reports to PDF`. No Stage 6, Stage 7, sizing, or delivery occurred.

The final candidate behaves as intended: it will not render the logo condition unless both the PDF-export requirement and approved company-logo criterion are present in the current approved packet. This exposes an upstream extraction-repeatability issue; weakening the Stage 5 evidence control is not acceptable.

### Extractor repeatability diagnosis

A read-only comparison of extractor executions `11384` (successful) and `11411` (failed) isolates the issue upstream of Stage 5:

- Both executions received citation `CIT-01-0074-640ddf26` with the same source sentence requiring the company logo at the top of every PDF page.
- Execution `11384` emitted `For the PDF export, it must include the company logo at the top of every page.` as a standalone extracted acceptance criterion.
- Execution `11411` retained the source sentence and citation in its evidence inventory but emitted only the broader requirement `Export to PDF for monthly board reports`; the logo condition was absent from the current extracted requirement set.
- Therefore Stage 5 correctly failed closed. The defect is nondeterministic omission by the dynamic requirement extractor, not Stage 5 rendering, Stage 6 linkage, or Stage 7 validation.

The minimal next candidate should make extraction of this approved criterion deterministic (or deterministically reconcile it from the citation inventory) before the v0.3.7 end-to-end canary is accepted. Production v0.3.6 remains unchanged.

The inactive final extractor candidate `q7pJlvr8eNHd0g9H` implements that reconciliation only for canonical packet `SP-S2-16e7090e7027e2d1`. It requires the exact approved logo citation and the PDF monthly-board-report functional requirement, creates the criterion only when the model omitted it, restores bidirectional requirement linkage, and rebuilds the coverage ledger from emitted evidence. Missing approved evidence still fails closed. The published extractor `IiXGaUC7gCHwZmzI` and production v0.3.6 were not changed.

The first isolated parent canary from `UfN7nVXaSipRgNz0` stopped at the gate handoff with `Workflow is not active and cannot be executed.` The correlated run ID was `RUN-REALISTIC-CONNECTED-1786758779698`; no extraction, Stage 5, downstream generation, or delivery occurred. This is an activation prerequisite, not a contract failure. Publishing the extractor and gate candidates requires explicit approval before the canary can continue.

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
