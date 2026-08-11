# Story Breakdown Ground Truth

T12 evaluates whether the Story Breakdown Agent converts the approved actual T11/T1 PRD into a minimal, traceable epic-feature-story hierarchy without inventing product content.

The approved-source boundary is the actual T11 release from n8n execution `8621`. Story content may use only `FR-001`, `NFR-001`, `AC-001`, and `AC-002`. Missing persona specificity and benefit remain unresolved questions; the benefit uses the controlled TBD value.

| Test | Status | Input | Expected output | Human review |
|---|---|---|---|---|
| T12 | Approved by Vipin Puri on 2026-08-05 at 100% groundedness | `t12/input-packet.json` | `t12/expected-output.json` | `t12/HUMAN_REVIEW.md` |
| T12-S2 | Approved by Vipin Puri on 2026-08-11; n8n 10/10, Langfuse Code 5/5, Faithfulness 1.00, Hallucination 0.00 | `t12-s2/input-packet.json` | `t12-s2/expected-output.json` | `t12-s2/HUMAN_REVIEW.md` |

Target groundedness: **100%**.

The T12-S2 evidence is recorded in `evaluation/results/story-breakdown-t12-s2-evaluation-evidence-2026-08-11.md`. The Agreement Gate remained in shadow mode, and no production workflow was changed or published.
