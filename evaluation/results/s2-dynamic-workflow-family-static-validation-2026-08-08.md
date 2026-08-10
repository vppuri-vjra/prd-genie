# S2 Dynamic Workflow Family — Static Validation Evidence

Date: 2026-08-08

## Result

`S2 STATIC CONTRACT PASS: 8/8 unpublished exports; dynamic Drive citations; S2-only calls; bidirectional fail-closed gates present.`

## Validated n8n workflows

| Workflow | ID | Published/callable |
|---|---|---|
| S2_ Dynamic Realistic Six-Source Main Orchestrator v0.1.2 | `qXwKh3NKS6DsATFs` | No; inactive parent |
| S2_ Dynamic Drive and Clarification Gate v0.1 | `CQoNtd5ZcVYV6hlG` | Yes; inactive child |
| S2_ Dynamic Requirement Extractor v0.1.1 | `IiXGaUC7gCHwZmzI` | Yes; inactive child |
| S2_ Dynamic Gap Analyzer v0.1 | `rDKD7Vnb1BIOLVJB` | Yes; inactive child |
| S2_ Dynamic Human Approval v0.1 | `yhA4MJhCkn6tpH96` | Yes; inactive child |
| S2_ Dynamic Production PRD v0.1 | `IisHTFOM9TAK1l0l` | Yes; inactive child |
| S2_ Dynamic Story Breakdown v0.1.1 | `ZTzLknRbkro5n4yE` | Yes; inactive child |
| S2_ Dynamic Final Validator and Export v0.1 | `BedDap8PQoauQcbw` | Yes; inactive child |

## Verified contracts

- The six source documents are read from Google Drive at execution time.
- Each source receives a runtime SHA-256 and Drive provenance.
- Candidate citations are generated from current file contents with stable citation IDs, locations, exact quotes, and quote hashes.
- Citation totals are dynamic; there is no fixed `88` gate.
- The extractor must classify the complete citation set.
- Approval creates a terminal citation disposition and item disposition for every entry.
- PRD generation maps every approved item to cited PRD elements.
- Story breakdown maps the PRD element set into the delivery hierarchy.
- Final validation enforces citation-disposition and PRD-delivery set equality.
- Final export blocks nonzero orphan or unsupported-claim counts.
- The parent references only the seven S2 stage IDs.
- No S2 export embeds the original six-document text or fixed `972x` execution authority.

## Reproducibility

- Builder: `scripts/build_s2_dynamic_workflows.mjs`
- Validator: `scripts/validate_s2_dynamic_workflows.py`
- Generated exports: `workflows/n8n/prd-genie-s2-*.json`

## Connected runtime result

The user explicitly authorized publishing the seven callable children for parent invocation. The parent remained unpublished and inactive.

- Parent execution: `9842` — succeeded in 1m 39.722s
- Dynamic gate execution: `9843`
- Run ID: `RUN-S2-9843-16e7090e`
- Source packet: `SP-S2-16e7090e7027e2d1`
- Parent/final trace: `31c935842eba067ff9ef372f1490f4ef`
- Google Drive inputs: 6 documents
- Citations: 145 indexed; 145 dispositioned
- PRD elements: 35
- Delivery hierarchy: 3 epics, 3 features, 35 stories, 35 acceptance criteria
- Orphans: 0 citations, 0 items, 0 PRD elements, 0 delivery items
- Groundedness: 100%
- Unsupported claims: 0
- Google Drive delivery: 4 validated files, including dedicated Story Breakdown JSON

No workflow was activated, archived, or deleted.
