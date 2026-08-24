# PRD Genie v0.3.8 — Submission Package Manifest

This manifest is the source of truth for the final Interview Kickstart ZIP. It distinguishes files stored in the public GitHub repository, files that will be physically included in the ZIP, and evidence that remains external by design.

> **Formal submission baseline — use for grading and all acceptance claims:** n8n execution `11901` · run `RUN-S2-11902-16e7090e`
>
> **Supplementary demonstration evidence only — does not replace the formal baseline:** n8n execution `11958` · run `RUN-S2-11959-16e7090e`
> **Repository:** https://github.com/vppuri-vjra/prd-genie  
> **Accepted v0.3.8 candidate package:** https://github.com/vppuri-vjra/prd-genie/tree/main/releases/v0.3.8
> **Published submission page:** https://vjra.us/prd-genie.html  
> **Published GitHub Download section:** https://vjra.us/prd-genie.html#github-download
> **Approved six-input inventory:** https://github.com/vppuri-vjra/prd-genie/tree/main/evaluation/fixtures/multi-source/realistic-v1
> **Q1 — Ideation:** [Published view](https://vjra.us/prd-genie.html#q1-ideation) · [PDF](https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/written-responses/PRD-Genie-Q1-Ideation-v0.3.8.pdf) · [GitHub source](https://github.com/vppuri-vjra/prd-genie/blob/main/docs/assignments/q1-ideation.md)
> **Q2 — Program Charter:** [Published view](https://vjra.us/prd-genie.html#q2-program-charter) · [PDF](https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/written-responses/PRD-Genie-Q2-Program-Charter-v0.3.8.pdf) · [GitHub source](https://github.com/vppuri-vjra/prd-genie/blob/main/docs/assignments/q2-program-charter.md)
> **Q3 — Build and Architecture:** [Published view](https://vjra.us/prd-genie.html#q3-build-architecture) · [PDF](https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/written-responses/PRD-Genie-Q3-Build-and-Architecture-v0.3.8.pdf) · [GitHub source](https://github.com/vppuri-vjra/prd-genie/blob/main/docs/assignments/q3-build-prd-orchestrator.md)
> **Q4 — Reflection:** [Published view](https://vjra.us/prd-genie.html#q4-reflection) · [PDF](https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/written-responses/PRD-Genie-Q4-Reflection-v0.3.8.pdf) · [GitHub source](https://github.com/vppuri-vjra/prd-genie/blob/main/docs/assignments/q4-reflection.md)
> **Two-page Architecture Write-up — PDF:** https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.pdf
> **Two-page Architecture Write-up — Word:** https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.docx
> **31-slide presentation — PDF:** https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pdf
> **31-slide presentation — PPTX:** https://github.com/vppuri-vjra/prd-genie/blob/main/releases/v0.3.8/presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pptx
> **Complete Demo with Artifacts:** https://github.com/vppuri-vjra/prd-genie/releases/tag/v0.3.8-complete-demo
> **ZIP status:** Not yet assembled. “Yes” below means required physical inclusion in the final ZIP; it does not claim that ZIP verification has already passed.

## Packaging policy

The final archive will contain a clean snapshot of the complete public repository working tree plus the final 7:08 MP4 demonstration. Repository-relative paths will be preserved so internal links continue to work. The demo will be stored at `demo/PRD-Genie-Complete-Demo-with-Artifacts-v0.3.8.mp4`. The archive will exclude Git metadata, local configuration, secrets, caches, temporary files, duplicate video exports, and raw section clips. The exact Git commit, archive filename, byte size, SHA-256 checksum, and open-test result will be recorded after assembly.

## Authoritative input-set evolution

The project began with three immutable discovery sources. The governed clarification process then added three dated stakeholder-decision sources. Formal baseline execution `11901` consumed the resulting six-document approved packet. The later clarification files are human-authored governance evidence, not model-generated assumptions, and they do not erase the original source statements. Where a later decision supersedes an earlier position, both remain traceable and the applicable decision ID records the controlled precedence.

| Input phase | File | Evidence role |
| --- | --- | --- |
| Initial discovery | [`product-brief.txt`](evaluation/fixtures/multi-source/realistic-v1/product-brief.txt) | Original product brief; immutable source evidence |
| Initial discovery | [`meeting-transcripts.txt`](evaluation/fixtures/multi-source/realistic-v1/meeting-transcripts.txt) | Original meeting record; immutable source evidence |
| Initial discovery | [`stakeholder-notes.txt`](evaluation/fixtures/multi-source/realistic-v1/stakeholder-notes.txt) | Original stakeholder notes; immutable source evidence |
| Governed clarification — August 7, 2026 | [`stakeholder-clarifications-2026-08-07.md`](evaluation/fixtures/multi-source/realistic-v1/stakeholder-clarifications-2026-08-07.md) | Dated stakeholder decisions resolving, deferring, or controlling recorded gaps |
| Governed amendment — August 7, 2026 | [`stakeholder-clarification-amendment-2026-08-07.md`](evaluation/fixtures/multi-source/realistic-v1/stakeholder-clarification-amendment-2026-08-07.md) | Approved amendments with explicit decision IDs and supersession scope |
| Governed mobile-release clarification — August 7, 2026 | [`stakeholder-clarification-mobile-release-2026-08-07.md`](evaluation/fixtures/multi-source/realistic-v1/stakeholder-clarification-mobile-release-2026-08-07.md) | Approved mobile-release decision and production-launch applicability |

**Counting convention:** “three original inputs” describes the discovery starting point; “six approved inputs” describes the complete packet used by the formal submission baseline. Both statements are correct when their phase is stated.

## Required deliverables and evidence

| Deliverable or evidence | Requirement mapping | GitHub location | Physical ZIP | External/public location | Evidence class | Current verification |
| --- | --- | --- | :---: | --- | --- | --- |
| Package entry guide | Reproducibility and reviewer navigation | [`README.md`](README.md) | Yes | [Repository](https://github.com/vppuri-vjra/prd-genie) | Submission | Current |
| Submission package manifest | Final upload inventory and ZIP reconciliation | [`SUBMISSION-PACKAGE-MANIFEST.md`](SUBMISSION-PACKAGE-MANIFEST.md) | Yes | GitHub root after publication | Submission | Current; ZIP reconciliation pending |
| Q1 — Ideation | Q1 rubric | [`docs/assignments/q1-ideation.md`](docs/assignments/q1-ideation.md) | Yes | [Published Q1](https://vjra.us/prd-genie.html#q1-ideation) | Submission | Current |
| Q2 — Program Charter | Q2 rubric | [`docs/assignments/q2-program-charter.md`](docs/assignments/q2-program-charter.md) | Yes | [Published Q2](https://vjra.us/prd-genie.html#q2-program-charter) | Submission | Current |
| Q3 — Build PRD Orchestrator | Q3 rubric | [`docs/assignments/q3-build-prd-orchestrator.md`](docs/assignments/q3-build-prd-orchestrator.md) | Yes | [Published Q3](https://vjra.us/prd-genie.html#q3-build-architecture) | Submission | Current |
| Q4 — Reflection | Q4 rubric | [`docs/assignments/q4-reflection.md`](docs/assignments/q4-reflection.md) | Yes | [Published Q4](https://vjra.us/prd-genie.html#q4-reflection) | Submission | Current |
| Q1 — fixed-layout PDF | Q1 rubric; standalone reviewer copy | [`releases/v0.3.8/written-responses/PRD-Genie-Q1-Ideation-v0.3.8.pdf`](releases/v0.3.8/written-responses/PRD-Genie-Q1-Ideation-v0.3.8.pdf) | Yes | GitHub open/download | Submission | Current; one page visually verified |
| Q2 — fixed-layout PDF | Q2 rubric; standalone reviewer copy | [`releases/v0.3.8/written-responses/PRD-Genie-Q2-Program-Charter-v0.3.8.pdf`](releases/v0.3.8/written-responses/PRD-Genie-Q2-Program-Charter-v0.3.8.pdf) | Yes | GitHub open/download | Submission | Current; two pages visually verified |
| Q3 — fixed-layout PDF | Q3 rubric; standalone reviewer copy | [`releases/v0.3.8/written-responses/PRD-Genie-Q3-Build-and-Architecture-v0.3.8.pdf`](releases/v0.3.8/written-responses/PRD-Genie-Q3-Build-and-Architecture-v0.3.8.pdf) | Yes | GitHub open/download | Submission | Current; two pages visually verified |
| Q4 — fixed-layout PDF | Q4 rubric; standalone reviewer copy | [`releases/v0.3.8/written-responses/PRD-Genie-Q4-Reflection-v0.3.8.pdf`](releases/v0.3.8/written-responses/PRD-Genie-Q4-Reflection-v0.3.8.pdf) | Yes | GitHub open/download | Submission | Current; two pages visually verified |
| Architecture write-up — Markdown | Playbook 1–2 page architecture write-up; editable source | [`releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.md`](releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.md) | Yes | GitHub | Formal baseline | Current |
| Architecture write-up — Word | Playbook 1–2 page architecture write-up; editable copy | [`releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.docx`](releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.docx) | Yes | GitHub download | Formal baseline | Current; two pages rendered |
| Architecture write-up — PDF | Playbook 1–2 page architecture write-up; fixed-layout copy | [`releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.pdf`](releases/v0.3.8/architecture/PRD-Genie-Architecture-Writeup-v0.3.8.pdf) | Yes | GitHub open/download | Formal baseline | Current; two pages visually verified |
| Business Requirements Document | Instructor-required document | [`docs/requirements/BRD.md`](docs/requirements/BRD.md) | Yes | GitHub | Submission | Current |
| Product Requirements Document | Instructor-required document | [`docs/requirements/PRODUCT_PRD.md`](docs/requirements/PRODUCT_PRD.md) | Yes | GitHub | Submission | Current |
| Consolidated architecture design | Instructor-required technical design | [`docs/architecture/ARCHITECTURE_DESIGN.md`](docs/architecture/ARCHITECTURE_DESIGN.md) | Yes | GitHub | Supporting design | Current |
| Architecture decisions | Tool choice, contracts, and model baseline rationale | [`docs/decisions/`](docs/decisions/) | Yes | GitHub | Supporting design | Current |
| Architecture diagram | Playbook diagram requirement | Embedded in the architecture DOCX/PDF and presentation slide 7; editable Mermaid sources in [`assets/diagrams/`](assets/diagrams/) | Yes | GitHub and presentation | Formal baseline | Current |
| Approved six-document input packet | Formal execution inputs, provenance, hashes, and governed clarification history | [`evaluation/fixtures/multi-source/realistic-v1/`](evaluation/fixtures/multi-source/realistic-v1/README.md) | Yes | [GitHub input inventory](https://github.com/vppuri-vjra/prd-genie/tree/main/evaluation/fixtures/multi-source/realistic-v1) | Formal baseline `11901` | 6/6 physical inputs present and tracked; v4 packet accepted |
| Nine v0.3.8 n8n workflow exports | Implementation and reproducibility | [`releases/v0.3.8/workflows/`](releases/v0.3.8/workflows/) | Yes | GitHub download | Formal baseline | 9/9 present |
| Workflow inventory and live IDs | Reproducibility, call graph, execution evidence | [`releases/v0.3.8/evidence/workflow-inventory-v0.3.8.md`](releases/v0.3.8/evidence/workflow-inventory-v0.3.8.md) | Yes | GitHub | Formal baseline | Current |
| Schemas, prompts, and supporting implementation | Rebuild and contract inspection | [`schemas/`](schemas/), [`prompts/`](prompts/), [`workflows/`](workflows/) | Yes | GitHub | Supporting implementation | Included by repository snapshot policy |
| T1–T12 ground truth | Baseline test dataset | [`evaluation/ground-truth/`](evaluation/ground-truth/) | Yes | GitHub | Formal evaluation | T1–T12 present and human reviewed |
| T1–T12 baseline results | Playbook baseline evidence; 12/12 summary | [`evaluation/results/baseline-summary.md`](evaluation/results/baseline-summary.md) | Yes | GitHub | Formal evaluation | Current |
| Detailed evaluation controls, outputs, and receipts | Deterministic and semantic evidence | [`evaluation/`](evaluation/) | Yes | GitHub | Formal and historical evaluation | Included by repository snapshot policy |
| Accepted run summary | Execution, run ID, release, tokens, cost | [`releases/v0.3.8/evidence/run-summary.json`](releases/v0.3.8/evidence/run-summary.json) | Yes | GitHub | Formal baseline `11901` | Current |
| Accepted final PRD | Planning-ready output | [`releases/v0.3.8/evidence/final-prd.md`](releases/v0.3.8/evidence/final-prd.md) | Yes | GitHub | Formal baseline `11901` | Current |
| Accepted story breakdown | Epic / Feature / Story output | [`releases/v0.3.8/evidence/story-breakdown.json`](releases/v0.3.8/evidence/story-breakdown.json) | Yes | GitHub | Formal baseline `11901` | Current |
| Accepted traceability data | Bidirectional lineage and reconciliation | [`releases/v0.3.8/evidence/traceability.json`](releases/v0.3.8/evidence/traceability.json) | Yes | GitHub | Formal baseline `11901` | Current |
| Human-readable accepted artifact reviews | PRD, hierarchy, sizing, traceability, citation dispositions | [`releases/v0.3.8/evidence/`](releases/v0.3.8/evidence/) | Yes | GitHub | Formal baseline `11901` | Current |
| Formal-baseline workflow and execution screenshots | Workflow canvas, accepted run, child execution, Langfuse overview | [`releases/v0.3.8/screenshots-and-traces/`](releases/v0.3.8/screenshots-and-traces/) | Yes | GitHub | Formal baseline `11901` | Current |
| Supplementary run screenshots and trace captures | Post-tidy-up demonstration evidence | [`releases/v0.3.8/screenshots-and-traces/supplementary-11958/`](releases/v0.3.8/screenshots-and-traces/supplementary-11958/) | Yes | GitHub | Supplementary `11958` | Clearly labeled supplementary |
| Supplementary Langfuse HTML report | Traces, evaluators, latency, tokens, and cost | [`releases/v0.3.8/evidence/langfuse/Langfuse-Complete-Trace-Evidence-11958.html`](releases/v0.3.8/evidence/langfuse/Langfuse-Complete-Trace-Evidence-11958.html) | Yes | [Published report](https://vjra.us/prd-genie-langfuse-11958.html) | Supplementary `11958` | Current |
| Editable presentation | Slide-deck deliverable | [`releases/v0.3.8/presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pptx`](releases/v0.3.8/presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pptx) | Yes | GitHub open/download | Submission | Current |
| Fixed-layout presentation | Slide-deck review copy | [`releases/v0.3.8/presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pdf`](releases/v0.3.8/presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pdf) | Yes | GitHub open/download | Submission | Current; 31 pages |
| Complete Demo with Artifacts | Demonstration of architecture, execution, artifacts, evaluation, release, and lessons | GitHub Release asset; not stored in the Git working tree | **Yes — `demo/PRD-Genie-Complete-Demo-with-Artifacts-v0.3.8.mp4`** | [7:08 demo release](https://github.com/vppuri-vjra/prd-genie/releases/tag/v0.3.8-complete-demo) | Demonstration using `11958`; `11901` remains formal baseline | Published; local source is 34,315,747 bytes |
| Instructor and upload checklists | Final submission controls | [`docs/submission/INSTRUCTOR_REQUIREMENTS.md`](docs/submission/INSTRUCTOR_REQUIREMENTS.md), [`docs/submission/GRADING_CHECKLIST.md`](docs/submission/GRADING_CHECKLIST.md) | Yes | GitHub | Submission administration | Current; final ZIP/form steps pending |

## External or reference-only items

| Item | In GitHub | Physical ZIP | Reason and verification path |
| --- | :---: | :---: | --- |
| Live Google Drive input and output folders | No | No | Runtime systems are external. File IDs, hashes, receipts, exported artifacts, and screenshots are preserved in the repository evidence. |
| Live n8n executions `11901` and `11958` | No | No | Platform records are external. Workflow JSON, execution IDs, run IDs, output evidence, and screenshots are included. |
| Live Langfuse project and traces | No | No | Platform records are external. Evaluator values, trace captures, and the supplementary HTML evidence report are included. |
| vjra.us submission portal | No | No | Public evaluator-facing index; link is recorded above and in the repository README. |
| Duplicate continuous-timeline MP4 and raw section clips | No | No | The final named 7:08 demo is included once; duplicate exports and editing components are excluded to keep the package unambiguous. |
| Capstone Project Playbook and PRD Genie Problem Statement PDFs | No | No | Course-provided reference material, not student-authored deliverables. Evaluators already possess the governing documents. |
| Obsidian working vault and recording work files | No | No | Working documentation and raw production material are not required submission deliverables; final evidence is preserved in GitHub. |
| Credentials, `.env` files, API keys, signed n8n resume URLs, caches, and temporary files | No | No | Explicitly excluded for security and privacy. `.env.example` contains placeholders only and may be included. |

## Final ZIP verification record

Complete this section only after the archive is assembled and tested.

| Control | Result |
| --- | --- |
| Archive filename | Pending |
| Source Git commit | Pending |
| Archive size | Pending; must be no more than 1 GB |
| SHA-256 checksum | Pending |
| Archive opens successfully | Pending |
| Required paths compared with this manifest | Pending |
| Secrets and temporary-file scan | Pending |
| Demo URL opened successfully | Pending |
| vjra.us submission page opened successfully | Pending |
| Ready for Interview Kickstart upload | **No — pending final ZIP assembly and verification** |

## Submission form values

| Field | Value / control |
| --- | --- |
| Email | Enter the learner email associated with the submission account |
| Learner name | Vipin Puri |
| Capstone Project Name | **PRD Genie — AI-Powered Product Documentation Assistant** |
| File upload | Select the single verified ZIP recorded above |
| Finality | Do not submit until the filename, size, and archive verification are visibly confirmed; the form states that submitted files cannot be edited or removed |
