# GA-T1 Semantic Evaluator Adjudication

Adjudication ID: `GA-T1-HUMAN-ADJUDICATION-2026-08-11`

## Trigger

The fresh shadow evaluation produced Langfuse faithfulness `0.50` and hallucination `0.08` for trace `f9cca1f9ab631a78a80edb3bf02d0b34`. The LLM judge questioned whether the missing persona and precise Q3 date support the `sufficient / proceed` decision.

## Human disposition

**Confirm existing ground truth; refine evaluator policy.**

The source contains a usable functional requirement, measurable performance target, named product owner, and stated Q3 deadline. Persona detail and the exact year/date are controlled non-material unknowns for this stage. `generation_allowed: true` means eligible to continue to mandatory human approval; it does not authorize automatic PRD release.

## Governed outcome

- Canonical Gap Analyzer output: unchanged.
- Business source: unchanged.
- Evaluator interpretation: stage policy and mandatory human-review routing must be included when judging the sufficiency decision.
- Agreement Gate: remains in shadow mode.

## Approval

Human reviewer: Vipin  
Decision date: 2026-08-11  
Disposition: approved evaluator-policy clarification
