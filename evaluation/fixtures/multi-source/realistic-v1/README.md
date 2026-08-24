# Realistic Multi-Source Production Packet

This directory preserves the complete six-document approved input set used by the accepted PRD Genie architecture and formal submission evidence.

> **Formal submission baseline — use for grading and all acceptance claims:** n8n execution `11901` / run `RUN-S2-11902-16e7090e`.
>
> **Supplementary demonstration evidence only — does not replace the formal baseline:** execution `11958` / run `RUN-S2-11959-16e7090e`.

## Auditable input-set evolution

PRD Genie did not begin with six inputs. The source set evolved through a governed, traceable process:

1. **Initial discovery set:** three supplied source documents were preserved as immutable evidence.
2. **Governed clarification history:** three human-authored decision records dated August 7, 2026 were added without rewriting the original sources.
3. **Formal execution input set:** baseline execution `11901` consumed the resulting six-document approved packet.

| Phase | Approved source | Type | SHA-256 |
| --- | --- | --- | --- |
| Initial discovery | [`product-brief.txt`](product-brief.txt) | Product brief | `a8f93fd8…6e33ce5` |
| Initial discovery | [`meeting-transcripts.txt`](meeting-transcripts.txt) | Meeting transcripts | `15111349…f49dcc8` |
| Initial discovery | [`stakeholder-notes.txt`](stakeholder-notes.txt) | Stakeholder notes | `c4b97370…4be76f` |
| Governed clarification — August 7, 2026 | [`stakeholder-clarifications-2026-08-07.md`](stakeholder-clarifications-2026-08-07.md) | Primary stakeholder decisions | `a10d68b2…dad5300` |
| Governed amendment — August 7, 2026 | [`stakeholder-clarification-amendment-2026-08-07.md`](stakeholder-clarification-amendment-2026-08-07.md) | Approved bounded amendments | `4bb1edb4…9e49d16` |
| Governed mobile-release clarification — August 7, 2026 | [`stakeholder-clarification-mobile-release-2026-08-07.md`](stakeholder-clarification-mobile-release-2026-08-07.md) | Approved mobile-release decision | `39001440…bcdbc883` |

The complete machine-readable packet is [`source-packet-v4.json`](source-packet-v4.json), packet ID `SP-REALISTIC-PB-MT-SN-CLAR-V4`. It preserves all six source identities, full hashes, raw text, provenance, metadata, and exact citations. It runs through the production multi-source route and must not be combined with `eval_prdgenie_inputs`, which remains a separate regression/control producer.

## Decision precedence and history

The original Product Brief, Meeting Transcripts, and Stakeholder Notes remain immutable. Later clarification records are human-authored governance evidence, not model-generated assumptions. Explicit decision IDs identify approved resolutions, deferrals, controls, and bounded supersessions. A superseded statement remains available for audit even when a later decision governs the current state.

Supporting decision and validation artifacts include:

- [`stakeholder-clarification-decisions-2026-08-07.json`](stakeholder-clarification-decisions-2026-08-07.json) — canonical primary decision ledger.
- [`stakeholder-clarification-amendment-2026-08-07.json`](stakeholder-clarification-amendment-2026-08-07.json) — machine-readable approved amendments.
- [`stakeholder-clarification-mobile-release-2026-08-07.json`](stakeholder-clarification-mobile-release-2026-08-07.json) — machine-readable mobile-release decision.
- [`CLARIFICATION_GROUND_TRUTH.md`](CLARIFICATION_GROUND_TRUTH.md) — reviewed clarification expectations and hashes.
- [`DECISION_TO_PRD_DISPOSITION_V4.md`](DECISION_TO_PRD_DISPOSITION_V4.md) — effective, superseded, deferred, and PRD disposition mapping.
- [`source-packet-v4.json`](source-packet-v4.json) — accepted six-source packet.

## Current verification status

- Six approved source files: present and version controlled.
- Byte/content-hash integrity: passed.
- Source identity, provenance, and exact citations: passed.
- Route separation: passed.
- Input groundedness: 100%.
- Decision precedence and supersession mapping: preserved.
- Formal accepted execution: `11901` / `RUN-S2-11902-16e7090e`.
- Formal downstream result: release authorized, 145/145 citation dispositions, zero orphaned governed records, seven delivered artifacts, and 11/11 advisory sizing results.

Earlier `source-packet.json`, `source-packet-v2.json`, and `source-packet-v3.json` remain historical development states. Their earlier pending or partial status must not be used to characterize the accepted v4 packet or formal execution `11901`.
