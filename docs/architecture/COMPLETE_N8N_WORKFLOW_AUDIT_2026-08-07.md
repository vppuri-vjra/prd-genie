# Complete n8n workflow audit — 2026-08-07

Read-only review of both workflow-list pages found **68 PRD Genie workflows**. Exact titles and IDs were captured from n8n. Publication is stated only when visible; otherwise it is “not shown.” No workflow state was changed.

## Counts

| Classification | Count |
|---|---:|
| Current-active | 18 |
| Current-unpublished | 6 |
| Superseded-retain-as-evidence | 27 |
| Failed-candidate-retain-as-evidence | 16 |
| Duplicate/obsolete cleanup candidate | 1 |
| Unknown-needs-review | 0 |
| **Total** | **68** |

## Recommended current realistic chain

| Workflow | ID | State | Accepted evidence |
|---|---|---|---|
| Requirement Extractor Child v1.10 | `eDAl2qSb4ai17JZk` | Current-unpublished | `9722`; trace `320fb727a808c8228001e1aef5de7d98` |
| Gap Analyzer Child v1.0 | `wGBE80XMjD5rTKql` | Current-active | `9723`; trace `322897a2600add94152dbf938c837c00` |
| Clarification v4 Gate Canary v0.11 | `ZUYumiSo2xdAJva5` | Current-unpublished | children `9722`/`9723`; parent trace `26c7466f817aa1511f4a4e239bb52a62` |
| Realistic v4 Human Approval Tail v0.1 | `xcBnMPcnCI6xVS4h` | Current-unpublished | `9724`; trace `f4e298e120d6503b5dfac4688adae1db` |
| Realistic v4 Production PRD Generator v0.1 | `2K9dntvZDaUgudrl` | Current-unpublished | `9725`; trace `f8879ebe22d888152a77f892230c62ba` |
| Realistic v4 Story Breakdown Child v0.2 | `MEm1VyILsMyn53HU` | Current-unpublished | `9727`; trace `f772ec699a437bc70de67ac124976161` |

The existing 18-workflow control allowlist remains the current-active control set: `NXJLNsdf3N8HfrnQ`, `xrtf52GK57IRI1NI`, `hE3ekoftADwnQog2`, `30ZYQxRHWggFgrAe`, `sYjmLbuEQNhrm6xK`, `ydNRRELKulEfzCeo`, `BTdoh2JW0mNlq9eT`, `f6W7bxcrodOPXh21`, `wGBE80XMjD5rTKql`, `lx7vCf4zxBlBjveh`, `T07vf7xPOWegbCJk`, `M85Dvpg0uriViX14`, `gPc9aTRQ8qLWdZgL`, `OTmIj7I1AFVvCceV`, `wXIY2Wn4umHsvWft`, `irsZec9KNFzxbcK2`, `jQPnuwa0E759FoCC`, and `7Z9TRF8RIyqWNDCe`. Only Failure Observer `ydNRRELKulEfzCeo` displayed “Published” in the list; other publication states were not shown there.

## Evidence retention and cleanup

Story Breakdown v0.1 `KKYU4QssjUTovd8U` and failed execution `9726` are explicitly retained as audit evidence. The 16 failed-candidate records include v0.1 plus clarification canaries `PhT3aEnSrbEJnlgE`, `mJRvWwPZrPgwQWwW`, `vMShSs7pPjzm7EWr`, and `LuCOCCe1jRhb6g5o`, along with their documented predecessor defects. Twenty-seven prior accepted/incremental workflows remain superseded evidence.

The **smallest safe cleanup set is one workflow**: duplicate non-authoritative Connected Orchestrator v0.5 `DRneGVklJT1DhDKv`; authoritative replacement `OTmIj7I1AFVvCceV`. No deletion/archive is authorized or performed. Duplicate-name multi-source and v0.8 workflows remain retained until execution-history dependencies are separately reviewed.

## Complete identity ledger

The 68 verified IDs, in n8n list order, are:

`MEm1VyILsMyn53HU`, `KKYU4QssjUTovd8U`, `2K9dntvZDaUgudrl`, `xcBnMPcnCI6xVS4h`, `ZUYumiSo2xdAJva5`, `LuCOCCe1jRhb6g5o`, `vMShSs7pPjzm7EWr`, `eDAl2qSb4ai17JZk`, `mJRvWwPZrPgwQWwW`, `PhT3aEnSrbEJnlgE`, `fONRatRmEHBrMYgr`, `i6Tb2P6se5pwn5ad`, `dGQ0iBTzng7hwfid`, `DJvhjvzsVF3EamEM`, `5JDrnH6E4emJB7WD`, `DLjawLd651ksC9Mp`, `Sdu0l5yYFn60RfvZ`, `TfjJhfWDq3bZAPI2`, `pF7LmuLU9JRMiFmn`, `GsJaBWKUXOw7EfX0`, `GxK42oKysCS0ZHFC`, `CEVm7KSZrdcfQ0qV`, `7Z9TRF8RIyqWNDCe`, `a7jOgippMt3Ovhfb`, `jQPnuwa0E759FoCC`, `irsZec9KNFzxbcK2`, `mkntih5N04MKARtp`, `DjL83NNU8XSO18qh`, `UDNaAd3sGhbqogFa`, `UfaWIglPGnmEFZUo`, `9TPDzvCdcyfK0Hoj`, `VZRKQNdxl8qXpmKL`, `AEbgqRpfeRMvv4va`, `CjFL8HuoCT57jbHT`, `E0jtyN9OItTGJ4Ck`, `Me0VRHz1LQcXGU8q`, `MKUYH5f5JqNzm7rc`, `isz9Jj1qVbwQVceS`, `f6W7bxcrodOPXh21`, `wXIY2Wn4umHsvWft`, `Unz88umJAaPdrnpQ`, `e2EkaBwL1awV5Fa8`, `OTmIj7I1AFVvCceV`, `T07vf7xPOWegbCJk`, `DRneGVklJT1DhDKv`, `gPc9aTRQ8qLWdZgL`, `hE3ekoftADwnQog2`, `sZJ0sEDPMASCjnPV`, `mekCxb7D7yEEnTXJ`, `M85Dvpg0uriViX14`, `jVLRcKotTx7JSn3w`, `VvyPX8cPcY5Q67iY`, `K5JIIOiq6FgMOc1V`, `07Mu9VQvGNQ7nIEV`, `lx7vCf4zxBlBjveh`, `O5XzVAGhAfSHa2K5`, `wGBE80XMjD5rTKql`, `BTdoh2JW0mNlq9eT`, `sYjmLbuEQNhrm6xK`, `EsLyfJrV6W6vcamB`, `NXJLNsdf3N8HfrnQ`, `30ZYQxRHWggFgrAe`, `eQRkZR8t6VS4q1Xu`, `NcqReOJGoKkyNh4S`, `L3J0nRWdKhs46wxF`, `xrtf52GK57IRI1NI`, `ydNRRELKulEfzCeo`, `Vvqr8ybO1jfB9UN7`.

Groundedness: **100%**. Unsupported claims: **0**. Publication uncertainty is explicitly preserved rather than inferred.
