# PRD Genie — Realistic v4 Final Delivery Export

Story Breakdown authority: n8n execution 9727; trace f772ec699a437bc70de67ac124976161.

## Approved PRD summary

# Advanced Analytics Dashboard

Version 1.0 · Approved · 2026-08-07

## 1. Product overview

An analytics dashboard that gives business users visibility into key metrics without requiring SQL or help from the data team. The first release uses a fixed-layout single-page application and includes responsive web access at launch. (`FR-001`, `CON-009`, `CON-010`, `CON-011`, `DEC-2026-08-07-GAP-001`, `DEC-2026-08-07-GAP-014-A1`, `DEC-2026-08-07-MOBILE-LAUNCH-001`)

## 2. Goals and objectives

- Business: Deliver the approved first production release by 2026-09-30 while respecting existing cost constraints.
- User: Provide business users access to dashboard reporting and report filtering without requiring SQL or assistance from the data team.
- Success: Report filtering completes in under 2 seconds.; Dashboard pages load in under 3 seconds.

## 3. User personas

No persona IDs were included in the signed 19-item first-release allowlist.

## 4. Functional requirements

- **FR-001:** Provide a fixed-layout analytics dashboard implemented as a single-page application, with responsive web access completed before the 2026-09-30 production launch. (`FR-001`, `CON-009`, `CON-010`, `CON-011`, `DDL-001`, `DEC-2026-08-07-GAP-001`, `DEC-2026-08-07-GAP-014-A1`, `DEC-2026-08-07-MOBILE-LAUNCH-001`)
- **FR-004:** Use precomputed warehouse data with 15-minute automatic refresh, manual refresh of the latest available precomputed data, a last-updated timestamp, protection against excessive repeated requests, and no direct live-database query. (`FR-004`, `FR-009`, `FR-010`, `CON-003`, `RSK-001`, `DEP-001`, `DEP-002`, `DEC-2026-08-07-GAP-004`, `DEC-2026-08-07-GAP-007`)
- **FR-007:** Allow report filtering by date range, category, and status using precomputed warehouse data. (`FR-007`, `DEP-001`, `DEP-002`, `DEC-2026-08-07-GAP-004`)
- **FR-011:** Generate XLSX with formula preservation and label the user action “Export to Excel”. (`FR-011`, `AC-002`, `CON-004`, `DEC-2026-08-07-GAP-006`)

## 5. Non-functional requirements

- **NFR-002:** Report filtering under 2 seconds; dashboard pages under 3 seconds. (`NFR-002`, `DEC-2026-08-07-GAP-003`)

## 6. Acceptance criteria

- **AC-002:** The generated XLSX preserves spreadsheet formulas and the action label is “Export to Excel”. (`AC-002`, `FR-011`, `CON-004`, `DEC-2026-08-07-GAP-006`)

## 7. Out of scope

- Churn-threshold alerting is deferred until its metric/calculation, measurement period, threshold, recipients, and notification channel are defined. (`DEC-2026-08-07-GAP-002`)
- The undefined AI capability is deferred to a later discovery phase. (`DEC-2026-08-07-GAP-005`)
- Churn prediction is deferred until inputs, users, outputs, feasibility, and minimum accuracy are defined. (`DEC-2026-08-07-GAP-011`)
- White-labeling is deferred to a later release. (`DEC-2026-08-07-GAP-012`)

## 8. Dependencies

- Existing PostgreSQL data warehouse and precomputed reporting data; owner: Raj / Engineering; risk: Dashboard reporting must not query the live database directly. (`DEP-001`, `DEC-2026-08-07-GAP-004`, `DEC-2026-08-07-GAP-007`)
- Optimized query layer; owner: Engineering; risk: Expensive or excessive requests may overload current infrastructure. (`DEP-002`, `CON-003`, `RSK-001`, `DEC-2026-08-07-GAP-007`)

## 9. Assumptions and open questions

- Assumptions: none approved.
- Budget amount remains a non-blocking controlled TBD managed by Sarah by 2026-09-10; product scope must continue to respect existing cost constraints. (`DEC-2026-08-07-GAP-008-A1`)

## 10. Timeline

