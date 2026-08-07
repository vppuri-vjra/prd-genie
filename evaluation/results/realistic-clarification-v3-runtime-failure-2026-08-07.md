# Realistic five-source clarification v3 — runtime acceptance failure

Date: 2026-08-07

| Field | Value |
|---|---|
| Packet | `SP-REALISTIC-PB-MT-SN-CLAR-V3` |
| n8n execution | `9687` |
| Canary | `PRD Genie - Realistic Clarification v3 Canary v0.4` / `5JDrnH6E4emJB7WD` |
| Extractor | v1.8 / `DLjawLd651ksC9Mp` |
| Local groundedness | 100% |
| Runtime groundedness | Not accepted |

The five-source packet passed local hash, citation, amendment, preservation and schema validation. The live Requirement Extractor candidate was rejected because evidence on `PER-002`, `CON-005`, and `RSK-001` did not exactly preserve approved provenance metadata. The strict validator stopped the workflow before accepted Requirement Extraction output, Langfuse ingestion, Gap Analysis, Generation Gate or Human Approval.

This is a grounding/traceability failure. The SPA and September 10 budget amendments remain locally authoritative but are not claimed as runtime-cleared. The next correction should deterministically hydrate evidence provenance from the approved citation map while still rejecting unknown source IDs, locations, or quotes.
