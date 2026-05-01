---

name: zip-exporter
description: Deterministic ZIP export with MANIFEST.json hashes + VALIDATION_REPORT.md.
metadata:
owner: anchor
maturity: mvp
outputs: - MANIFEST.json - VALIDATION_REPORT.md

---

# Skill: ZIP Exporter (Deterministic)

Rules:

- stable sort all paths
- sha256 each file
- always include VALIDATION_REPORT.md
