# S2 Production PRD Official-Template Candidate — Local Validation

## Scope

This evidence covers the additive, inactive **S2 Dynamic Production PRD v0.2 — Official Template Candidate**. It does not change or supersede parent v0.3.3 or the existing production child.

## Candidate controls

| Control | Local result |
|---|---|
| Exact official template headings and order | Pass |
| Structured representation of all ten sections | Pass |
| Existing downstream S2 envelope retained | Pass |
| Approved-item set equality | Pass |
| Citation inventory validation | Pass |
| Unapproved-reference rejection | Pass |
| JSON/Markdown item synchronization | Pass |
| Explicit grounded TBD policy | Pass |
| Candidate active/published state | Inactive local export |

## Canonical fixture execution

The candidate generation and both deterministic validation nodes were executed locally against the approved T11-S2 input packet.

| Metric | Result |
|---|---:|
| Template sections | 10 |
| Approved-item coverage | 4/4 |
| PRD elements | 4 |
| Groundedness | 100% |
| Unsupported claims | 0 |

## Release boundary

The local candidate checks passed. Native n8n results are recorded below. Langfuse evaluator scoring, human review, and any parent-reference change remain pending. No workflow was published, activated, archived, or deleted.

## Native n8n checkpoint

- Initial inactive workflow: `PUqtlwu3Auo3xgJ4`
- Approved fixture: `T11-S2`
- Initial native execution: `10723` — **Pass in 1.542 s**, superseded for human review after correcting stakeholder/persona presentation
- Corrected inactive workflow: `JlQCgx01CUzDLEeY`
- Corrected native execution: `10724` — **Pass in 1.58 s**
- PRD hash: `sha256:e6f10828b117c190dbd64e37f29719f4a7f0270682cffb116305f4117ae9827a`
- PRD trace ID: `e6f10828b117c190dbd64e37f29719f4`
- Template sections: **10**
- Approved-item coverage: **4/4**
- Groundedness: **100%**
- Unsupported claims: **0**
- JSON/Markdown synchronized: **true**
- Next route emitted: `story_breakdown`

The first native manual attempt correctly failed closed on an empty callable-trigger payload. A subsequent import into that draft appended duplicate nodes, so it was renamed **FAILED IMPORT DRAFT — DO NOT USE** and retained for audit rather than deleted. The clean workflow above was created from a fresh shell, imported once with the approved pinned fixture, and passed.

Content inspection of execution `10723` found that the approved stakeholder `STK-001 — Sarah is the PM` was displayed as a user persona to preserve visibility. The candidate was minimally corrected so only approved persona items populate User Personas, while stakeholder facts remain grounded Product Overview context. Corrected execution `10724` is the current human-review candidate.

The candidate remains unpublished and is not referenced by v0.3.3. Langfuse evaluator scoring, human approval, and any parent-reference change remain pending.

## Human-approved final candidate

- Final inactive workflow: `WzLih15YKEFDQqMu`
- Final native execution: `10725` — **Pass in 1.789 s**
- PRD hash: `sha256:7c0140c44595b85708d113ea72129d17ecc7dc595a784fcb6821e530c1d47894`
- PRD trace ID: `7c0140c44595b85708d113ea72129d17`
- Human decision: complete ten-section content and the TBD-versus-empty-section policy approved by Vipin Puri
- State: inactive, unpublished, and not referenced by v0.3.3

Execution `10725` supersedes `10724` as the accepted T11-S2 official-template candidate. Independent Langfuse scoring remains the next step.

## Independent Langfuse shadow evaluation

The approved PRD logic was combined with the existing credential-bound Langfuse shadow handoff in a separate inactive workflow. Production parent v0.3.3 and its published child remain unchanged.

- Inactive shadow candidate workflow: `YtH30JJ8YYqiLvUv`
- Final shadow execution: `10732` — **Succeeded in 2.306 s**
- Langfuse trace: `26b311dfc37865471742641ba9ca1526`
- Environment: `production-agreement-shadow`
- LLM faithfulness: **0.70**
- LLM hallucination: **0.01**
- Code approved-ID coverage: **true**
- Code citation-set validity: **true**
- Code validation pass: **true**
- Code route match: **false**
- Code overall evaluation pass: **false**

The route mismatch is isolated to the existing Code Evaluator contract; content coverage, citation validity, and validation all pass, while both semantic scores are favorable. The Agreement Gate therefore remains in shadow mode and this candidate is not approved for publication or parent-reference replacement. The next action is to review the Code Evaluator's expected route against the PRD child contract before any evaluator or workflow change.

### Route-contract correction and accepted shadow result

Review confirmed that the evaluator correctly expects `decision: continue` and `next_route: story_breakdown`. The shadow trace was being assembled before the return node added the decision field. The inactive shadow handoff was corrected to carry the existing downstream contract into the evaluation payload; neither the evaluator rule nor production v0.3.3 was changed.

- Accepted shadow execution: `10733` — **Succeeded in 2.355 s**
- Accepted Langfuse trace: `b2e3a8defc666cc874a034952e81b7ba`
- LLM faithfulness: **0.72**
- LLM hallucination: **0.00**
- Code approved-ID coverage: **true**
- Code citation-set validity: **true**
- Code validation pass: **true**
- Code route match: **true**
- Code overall evaluation pass: **true**

All three evaluation layers now agree in shadow mode. Publication, parent-reference replacement, and production rollout remain outside this approval.

### Faithfulness evaluation-boundary correction

The `0.72` rationale explicitly accepted the source-derived requirements, performance target, PM, deadline, citations, and empty-input statements, but penalized authorized template and workflow metadata. The inactive trace input was therefore augmented with an explicit evaluation context distinguishing source-derived claims from controlled template scaffolding and system metadata. The PRD, evaluator configuration, and production workflow were not changed.

- Scoped-evaluation execution: `10734` — **Succeeded in 2.372 s**
- Scoped-evaluation Langfuse trace: `6613860f7da59d05d0ae75e3db808275`
- LLM faithfulness: **1.00**
- LLM hallucination: **0.00**
- All five Code Evaluator controls: **true**

Execution `10734` is the accepted final shadow-evaluation result.
