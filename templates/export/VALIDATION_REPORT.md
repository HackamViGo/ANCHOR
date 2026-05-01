# ⚓ VALIDATION REPORT — {{projectName}}

**Generated At:** {{generatedAt}}  
**Status:** {{overallStatus}}  
**Anchor Version:** 2026.05-beta

---

## 📋 Executive Summary
This report summarizes the outcome of the 5-pass validation process performed on the generated blueprint. It highlights security risks, architecture conflicts, and missing evidence.

- **Integrity:** {{manifestStatus}} (SHA-256 Manifest generated)
- **Security:** {{securityStatus}}
- **Compliance:** {{complianceStatus}}

---

## 🛡️ Pass 1: Dependency Version Compatibility
Checks if all package versions are pinned and cross-referenced with recent evidence.

| Dependency | Version | Evidence ID | Status |
|---|---|---|---|
{{dependencyTable}}

---

## 🧩 Pass 2: Skill Conflict Detection
Detection of conflicts between agent skills, redundant tools, or convention violations.

{{skillConflicts}}

---

## 🔒 Pass 3: OWASP Security Audit
Verification of the chosen stack against modern security patterns (React2Shell protection, secret handling).

{{securityAudit}}

---

## ⚖️ Pass 4: License Compatibility
Ensuring that all selected skills and libraries have compatible licenses (MIT, Apache, etc.).

{{licenseCompatibility}}

---

## 📦 Pass 5: Completeness & Determinism
Final check to ensure all 11 core artifacts are present and the export is bit-identical to the source spec.

{{completenessCheck}}

---

## 🔎 Evidence Reference
Below are the primary sources used to validate this blueprint.

| ID | URL | Title | Accessed At |
|---|---|---|---|
{{evidenceTable}}

---

> [!IMPORTANT]
> This report is part of the ANCHOR deterministic export. Any modification to the source spec should regenerate this report to maintain integrity.
