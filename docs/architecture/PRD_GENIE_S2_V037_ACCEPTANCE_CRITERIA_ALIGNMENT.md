# PRD Genie S2 v0.3.7 — Acceptance Criteria Alignment

Status: candidate correction in progress; Agreement Gate traceability finding must pass before promotion
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
| Extractor reconciliation final | S2_ Dynamic Requirement Extractor v0.1.2 - Acceptance Reconciliation Candidate Final | `q7pJlvr8eNHd0g9H` | Superseded browser-edited candidate; unpublished |
| Extractor reconciliation incomplete | S2_ Dynamic Requirement Extractor v0.1.2 - Acceptance Reconciliation Candidate | `lXyJD2RBt78epFy9` | Inactive editor attempt; do not use; not published or deleted |
| Extractor reconciliation clean import | S2_ Dynamic Requirement Extractor v0.1.2 - Acceptance Reconciliation Imported Clean | `FXXpNgmJQfWjKZlV` | Published only as an isolated canary dependency; credentials restored; production reference unchanged |
| Gate reconciliation candidate | S2_ Dynamic Drive and Clarification Gate v0.2.5 - Acceptance Reconciliation Candidate | `bi4Gvq9tNWcQ2wfR` | Published only as an isolated canary dependency; points to `FXXpNgmJQfWjKZlV` |
| Parent reconciliation canary | S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.7 - Deterministic Acceptance Canary | `UfN7nVXaSipRgNz0` | Manual isolated canary; points only its gate call to `bi4Gvq9tNWcQ2wfR` |

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

After explicit approval, extractor `q7pJlvr8eNHd0g9H` and gate `bi4Gvq9tNWcQ2wfR` were published solely for the isolated canary. The rerun `RUN-REALISTIC-CONNECTED-1786758907139` reached the candidate extractor but stopped in its normalization code with `SyntaxError: Unexpected token 'const'`; no Stage 5, downstream generation, or delivery occurred. Browser inspection confirmed that the n8n draft contained editor residue in the normalization line despite the clean repository candidate and passing local contract tests. Both canary dependencies were immediately unpublished after the failed run. Production v0.3.6 and its published extractor/gate references remained unchanged.

### Clean-import reconciliation canary evidence

The repository candidate was imported into a fresh extractor workflow, avoiding the browser-editor residue in the superseded candidate. The clean extractor `FXXpNgmJQfWjKZlV` used OpenAI credential `OpenAI account 25`, model `gpt-5.6-terra`, and Langfuse credential `Langfuse US - PRD Genie`. It and gate `bi4Gvq9tNWcQ2wfR` were published only to support the isolated canary; production v0.3.6 references were not changed.

- Parent execution `11425` succeeded in 1m 48.733s.
- Correlated artifact run: `RUN-S2-11426-16e7090e`.
- PRD hash: `sha256:f86e698aacc55386f70648e00cb2bc3a18c9db10b64a49a5b6077a2d8c2378cd`.
- Stage 5 rendered 11 `FAC-*` criteria grouped beneath all 7 delivery features.
- Stage 6 rendered 11 `SBAC-*` criteria, one for every story, with visible `FAC-*` and PRD-requirement linkage.
- `FEAT-006` / `US-010` included the approved criterion: monthly board-report PDFs contain the company logo at the top of every page, grounded by `CIT-01-0074-640ddf26`.
- Stage 6 validation reported approved-item coverage `37/37`, groundedness `100%`, unsupported claims `0`, JSON/Markdown synchronized, feature acceptance linkage passed, and zero orphan PRD or delivery elements.
- Current-run Langfuse polling completed on attempt 1 with code evaluation passed and faithfulness `0.94`, but hallucination `0.22` exceeded the `0.10` maximum. The Agreement Gate held the run for human review; Stage 7, sizing, and delivery did not execute.

The run proves the acceptance-criteria document shape, but it is not a full-pipeline promotion checkpoint.

### Full-pipeline retry and Stage 6 traceability correction

A controlled retry produced correlated artifact run `RUN-S2-11433-16e7090e`. Deterministic controls and code evaluation passed, and faithfulness scored `0.96`, but story hallucination scored `0.30`; the Agreement Gate again held the run and correctly prevented Stage 7, sizing, and delivery.

Langfuse identified a real display-level traceability defect: detailed Epic, Feature, and User Story source labels still used packet item identifiers while their acceptance tables used canonical PRD identifiers. This produced shifted labels such as a story mapped to canonical `FR-003` displaying `Source: FR-004`, while the artifact claimed JSON/Markdown synchronization.

The local Stage 6 candidate now:

- carries explicit canonical `display_source_ids` on stories, features, and epics;
- renders those same identifiers in every detailed Markdown source line;
- verifies exact story-to-criterion display-source equality;
- fails closed when Epic, Feature, or Story source labels are absent or unsynchronized.

The strengthened Stage 6 contract tests pass locally. This correction must be deployed to the isolated Stage 6 candidate and rerun through the unchanged Agreement Gate before sizing evidence or promotion can be accepted.

