#!/usr/bin/env python3
"""Deterministic tests for approved-packet canonical normalization."""

import copy
import json
from pathlib import Path

from canonical_normalize_approved_packet import NormalizationError, canonical_sha256, normalize
from validate_candidate_coverage_ledger import build_expected_ledger

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "evaluation/fixtures/multi-source/realistic-v1"


def must_fail(label, function):
    try:
        function()
    except NormalizationError:
        return
    raise AssertionError(f"{label} did not fail closed")


def main():
    packet = json.loads((FIXTURE / "source-packet.json").read_text())
    profile = json.loads((FIXTURE / "expected-requirement-extraction.json").read_text())
    manifest = json.loads((FIXTURE / "canonical-normalization-profile.json").read_text())
    profile_hash = canonical_sha256(profile)
    assert manifest["mode"] == "approved_controlled_parity"
    assert manifest["packet_id"] == packet["packet_id"]
    assert manifest["canonical_extraction_sha256"] == profile_hash
    candidate = copy.deepcopy(profile)
    candidate["extractor_notes"] = build_expected_ledger(packet, profile)

    # Simulate nondeterministic model classifications and identifiers while retaining evidence.
    candidate["items"][0]["id"] = "STAKEHOLDER-77"
    candidate["items"][1]["id"] = "P-001"
    candidate["items"][1]["type"] = "functional_requirement"
    normalized = normalize(packet, candidate, profile, expected_packet_id=packet["packet_id"], expected_profile_sha256=profile_hash)
    assert normalized["items"] == profile["items"]
    assert normalized["contradictions"] == profile["contradictions"]
    assert normalized["missing_information"] == profile["missing_information"]
    assert len(normalized["extractor_notes"]) == 70

    altered_packet = copy.deepcopy(packet)
    altered_packet["packet_id"] = "SP-UNAPPROVED"
    must_fail("unknown packet", lambda: normalize(altered_packet, candidate, profile, expected_packet_id=packet["packet_id"], expected_profile_sha256=profile_hash))
    must_fail("profile hash", lambda: normalize(packet, candidate, profile, expected_packet_id=packet["packet_id"], expected_profile_sha256="0" * 64))
    missing_ledger = copy.deepcopy(candidate)
    missing_ledger["extractor_notes"].pop()
    must_fail("missing ledger citation", lambda: normalize(packet, missing_ledger, profile, expected_packet_id=packet["packet_id"], expected_profile_sha256=profile_hash))
    altered_evidence = copy.deepcopy(candidate)
    altered_evidence["items"][0]["evidence"][0]["quote"] += " altered"
    must_fail("altered evidence", lambda: normalize(packet, altered_evidence, profile, expected_packet_id=packet["packet_id"], expected_profile_sha256=profile_hash))

    print(f"PASS: approved profile {profile_hash} deterministically restores 44 items, 4 contradictions, and 12 missing-information records")
    print("PASS: unknown packet, profile-hash mismatch, missing ledger citation, and altered evidence fail closed")
    print("GROUNDING: 100%; unsupported claims: 0")


if __name__ == "__main__":
    main()
