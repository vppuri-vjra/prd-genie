---
title: PRD Genie Source Packet Contract
version: 1.0
status: T1 multi-source parity validated locally and in n8n
last_updated: 2026-08-06
owner: Vipin Puri
---

# Source Packet Contract

## Purpose

`schemas/source-packet.schema.json` is the canonical production-style input envelope for the Requirement Extractor. It preserves every source independently while allowing the Requirement Extractor—not the ingestion layer—to produce the unified requirement packet.

## Two alternative producers

| Route | Producer | Input form | Combination rule |
|---|---|---|---|
| Regression/control | `eval_prdgenie_inputs.txt` and `evaluation/fixtures/t01-t10-extractor-cases.json` | Existing normalized `workflow-input` with `input_type: evaluation_test` | Run alone |
| Production-style multi-source | Product Brief + Meeting Transcript + Stakeholder Notes, plus dated stakeholder clarification sources when decisions exist | `source-packet` containing separate immutable source records | Run alone |

Both routes satisfy the same logical Requirement Extractor input boundary. They are parity alternatives. The PB+MT+SN packet must not be concatenated with the evaluation source in one run, because doing so would duplicate the same logical facts and corrupt source-level traceability.

## Source record

Each `sources[]` record contains:

- a stable `source_id` and controlled `source_type`;
- human-readable `source_name` and exact `raw_text`;
- provenance origin and fixture/file path;
- exact citation quotes and `line:N` locations;
- source metadata; and
- `sha256:<hex>` content hash calculated over the exact UTF-8 raw text, including its final newline.

Source IDs must be unique. A missing required T1 source, duplicate source ID, changed file/text, hash mismatch, or citation that does not exactly match its declared line is rejected before model execution.

## Controlled T1 parity fixture

The initial packet is `evaluation/fixtures/multi-source/t1/source-packet.json` and contains only four approved T1 facts:

| Source | Source ID | Approved facts |
|---|---|---|
| Product Brief | `SRC-T1-PB-001` | `FR-001` report filtering and `NFR-001` under-two-second performance |
| Meeting Transcript | `SRC-T1-MT-001` | `STK-001` Sarah is the PM |
| Stakeholder Notes | `SRC-T1-SN-001` | `DDL-001` Q3 deadline |

No persona, priority, business goal, date/year, scope, dependency, or other product fact is added. The expected unified extraction preserves the same four logical facts, exact citations, source IDs/types/names, and content hashes. Groundedness is **100%** and unsupported claims are **0**.

## Workflow boundary and approval placement

The ingestion/normalization layer validates and supplies the source packet. The Requirement Extractor reads all records and emits one `requirement-extraction` contract. Gap Analysis consumes that unified packet. The existing mandatory Human Approval checkpoint remains after Gap Analysis; this foundation introduces no additional approval checkpoint.

## Local acceptance command

```bash
python3 scripts/validate_t1_multi_source_parity.py
```

The validator proves the positive parity case and four controlled rejection cases: missing source, duplicate source ID, altered content/hash mismatch, and lost citation preservation. After that local gate passed, Requirement Extractor Child v1.1.1 and parity parent v0.2 passed n8n execution `9638` with accepted Langfuse trace `2f0e20055d7765ca3bb0bb0d2bea866b`, 100% groundedness, and zero unsupported claims.

## Realistic regression intake

`evaluation/fixtures/multi-source/realistic-v1/` preserves the three supplied capstone resources byte-for-byte in packet `SP-REALISTIC-PB-MT-SN-V1`. The packet contains 70 reviewed, exact line citations across the Product Brief, five meeting transcripts, and stakeholder notes. It uses `test_id: null` so it cannot masquerade as T1, and remains separate from the evaluation-control route. Input integrity and citation grounding pass at **100%**. The expected Requirement Extraction was approved by Vipin Puri on 2026-08-06 and frozen at SHA-256 `aec924acffa6359bba0e0d73fdc4e5774db3e56a12c7ecff352e74b51a8111b8`; the real n8n canary is eligible to proceed against that baseline.

