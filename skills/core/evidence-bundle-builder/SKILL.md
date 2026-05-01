---

name: evidence-bundle-builder
description: Build evidence/evidence.json with EvidenceItems (url, accessed_at, snippet <= 25 words).
metadata:
owner: anchor
maturity: mvp
outputs: - evidence/evidence.json

---

# Skill: Evidence Bundle Builder

## Hard gate

Every major recommendation requires EvidenceItem:

- url
- accessed_at (ISO8601)
- snippet <= 25 words