### Corrected Stage 6 deployment and canary

The corrected generator and validator code was deployed to isolated Stage 6 workflow `F146WpcfZZVomhq0` and published as `v0.3.7 canonical display-source correction`. No production v0.3.6 workflow was changed.

- Parent execution `11439` completed operationally in 2m 0.39s.
- Correlated artifact run: `RUN-S2-11440-16e7090e`.
- Corrected Stage 6 and its strengthened display-source synchronization checks passed.
- Langfuse completed and `Release Authorized Path` emitted one item, proving the unchanged Agreement Gate authorized the corrected package.
- The parent then terminated without invoking Stage 7 or sizing even though the editor visibly shows the release-to-validator edge.

This isolates the remaining blocker to the candidate parent orchestration/runtime state, not the PRD or Stage 6 document contract. A fresh parent import or equivalent isolated-parent reconstruction is required before the full Stage 7, sizing, and delivery evidence can be accepted.

### Fresh-parent reconstruction evidence

A fresh parent was imported as workflow `TakmnVBH7BPiKWXx`. Only its clarification-gate reference was changed, from the production gate to isolated reconciliation candidate `bi4Gvq9tNWcQ2wfR`, and the reference set was saved as `v0.3.7 fresh isolated parent references`. Production v0.3.6 remained unchanged.

- Parent execution `11460` failed closed when extractor run `RUN-S2-11461-16e7090e` omitted the PDF monthly-board-report requirement.
- Parent execution `11463` passed reconciliation and approval, then failed closed at Stage 5 when run `RUN-S2-11464-16e7090e` omitted persona numbering.
- Parent execution `11469` generated and validated both corrected documents. Correlated artifact run `RUN-S2-11470-16e7090e` passed Stage 5, corrected Stage 6, Langfuse polling, and the Agreement Gate; `Release Authorized Path` emitted one item.
- Execution `11469` again ended after the release node. Stage 7, non-blocking sizing, and Drive delivery were not invoked.

The fresh import rules out stale workflow-editor state as the sole cause. The remaining v0.3.7 blocker is the post-Agreement-Gate routing design itself. Do not treat execution `11469` as full-pipeline acceptance evidence and do not promote v0.3.7 until an isolated routing correction reaches Stage 7, sizing, and delivery in one parent execution.

### Explicit post-gate routing candidate

The isolated parent definition now replaces the parallel release/hold code filters with one explicit boolean router on `production_loop.release_authorized`. Its true output invokes Stage 7; its false output invokes the existing human-review hold formatter. Contract tests verify both destinations and unchanged Stage 5–7 and sizing references.

The corrected definition was imported as unpublished workflow `hkWIZY6MAH4KKpuq`, named `S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.7 - Explicit Post-Gate Routing Candidate`, and pointed only to isolated clarification gate `bi4Gvq9tNWcQ2wfR`. The imported polling handoff was rebuilt and saved as `v0.3.7 rebuilt polling handoff`.

The subsequent controlled canary reached Stage 6 but failed closed before Langfuse or the routing decision. Correlated run `RUN-S2-11491-16e7090e` reported invalid Feature-AC links across the generated story set plus an unused feature acceptance criterion. No Stage 7, sizing, or delivery occurred. The explicit router therefore remains implemented but not yet release-path validated.

A clean import of the tested Stage 6 definition was then saved as unpublished workflow `V1ViUN8DI8YKxxSR` (`S2_ Dynamic Story Breakdown v0.2.6 - Clean Deterministic FAC Linkage Candidate`) and referenced only by isolated parent `hkWIZY6MAH4KKpuq`. Repeated canaries passed the corrected Stage 5 and clean Stage 6 contracts, confirming the earlier invalid-link failure was deployment drift.

The imported parent did not retain a functional polling fan-out. After rebuilding and visually verifying Normalize Scores connections to Complete, Retry, and Timeout, runtime execution still stopped after `Scores Complete Path` on an incomplete first poll. Retry and Timeout were not scheduled. The remaining blocker is therefore the same-output polling fan-out pattern. Replace it with a single deterministic polling decision router (complete / retry / timeout) before attempting further full-pipeline evidence.

An explicit sequential complete/timeout router was tested in isolated workflow `WDfTlgWcGu8yuoRf`, using clean Stage 6 `V1ViUN8DI8YKxxSR`. Correlated document run `RUN-S2-11527-16e7090e` passed Stage 5 and Stage 6, but n8n again terminated at the first decision when its false route re-entered the polling cycle. This confirms the cycle, rather than missing visual connections, is the execution-planning blocker.

The next candidate removes the polling cycle entirely: wait once for 45 seconds, query Langfuse once, normalize once, then invoke the unchanged fail-closed Agreement Gate directly. Missing scores remain a hold, while repeated score API calls and model reruns are eliminated. Local contract tests pass; no additional model canary was launched for this checkpoint.

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
