---
description: Sync all kb/ documentation to reflect the current state of AGENTS.md and project context — updates timestamps, cross-references, and the DECISIONS.md ADR log.
---

## When to run this workflow
Run `/sync-docs` whenever:
- `AGENTS.md` has been structurally changed (new rules, moved sections, renamed domains)
- A new ADR has been added to `kb/DECISIONS.md`
- `kb/PROJECT_CONTEXT.md` has been updated (stack versions, MVP status)
- Any invariant or constraint has changed in scope or meaning

---

## Step 1 — Read the source of truth
Read these files in order — they are the authoritative sources:

1. `AGENTS.md` — full rules (Domain A + Domain B)
2. `kb/PROJECT_CONTEXT.md` — stack versions, MVP status, workspace rules
3. `kb/DECISIONS.md` — ADR log

Store:
- `AGENTS_DOMAIN_A` = all Domain A sections (coding agent rules)
- `AGENTS_DOMAIN_B` = all Domain B sections (app product invariants)
- `CURRENT_TIMESTAMP` = current ISO-8601 timestamp

---

## Step 2 — Sync GEMINI.md
Read `GEMINI.md`. Check:

- [ ] Read order matches: PROJECT_CONTEXT → DECISIONS → AGENTS → ARCHITECTURE → ROADMAP → SECURITY → TESTING → API_SPEC → DEPLOYMENT
- [ ] Contains the two-domain awareness note referencing Domain A and Domain B
- [ ] `Last Modified` timestamp is current

If any check fails → update the relevant section. Do NOT rewrite the whole file — apply targeted edits only.

---

## Step 3 — Sync CLAUDE.md
`CLAUDE.md` must be a **full mirror** of `AGENTS.md` (ADR-0005 + ADR-0011).

Check: is the content of `CLAUDE.md` identical to `AGENTS.md`?

- If yes → update only the `Last Modified` timestamp.
- If no → overwrite `CLAUDE.md` with the full content of `AGENTS.md`.

---

## Step 4 — Sync kb/ARCHITECTURE.md
Read `kb/ARCHITECTURE.md`. Check that the "Core principles" section references and is consistent with `AGENTS.md § Domain B`:

- [ ] Evidence-first matches `AGENTS.md § B.1`
- [ ] Skill safety matches `AGENTS.md § B.2`
- [ ] Deterministic export matches `AGENTS.md § B.4`
- [ ] BYOK matches `AGENTS.md § B.3`
- [ ] Agent entrypoint section references the two-domain structure

If any check fails → apply targeted edits to bring ARCHITECTURE.md in sync. Do NOT change the component descriptions or Mermaid diagram unless the architecture itself has changed.

Update `Last Modified` timestamp.

---

## Step 5 — Verify DECISIONS.md is up to date
Read `kb/DECISIONS.md`. Check:

- [ ] ADR-0011 (two-domain AGENTS.md split) exists and is accurate
- [ ] Any ADR that references an `AGENTS.md` section number still matches the current structure
- [ ] `Last Modified` timestamp is current

If any check fails → add or update the relevant ADR. Follow the existing ADR format:
```
## ADR-XXXX — Title
**Status:** Accepted
**Date:** YYYY-MM-DD

### Decision
...

### Consequences
...
```

---

## Step 6 — Check all timestamps
Scan all `.md` files in the project root and `kb/` for files that were modified in this session but whose `Last Modified` footer is stale.

For each stale file:
- Update the `Last Modified: ISO-TIMESTAMP` footer to `{{CURRENT_TIMESTAMP}}`.

Files to check:
- `AGENTS.md`
- `GEMINI.md`
- `CLAUDE.md`
- `kb/PROJECT_CONTEXT.md`
- `kb/DECISIONS.md`
- `kb/ARCHITECTURE.md`
- `kb/ROADMAP.md`
- `kb/SECURITY.md`
- `kb/TESTING.md`

---

## Step 7 — Report
Summarize what was changed:

```
✅ DOCS SYNC COMPLETE

Files updated:
  - GEMINI.md: [what changed]
  - CLAUDE.md: [what changed]
  - kb/DECISIONS.md: [what changed]
  - kb/ARCHITECTURE.md: [what changed]
  - [N] timestamp(s) updated

No changes needed:
  - [files that were already in sync]
```

If any file could not be synced due to a conflict or ambiguity → list it clearly and explain what manual review is needed.
