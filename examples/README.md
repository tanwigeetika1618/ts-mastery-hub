# 📚 TypeScript Examples

Runnable TypeScript examples organized by topic. Each file can be run directly:

```bash
npx tsx examples/01-basics/types.ts
```

## Contents

| # | Topic | File | What You'll Learn |
|---|-------|------|-------------------|
| 01 | **Basic Types** | `01-basics/types.ts` | Primitives, arrays, tuples, unions, literals, any vs unknown |
| 02 | **Interfaces** | `02-interfaces/interfaces.ts` | Interfaces, type aliases, extending, discriminated unions |
| 03 | **Generics** | `03-generics/generics.ts` | Generic functions, constraints, classes, keyof, lookup types |
| 04 | **Utility Types** | `04-utility-types/utility-types.ts` | Partial, Pick, Omit, Record, Extract, ReturnType, and combining them |
| 05 | **Advanced** | `05-advanced/advanced-patterns.ts` | satisfies, as const, conditional types, template literals, mapped types |

## Run All Examples

```bash
for f in examples/**/*.ts; do echo "--- $f ---"; npx tsx "$f"; echo; done
```