## Realistic clarification packet v2

The accepted v1 packet and its original PB/MT/SN sources remain unchanged. After stakeholder Vipin decided all 14 execution-`9667` clarifications on 2026-08-07, packet `SP-REALISTIC-PB-MT-SN-CLAR-V2` added `SRC-REALISTIC-CLAR-001` as a fourth `stakeholder_clarification` source. It preserves the decision text, stable `DEC-2026-08-07-GAP-###` identifiers, provenance, exact decision-line citations, and SHA-256 hash while retaining every original source and superseded statement.

`stakeholder-clarification-decisions-2026-08-07.json` is the canonical machine-readable decision record. `expected-clarification-resolution.json` is the local semantic acceptance baseline for the next controlled rerun. Both explicitly use `runtime_status: pending_n8n_verification`; local acceptance does not claim that Requirement Extraction, Gap Analysis, Human Approval, or PRD Generation has rerun.

## Canonical realistic packet v4 six-source manifest

Packet `SP-REALISTIC-PB-MT-SN-CLAR-V4` contains exactly these production sources. Each hash covers the exact UTF-8 `raw_text` in `source-packet-v4.json`.

| Source ID | Type | File | Role | SHA-256 | Provenance/date | Supersession |
|---|---|---|---|---|---|---|
| `SRC-REALISTIC-PB-001` | `product_brief` | `product-brief.txt` | Original requirements/scope | `a8f93fd8b88bd8e52b69197b378cf655be87d88a34d020ce992df6acd6e33ce5` | `uploaded_document`; decision date N/A | Original evidence preserved |
| `SRC-REALISTIC-MT-001` | `meeting_transcript` | `meeting-transcripts.txt` | Stakeholder discussion/decisions/ambiguities | `15111349acf5fa92a2f5a33cbbedfc06765e2bb341473d451c49d5123f49dcc8` | `uploaded_document`; decision date N/A | Original evidence preserved |
| `SRC-REALISTIC-SN-001` | `stakeholder_notes` | `stakeholder-notes.txt` | Requests/constraints/risks/contradictions | `c4b9737007fdce22f23f293634a5a7caa23732848624e874184a4be76fb1fa68` | `uploaded_document`; decision date N/A | Original evidence preserved |
| `SRC-REALISTIC-CLAR-001` | `stakeholder_clarification` | `stakeholder-clarifications-2026-08-07.md` | Original 14 decisions | `a10d68b226cf1f4ac48dc1c08ddc6205e137146657db035c3cae5da46dad5300` | `submitted_text`; Vipin; `2026-08-07` | GAP-008 and GAP-014 only are superseded below |
| `SRC-REALISTIC-CLAR-AMEND-001` | `stakeholder_clarification` | `stakeholder-clarification-amendment-2026-08-07.md` | GAP-008/GAP-014 amendments | `4bb1edb4d3a13f0868bf3e13ff3a618db073b84d0d7e38f0a5d27860d9e49d16` | `submitted_text`; Vipin; `2026-08-07` | A1 decisions supersede the earlier GAP-008 deadline/blocking treatment and GAP-014 deferred technical choice |
| `SRC-REALISTIC-CLAR-MOBILE-001` | `stakeholder_clarification` | `stakeholder-clarification-mobile-release-2026-08-07.md` | Responsive web at launch | `390014408db99fa1f85d469d269c0819f002f63ab41ae7738b287fc3bcdbc883` | `submitted_text`; Vipin; `2026-08-07` | Supersedes only the post-launch mobile fast-follow interpretation |

Immutability policy: PB, MT and SN remain byte-for-byte audit evidence. Clarifications are append-only authorities; later decisions record explicit supersession without editing or erasing earlier sources, citations or decisions. IDs, names, types, raw text, citations, provenance, metadata and hashes must remain unchanged through every stage. These six production sources are never mixed with `eval_prdgenie_inputs`; production and evaluation are mutually exclusive producers.