- **2026-08-21:** Completed dashboard designs; Lisa provides designs and Sarah owns follow-up. (`DDL-002`, `DEC-2026-08-07-GAP-009`, `DEC-2026-08-07-GAP-010`, `DEC-2026-08-07-GAP-013`)
- **2026-09-04:** Internal basic version with fixed layout, five core metrics, precomputed warehouse data, 15-minute automatic refresh, manual refresh, and last-updated timestamp. (`DDL-003`, `DEC-2026-08-07-GAP-010`, `DEC-2026-08-07-GAP-013`)
- **2026-09-30:** First production release with all approved first-release requirements, including responsive web access. (`DDL-001`, `CON-011`, `DEC-2026-08-07-GAP-010`, `DEC-2026-08-07-GAP-013`, `DEC-2026-08-07-MOBILE-LAUNCH-001`)

## Provenance appendix

### Approved item ledger (19/19)

| ID | PRD location | Treatment |
|---|---|---|
| AC-002 | acceptance_criteria.AC-002 | active_or_context |
| CON-003 | dependencies.query_layer | active_or_context |
| CON-004 | functional_requirements.FR-011 | superseded_or_resolved_source_text_not_active |
| CON-009 | functional_requirements.FR-001 | active_or_context |
| CON-010 | functional_requirements.FR-001 (resolved; server-rendered option inactive) | superseded_or_resolved_source_text_not_active |
| CON-011 | functional_requirements.FR-001 and timeline.2026-09-30 | superseded_or_resolved_source_text_not_active |
| DDL-001 | timeline.2026-09-30 | active_or_context |
| DDL-002 | timeline.2026-08-21 | active_or_context |
| DDL-003 | timeline.2026-09-04 | active_or_context |
| DEP-001 | dependencies.warehouse | active_or_context |
| DEP-002 | dependencies.query_layer | active_or_context |
| FR-001 | functional_requirements.FR-001 | active_or_context |
| FR-004 | functional_requirements.FR-004 | active_or_context |
| FR-007 | functional_requirements.FR-007 | active_or_context |
| FR-009 | functional_requirements.FR-004 (resolved; five-second refresh inactive) | superseded_or_resolved_source_text_not_active |
| FR-010 | functional_requirements.FR-004 (resolved; direct live query inactive) | superseded_or_resolved_source_text_not_active |
| FR-011 | functional_requirements.FR-011 | active_or_context |
| NFR-002 | non_functional_requirements.NFR-002 | active_or_context |
| RSK-001 | dependencies.query_layer risk | active_or_context |

### August 7 decision ledger (17/17; 15 effective; 2 superseded audit-only)

| Decision | Disposition | PRD usage | Citation |
|---|---|---|---|
| DEC-2026-08-07-GAP-001 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-001 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-002 | deferred_out_of_first_release | out_of_scope | DEC-2026-08-07-GAP-002 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-003 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-003 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-004 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-004 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-005 | deferred_out_of_first_release | out_of_scope | DEC-2026-08-07-GAP-005 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-006 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-006 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-007 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-007 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-008 | superseded | superseded_audit_only | DEC-2026-08-07-GAP-008 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-009 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-009 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-010 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-010 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-011 | deferred_out_of_first_release | out_of_scope | DEC-2026-08-07-GAP-011 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-012 | deferred_out_of_first_release | out_of_scope | DEC-2026-08-07-GAP-012 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-013 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-013 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-014 | superseded | superseded_audit_only | DEC-2026-08-07-GAP-014 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-008-A1 | controlled_tbd | controlled_tbd | DEC-2026-08-07-GAP-008-A1 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-GAP-014-A1 | included_first_release | active_prd_item | DEC-2026-08-07-GAP-014-A1 — Stakeholder Clarification, Vipin, 2026-08-07 |
| DEC-2026-08-07-MOBILE-LAUNCH-001 | included_first_release | active_prd_item | DEC-2026-08-07-MOBILE-LAUNCH-001 — Stakeholder Clarification, Vipin, 2026-08-07 |

### Six-source manifest

