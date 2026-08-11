# PRD Genie S2 Document Classification Register

Last updated: 2026-08-10

## Control boundary

**Used By is the primary control boundary.** Document Type identifies what a document is; Used By determines where it is permitted to influence the system.

| Used By | Permitted influence |
|---|---|
| Production pipeline | May influence product requirements through evidence-supported extraction or an approved human decision |
| Independent evaluation only | May change evaluation expectations, ground truth, scoring, or evaluator policy; may not introduce or modify production requirements |
| Documentation and evidence reporting | May describe decisions and results; has no independent authority over production requirements or evaluation ground truth |

## Register

| Document | Source ID / record ID | Document Type | Used By | Authority |
|---|---|---|---|---|
| `product-brief.txt` | `SRC-REALISTIC-PB-001` | Original business source evidence — product brief | **Production pipeline** | Business stakeholders |
| `meeting-transcripts.txt` | `SRC-REALISTIC-MT-001` | Original business source evidence — meeting transcript | **Production pipeline** | Meeting participants |
| `stakeholder-notes.txt` | `SRC-REALISTIC-SN-001` | Original business source evidence — stakeholder notes | **Production pipeline** | Business stakeholders |
| `stakeholder-clarifications-2026-08-07.md` | `SRC-REALISTIC-CLAR-001` | Human-approved production decision and clarification record | **Production pipeline** | Vipin |
| `stakeholder-clarification-amendment-2026-08-07.md` | `SRC-REALISTIC-CLAR-AMEND-001` | Human-approved production decision amendment | **Production pipeline** | Vipin |
| `stakeholder-clarification-mobile-release-2026-08-07.md` | `SRC-REALISTIC-CLAR-MOBILE-001` | Human-approved production release clarification | **Production pipeline** | Vipin |
| T3 human ground-truth adjudication | `T3-HUMAN-ADJUDICATION-2026-08-10` | Human-approved evaluation adjudication record | **Independent evaluation only** | Vipin |

## T3 evaluation lineage

The Langfuse LLM judge identified that the earlier T3 ground truth over-interpreted two compatible requirements as a contradiction. Human review authorized ground truth `0.2.0`, which preserves both requirements as `stated`, removes the inferred contradiction, and changes the expected extraction status to `complete`.

| Field | Value |
|---|---|
| Adjudication | `T3-HUMAN-ADJUDICATION-2026-08-10` |
| Used By | Independent evaluation only |
| Product-requirement impact | None |
| Base control hash | `4ad3e09eb76eb7fa21823b5f9ccbd372dc8453a93ff200dedc588c8907eb0e26` |
| Authoritative v1.1 control hash | `559785b3a8788113e9b43e05dad09cab56b447a7ed322bc1f72b7aae8d923c82` |
| Drive-only validation execution | n8n `10333`: deterministic T1–T10 10/10; Code 10/10; T3 faithfulness `1.00`; T3 hallucination `0.00` |

The six production inputs therefore comprise three original business evidence sources and three human-approved production decision records. The T3 adjudication is evaluation governance, not a seventh production source.
