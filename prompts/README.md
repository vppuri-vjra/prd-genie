# Agent Prompts

Prompts are versioned implementation artifacts. Each prompt file contains the system message, runtime input template, expected schema, and failure behavior.

| Prompt | Status | Output contract |
|---|---|---|
| `requirement-extractor-v0.1.md` | Superseded working file; retained for repository continuity | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v0.9.md` | Current candidate prompt; adds grounded relationships, ambiguity dimensions, unresolved tensions, and explicit persona links | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v1.0.md` | Current correction candidate; addresses v0.9 T5, T6, and T10 release-gate findings | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v1.1.md` | Current candidate; prevents embedded functional timing from becoming a duplicate acceptance criterion | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v1.2.md` | Current candidate; prevents generic user references from becoming personas | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v1.3.md` | Current candidate; distinguishes optional clarification from a materially partial extraction | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v1.4.md` | Targeted candidate; audits bidirectional NFR-to-FR relationships | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v1.5.md` | Promoted baseline; distinguishes product fragments from content with no requirements and includes the v1.4 relationship audit | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v0.8.md` | Previous verified baseline; dependency/risk correction passed T10 | `schemas/requirement-extraction.schema.json` |
| `gap-analyzer-v0.1.md` | Approved design baseline through role, grounding, generation decisions, severity, and clarification-question rules; implementation and evaluation pending | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.2.md` | Targeted candidate; applies a materiality boundary before promoting extractor missing-information records into Gap Analyzer gaps | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.3.md` | Superseded diagnostic candidate; exposed exact nested-field and severity-configuration defects | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.4.md` | Superseded targeted candidate; corrected schema fields, coverage and sufficiency but overstated GA-T2 severity | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.5.md` | Current candidate; adds the approved high-versus-blocking severity boundary | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.6.md` | Current candidate; enforces the exact contradiction contract and blocking-contradiction sufficiency boundary | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.7.md` | Current candidate; preserves product-fragment gaps, explicit TBDs, specific categories, and no-item severity boundaries | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.8.md` | Current candidate; normalizes the no-requirements source category while preserving blocking source traceability | `schemas/gap-analysis.schema.json` |
| `gap-analyzer-v0.9.md` | Promoted Gap Analyzer baseline; preserves all approved materiality, contradiction, fragment, no-requirements, and dependency-TBD behaviors | `schemas/gap-analysis.schema.json` |

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
| `extractor-v1.0-fragments-speakers-risk-links` | 2026-08-03 | v0.9 promoted T5 fragments into items, added speaker roles as T6 stakeholders, and emitted invalid/unlinked T10 risk data | Keep fragments and undecided values as gaps unless explicitly requirements/risks; distinguish speakers from stakeholders; enforce `RSK-`; require dependency-risk links | Targeted T5/T6/T10 passed. Full release gate: 7 pass, T3/T4 needs review, T8 fail; not promoted. See `evaluation/results/t01-t10-v1.0-release-gate-2026-08-03.md` | Pending |
| `extractor-v1.1-embedded-condition-fix` | 2026-08-03 | v1.0 T3 duplicated the five-second refresh interval as `AC-001` even though it was embedded in `FR-001` | Keep an embedded timing/frequency/threshold inside its functional requirement; create an AC only for a separately stated test condition | Targeted T3 rerun passed; Langfuse trace `e485cd3c1841c122b03dd110cf507312` | Pending |
| `extractor-v1.2-generic-user-persona-fix` | 2026-08-03 | v1.0 T4 created `PER-001` from the generic word `Users` | Keep generic user terms inside requirements; create personas only for explicit distinguishable groups or roles with distinct needs | Targeted T4 rerun passed; Langfuse trace `145aae12cb410afe288ed6bc529fe359` | Pending |
| `extractor-v1.3-complete-optional-clarification` | 2026-08-03 | v1.0 T8 captured all canonical items and links but returned `partial` because `simplified view` could be refined | Return `complete` when all stated information is faithfully captured and optional clarification does not block extraction | Targeted T8 passed. Full release gate: 8 pass; T1 failed relationship and T5 failed status boundary. Not promoted. See `evaluation/results/t01-t10-v1.3-release-gate-2026-08-03.md` | Pending |
| `extractor-v1.4-bidirectional-relationship-audit` | 2026-08-03 | v1.3 T1 extracted the correct FR and NFR but omitted their required relationship | Audit `related_item_ids`; link a qualifying NFR and FR in both directions, including across adjacent sentences; prohibit proximity-only stakeholder/deadline links | Targeted T1 passed deterministic evaluation; Langfuse trace `2fd30f89209d1e35befda538496b5600`. Full release gate pending after T5 correction | Pending |
| `extractor-v1.5-product-fragment-status-boundary` | 2026-08-03 | v1.3 T5 correctly kept fragments out of `items` but returned `no_requirements` instead of approved `partial` | Return `partial` for product-relevant fragments with actionable gaps; reserve `no_requirements` for empty, non-product, or clearly non-requirement content; preserve exact fragment values such as `budget TBD` | Full unchanged T1–T10 release gate passed 10/10. See `evaluation/results/t01-t10-v1.5-release-gate-2026-08-03.md` | Promoted |

## Gap Analyzer Version Register

| Version | Date | Trigger / evidence | Change introduced | Verification status | Commit |
|---|---|---|---|---|---|
| `gap-analyzer-v0.1` | 2026-08-03 | Approved contract, grounding, decision, severity, and clarification design | Initial complete Gap Analyzer baseline | First `GA-T1` n8n run was fully grounded but failed all three canonical decision fields by promoting optional clarification records into material gaps | Pending |
| `gap-analyzer-v0.2-materiality-boundary` | 2026-08-03 | `GA-T1` actual returned `partially_sufficient/false/request_clarification`; approved result is `sufficient/true/proceed` | Require a materiality test before promoting `MISS-###` records; explicitly preserve generic users and `Q3` as stated when exact documentation requires no invention | Targeted `GA-T1` rerun passed with 100% groundedness and 3/3 canonical decision agreement; remaining Gap Analyzer regression cases pending | Pending |
| `gap-analyzer-v0.3-contract-precision` | 2026-08-04 | Initial GA-T2 run merged material topics and exposed an outdated parser lookup | Require distinct material gaps and precise trace links; diagnostic severity rule was later reversed after schema reconciliation | Superseded; failed exact nested-field and sufficiency validation | Pending |
| `gap-analyzer-v0.4-schema-decision` | 2026-08-04 | v0.3 used `affected_item_ids`, omitted users, and returned `partially_sufficient` | Enforce exact gap fields, material MISS coverage, normalized categories and the undefined-capability decision boundary | Structurally passed; final independent GA-T2 result needs review at 92.31% because all four severities were `blocking` instead of `high` | Pending |
| `gap-analyzer-v0.5-severity-boundary` | 2026-08-04 | v0.4 overstated missing dimensions as `blocking` | Use `high` for missing dimensions attached to an existing grounded item; reserve `blocking` for no reliable requirement, no meaningful requirements, or unresolved material contradiction | GA-T2 passed 13/13 at 100%; Langfuse trace `7c39feb2c77de8b7467cccbd37737208`; remaining GA regression pending | Pending |
| `gap-analyzer-v0.6-contradiction-contract` | 2026-08-04 | GA-T3 v0.5 copied an extraction-only clarification field and returned `partially_sufficient` for a core blocking contradiction | Enforce exact contradiction fields, map item links, prohibit invented risks/resolution, and classify core blocking contradictions as insufficient | GA-T3 passed 13/13 at 100%; Langfuse trace `e277c0f2afa297cd37d33f243e5dc714`; remaining GA regression pending | Pending |
| `gap-analyzer-v0.7-fragment-gap-coverage` | 2026-08-04 | GA-T5 v0.6 omitted budget TBD, generalized a specific category, and understated a no-item behavior gap | Preserve all material product fragments, explicit TBDs, specific categories, and blocking severity for undefined capability/behavior when no reliable item exists | GA-T5 passed 13/13 at 100%; Langfuse trace `444278460f3941a14b0e58b9246b9f9e`; GA-T9, GA-T10 and full regression pending | Pending |
| `gap-analyzer-v0.8-no-requirements-category` | 2026-08-04 | GA-T9 v0.7 returned the approved blocked decision and `MISS-001` linkage but copied category `requirements_source`; evaluator scored 84.62% | Normalize `requirements_source` to Gap Analysis category `requirements` only for the no-requirements path; retain blocking severity, source linkage, and block decision | GA-T9 passed 13/13 at 100%; n8n execution `7608`; Langfuse trace `25629f451f919250ca70c259f8712e3d`; GA-T10 and full regression pending | Pending |
| `gap-analyzer-v0.9-dependency-uncertainty` | 2026-08-04 | GA-T10 v0.8 returned fully sufficient, omitted the ETA TBD gap, and emitted a risk without `source_risk_ids`; evaluator scored 61.54% | Preserve explicit dependency ETA uncertainty as a medium TBD gap and exact source-linked risk; use `partially_sufficient / true / proceed_with_tbd` without estimating the ETA | Targeted GA-T10 passed 13/13; unchanged six-case regression passed 6/6 at 100% average groundedness. See `evaluation/results/gap-analysis-v0.9-release-gate-2026-08-04.md` | Promoted |

