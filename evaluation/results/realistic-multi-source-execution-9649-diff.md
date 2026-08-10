# Execution 9649 vs Approved Realistic Multi-Source Ground Truth

## Totals

| Record | Approved | Execution 9649 | Difference |
|---|---:|---:|---:|
| Extracted items | 44 | 31 | -13 |
| Contradictions | 4 | 3 | -1 |
| Missing-information records | 12 | 7 | -5 |

## Item-type totals

| Type | Approved | Actual | Difference |
|---|---:|---:|---:|
| Functional requirements | 17 | 12 | -5 |
| Non-functional requirements | 2 | 4 | +2 |
| Constraints | 11 | 5 | -6 |
| Acceptance criteria | 2 | 2 | 0 |
| Deadlines | 3 | 3 | 0 |
| Dependencies | 2 | 0 | -2 |
| Personas | 3 | 3 | 0 |
| Risks | 2 | 0 | -2 |
| Stakeholders | 2 | 2 | 0 |

## Exact failure patterns

### Omitted approved coverage

The actual extraction omitted or failed to preserve as separate items:

- Product Brief overview/dashboard capability (`PB line:8`);
- real-time freshness request and five-second-refresh outage risk (`MT line:58`,
  `MT line:64`);
- query-layer prerequisite and database-load constraint (`SN line:10`);
- answers/insights requirement (`SN line:22`);
- desktop-first/mobile-fast-follow suggestion (`SN line:26`);
- dark-mode suggestion (`SN line:28`);
- end-of-March request and Q3 account-loss risk (`SN line:34`, `SN line:36`);
- churn-prediction suggestion (`SN line:40`);
- white-labeling suggestion (`SN line:50`); and
- search/filtering priority (`SN line:52`).

### Collapsed distinct facts

- The events-table suggestion and timestamp-index suggestion were combined into one
  constraint instead of two (`SN line:14`).
- The SPA preference and server-rendering preference were combined into one item
  instead of preserving both sides of the architecture conflict (`SN line:24`).
- The reporting owner, end-of-Q3 delivery and end-of-April design milestone were
  extracted, but deadline identity shifted because Q3 reinforcement was not merged
  with the Product Brief Q3 item and the March milestone was omitted.

### Misclassification or promotion

- PostgreSQL integration was classified as a non-functional requirement rather than
  a dependency (`PB line:23`).
- API-call minimization was classified as a non-functional requirement rather than a
  constraint (`MT line:56`).
- The user-facing CSV label was classified as a functional requirement rather than a
  constraint (`MT line:82`).
- The XLSX implementation proposal became an additional functional requirement
  (`FR-012` actual) instead of remaining an unresolved export-format question.
- Mobile responsiveness remained `stated` rather than `contradictory` because the
  desktop-first opposing suggestion was omitted.

### Contradictions

The actual output contained three contradictions instead of four:

- refresh cadence omitted the real-time side;
- API-load conflict omitted the outage-risk item; and
- architecture preferences were collapsed, while the required mobile-launch conflict
  was absent.

### Missing information

The actual output retained seven open questions but omitted budget, design-follow-up
ownership, incomplete real-time-note clarification, milestone-scope reconciliation,
and other approved coverage. Its category labels also diverged from the approved
contract, causing evidence-aligned questions to fail canonical semantic comparison.

## Root-cause decision

This is not an evidence-grounding failure. Every emitted item passed exact citation and
hash validation at **100% groundedness**. The failure is extraction completeness,
classification, separation of multi-fact citations, canonical identity, and approved
semantic coverage.

A prompt-only retry is not justified. The next version should add a deterministic
candidate-normalization stage inside the Requirement Extractor child that:

1. splits independently stated facts from the same citation;
2. applies explicit type/status boundaries before assigning IDs;
3. assigns IDs only after sorting by source type and numeric line;
4. preserves every side of a conflict as a separate item;
5. refuses to promote implementation alternatives into requirements; and
6. fails closed when a reviewed citation disposition expected to produce an item,
   conflict or missing-information record is not represented.

No n8n change or billable rerun was performed while producing this diff.
