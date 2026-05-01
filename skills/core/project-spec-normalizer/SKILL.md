---

name: project-spec-normalizer
description: Normalize user inputs into a strict ProjectSpec JSON.
metadata:
owner: anchor
maturity: mvp
outputs: - project_spec.json

---

# Skill: ProjectSpec Normalizer

## Output

- A ProjectSpec JSON object matching `kb/API_SPEC.md`

## Rules

- Do not guess versions.
- If required fields are missing, emit warnings into validation.
