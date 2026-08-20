# Product Requirements Document (PRD)

## 1. Product Overview

- **Product Name:** TBD - stakeholder input required
- **Document Version:** 0.3
- **Author:** PRD Genie
- **Date:** 2026-08-18
- **Status:** Draft

A proposed analytics experience for business analysts, team leads, executives, and customers, providing source-supported capabilities for viewing, filtering, reporting, exporting, and role-appropriate access where those capabilities are present in the approved requirements.
- **Classification:** derived_proposal
- **Approval status:** pending_stakeholder_confirmation
- **Derived from:** approved_personas_and_requirements
- **Sources:** PER-001, PER-002, PER-003, FR-001, FR-002, FR-003, FR-004, FR-005, FR-008, FR-009

### Stakeholder Context

- Sarah is the PM owner. — CIT-01-0024-8f753880
- Vipin is the Decision maker. — CIT-04-0003-a9459794

## 2. Goals and Objectives

### 2.1 Proposed Business Goal

Provide an analytics experience that reduces dependence on manual Excel exports and gives teams and executives access to relevant performance information.

- **Classification:** derived_proposal
- **Approval status:** pending_stakeholder_confirmation
- **Derived from:** approved_personas_and_requirements
- **Sources:** PER-001, PER-002, PER-003, FR-001, FR-002, FR-003, FR-004, FR-005, FR-008, FR-009

### 2.2 Proposed User Goal

Enable business analysts, team leads, executives, and customers to access, filter, review, and export information appropriate to their approved needs and permissions.

- **Classification:** derived_proposal
- **Approval status:** pending_stakeholder_confirmation
- **Derived from:** approved_personas_and_requirements
- **Sources:** PER-001, PER-002, PER-003, FR-001, FR-002, FR-003, FR-004, FR-005, FR-008, FR-009

### 2.3 Success Metrics

TBD - stakeholder input required

## 3. User Personas

### 3.1 Business Analysts
- **Name / Role:** Business Analysts
- **Key Need:** TBD - stakeholder input required
- **Current Workaround:** Exporting data to Excel.
- **Sources:** PER-001

### 3.2 Team Leads
- **Name / Role:** Team Leads
- **Key Need:** Review weekly performance summaries.
- **Current Workaround:** TBD - stakeholder input required
- **Sources:** PER-002

### 3.3 Executives
- **Name / Role:** Executives
- **Key Need:** Obtain a high-level performance overview without reviewing detailed underlying information.
- **Current Workaround:** TBD - stakeholder input required
- **Sources:** PER-003

## 4. Feature Requirements

### 4.1 Functional Requirements

| ID | Requirement | Priority (Must/Should/Nice) | Source |
|---|---|---|---|
| FR-001 | Dashboard should display 5 core metrics: revenue, active users, churn rate, NPS score, and support ticket volume | Should Have | CIT-05-0016-13c3d894 |
| FR-002 | Users should be able to filter by date range (last 7 days, 30 days, 90 days, custom) | Should Have | CIT-05-0017-f0ae7fbb, CIT-01-0012-f394e26d |
| FR-003 | Must support role-based access: executives see all data, team leads see their team only | Must Have | CIT-05-0019-192d5768 |
| FR-004 | Export to PDF for monthly board reports | Unspecified | CIT-05-0020-1d09d883 |
| FR-005 | DEC-2026-08-07-GAP-006: Generate XLSX with formula preservation and label the action “Export to Excel”; this supersedes the earlier proposed “Export to CSV” label. | Unspecified | CIT-04-0015-1afd65a7 |
| FR-006 | DEC-2026-08-07-GAP-007: Hybrid refresh: 15-minute automatic refresh plus manual refresh of the latest available precomputed warehouse data, a last-updated timestamp, and protection against excessive repeated requests; no direct live-database query. | Unspecified | CIT-04-0016-40b68902 |
| FR-007 | The September 30, 2026 first production release must include responsive web access. The team may use a desktop-first design and implementation sequence, but mobile responsiveness must be completed before production launch. There will not be a separate post-launch mobile fast-follow for this requirement. | Must Have | CIT-02-0009-2d08dd05 |
| FR-008 | Customers want to see their own data, filtered by their account. Multi-tenant support is critical. | Must Have | CIT-03-0048-a08820dd |
| FR-009 | Search and filtering are more important than adding new metrics. | Unspecified | CIT-03-0052-07cf02a7 |
| FR-010 | Can we add dark mode? Users have asked for it. Not critical but would be nice. | Nice to Have | CIT-03-0028-ced5beb1 |

### 4.2 Non-Functional Requirements

