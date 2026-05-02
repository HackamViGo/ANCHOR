---
description: Interact with the AnchorMemory knowledge graph — read project state, add nodes/edges, or search for existing entries.
---

## What is AnchorMemory?
AnchorMemory is ANCHOR's local-first knowledge graph stored in `.anchor/memory/graph.json`.
It tracks project decisions, features, rules, and their relationships across agent sessions.

The manager CLI lives at: `.anchor/memory/manager.py`

---

## Step 1 — Choose an operation
Ask the user: **What do you want to do?**

```
1. status   — Show a summary of the current graph (nodes, edges, history count)
2. read     — Read and display all nodes in a human-readable format
3. search   — Search nodes by name, type, or reasoning keyword
4. add-node — Add a new entry (decision, feature, rule, finding, etc.)
5. add-edge — Connect two existing nodes with a relationship
6. delete   — Remove a node or edge by ID
```

Store the choice as `OPERATION`.

---

## Step 2 — Execute the operation

### If OPERATION = status
// turbo
Run: `python .anchor/memory/manager.py --status`

Display the output clearly.

---

### If OPERATION = read
// turbo
Run: `python .anchor/memory/manager.py --query ""`

Then display all nodes in this format for each:
```
[TYPE] Name
  Reasoning: ...
  ID: ...
  Created: ...
```

---

### If OPERATION = search
Ask the user for a **search keyword** (e.g., `"auth"`, `"export"`, `"skill"`).
// turbo
Run: `python .anchor/memory/manager.py --search "<keyword>"`

Display matching nodes. If none found, say so clearly.

---

### If OPERATION = add-node
Ask the user for:
- **Name** — what is this? (e.g., `"Feature: skill-fetcher"`, `"Decision: use Dexie"`)
- **Type** — one of: `Feature`, `Decision`, `Rule`, `Finding`, `Workspace`, `Module`
- **Reasoning** — *why* does this exist? (This field is MANDATORY — AGENTS.md rule)

// turbo
Run: `python .anchor/memory/manager.py --add-node "<NAME>" "<TYPE>" "<REASONING>"`

Confirm: show the returned Node ID to the user.

---

### If OPERATION = add-edge
First, help the user find the two node IDs:
// turbo
Run: `python .anchor/memory/manager.py --status` to show available nodes.

Ask the user for:
- **From node ID** (e.g., `bfe7660f`)
- **To node ID**
- **Predicate** — the relationship verb (e.g., `implements`, `depends-on`, `follows`, `produces`)
- **Context** — one sentence explaining why this relationship exists

// turbo
Run: `python .anchor/memory/manager.py --add-edge "<FROM>" "<TO>" "<PREDICATE>" "<CONTEXT>"`

---

### If OPERATION = delete
Ask the user: node or edge?

**For a node:**
Ask for the Node ID.
// turbo
Run: `python .anchor/memory/manager.py --delete-node "<ID>"`

⚠️ Note: this also deletes all edges connected to that node.

**For an edge:**
Ask for FROM id, TO id, and PREDICATE.
// turbo
Run: `python .anchor/memory/manager.py --delete-edge "<FROM>" "<TO>" "<PREDICATE>"`

---

## Step 3 — Confirm result
Show the output of the command to the user.
If an add or delete was performed, run `--status` to confirm the updated graph count.
