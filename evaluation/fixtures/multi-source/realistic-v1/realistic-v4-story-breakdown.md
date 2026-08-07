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
