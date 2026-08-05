# Story Breakdown Ground Truth

T12 evaluates whether the Story Breakdown Agent converts the approved actual T11/T1 PRD into a minimal, traceable epic-feature-story hierarchy without inventing product content.

The approved-source boundary is the actual T11 release from n8n execution `8621`. Story content may use only `FR-001`, `NFR-001`, `AC-001`, and `AC-002`. Missing persona specificity and benefit remain unresolved questions; the benefit uses the controlled TBD value.

| Test | Status | Input | Expected output | Human review |
|---|---|---|---|---|
| T12 | Proposed for approval | `t12/input-packet.json` | `t12/expected-output.json` | `t12/HUMAN_REVIEW.md` |

Target groundedness: **100%**.
