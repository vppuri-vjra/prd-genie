# Realistic-v1 Ground-Truth Review

Status: **Approved on 2026-08-06 by Vipin Puri**

Approved artifact SHA-256:
`aec924acffa6359bba0e0d73fdc4e5774db3e56a12c7ecff352e74b51a8111b8`.
The authoritative decision record is `GROUND_TRUTH_APPROVAL.md`.

All 70 approved evidence citations are classified in `citation-review.json`. A citation is an evidence candidate, not an automatically approved requirement.

## Source-specific interpretation

### Product Brief

The brief is structured and mostly authoritative, but its sections still have different meanings:

- `KEY REQUIREMENTS` and explicit `CONSTRAINTS` are strong item candidates.
- `TARGET USERS` supports distinct personas and their stated needs.
- `Target launch: Q3 2026` supports a deadline.
- `OPEN QUESTIONS` supports missing-information records; the under-three-second value is explicitly a suggestion, not an approved target.
- competitor descriptions are context only and must not become product requirements.
- `Status: Draft` applies to the document and prevents treating every statement as formally approved.

### Meeting Transcripts

The transcript file contains five separate meetings with different evidence quality:

- Transcript 1 contains explicit requirements, ownership, deadlines, dependencies and unresolved data-source selection.
- Transcript 2 is intentionally vague; it supports clarification questions, not an invented AI requirement specification.
- Transcript 3 contains an unresolved refresh-frequency versus infrastructure-load contradiction. Both viewpoints must remain separate.
- Transcript 4 contains an export requirement, separately stated acceptance conditions, and a proposed XLSX implementation that is not equivalent to an approved CSV decision.
- Transcript 5 contains fragments and TBDs; it supports missing information and follow-up, not reliable requirements.

### Stakeholder Notes

The interview notes are viewpoint evidence:

- Raj's architecture, data-model and indexing statements are suggestions or prerequisites, not automatically approved implementation decisions.
- Lisa's single-page versus server-rendered discussion is an unresolved preference conflict; desktop-first and dark mode are suggestions.
- Tom states deadline pressure and churn risk, while churn prediction remains under-specified.
- Nina provides explicit multi-tenant, search and filtering needs; white-labeling remains an uncertain scope question.

## Cross-source correlation map

This table records thematic overlap for review. Correlation does not mean that statements are equivalent, approved, or safe to merge.

| Theme | Product Brief | Meeting Transcripts | Stakeholder Notes |
|---|---|---|---|
| Reporting/dashboard | Analytics dashboard with five core metrics | Reporting filters and a dedicated page | Users want answers, search, and filtering |
| Filtering | Date-range filtering | Date range, category, and status | Search and filtering are more important than adding metrics |
| Performance | Fifteen-minute refresh; load-time question with an under-three-second suggestion | Under-two-second load requirement; proposed five-second refresh | Slow API, 8+ second scans, and database-load concern |
| Data architecture | Integration with the existing PostgreSQL warehouse | Live queries versus a precomputed warehouse remains TBD | Events table, timestamp index, and microservices preference |
| Access control | Executives see all data; team leads see their team | No directly corresponding approved statement | Customers must see data filtered to their own account |
| Exporting | PDF export for monthly board reports | PDF and CSV, logo and formula conditions, plus an XLSX proposal | White-label report logo remains uncertain in scope |
| Mobile | Responsive mobile access is required | No directly corresponding approved statement | Desktop-first with mobile as a fast follow is suggested |
| Deadlines | Q3 2026 target launch | End-of-Q3 delivery; designs requested by end of April | End-of-March request and Q3 customer-loss risk |
| Churn | Churn rate is one displayed metric | Vague request for smarter or AI-enabled reporting | Churn prediction requested without data or accuracy definition |
| User needs | Business analysts, team leads, and executives | Users need reporting and current data | Enterprise customers want account-specific answers |

### Correlation safeguards

