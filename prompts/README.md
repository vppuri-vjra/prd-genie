# Agent Prompts

Prompts are versioned implementation artifacts. Each prompt file contains the system message, runtime input template, expected schema, and failure behavior.

| Prompt | Status | Output contract |
|---|---|---|
| `requirement-extractor-v0.1.md` | Superseded working file; retained for repository continuity | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v0.9.md` | Current candidate prompt; adds grounded relationships, ambiguity dimensions, unresolved tensions, and explicit persona links | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v0.8.md` | Previous verified baseline; dependency/risk correction passed T10 | `schemas/requirement-extraction.schema.json` |

Prompt versions should also be recorded in Langfuse and attached to every evaluation result.

## Requirement Extractor Version Register

| Version | Date | Trigger / evidence | Change introduced | Verification status | Commit |
|---|---|---|---|---|---|
| `extractor-v0.1-contract-fix` | 2026-07-31 | Initial T1 output did not fully align with the structured extraction contract | Aligned the system prompt, runtime input, output fields, evidence grounding, status values, and failure behavior with `requirement-extraction.schema.json` | Verified by the corrected T1 rerun; contract and semantic pass. Langfuse trace `6509203ccdf044f9dd98047eda2c4a13` | `d343bac` |
| `extractor-v0.2-classification-status-fix` | 2026-08-01 | T3 classified auto-refresh as non-functional and returned `complete` despite an unresolved contradiction | Classify product behavior by primary intent; retain functional classification when timing constrains a behavior; require `partial` for unresolved contradictions | Applied after T3; not rerun. Must be covered by the final regression set | `6015d09` |
| `extractor-v0.3-acceptance-criteria-fix` | 2026-08-01 | T4 did not preserve a qualifying testable condition as a separate acceptance criterion | Require testable conditions to be preserved verbatim as acceptance criteria and linked to the relevant functional requirement | Applied after T4; not rerun. Must be covered by the final regression set | `ef01de5` |
| `extractor-v0.4-status-boundary-fix` | 2026-08-01 | T5 exposed an unclear boundary between `partial` and `no_requirements` | Use `partial` for product-relevant fragments with actionable gaps; reserve `no_requirements` for empty or genuinely non-product input | Applied after T5; not rerun. Must be covered by the final regression set | `9166fe8` |
| `extractor-v0.5-viewpoint-contract-fix` | 2026-08-01 | T6 returned invalid array shapes and represented architecture preferences as stakeholder items instead of suggested constraints | Enforce array-shaped `evidence` and `extractor_notes`; preserve stakeholder attribution; classify technology preferences as suggested constraints; record neutral unresolved relationships | Applied after T6; not rerun. Must be covered by the final regression set | `d2365bb` |
| `extractor-v0.6-integration-nfr-fix` | 2026-08-01 | T7 duplicated the Salesforce integration as a functional requirement and acceptance criterion rather than one integration NFR | Represent a named external system, API, protocol, or exact API version as one integration NFR; preserve exact identifiers; prohibit duplicate classifications | Applied after T7; T8 passed under v0.6. T7 itself was not rerun and remains in final regression scope | `8ac8ddd` |
| `extractor-v0.7-no-requirements-clarification-fix` | 2026-08-01 | T9 correctly returned `no_requirements` but omitted the required grounded clarification | For `no_requirements`, require at least one missing-information record requesting a source containing product requirements, without inventing source contents | Applied after T9; not rerun. Must be covered by the final regression set | `0ce9c6c` |
| `extractor-v0.8-dependency-risk-fix` | 2026-08-02 | T10 v0.7 returned only a dependency with `partial` status and omitted the SSO functional requirement and explicit unknown-ETA risk | When a capability requires another service, emit the capability, dependency, and grounded risk separately; preserve explicit unknown-ETA wording; do not let clarification replace risk | Verified by passing T10 rerun. Langfuse trace `ca05ea0e1c143d6f1a9fe8e66fc8fe8a` | `ef22072` |
| `extractor-v0.9-relationships-conflicts-personas` | 2026-08-03 | Actual-output scorecard `0.1.1` exposed missing NFR links, ambiguous needs, unresolved tensions, constraint links, and persona items in T1/T2/T3/T6/T8 | Add evidence-bounded relationship, ambiguity, conflict, competing-constraint, persona, exact constraint-prefix, and stakeholder-preservation rules without weakening grounding | Full T1–T10 regression completed: 7 pass, 2 needs review (T5, T6), 1 fail (T10). Release gate not passed; do not promote. See `evaluation/results/t01-t10-v0.9-regression-scorecard-2026-08-03.md` | Pending |

## Version-Control Rules

1. Give every material prompt change a new immutable version identifier.
2. Keep the current canonical prompt as a complete standalone file; use Git history for superseded intermediate prompt text.
3. Update the n8n workflow metadata and sanitized workflow export with the same prompt version.
4. Record the prompt version on every Langfuse trace and evaluation result.
5. Never overwrite original evaluation evidence after a correction. Preserve the original result and add a separate rerun result.
6. Distinguish **applied** from **verified**. A correction is verified only after an approved rerun or regression test exercises it successfully.
7. Add future versions to this register with the trigger, behavior change, verification evidence, and commit.

## Current Baseline

- Candidate version: `extractor-v0.9-relationships-conflicts-personas`
- Candidate prompt: `prompts/requirement-extractor-v0.9.md`
- Last verified baseline: `extractor-v0.8-dependency-risk-fix`
- Output contract: `schemas/requirement-extraction.schema.json`
- Workflow export: `workflows/n8n/prd-genie-requirement-extractor-v0.2.json`
- Final regression obligation: rerun T1-T10 against approved ground truth using one fixed prompt/model/workflow baseline.
