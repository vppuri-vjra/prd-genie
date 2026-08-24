# T1–T12 Baseline Evaluation Summary

## Final release disposition

**12/12 prescribed cases passed.** The final preserved outputs achieved 100% groundedness with zero unsupported claims. `Partial` and `No requirements` below are correct expected extraction statuses for ambiguous, incomplete, contradictory, or empty inputs; they are not test failures.

| Test | Capability | Final expected output | Evidence receipt | Disposition |
|---|---|---|---|---|
| T1 | Precise mixed requirements | `Complete`; 1 FR, 1 NFR, stakeholder, and deadline | Langfuse `f14cab…0002` | Pass |
| T2 | Vague comparative request | `Partial`; broad FR and 4 clarification records | Langfuse `114917…4b95` | Pass |
| T3 | Contradictory refresh goals | `Partial`; FR, NFR, and contradiction preserved | Langfuse `1d107c…7d9d` | Pass |
| T4 | Export acceptance criteria | `Complete`; 1 FR and 2 testable criteria | Langfuse `119cf3…0901` | Pass |
| T5 | Fragmentary uncertain notes | `Partial`; no invention and 3 clarifications | Langfuse `e6fd72…38e1` | Pass |
| T6 | Conflicting technical direction | `Partial`; 2 constraints, deadline, and contradiction | Langfuse `4df943…f4d7` | Pass |
| T7 | Exact technical metrics | `Complete`; 3 exact-value NFRs preserved | Langfuse `f1f4b6…f56f` | Pass |
| T8 | Personas and permissions | `Complete`; 3 personas and 3 matched FRs | Langfuse `29a078…ab6e` | Pass |
| T9 | Empty meeting notes | `No requirements`; downstream generation correctly refused | Langfuse `3c54e4…205c` | Pass |
| T10 | Dependency with unknown ETA | `Complete`; FR, dependency, risk, and unknown ETA preserved | Langfuse `0c99f0…1bb5` | Pass |
| T11 | Ten-section PRD generation | 10/10 sections using approved IDs only | n8n `8621`; Langfuse `05e9…48ff` | Pass |
| T12 | Epic-to-story decomposition | 1 epic, 1 feature, 1 story, and 2 acceptance criteria | n8n `8788`; Langfuse `8e20…159b` | Pass |

## Evidence locations

- [T1–T10 fixtures](../fixtures/t01-t10-extractor-cases.json)
- [Human-reviewed ground truth](../ground-truth/README.md)
- [End-to-end test traceability matrix](../END_TO_END_TEST_TRACEABILITY_MATRIX.md)
- [T11 observable release](prd-generation-t11-v0.4-release-2026-08-05.md)
- [T12 observable release](story-breakdown-t12-v0.2-release-2026-08-05.md)
- [Final presentation Appendices A5–A7](../../releases/v0.3.8/presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pdf)

Earlier partial and failed development runs are retained in the repository as iteration evidence. This summary records the final approved baseline results and does not rewrite those historical receipts.