| Source ID | Type | SHA-256 |
|---|---|---|
| SRC-REALISTIC-PB-001 | product_brief | sha256:a8f93fd8b88bd8e52b69197b378cf655be87d88a34d020ce992df6acd6e33ce5 |
| SRC-REALISTIC-MT-001 | meeting_transcript | sha256:15111349acf5fa92a2f5a33cbbedfc06765e2bb341473d451c49d5123f49dcc8 |
| SRC-REALISTIC-SN-001 | stakeholder_notes | sha256:c4b9737007fdce22f23f293634a5a7caa23732848624e874184a4be76fb1fa68 |
| SRC-REALISTIC-CLAR-001 | stakeholder_clarification | sha256:a10d68b226cf1f4ac48dc1c08ddc6205e137146657db035c3cae5da46dad5300 |
| SRC-REALISTIC-CLAR-AMEND-001 | stakeholder_clarification | sha256:4bb1edb4d3a13f0868bf3e13ff3a618db073b84d0d7e38f0a5d27860d9e49d16 |
| SRC-REALISTIC-CLAR-MOBILE-001 | stakeholder_clarification | sha256:390014408db99fa1f85d469d269c0819f002f63ab41ae7738b287fc3bcdbc883 |

Groundedness: **100%**. Unsupported claims: **0**.


---

## Epic / Feature / User Story / Acceptance Criterion hierarchy

# Advanced Analytics Dashboard — Story Breakdown

Authority: PRD execution `9725` · PRD trace `f8879ebe22d888152a77f892230c62ba`

## Delivery hierarchy

## EPIC-001: Dashboard Experience
Deliver the approved fixed-layout single-page dashboard with responsive web access at launch and approved page-load performance.
Sources: `FR-001`, `NFR-002`, `DEC-2026-08-07-GAP-001`, `DEC-2026-08-07-GAP-003`, `DEC-2026-08-07-GAP-014-A1`, `DEC-2026-08-07-MOBILE-LAUNCH-001`

### FEAT-001: Responsive Single-Page Dashboard
Provide the approved fixed-layout SPA and responsive web access for the first production release.

#### US-001: Use the approved dashboard experience
As a business user, I want a fixed-layout single-page analytics dashboard so that I can access dashboard reporting without requiring SQL or help from the data team.

Acceptance criteria:
- [ ] SBAC-001: The dashboard uses a fixed layout. (`DEC-2026-08-07-GAP-001`)
- [ ] SBAC-002: The dashboard is implemented as a single-page application. (`DEC-2026-08-07-GAP-014-A1`)
Sources: `FR-001`, `CON-009`, `CON-010`, `DEC-2026-08-07-GAP-001`, `DEC-2026-08-07-GAP-014-A1`

#### US-002: Access the dashboard responsively at launch
As a business user, I want responsive web access so that I can use the first production release through responsive web access.

Acceptance criteria:
- [ ] SBAC-003: Responsive web access is completed before the 2026-09-30 production launch. (`FR-001`, `DDL-001`, `DEC-2026-08-07-MOBILE-LAUNCH-001`)
Sources: `FR-001`, `CON-011`, `DDL-001`, `DEC-2026-08-07-MOBILE-LAUNCH-001`

#### US-003: Load dashboard pages within the approved limit
As a business user, I want dashboard pages to load in under 3 seconds so that I can access dashboard reporting within the approved page-load limit.

Acceptance criteria:
- [ ] SBAC-004: Dashboard pages load in under 3 seconds. (`NFR-002`, `DEC-2026-08-07-GAP-003`)
Sources: `NFR-002`, `DEC-2026-08-07-GAP-003`

## EPIC-002: Warehouse-Backed Reporting
Provide approved reporting from precomputed warehouse data with controlled refresh and filtering performance.
Sources: `FR-004`, `FR-007`, `FR-009`, `FR-010`, `NFR-002`, `CON-003`, `DEP-001`, `DEP-002`, `RSK-001`, `DEC-2026-08-07-GAP-003`, `DEC-2026-08-07-GAP-004`, `DEC-2026-08-07-GAP-007`

### FEAT-002: Controlled Data Refresh
Use the approved precomputed warehouse and hybrid refresh behavior without direct live-database queries.

#### US-004: Receive refreshed warehouse reporting data
As a business user, I want reporting data to refresh automatically every 15 minutes so that I can view the latest available precomputed warehouse data.

Acceptance criteria:
- [ ] SBAC-005: Dashboard reporting uses precomputed warehouse data. (`FR-004`, `DEP-001`, `DEC-2026-08-07-GAP-004`)
- [ ] SBAC-006: Automatic refresh runs every 15 minutes. (`FR-004`, `DEC-2026-08-07-GAP-007`)
Sources: `FR-004`, `FR-009`, `DEP-001`, `DEC-2026-08-07-GAP-004`, `DEC-2026-08-07-GAP-007`

