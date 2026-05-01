---

name: skill-frontmatter-validator
description: Validate SKILL.md YAML frontmatter; block unsafe allowed-tools shell/bash unless explicit opt-in + pinning.
metadata:
owner: anchor
maturity: mvp
outputs: - validation_findings.json

---

# Skill: Skill Frontmatter Validator

## BLOCKER gate

- If allowed-tools contains shell/bash => BLOCKER unless explicit opt-in + pinned.

## WARNING scans (MVP)

- hidden unicode
- base64 blobs
- injection patterns
