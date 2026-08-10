#!/usr/bin/env python3
"""Validate byte integrity and the reviewed citation inventory for realistic-v1."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "evaluation" / "fixtures" / "multi-source" / "realistic-v1"
PACKET = BASE / "source-packet.json"
SCHEMA = ROOT / "schemas" / "source-packet.schema.json"
EXPECTED = {
    "SRC-REALISTIC-PB-001": ("product_brief", 21, "a8f93fd8b88bd8e52b69197b378cf655be87d88a34d020ce992df6acd6e33ce5"),
    "SRC-REALISTIC-MT-001": ("meeting_transcript", 33, "15111349acf5fa92a2f5a33cbbedfc06765e2bb341473d451c49d5123f49dcc8"),
    "SRC-REALISTIC-SN-001": ("stakeholder_notes", 16, "c4b9737007fdce22f23f293634a5a7caa23732848624e874184a4be76fb1fa68"),
}


def main() -> int:
    packet = json.loads(PACKET.read_text(encoding="utf-8"))
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    errors = list(Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(packet))
    if errors:
        raise ValueError("schema: " + "; ".join(error.message for error in errors))
    if packet["producer"] != "production_multi_source" or packet["metadata"]["route_policy"] != "alternative_not_combined":
        raise ValueError("route separation failed")
    if packet["test_id"] is not None:
        raise ValueError("realistic packet must not masquerade as T1-T12")
    if {source["source_id"] for source in packet["sources"]} != set(EXPECTED):
        raise ValueError("source inventory mismatch")
    for source in packet["sources"]:
        expected_type, expected_citations, expected_hash = EXPECTED[source["source_id"]]
        path = ROOT / source["provenance"]["fixture_path"]
        raw = path.read_bytes()
        text = raw.decode("utf-8")
        actual_hash = hashlib.sha256(raw).hexdigest()
        if source["source_type"] != expected_type or len(source["citations"]) != expected_citations:
            raise ValueError(f"reviewed inventory mismatch for {source['source_id']}")
        if text != source["raw_text"] or actual_hash != expected_hash or source["content_hash"] != f"sha256:{actual_hash}":
            raise ValueError(f"content integrity mismatch for {source['source_id']}")
        lines = text.splitlines()
        for citation in source["citations"]:
            number = int(citation["location"].split(":", 1)[1])
            if lines[number - 1] != citation["quote"]:
                raise ValueError(f"citation mismatch for {source['source_id']} {citation['location']}")
    print("REALISTIC INTAKE OK: 3 supplied sources, 70 reviewed citations, hashes and route separation preserved.")
    print("INPUT GROUNDING OK 100%; approved expected extraction is frozen separately.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
