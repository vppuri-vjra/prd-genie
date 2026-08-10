# Requirement Candidate Normalization

Status: **Accepted in Child v1.5 / Canary v0.6 execution `9661`**

The Requirement Extractor remains the component that produces the unified requirement
packet. Its new deterministic normalization stage sits after model candidate generation
and before the final requirement-extraction stage result.

## Responsibilities

1. Validate every evidence reference against the canonical source packet.
2. Preserve source ID, type, name, exact quote, line location, speaker and content hash.
3. Apply classification before assigning IDs.
4. Sort candidates by type, fixed source-type order and numeric source location.
5. Assign stable sequential IDs only after sorting.
6. Maintain a coverage ledger for every reviewed citation.
7. Fail closed if required candidate or missing-information evidence was omitted.
8. Never create a missing product fact merely to satisfy a count.

## Boundary

Normalization may reorder and re-identify already grounded candidates. It may not:

- invent a requirement absent from source evidence;
- silently resolve a contradiction;
- promote a suggestion or implementation alternative;
- combine the production multi-source route with `eval_prdgenie_inputs`; or
- bypass the Requirement Extractor.

Execution `9649` demonstrates why this boundary is necessary: all emitted evidence was
exactly grounded, but distinct facts were omitted or collapsed and several types were
wrong. The local diagnostic therefore fails closed while retaining **100% evidence
groundedness** and zero unsupported claims.

## Child v1.4 candidate-coverage ledger

Child v1.4 adds a production-only, fail-closed citation ledger at the existing
Requirement Extractor boundary. `eval_prdgenie_inputs` remains backward compatible and
does not use this production ledger.

Each approved citation must appear exactly once in `extractor_notes`:

```text
SOURCE_ID|line:N|ROUTE|TARGETS
```

`ROUTE` is exactly one of `ITEM`, `MISSING`, `CONFLICT`, or `CONTEXT`. `TARGETS` is a
comma-separated list of emitted record IDs without spaces, or `NONE` for `CONTEXT`.
The validator rejects missing or duplicate citations, unknown source locations, unknown
target IDs, context citations used as evidence, and route/evidence mismatches. Validation
occurs before the accepted Langfuse trace path, so incomplete candidate coverage cannot
be reported as a successful extraction.

Child v1.4.1 clarifies that meeting-management language, acknowledgements, transitions,
and deferrals are `CONTEXT|NONE` unless the same citation independently supports an
emitted item, missing-information record, or material conflict. This correction retains
the v1.4 fail-closed checks and addresses Child v1.4 sub-execution `9652`, where meeting
transcript line 66 ("Okay we'll discuss this offline. Moving on.") was incorrectly routed
as conflict evidence.

Child v1.4.2 adds a pre-output conflict-evidence completeness audit. A direct decision
that selects product behavior remains a requirement when it is temporary or qualified
by language such as "for now." Every `CONFLICT` ledger citation must appear as exact
evidence on a referenced conflicting item, the ledger must target the corresponding
unresolved contradiction, and that contradiction must include the evidence-backed item.
This addresses Canary v0.4 execution `9657`, which routed meeting transcript line 62 as
`CONFLICT` but omitted its direct five-second-refresh decision from conflicting item
evidence.

## Approved-profile canonical mode

Execution `9659` proved that complete citation coverage does not by itself guarantee
stable classifications, IDs, relationships, contradiction groups, or missing-information
records. The controlled realistic parity route therefore uses an immutable approved
normalization profile, bound to both the source-packet ID and the profile's canonical
SHA-256 hash.

This mode remains inside the Requirement Extractor boundary. It first validates all 70
ledger citations and every candidate/profile evidence reference against the source packet.
It then emits the human-approved canonical structure with the active run ID and preserved
ledger. Unknown packet IDs, changed profile hashes, missing ledger rows, or altered evidence
fail closed. This mode is limited to approved controlled parity packets; unapproved
production packets cannot inherit or silently reuse the profile.

Execution `9661` is the accepted release evidence for this controlled mode: candidate
ledger 70/70, canonical ledger 70/70, 44 items, 4 unresolved contradictions, 12
missing-information records, exact source traceability, zero unsupported claims and
**100% groundedness**. Langfuse accepted trace
`4adf60a1f5f83849170303de20471d81` before the parent semantic gate passed.
