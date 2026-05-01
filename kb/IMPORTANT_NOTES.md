# IMPORTANT NOTES (from темп.md)

### Important (so you don’t get surprised)
This src/ assumes you will install deps later: zustand, dexie, jszip, Tailwind, etc.
exportDeterministicZip() guarantees manifest determinism on file contents + stable ordering. ZIP container-level metadata can still vary in some libs; the MANIFEST.json is the audit anchor.