| ID | Requirement | Category | Target | Source |
|---|---|---|---|---|
| NFR-001 | DEC-2026-08-07-GAP-003: Dashboard pages must load in under 3 seconds. | performance | dashboard pages | CIT-04-0012-5b02e9d8 |
| NFR-002 | Must integrate with our existing PostgreSQL data warehouse | integration | existing PostgreSQL data warehouse | CIT-05-0023-03dc5cc5, CIT-04-0013-23ba34cb |
| CON-001 | DEC-2026-08-07-GAP-001: Fixed dashboard layout for the first release. | Constraint | first release | CIT-04-0010-d836cb1c |
| CON-002 | DEC-2026-08-07-GAP-004: Use precomputed warehouse data for dashboard reporting. | Constraint | dashboard reporting | CIT-04-0013-23ba34cb, CIT-04-0016-40b68902 |
| CON-003 | Cannot use any third-party analytics tools (licensing cost concern) | Constraint | analytics dashboard | CIT-05-0024-75961f04 |
| CON-004 | DEC-2026-08-07-GAP-005: Defer the undefined AI capability to a later discovery phase. | Constraint | AI capability | CIT-04-0014-09e1bf53 |
| CON-005 | DEC-2026-08-07-GAP-011: Defer churn prediction to a later discovery phase until inputs, users, outputs, feasibility, and minimum accuracy are defined. | Constraint | churn prediction | CIT-04-0020-650c4856 |
| CON-006 | DEC-2026-08-07-GAP-012: Defer white-labeling to a later release. | Constraint | white-labeling | CIT-04-0021-90f304b5 |
| CON-007 | Product scope must continue to respect the existing cost constraints. | Constraint | product scope | CIT-06-0010-0d7c9006 |
| CON-008 | DEC-2026-08-07-GAP-014-A1: Use a single-page application (SPA) for the analytics dashboard. | Constraint | analytics dashboard | CIT-06-0011-cd539c06 |

## 5. Acceptance Criteria

### 5.1 FEAT-001 — Dashboard Insights

- [ ] **FAC-001:** The dashboard displays revenue, active users, churn rate, NPS score, and support ticket volume.
  - Story scope: Display five core metrics
  - PRD requirement: FR-001
  - Evidence: CIT-05-0016-13c3d894

### 5.2 FEAT-002 — Report Filtering

- [ ] **FAC-002:** Reports can be filtered using the approved preset and custom date ranges, category, and status.
  - Story scope: Preset and custom date-range filtering
  - PRD requirement: FR-002
  - Evidence: CIT-05-0017-f0ae7fbb, CIT-01-0012-f394e26d

### 5.3 FEAT-003 — Controlled Data Refresh

- [ ] **FAC-003:** Approved precomputed dashboard data refreshes automatically every 15 minutes.
  - Story scope: 15-minute automatic refresh
  - PRD requirement: FR-006, CON-002
  - Evidence: CIT-04-0016-40b68902, CIT-04-0013-23ba34cb
- [ ] **FAC-004:** A user can manually refresh the latest available precomputed warehouse data without querying the live database.
  - Story scope: Manual refresh of latest precomputed data
  - PRD requirement: FR-006, CON-002
  - Evidence: CIT-04-0016-40b68902, CIT-04-0013-23ba34cb
- [ ] **FAC-005:** The dashboard displays the timestamp of the most recent completed data refresh.
  - Story scope: Display last-updated timestamp
  - PRD requirement: FR-006
  - Evidence: CIT-04-0016-40b68902
- [ ] **FAC-006:** The refresh control protects the system from excessive repeated requests.
  - Story scope: Protect against excessive repeated requests
  - PRD requirement: FR-006
  - Evidence: CIT-04-0016-40b68902

### 5.4 FEAT-004 — Role-Based Access

- [ ] **FAC-007:** Executives can access all approved dashboard data.
  - Story scope: Executive access to all data
  - PRD requirement: FR-003
  - Evidence: CIT-05-0019-192d5768
- [ ] **FAC-008:** Team leads can access only data for their own team.
  - Story scope: Team-lead access to team data only
  - PRD requirement: FR-003
  - Evidence: CIT-05-0019-192d5768

### 5.5 FEAT-005 — Responsive Web Access

- [ ] **FAC-009:** Responsive web access is completed before the September 30, 2026 production launch.
  - Story scope: Responsive web access completed before production launch
  - PRD requirement: FR-007
  - Evidence: CIT-02-0009-2d08dd05

### 5.6 FEAT-006 — PDF Reporting

- [ ] **FAC-010:** Monthly board reports can be exported to PDF with the company logo at the top of every page.
  - Story scope: Export monthly board reports to PDF
  - PRD requirement: FR-004, AC-001
  - Evidence: CIT-05-0020-1d09d883, CIT-01-0074-640ddf26

### 5.7 FEAT-007 — Excel Export

- [ ] **FAC-011:** The approved “Export to Excel” action produces an XLSX file with formulas preserved.
  - Story scope: Export XLSX with formulas preserved and approved label
  - PRD requirement: FR-005
  - Evidence: CIT-04-0015-1afd65a7


## 6. Out of Scope

No out-of-scope items were specified in the approved inputs.

## 7. Dependencies and Risks

### 7.1 Dependencies

No dependencies were specified in the approved inputs.

### 7.2 Risks

- **RSK-001:** If we don't ship by Q3, we risk losing at least one of them.
  - **Source:** CIT-03-0036-7e47b30a

## 8. Assumptions

No assumptions were specified in the approved inputs.

## 9. Open Questions

No approved open questions were supplied.

## 10. Timeline

| Milestone | Target Date | Source |
|---|---|---|
| Designs complete | 2026-08-21 | CIT-04-0019-c3fc98ac |
| internal basic version | 2026-09-04 | CIT-04-0019-c3fc98ac |
| launch | 2026-09-30 | CIT-04-0019-c3fc98ac |
| Sarah will manage the budget separately | 2026-09-10 | CIT-06-0010-0d7c9006 |
