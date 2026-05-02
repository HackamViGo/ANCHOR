# Implementation Plan: Technical Minimalism (Swiss Design)

## Overview
Implement the "Technical Minimalism" aesthetic defined in `temp/Desing_template.md` across the ANCHOR project, integrating it tightly with Shadcn UI and following the `core-workflow`.

## Steps

- [x] **1. CSS & Theme Foundation**
  - Update `globals.css` with the strict monochrome palette (`#111111`, `#0A0A0A`, `#FDFDFD`, `#FAFAFA`).
  - Set CSS variables for semantic colors (Emerald `#00AA66`, Blue `#0055FF`, Orange/Red).
  - Globally enforce `radius: 0` to remove all rounded corners from Shadcn defaults.

- [x] **2. Typography System**
  - Configure `font-sans` (e.g., Geist) and `font-mono` (e.g., JetBrains Mono).
  - Create a utility class or component for the "Micro-Header" pattern (`text-[10px] uppercase font-bold tracking-widest`).

- [ ] **3. Shadcn Component Overrides**
  - **Button**: Remove shadows, apply sharp borders, update primary/secondary/action variants to match the flat aesthetic.
  - **Card**: Strip `shadow-sm` and `rounded-xl/md`. Apply strict 1px borders (`#EEEEEE` / `#333333`).
  - **Input / Textarea / Dialogs**: Ensure utterly flat design, sharp 90-degree corners.
  *(Pending component installation)*

- [x] **4. State Indicators & Specialized UI**
  - Implement the `border-l-2` pattern for alerts, logs, and evidence items (e.g., Pass/Gate/Warning blocks).
  - Ensure dark mode contrast is purely structural (no deep shadows, just border and background contrast).

- [x] **5. Verification & Review**
  - Check the UI visually (or via code review) to ensure no generic Shadcn UI artifacts (shadows, rounded corners) remain.
  - Ensure the ANCHOR design meets the "Swiss Machine Precision" standard.

## Review
*Pending implementation...*