#### US-005: Refresh the latest available data manually
As a business user, I want to manually refresh the latest available precomputed warehouse data so that I can see its last-updated timestamp.

Acceptance criteria:
- [ ] SBAC-007: Manual refresh returns the latest available precomputed warehouse data and shows a last-updated timestamp. (`FR-004`, `DEC-2026-08-07-GAP-007`)
- [ ] SBAC-008: Refresh protects against excessive repeated requests and does not query the live database directly. (`FR-004`, `FR-010`, `CON-003`, `RSK-001`, `DEC-2026-08-07-GAP-007`)
Sources: `FR-004`, `FR-010`, `CON-003`, `DEP-001`, `DEP-002`, `RSK-001`, `DEC-2026-08-07-GAP-007`

### FEAT-003: Report Filtering
Filter reporting by the approved fields using precomputed warehouse data within the approved response limit.

#### US-006: Filter reports
As a business user, I want to filter reports by date range, category, and status so that I can access the approved filtered reporting.

Acceptance criteria:
- [ ] SBAC-009: Reports can be filtered by date range, category, and status using precomputed warehouse data. (`FR-007`, `DEP-001`, `DEC-2026-08-07-GAP-004`)
- [ ] SBAC-010: Report filtering completes in under 2 seconds. (`NFR-002`)
Sources: `FR-007`, `NFR-002`, `DEP-001`, `DEP-002`, `DEC-2026-08-07-GAP-003`, `DEC-2026-08-07-GAP-004`

## EPIC-003: Excel Export
Provide the approved XLSX export with formula preservation and the approved user-facing label.
Sources: `FR-011`, `AC-002`, `CON-004`, `DEC-2026-08-07-GAP-006`

### FEAT-004: Export to Excel
Generate XLSX with formula preservation.

#### US-007: Export reporting to Excel
As a business user, I want to use the “Export to Excel” action so that I can receive an XLSX that preserves spreadsheet formulas.

Acceptance criteria:
- [ ] SBAC-011: The action is labeled “Export to Excel”. (`FR-011`, `DEC-2026-08-07-GAP-006`)
- [ ] SBAC-012: The generated XLSX preserves spreadsheet formulas. (`AC-002`, `FR-011`, `CON-004`, `DEC-2026-08-07-GAP-006`)
Sources: `FR-011`, `AC-002`, `CON-004`, `DEC-2026-08-07-GAP-006`

## Non-active scope dispositions

- **DEC-2026-08-07-GAP-002 — deferred:** Explicitly outside the first-release delivery scope.
- **DEC-2026-08-07-GAP-005 — deferred:** Explicitly outside the first-release delivery scope.
- **DEC-2026-08-07-GAP-008 — superseded:** Preserved for audit only; the effective August 7 decision governs.
- **DEC-2026-08-07-GAP-011 — deferred:** Explicitly outside the first-release delivery scope.
- **DEC-2026-08-07-GAP-012 — deferred:** Explicitly outside the first-release delivery scope.
- **DEC-2026-08-07-GAP-014 — superseded:** Preserved for audit only; the effective August 7 decision governs.
- **DEC-2026-08-07-GAP-008-A1 — controlled_tbd:** Budget remains metadata only: non-blocking, owner Sarah, due 2026-09-10.

## Coverage and provenance

- Approved scope: 19/19
- Sources: 6/6 with hashes preserved
- August 7 decisions: 17/17 preserved; superseded and deferred records remain non-active
- Controlled budget TBD remains metadata only

Groundedness: **100%**. Unsupported claims: **0**.


---

## Final provenance and decision appendix

- Packet: SP-REALISTIC-PB-MT-SN-CLAR-V4
- Run: RUN-REALISTIC-MULTI-SOURCE-V4
- Parent trace: 26c7466f817aa1511f4a4e239bb52a62
- Approval: 9724 / f4e298e120d6503b5dfac4688adae1db
- PRD: 9725 / f8879ebe22d888152a77f892230c62ba
- Story Breakdown: 9727 / f772ec699a437bc70de67ac124976161

All 6 source hashes and all 17 decision dispositions are preserved in the structured companion artifact.

Groundedness: 100%. Unsupported claims: 0.
