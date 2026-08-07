# Realistic v4 Stage Contract

## Purpose

This contract carries the frozen six-source production packet through Requirement Extraction and Gap Analysis without allowing either model stage to rewrite its provenance. The deterministic gate fails closed if the context is missing or mutated.

## Stage shape

| Boundary | Required output |
|---|---|
| `Load Approved Six-Source Packet v4` | Canonical packet with `packet_id`, `run_id`, exactly six `sources`, `clarification_contract`, and `orchestration_context.parent_trace_id`. Each source retains raw text, ID/type/name, SHA-256 hash, provenance, metadata and exact citations. The clarification contract retains decision IDs and supersessions. |
| `Requirement Extractor v1.10` | Standard Requirement Extraction stage envelope plus `source_packet` containing the same packet ID, six source identities and hashes. Groundedness must be 100%, unsupported claims 0 and Langfuse ingestion accepted. |
| `Validate Six-Source Extraction` | `run_id`, validated extraction, orchestration context, Requirement Extraction stage, clarification contract, and immutable `original_packet` copied from the loader only after packet/source/hash/citation/trace validation passes. |
| `Gap Analyzer v1.0` | Receives the validated-extraction object, including `original_packet`, as its input. Its returned stage envelope remains model output and is not trusted to re-emit provenance. It must preserve run ID and parent trace ID and pass at 100% groundedness with accepted Langfuse ingestion. |
| `Deterministic Clarification Resolution and Gate` | Reads `original_packet` from `Validate Six-Source Extraction`, not from model output. It checks packet/run/parent-trace identity, six sources, hashes against the accepted Requirement Extraction source packet, decision IDs, citations and supersessions. Missing or mutated context blocks the run. |

The gate may return `human_approval` only after the authoritative decisions classify churn alerting, undefined AI and churn prediction as deferred/non-blocking and mobile responsiveness as resolved for the 2026-09-30 release. Human Approval remains a separate uninvoked boundary.

The authoritative six-source manifest, hashes, provenance, dates and supersession rules are recorded in `SOURCE_PACKET_CONTRACT.md`. This stage contract rejects dropped, added, reordered or mutated records and rejects mixing the production packet with `eval_prdgenie_inputs`.
