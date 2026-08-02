# Additional Instructor Requirements

These requirements were communicated verbally by the instructor on 2026-08-02 and are tracked alongside the written problem statement, rubric, and Capstone Project Playbook.

| Required artifact | Expected format and content | Current status | Planned location |
|---|---|---|---|
| Business Requirements Document (BRD) | Business problem, users, current process, business objectives, scope, stakeholders, business requirements, success measures, assumptions, constraints, risks, and approvals | Not started | `docs/requirements/BRD.md` |
| Product Requirements Document (PRD) | Product goals, personas, functional and non-functional requirements, acceptance criteria, dependencies, assumptions, open questions, out-of-scope items, and timeline | Not started as a project artifact; the official PRD template is already represented in the output contract | `docs/requirements/PRD.md` |
| Architecture Design | System context, agent workflow, data flow, human approval gate, integrations, security boundaries, observability, failure handling, and deployment view | Partially documented across the README, ADRs, schemas, and workflow mapping; consolidated document still required | `docs/architecture/ARCHITECTURE_DESIGN.md` |
| Architecture Decisions | Important choices documented with context, decision, rationale, alternatives, consequences, and status | In progress through ADR-001 to ADR-003; additional ADRs will be added as decisions are made | `docs/decisions/ADR-*.md` |
| Ground Truth Dataset | Versioned, human-reviewed expected outputs for evaluation inputs, including exact values, classifications, evidence, allowed variation, prohibited claims, and pass criteria | Partial: T1-T10 fixtures currently contain checks, not complete canonical outputs | `evaluation/ground-truth/` |

## Ground Truth Quality Requirements

Ground truth is stronger than a list of expected keywords. Each case should include:

- Stable test ID and source input.
- Canonical expected structured output using the applicable JSON contract.
- Exact names, numbers, dates, versions, units, and source quotations that must be preserved.
- Required classifications and relationships.
- Explicitly allowed variations where wording may differ without changing meaning.
- Prohibited unsupported claims and hallucinations.
- Expected ambiguity, contradiction, missing-information, or refusal behavior.
- Human reviewer, review date, dataset version, and approval status.
- Automated checks where fields can be evaluated deterministically.

The ground truth should cover T1-T10 Requirement Extraction, T11 PRD Generation, and T12 Story Breakdown. Baseline model outputs must never overwrite the approved ground truth; corrections require a reviewed dataset version change.

## Immediate Sequence

1. Complete and verify the T10 prompt correction using a before-and-after trace comparison.
2. Create the BRD, project PRD, and consolidated Architecture Design in Markdown.
3. Review existing ADRs and add missing decisions for orchestration, human approval, grounding, failure handling, and evaluation.
4. Build and human-review the T1-T12 ground truth dataset.
5. Run the final baseline against the approved ground truth and retain evaluation evidence.
