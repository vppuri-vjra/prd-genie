# Source-to-Delivery Citation Traceability Matrix

This matrix provides bidirectional traceability from source evidence and stakeholder decisions through the approved PRD and delivery hierarchy.

Authority: PRD execution `9725` · PRD trace `f8879ebe22d888152a77f892230c62ba` · Story Breakdown workflow `MEm1VyILsMyn53HU`

## Active first-release delivery scope

| Source document | Citation | PRD requirement(s) | Epic | Feature | User story | Acceptance criterion | Decision / provenance | Status |
|---|---|---|---|---|---|---|---|---|
| `product-brief.txt`; `stakeholder-notes.txt`; stakeholder clarification | PB `line:8`; SN `line:24`; clarification `line:10`; amendment `line:11` | `FR-001`, `CON-009`, `CON-010` | `EPIC-001` Dashboard Experience | `FEAT-001` Responsive Single-Page Dashboard | `US-001` Use the approved dashboard experience | `SBAC-001` Fixed layout; `SBAC-002` SPA | `DEC-2026-08-07-GAP-001`; `DEC-2026-08-07-GAP-014-A1` | Active first release |
| `product-brief.txt`; `meeting-transcripts.txt`; `stakeholder-notes.txt`; mobile clarification | PB `lines:8,26`; MT `line:24`; SN `lines:26,36`; mobile clarification `line:9` | `FR-001`, `CON-011`, `DDL-001` | `EPIC-001` Dashboard Experience | `FEAT-001` Responsive Single-Page Dashboard | `US-002` Access the dashboard responsively at launch | `SBAC-003` Responsive web access before `2026-09-30` | `DEC-2026-08-07-MOBILE-LAUNCH-001` | Active first release |
| `meeting-transcripts.txt`; stakeholder clarification | MT `line:16`; clarification `line:12` | `NFR-002` | `EPIC-001` Dashboard Experience | `FEAT-001` Responsive Single-Page Dashboard | `US-003` Load dashboard pages within the approved limit | `SBAC-004` Page load under three seconds | `DEC-2026-08-07-GAP-003` | Active first release |
| `product-brief.txt`; `meeting-transcripts.txt`; stakeholder clarification | PB `lines:18,23`; MT `lines:52,62`; clarification `lines:13,16` | `FR-004`, `FR-009`, `DEP-001` | `EPIC-002` Warehouse-Backed Reporting | `FEAT-002` Controlled Data Refresh | `US-004` Receive refreshed warehouse reporting data | `SBAC-005` Precomputed warehouse data; `SBAC-006` 15-minute automatic refresh | `DEC-2026-08-07-GAP-004`; `DEC-2026-08-07-GAP-007`; five-second refresh superseded | Active first release |
| `product-brief.txt`; `meeting-transcripts.txt`; `stakeholder-notes.txt`; stakeholder clarification | PB `lines:18,23`; MT `lines:56,58,64`; SN `line:10`; clarification `lines:13,16` | `FR-004`, `FR-010`, `CON-003`, `DEP-001`, `DEP-002`, `RSK-001` | `EPIC-002` Warehouse-Backed Reporting | `FEAT-002` Controlled Data Refresh | `US-005` Refresh the latest available data manually | `SBAC-007` Latest data and timestamp; `SBAC-008` Request protection and no live query | `DEC-2026-08-07-GAP-004`; `DEC-2026-08-07-GAP-007`; direct live query inactive | Active first release |
| `meeting-transcripts.txt`; `product-brief.txt`; `stakeholder-notes.txt`; stakeholder clarification | MT `lines:12,16`; PB `line:23`; SN `line:10`; clarification `line:13` | `FR-007`, `NFR-002`, `DEP-001`, `DEP-002` | `EPIC-002` Warehouse-Backed Reporting | `FEAT-003` Report Filtering | `US-006` Filter reports | `SBAC-009` Date/category/status filters; `SBAC-010` Filtering under two seconds | `DEC-2026-08-07-GAP-003`; `DEC-2026-08-07-GAP-004` | Active first release |
| `meeting-transcripts.txt`; stakeholder clarification | MT `lines:74,82`; clarification `line:15` | `FR-011`, `AC-002`, `CON-004` | `EPIC-003` Excel Export | `FEAT-004` Export to Excel | `US-007` Export reporting to Excel | `SBAC-011` “Export to Excel” label; `SBAC-012` XLSX formula preservation | `DEC-2026-08-07-GAP-006`; prior CSV label superseded | Active first release |

## Non-active dispositions

| Decision | Status | Delivery treatment |
|---|---|---|
| `DEC-2026-08-07-GAP-002` | Deferred | No Epic, Feature, Story, or acceptance criterion |
| `DEC-2026-08-07-GAP-005` | Deferred | No Epic, Feature, Story, or acceptance criterion |
| `DEC-2026-08-07-GAP-008` | Superseded | Audit evidence only |
| `DEC-2026-08-07-GAP-011` | Deferred | No Epic, Feature, Story, or acceptance criterion |
| `DEC-2026-08-07-GAP-012` | Deferred | No Epic, Feature, Story, or acceptance criterion |
| `DEC-2026-08-07-GAP-014` | Superseded | Audit evidence only; effective SPA amendment governs |
| `DEC-2026-08-07-GAP-008-A1` | Controlled TBD | Budget metadata only; non-blocking; owner Sarah; due `2026-09-10` |

## Coverage

- Approved PRD items accounted for: **19/19**
- Source manifests preserved: **6/6**
- Epics / Features / User Stories / Acceptance Criteria: **3 / 4 / 7 / 12**
- Orphan delivery items: **0**
- Active deferred, superseded, or controlled-TBD items: **0**
- Groundedness: **100%**
- Unsupported claims: **0**

## Final delivery export — 2026-08-07

Final Validator/export workflow `3A8biYxoQ7Q1E9FQ`, execution `9728`, trace `4e1ef40a6da7a838ad9e9cc3a37a1a35` preserves the six-source manifest/hashes, 17 decision dispositions, 19/19 approved scope, PRD summary, 3/4/7/12 hierarchy, all citations, and upstream execution/trace lineage in Markdown export SHA-256 `82c614c0e6608c5b0010d22de6eb66ffa9def5600acb82fd80ebf1651756c5e1`. Groundedness: 100%. Unsupported claims: 0.
