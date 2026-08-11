# PRD Generation Ground Truth

This dataset evaluates the PRD Generator against the official ten-section template and `schemas/prd-output.schema.json`.

| Test | Source package | Expected artifact | Status | Groundedness target |
|---|---|---|---|---:|
| T11 | Approved T1 package (`HA-R01 / approved`) | JSON and matching Markdown PRD | Approved by Vipin on 2026-08-05 | 100% |
| T11-S2 | Approved T1 package adapted to the current S2 `production_prd` contract | Four citation-linked PRD elements, Markdown, hashes, dispositions, and route | Approved by Vipin on 2026-08-10 | 100% |

T11 may use only `FR-001`, `NFR-001`, `STK-001`, and `DDL-001`. Required fields without approved evidence remain empty or use the exact controlled value `TBD - stakeholder input required`.

T11-S2 preserves the same four-item scope but evaluates the current S2 workflow contract. It does not replace the historical ten-section T11 artifact.
