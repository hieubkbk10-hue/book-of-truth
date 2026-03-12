## Audit Summary
- Oxlint errors:
  1) `app/api/search/route.ts`: unused import `docs`.
  2) `tsconfig` validation from oxlint/tsgolint: `baseUrl` removed; `paths` uses non-relative value `.source/*`.
- Current state: Added `oxlint-tsgolint` via Bun; `bunx oxlint --type-aware --type-check --fix` still fails on the above.

## Root Cause Confidence
- High — errors point directly to unused import and tsconfig options incompatible with tsgolint.

## Proposed Fix (no behavior change to app build)
1) Clean unused import
   - `app/api/search/route.ts`: remove unused `docs` import.
2) Provide oxlint-only tsconfig to avoid touching main tsconfig
   - Create `tsconfig.oxlint.json` (do not extend main) with minimal options and without `baseUrl`.
   - Use relative paths to satisfy tsgolint:
     ```json
     {
       "compilerOptions": {
         "target": "ES2017",
         "lib": ["dom", "dom.iterable", "esnext"],
         "module": "esnext",
         "moduleResolution": "bundler",
         "jsx": "react-jsx",
         "allowJs": true,
         "resolveJsonModule": true,
         "isolatedModules": true,
         "strict": true,
         "skipLibCheck": true,
         "noEmit": true,
         "paths": {
           "@/*": ["./*"],
           "collections/*": ["./.source/*"]
         }
       },
       "include": [
         "next-env.d.ts",
         "**/*.ts",
         "**/*.tsx",
         ".next/types/**/*.ts",
         ".next/dev/types/**/*.ts",
         "**/*.mts"
       ]
     }
     ```
   - Run oxlint with `--tsconfig tsconfig.oxlint.json`.
3) Verification
   - Run `bunx oxlint --type-aware --type-check --fix --tsconfig tsconfig.oxlint.json` → expect no tsconfig errors.
   - Confirm unused import warning resolved.
4) Commit
   - Commit dependency + new tsconfig + import cleanup.
   - Message: `chore: add oxlint tsconfig and clean unused import`.

## Verification Plan
- Static: `tsconfig.oxlint.json` present, no `baseUrl` option.
- Runtime: oxlint command completes without errors.
- Git: working tree clean after commit.

Notes
- This approach isolates linter config, avoids altering main `tsconfig.json`, so app behavior/build stays unchanged.
