# AnchorMemory — Agentic Knowledge Base (2026)

## Overview
AnchorMemory is a local-first, graph-based memory system designed for AI agents. It follows the **Modular Property Graph** standard (inspired by WhyHow AI), allowing the agent to store facts alongside its internal reasoning and historical context.

## Core Architecture

### 1. Nodes (Entities)
Each node represents a discrete concept, decision, or artifact.
- **ID**: 8-character unique hash.
- **Type**: Categorization (Project, Decision, Rule, Artifact, Workspace).
- **Reasoning**: The most critical field. It captures *why* this node exists or why a decision was made.

### 2. Edges (Relationships)
Edges define how nodes relate to each other.
- **Predicates**: `implements`, `follows`, `uses`, `relates_to`, `blocks`.
- **Context**: Detailed explanation of the relationship.

### 3. History (Audit Trail)
A linear log of every addition, modification, or deletion. This ensures the project's evolution is traceable and reversible if needed.

## Management CLI (`manager.py`)
Usage: `python3 .anchor/memory/manager.py [command]`

- `--add-node [N] [T] [R]`: Create a new node.
- `--add-edge [F] [T] [P] [C]`: Create a relationship.
- `--delete-node [ID]`: Remove a node and its edges.
- `--search [Q]`: Deep search across all fields (including reasoning).
- `--status`: Overview of the memory state.

## Rules & Invariants
- **Privacy**: The `graph.json` file is ignored by Git to protect reasoning and session-specific data.
- **Persistence**: Memory must be queried at the start of every session (Memory-First Orientation).

---
Last Modified: 2026-05-01T23:52:25+03:00
