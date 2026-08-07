# Traceability Model

## Chain of evidence

```text
Source packet ID + source ID + content hash + exact source quote/location
  -> Extracted item ID
    -> Human approval
      -> PRD requirement ID
        -> Epic / feature / story IDs
          -> Evaluation checks and Langfuse trace
```

## Identifier conventions

| Artifact | Format | Example |
|---|---|---|
| Workflow run | `RUN-*` | `RUN-T1-001` |
| Source packet | `SP-*` | `SP-T1-PB-MT-SN` |
| Source | `SRC-*` | `SRC-T1-PB-001` |
| Functional requirement | `FR-###` | `FR-001` |
| Non-functional requirement | `NFR-###` | `NFR-001` |
| Acceptance criterion | `AC-###` | `AC-001` |
| Persona | `PER-###` | `PER-001` |
| Stakeholder | `STK-###` | `STK-001` |
| Deadline | `DDL-###` | `DDL-001` |
| Dependency | `DEP-###` | `DEP-001` |
| Constraint | `CON-###` | `CON-001` |
| Assumption | `ASM-###` | `ASM-001` |
| Risk | `RSK-###` | `RSK-001` |
| Contradiction | `CTR-###` | `CTR-001` |
| Missing information | `MISS-###` | `MISS-001` |
| Gap | `GAP-###` | `GAP-001` |
| Open question | `OQ-###` | `OQ-001` |
| Epic | `EPIC-###` | `EPIC-001` |
| Feature | `FEAT-###` | `FEAT-001` |
| User story | `US-###` | `US-001` |

## Review behavior

Human approval records the exact extraction IDs that may proceed. If a reviewer modifies a requirement, both original and revised text plus the reason are retained. Downstream agents receive only the approved view, while the trace preserves the earlier extraction.

For multi-source inputs, Requirement Extractor evidence also preserves `source_id`, `source_type`, `source_name`, exact `location`, verbatim `quote`, and the source `content_hash`. The ingestion layer may validate these fields but may not produce or merge requirements itself.

The controlled PB+MT+SN chain was verified in n8n execution `9638`: source packet `SP-T1-PB-MT-SN` produced exactly `FR-001`, `NFR-001`, `STK-001`, and `DDL-001`, with exact evidence and hashes preserved. Langfuse accepted trace `2f0e20055d7765ca3bb0bb0d2bea866b`; groundedness was **100%** and unsupported claims were **0**.
## Realistic v4 Human Approval decision coverage

The authorized approval input is pinned to Requirement Extractor execution `9722`, Gap Analyzer execution `9723`, and parent trace `26c7466f817aa1511f4a4e239bb52a62`. `decision-to-prd-disposition-v4.json` accounts for all 17 August 7 decisions exactly once: 15 effective and two superseded audit records. The signed result must carry the effective decision IDs and complete disposition allowlist. PRD Generation remains stopped.

Human Approval execution `9724` satisfied that contract. Reviewer `Vipin` approved the exact 19-item allowlist on `2026-08-07`; Langfuse accepted stage trace `f4e298e120d6503b5dfac4688adae1db`; `stop_before_prd_generation=true` and `prd_generation_invoked=false`.

Realistic v4 PRD execution `9725` accounts for 19/19 signed items, 17/17 dispositions, 15/15 effective decisions, two superseded audit-only records, and all six source manifests. JSON and Markdown are synchronized; groundedness is 100% with zero unsupported claims. Langfuse accepted trace `f8879ebe22d888152a77f892230c62ba`; Story Breakdown was not invoked.

## Realistic v4 Story Breakdown lineage

The Story Breakdown starts only from PRD execution `9725`. It preserves the packet/run/parent/approval/PRD lineage and copies the six-source manifest and 17-decision disposition ledger without mutation. Its coverage ledger accounts for all 19 signed PRD item IDs and links active story behavior to 3 epics, 4 features, 7 stories, and 12 criteria. Deferred, superseded, and controlled-TBD decisions remain non-active.

Native execution `9726` of workflow `KKYU4QssjUTovd8U` stopped in the deterministic breakdown validator on `duplicate IDs`. This was a false duplicate-parent-ID integration defect: Story Breakdown trace construction and Langfuse ingestion were not invoked, so no runtime hierarchy, grounding result, or trace is accepted. The upstream PRD `9725` lineage remains intact and 100% grounded.

The v0.2 workflow preserves that failure evidence and the complete upstream lineage while correcting ID uniqueness by hierarchy level. Native execution `9727` passed 3/4/7/12 counts, 19/19 coverage, 6/6 source-hash preservation, 17/17 decision provenance, JSON/Markdown equivalence, and four true-duplicate negative cases. Langfuse accepted trace `f772ec699a437bc70de67ac124976161` with HTTP 200.

## Realistic v4 Story Breakdown runtime — 2026-08-07

Approved PRD execution `9725` / trace `f8879ebe22d888152a77f892230c62ba` → Story Breakdown workflow `MEm1VyILsMyn53HU` → execution `9727` → trace `f772ec699a437bc70de67ac124976161`. Result: 3 epics, 4 features, 7 stories, 12 criteria; 19/19 approved IDs and 6/6 sources covered; zero orphans; no active deferred, superseded, or controlled-TBD scope; groundedness 100%; unsupported claims 0.