- Filtering, reporting, performance, and Q3 delivery are reinforced across sources, but each item must retain its own evidence.
- The under-two-second requirement must not be silently replaced by the Product Brief's suggested under-three-second value.
- Fifteen-minute refresh, five-second refresh, and real-time requests conflict and must remain separate pending clarification.
- Required mobile support conflicts with the desktop-first/fast-follow suggestion.
- PostgreSQL integration, microservices, the events table, timestamp indexing, live queries, a warehouse, and WebSockets are distinct statements rather than one approved architecture.
- PDF export is reinforced, while CSV/XLSX behavior, formulas, logos, and white-labeling require separate treatment.
- End of March, end of April, and end of Q3 may refer to different scopes or deliverables and must not be collapsed into one deadline.
- Churn rate reporting and churn prediction are different capabilities.

Cross-source correlation grounding: **100%**. Unsupported correlations promoted to decisions: **0**.

## Relationship to controlled T1–T10 cases

This matrix supports comparison between the production-style sources and the separate T1–T10 regression route. It does not authorize combining both routes in one run.

| Test | Match level | Source document | Description |
|---|---|---|---|
| **T1** | Strong/direct | Meeting Transcripts; partial reinforcement in Product Brief | Report filters, under-two-second performance, Sarah as PM owner, and Q3 deadline. |
| **T2** | Strong/direct | Meeting Transcripts | Better reporting and comparison to Competitor X. |
| **T3** | Strong/direct | Meeting Transcripts; reinforced by Stakeholder Notes | Five-second refresh conflicts with minimizing API calls and infrastructure-load concerns. |
| **T4** | Strong/direct | Meeting Transcripts; partial reinforcement in Product Brief | PDF/CSV export, company logo, and formula preservation. |
| **T5** | Strong/direct | Meeting Transcripts | Incomplete dashboard notes, John mentioning real-time, and budget TBD. |
| **T6** | Partial/distributed | Stakeholder Notes | Engineering prefers microservices, Design prefers a single-page app, and VP Sales requests delivery by March. The deadline speaker differs from T6's PM. |
| **T7** | Thematic only | Stakeholder Notes | API and performance concerns exist, but not 10,000 users, `<200ms p95`, or Salesforce REST API v52. |
| **T8** | Thematic only | Product Brief | Analysts, team leads, executives, and role-based access appear, but not the exact T8 personas or capabilities. |
| **T9** | No direct match | None | Incomplete meeting notes are not equivalent to “Notes: none.” |
| **T10** | Thematic only | Meeting Transcripts and Stakeholder Notes | Dependencies and unknown decisions exist, but not SSO, Team Alpha, a new auth service, or unknown ETA. |

T1–T10 relationship-map groundedness: **100%**. Unsupported test equivalences: **0**.

## Expected extraction totals by type

The canonical expected extraction currently contains 44 extracted items. Citation
references count evidence uses: the same approved source citation may support more
than one extracted fact, and an item may be reinforced by multiple sources.

| Type | Number of items | Citation references |
|---|---:|---:|
| Functional requirements | 17 | 18 |
| Non-functional requirements | 2 | 2 |
| Constraints | 11 | 11 |
| Acceptance criteria | 2 | 2 |
| Deadlines | 3 | 5 |
| Dependencies | 2 | 2 |
| Personas | 3 | 3 |
| Risks | 2 | 2 |
| Stakeholders | 2 | 2 |
| **Total extracted items** | **44** | **47** |

The 12 missing-information records contain another **21 citation references**.
Therefore, the expected extraction preserves **68 total evidence references**:
47 on extracted items plus 21 on missing-information records. The 4 contradiction
records describe relationships among already cited items and are not added to the
44-item total.

Expected-extraction groundedness: **100%**. Unsupported claims: **0**.

## Fail-closed rules for the expected extraction

1. Preserve source, speaker, quote, location and content hash for every emitted item.
2. Do not convert contextual or competitor statements into requirements.
3. Do not promote suggestions, alternatives or “nice to have” requests to stated requirements.
4. Do not resolve contradictions or choose an implementation.
5. Convert vague fragments and explicit unknowns into grounded missing-information records where actionable.
6. Preserve exact thresholds, dates, named people, systems and qualifiers.
7. Require **100% groundedness** and zero unsupported claims before n8n execution.

The canonical unified `expected-requirement-extraction.json` has been generated from
this reviewed classification, passes local schema and evidence validation, and was
approved on 2026-08-06. It is now the frozen semantic acceptance baseline for the
realistic multi-source Requirement Extractor canary.
