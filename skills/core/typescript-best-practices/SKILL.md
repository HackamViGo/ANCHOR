---
name: typescript-best-practices
description: |
  Enforce strict TypeScript patterns, naming conventions, and type safety. 
  Use when: starting new TS files, refactoring types, or fixing complex type errors.
---

# TypeScript Best Practices & Strict Patterns

**Version**: TypeScript 5.0+ (Ready for 6.0)
**Configuration**: `strict: true`

## Overview
Guides agents through writing consistent, maintainable, and type-safe TypeScript code according to modern engineering standards (TS.dev / Google Style Guide).

## When to Use
- Creating new modules or components.
- Designing API contracts and data models.
- Refactoring `any` or `unknown` types into specific interfaces.
- Organizing exports and namespacing.

## Core Process

1. **Exports & Namespacing**
   - **Use Named Exports**: Always prefer `export const Foo` over `export default Foo`. This ensures predictable imports and better IDE support.
   - **File-level Namespacing**: Use files and directories for organization rather than `namespace` or `module` keywords.

## Usage

```bash
# Harden an existing TypeScript project with ANCHOR standards
bash scripts/harden.sh [target-directory]
```

**Arguments:**
- `target-directory` - Optional. The directory containing tsconfig.json (defaults to current dir).

2. **Type Definition Strategy**
   - **Interfaces for Data**: Use `interface` for public API shapes and server-side JSON structures.
   - **Type Aliases for Logic**: Use `type` for unions, intersections, and complex utility types.
   - **Avoid `any`**: Use `unknown` for values of uncertain type and narrow them using type guards.

3. **Naming Conventions**
   - **Classes/Interfaces/Types**: `PascalCase`
   - **Variables/Functions**: `camelCase`
   - **Constants/Enums**: `UPPER_SNAKE_CASE`
   - **Private Fields**: Prefix with `_` or use private `#` syntax.

4. **Safety Patterns**
   - Always specify return types for public functions to prevent accidental leak of internal types.
   - Use `readonly` for arrays and objects that should not be mutated.

## Specific Techniques

### Named Exports Pattern
```typescript
// Good
export const API_BASE_URL = 'https://api.example.com';
export function fetchData() { ... }

// Avoid
export default function() { ... }
```

### Type Narrowing
```typescript
function process(input: unknown) {
  if (typeof input === "string") {
    console.log(input.toUpperCase()); // Safe
  }
}
```

## Common Rationalizations
| Rationalization | Reality |
|---|---|
| "I'll use any just for now" | `any` spreads like a virus and disables the compiler. Use `unknown`. |
| "Default exports are easier" | They lead to naming drift across the codebase (e.g. `import MyComp from './Comp'`). |

## Red Flags
- Use of `any` without a `// TODO` or explanation.
- Default exports in new code.
- Missing return types on exported functions.
- Use of `! (non-null assertion)` instead of proper narrowing.

## Verification
- [ ] `strict: true` is enabled in `tsconfig.json`.
- [ ] All exports are named.
- [ ] No `any` types remain in the module.
- [ ] Interfaces represent the data structures accurately.
- [ ] Public API functions have explicit return types.
