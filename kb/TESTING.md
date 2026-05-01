# TESTING — ANCHOR

ANCHOR’s tests exist to prevent broken exports, enforce safety policies, and guarantee deterministic output.

---

## Test goals

1) Prevent broken exports (missing required files, invalid structures)
2) Enforce evidence-first hard gate
3) Enforce skill safety policy gates (shell tools)
4) Guarantee deterministic export hashing and manifest generation

---

## Test pyramid

### Unit tests (fast)
- ProjectSpec normalization and validation
- EvidenceItem validation:
  - snippet length <= 25 words
  - url is present
  - accessed_at ISO8601 parseable
- Deterministic sorting:
  - artifacts sorted by path
  - evidence items sorted by stable key (normalized URL + timestamp)
- Manifest hashing:
  - sha256 correctness for known fixtures
  - newline normalization behavior
- Skill policy gates:
  - `allowed-tools: shell/bash` => BLOCKER
- Skill scan warnings:
  - unicode/base64/injection patterns flagged as WARNING

### Integration tests (moderate)
- End-to-end pipeline with mocked AI + mocked research provider:
  - ProjectSpec -> EvidenceBundle -> Artifacts -> ValidationReport -> Manifest
- Deterministic export test:
  - same stored snapshot exported twice => identical MANIFEST entries + hashes

### CI gates (minimum)
- lint
- typecheck
- unit tests
- integration tests (pipeline)
- build

---

## Determinism: what we test explicitly
- Stable ordering of files in the manifest
- Hash stability across:
  - repeated exports
  - different machines (line endings normalized)
- No filesystem metadata (mtime) affects hashes


---
Last Modified: 2026-05-01T23:23:41+03:00
