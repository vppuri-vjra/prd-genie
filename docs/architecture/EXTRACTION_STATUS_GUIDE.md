# Requirement Extraction Status Guide

## Purpose

This guide is the human-readable authority for selecting `extraction_status` in Requirement Extractor output. The JSON Schema controls the allowed values; this guide explains their meaning and decision boundary.

## Allowed statuses

| Status | Meaning | Typical output | Example |
|---|---|---|---|
| `complete` | All explicit, reliable source information has been extracted and no material ambiguity, contradiction, or clarification dependency remains | Usually one or more items; contradictions empty; optional non-material missing-information questions | T1 and T4 |
| `partial` | Product-relevant information exists, but a material ambiguity, incompleteness, unresolved contradiction, or clarification dependency remains | May contain one or more items, or an empty `items` array with actionable missing information | T2, T3 and T5 |
| `no_requirements` | The input is empty, genuinely non-product, or contains no meaningful product-requirement content | Empty `items`; no generated requirements; at least one grounded request for a source containing requirements | T9 |

## Status and item combinations

| Status | `items` | Valid? | Interpretation |
|---|---:|---|---|
| `complete` | One or more | Yes | Explicit requirements or related facts were fully extracted |
| `complete` | Zero | Normally no | No extracted requirement usually means `no_requirements`; treat any exception as a contract-review issue |
| `partial` | One or more | Yes | Some reliable items exist, but material gaps or contradictions remain |
| `partial` | Zero | Yes | Product-relevant fragments exist, but nothing is specific enough to become a reliable item; actionable clarification remains, as in T5 |
| `no_requirements` | Zero | Yes | No meaningful product requirement can be extracted, as in T9 |
| `no_requirements` | One or more | No | Deterministic validation must reject this combination |

## Decision sequence

1. Determine whether the source contains meaningful product-related content.
2. If it does not, return `no_requirements`, empty `items`, and a grounded request for a source containing product requirements.
3. If it does, extract only reliable, evidence-supported items.
4. Identify material ambiguities, contradictions, and missing information.
5. Return `partial` when any material issue remains—even when `items` is empty.
6. Return `complete` only when every explicit item and explicitly stated uncertainty has been captured and no material issue remains.

## Important boundary rules

| Situation | Required handling |
|---|---|
| Unresolved contradiction | Status must be `partial` |
| Vague product fragments with actionable questions but no reliable items | Status must be `partial`; `items: []` is valid |
| Empty or genuinely irrelevant input | Status must be `no_requirements`; `items: []` |
| Explicitly stated unknown value, such as `ETA unknown` | Preserve the uncertainty as grounded information; it does not by itself require `partial` |
| Optional, non-material clarification after all explicit requirements are extracted | May remain `complete` |
| Material clarification needed before a requirement can be understood or approved | Status must be `partial` |

## Examples

| Test | Source pattern | Status | Why |
|---|---|---|---|
| T1 | Specific filter behavior, performance target, PM and deadline | `complete` | All explicit information is extractable; optional persona and Q3-date clarification does not alter the stated requirements |
| T2 | “Better reporting” with an undefined competitor reference | `partial` | An ambiguous functional desire exists, but metrics, format and users are missing |
| T3 | Five-second refresh plus API-call minimization | `partial` | Both items are extractable, but their interaction is unresolved |
| T4 | Export behavior with exact PDF and CSV conditions | `complete` | Functional behavior and acceptance criteria are explicit |
| T5 | Dashboard, real-time and budget fragments | `partial` | No reliable item exists, but the fragments support actionable product clarification |
| T9 | Meeting occurred; notes contain nothing | `no_requirements` | No meaningful product-related content exists |
| T10 | Capability, dependency and `ETA unknown` | `complete` | The explicit uncertainty is captured as a grounded risk; nothing is silently resolved |

## Status is not a quality score

`complete` does not mean that the source document contains every detail needed to build the product. It means the extractor completely captured the explicit source content without a material unresolved interpretation issue.

Likewise, `partial` does not mean the extraction failed. It means the output correctly preserved useful information while making material uncertainty visible.

Grounding, extraction completeness, classification accuracy, and schema validity are separate evaluation dimensions.

## Downstream handling

| Status | Default orchestration behavior |
|---|---|
| `complete` | Eligible for deterministic validation, gap analysis, and human review |
| `partial` | Route to gap analysis and human clarification/review; do not silently promote unresolved content to approved facts |
| `no_requirements` | Stop PRD generation and request suitable product-requirement source material |

Human approval remains required before extracted information progresses to PRD generation.

## Related artifacts

- Schema: `schemas/requirement-extraction.schema.json`
- Canonical prompt: `prompts/requirement-extractor-v0.8.md`
- Prompt version history: `prompts/README.md`
- Workflow mapping: `workflows/n8n/REQUIREMENT_EXTRACTOR_MAPPING.md`
- Ground-truth cases: `evaluation/ground-truth/requirement-extraction/`
- T5 status-boundary evidence: `evaluation/results/t5-requirement-extractor.md`

If this guide, the prompt, and workflow behavior disagree, treat the mismatch as a versioned contract defect and reconcile all three before evaluation.
