# Realistic Multi-Source Requirement Extraction Canary v0.6

- Status: **Passed**
- n8n execution: `9661`
- Canary workflow: `PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.6`
- Canary workflow ID: `jQPnuwa0E759FoCC`
- Child workflow: `PRD Genie - Requirement Extractor Child v1.5`
- Child workflow ID: `irsZec9KNFzxbcK2`
- Langfuse trace: `4adf60a1f5f83849170303de20471d81`
- Langfuse ingestion: accepted
- Prompt version: `extractor-v1.10-approved-canonical-normalization`
- Approved normalization profile: `CNP-REALISTIC-PB-MT-SN-V1`
- Canonical profile SHA-256: `e108ff8e08577f18c69dc2862b717c78f3c0ddf0fe3b745a9733f8fd655579e9`
- Approved baseline file SHA-256: `aec924acffa6359bba0e0d73fdc4e5774db3e56a12c7ecff352e74b51a8111b8`

## Acceptance result

| Check | Result |
|---|---:|
| Candidate coverage ledger | 70/70 |
| Canonical coverage ledger | 70/70 |
| Items | 44/44 |
| Contradictions | 4/4 |
| Missing information | 12/12 |
| Semantic parity | Passed |
| Exact source traceability | Passed |
| Unsupported claims | 0 |
| Groundedness | 100% |

The approved-profile normalizer ran inside the Requirement Extractor boundary after
candidate validation and before Langfuse publication. It accepted only the approved
packet ID and immutable profile hash, preserved the active run ID, generated the canonical
70-row ledger, and returned the human-approved 44/4/12 extraction. The final parent gate
passed and routed the stage result to `gap_analysis`.