## Version-Control Rules

1. Give every material prompt change a new immutable version identifier.
2. Keep the current canonical prompt as a complete standalone file; use Git history for superseded intermediate prompt text.
3. Update the n8n workflow metadata and sanitized workflow export with the same prompt version.
4. Record the prompt version on every Langfuse trace and evaluation result.
5. Never overwrite original evaluation evidence after a correction. Preserve the original result and add a separate rerun result.
6. Distinguish **applied** from **verified**. A correction is verified only after an approved rerun or regression test exercises it successfully.
7. Add future versions to this register with the trigger, behavior change, verification evidence, and commit.

## Current Baseline

- Promoted version: `extractor-v1.5-product-fragment-status-boundary`
- Promoted prompt: `prompts/requirement-extractor-v1.5.md`
- Last verified baseline: `extractor-v0.8-dependency-risk-fix`
- Output contract: `schemas/requirement-extraction.schema.json`
- Workflow export: `workflows/n8n/prd-genie-requirement-extractor-v0.2.json`
- Final regression obligation: rerun T1-T10 against approved ground truth using one fixed prompt/model/workflow baseline.

### Gap Analyzer baseline

- Promoted version: `gap-analyzer-v0.9-dependency-uncertainty`
- Promoted prompt: `prompts/gap-analyzer-v0.9.md`
- Output contract: `schemas/gap-analysis.schema.json`
- Release evidence: `evaluation/results/gap-analysis-v0.9-release-gate-2026-08-04.md`
- Approved regression scope: GA-T1, GA-T2, GA-T3, GA-T5, GA-T9, and GA-T10
- Release result: 6/6 pass, 100% average groundedness
