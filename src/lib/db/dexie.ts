// ⚓ ANCHOR — IndexedDB schema via Dexie.js
// API key is NEVER stored here

import Dexie, { type EntityTable } from "dexie";
import type { StoredApproval, StoredProject } from "@/types";

class AnchorDB extends Dexie {
  projects!: EntityTable<StoredProject, "id">;
  approvals!: EntityTable<StoredApproval, "project_id">;

  constructor() {
    super("anchor-db");

    this.version(1).stores({
      projects: "id, updated_at",
      approvals: "project_id, phase",
    });
  }
}

export const db = new AnchorDB();

// ─────────────────────────────────────────
// Storage persistence (Safari warning)
// ─────────────────────────────────────────

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  return navigator.storage.persist();
}

export async function isStoragePersisted(): Promise<boolean> {
  if (!navigator.storage?.persisted) return false;
  return navigator.storage.persisted();
}

// ─────────────────────────────────────────
// Project helpers
// ─────────────────────────────────────────

export async function saveProject(project: StoredProject): Promise<void> {
  await db.projects.put(project);
}

export async function loadProject(
  id: string,
): Promise<StoredProject | undefined> {
  return db.projects.get(id);
}

export async function listProjects(): Promise<StoredProject[]> {
  return db.projects.orderBy("updated_at").reverse().toArray();
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
  await db.approvals.where("project_id").equals(id).delete();
}

// ─────────────────────────────────────────
// Approval helpers
// ─────────────────────────────────────────

export async function saveApproval(approval: StoredApproval): Promise<void> {
  await db.approvals.put(approval);
}

export async function getApproval(
  project_id: string,
  phase: string,
): Promise<StoredApproval | undefined> {
  return db.approvals
    .where("project_id")
    .equals(project_id)
    .and((a) => a.phase === phase)
    .first();
}
