import JSZip from "jszip";
import type {
  Artifact,
  EvidenceBundle,
  Manifest,
  SkillsLock,
  ValidationReport,
} from "@/types";
import { buildManifest, manifestToArtifact } from "./manifest";
import { buildZipFileName } from "@/lib/utils/sanitize";
import { stableJsonStringify } from "@/lib/utils/deterministic";

export interface ExportInput {
  projectName: string;
  artifacts: Artifact[];
  evidenceBundle: EvidenceBundle;
  skillsLock: SkillsLock;
  validationReport: ValidationReport;
}

export interface ExportResult {
  blob: Blob;
  fileName: string;
  manifest: Manifest;
}

export async function buildZip(input: ExportInput): Promise<ExportResult> {
  // 1. Stable sort all artifacts
  const sorted = [...input.artifacts].sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  // 2. Add system artifacts (evidence, skills-lock, validation report)
  // Use stableJsonStringify for all JSON artifacts
  const systemArtifacts: Artifact[] = [
    {
      path: "evidence/evidence.json",
      mediaType: "application/json",
      content: stableJsonStringify(input.evidenceBundle),
    },
    {
      path: "skills-lock.json",
      mediaType: "application/json",
      content: stableJsonStringify(input.skillsLock),
    },
    {
      path: "VALIDATION_REPORT.md",
      mediaType: "text/markdown",
      content: buildValidationReportMarkdown(input.validationReport),
    },
  ];

  const allArtifacts = [...sorted, ...systemArtifacts];

  // 3. Build manifest (SHA256 per file)
  const manifest = await buildManifest(allArtifacts);
  allArtifacts.push(manifestToArtifact(manifest));

  // 4. Build ZIP — no timestamps (determinism)
  const zip = new JSZip();
  for (const artifact of allArtifacts) {
    zip.file(artifact.path, artifact.content, {
      date: new Date(0), // epoch — no real timestamp
    });
  }

  // 5. Generate blob
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const fileName = buildZipFileName(input.projectName);

  return { blob, fileName, manifest };
}

export function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────
// Validation report → Markdown
// ─────────────────────────────────────────

function buildValidationReportMarkdown(report: ValidationReport): string {
  const lines: string[] = [
    "# VALIDATION_REPORT",
    "",
    `Generated at: ${report.generated_at}`,
    "",
    "## Summary",
    "",
    `- Status: **${report.overall_status}**`,
    `- Conflicts: ${report.conflicts.length}`,
    `- Missing items: ${report.missing_items.length}`,
    `- High-risk items: ${report.high_risk_items.length}`,
    `- Unverified items: ${report.unverified_items.length}`,
    "",
  ];

  if (report.conflicts.length > 0) {
    lines.push("## Conflicts", "");
    for (const c of report.conflicts) {
      lines.push(
        `### [${c.severity}] ${c.type} — ${c.id}`,
        "",
        c.description,
        "",
        "**Resolution options:**",
        "",
      );
      for (const opt of c.resolution_options) {
        lines.push(
          `- **${opt.label}** (effort: ${opt.effort}): ${opt.description}`,
        );
      }
      lines.push("");
    }
  }

  if (report.missing_items.length > 0) {
    lines.push("## Missing Items", "");
    for (const item of report.missing_items) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  if (report.high_risk_items.length > 0) {
    lines.push("## High-Risk Items", "");
    for (const item of report.high_risk_items) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  if (report.unverified_items.length > 0) {
    lines.push("## Unverified Items (UNVERIFIED — no evidence)", "");
    for (const item of report.unverified_items) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  if (report.recommendations.length > 0) {
    lines.push("## Recommendations", "");
    for (const rec of report.recommendations) {
      lines.push(`- ${rec}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
