# PRD Generation Ground Truth

This dataset evaluates the PRD Generator against the official ten-section template and `schemas/prd-output.schema.json`.

| Test | Source package | Expected artifact | Status | Groundedness target |
|---|---|---|---|---:|
| T11 | Approved T1 package (`HA-R01 / approved`) | JSON and matching Markdown PRD | Awaiting human review | 100% |

T11 may use only `FR-001`, `NFR-001`, `STK-001`, and `DDL-001`. Required fields without approved evidence remain empty or use the exact controlled value `TBD - stakeholder input required`.

