# Baseline Evaluation Summary

> Results will be populated after the workflow and evaluation instrumentation are implemented.

| Test | Capability | Result | Trace | Notes |
|---|---|---|---|---|
| T1 | Detailed extraction | Pass after correction | `6509203ccdf044f9dd98047eda2c4a13` | Contract and semantic pass |
| T2 | Ambiguity handling | Partial | `a0857ea498c09dd4c36fdf2c18ad0244` | Missing report format was not explicit |
| T3 | Contradiction detection | Partial | `4d1d08ec201a3faa552101b307f0a27c` | Classification and status gaps; controls subsequently corrected |
| T4 | Acceptance criteria | Partial | `5afe3913965ca6bbf5177b3e67a2c6d3` | Conditions returned as functional requirements |
| T5 | Incomplete input | Partial | `4581cbb1e21b8aab1813f58ab91739e7` | Clarifications passed; returned `no_requirements` instead of `partial` |
| T6 | Multiple stakeholders | Fail | No success trace | Viewpoints preserved; invalid evidence shape and constraint classification gap |
| T7 | Technical NFRs | Partial | `3eeaca0fc62825d3442ca98276ba0dc9` | Exact values passed; integration returned as FR plus AC instead of NFR |
| T8 | Persona separation | Pass | `0773d9e9cbed86f174fcf30be8c42b10` | Three personas and three matching functional requirements |
| T9 | Empty-input refusal | Pass | `326222fa59c41c3854d4e087a00fc1dd` | Official fixture passed; canonical clarification request omitted |
| T10 | Dependency and risk | Fail; correction applied, rerun pending | `1eacb1ba799432413f48e6887c261c97` | v0.8 adds linked capability/dependency, explicit unknown-ETA risk, exact wording, and status controls |
| T11 | PRD generation | Not run | - | - |
| T12 | Story breakdown | Not run | - | - |
