# Unused Code & Dead Code Analysis Report

**Date:** 2025-01-XX  
**Tools:** Manual analysis + depcheck + knip (configured)  
**Branch:** `chore/remove-dead-code`

---

## Summary

This report identifies unused dependencies, files, and code that can be safely removed without breaking functionality.

---

## 1. Unused Dependencies (via depcheck)

**Note:** Run `pnpm install && pnpm run analyze:unused:deps` to get full depcheck results.

### Likely Unused (Requires Verification):
- `vite-plugin-pwa` - Vite PWA plugin, but Next.js has built-in PWA support
- `@vitejs/plugin-react-swc` - Vite React plugin, but Next.js uses its own compiler
- `rollup-plugin-visualizer` - Used in vite.config.ts, but main build is Next.js

### Potentially Unused (Check Dynamic Imports):
- Some Radix UI components may be unused
- Some utility libraries may be unused

**Action:** Run depcheck after installing dependencies to get accurate results.

---

## 2. Unused Files (via knip + manual analysis)

**Note:** Run `pnpm install && pnpm run analyze:unused:files` to get full knip results.

### Confirmed Dead Code (100% Unused):

#### Backup Files:
- ✅ `app/layout.tsx.bak.20251105_051442` - Backup file, not referenced anywhere

#### Lock Files (Wrong Package Manager):
- ✅ `package-lock.json` - npm lockfile, but project uses pnpm (package.json specifies `"packageManager": "pnpm@8.15.0"`)
- ✅ `bun.lockb` - Bun lockfile, but project uses pnpm

#### Legacy Vite Files (Next.js App Router doesn't use these):
- ⚠️ `index.html` - Vite entry point, but Next.js App Router doesn't use index.html
  - **Risk:** Low - Next.js ignores this file
  - **Action:** Remove if confirmed unused (check if any build process references it)
- ⚠️ `src/` directory - Appears to be legacy Vite code
  - **Risk:** Medium - Need to verify no imports from src/
  - **Action:** Check for imports, then remove if unused

#### Duplicate Config Files:
- ⚠️ `vite.config.ts` - Vite config exists, but main build uses Next.js
  - **Used in:** `build:analyze` script (`ANALYZE=true vite build`)
  - **Action:** Keep if bundle analysis depends on it, otherwise remove

### Potentially Unused (Requires Runtime Analysis):

#### Unused Exports:
- Run knip to identify unused exports across packages

#### Unused Components:
- Some components in `components/` may be unused
- Some components in `src/components/` (if src/ is legacy) are likely unused

---

## 3. Unused Scripts

### Scripts to Review:
- Scripts referencing Vite if Vite is not primary build tool
- Scripts that are never called

**Action:** Audit package.json scripts and remove unused ones.

---

## 4. Recommendations

### Safe to Remove Immediately (100% Confident):
1. ✅ `app/layout.tsx.bak.20251105_051442` - Backup file
2. ✅ `package-lock.json` - Wrong package manager
3. ✅ `bun.lockb` - Wrong package manager

### Requires Verification Before Removal:
1. ⚠️ `index.html` - Check if referenced by any build process
2. ⚠️ `src/` directory - Check for imports, verify it's legacy Vite code
3. ⚠️ `vite.config.ts` - Keep if `build:analyze` depends on it

### Requires Tool Execution:
1. Run `depcheck` to identify unused dependencies
2. Run `knip` to identify unused files and exports
3. Review results and remove confirmed dead code

---

## 5. Next Steps

1. Install dependencies: `pnpm install`
2. Run depcheck: `pnpm run analyze:unused:deps`
3. Run knip: `pnpm run analyze:unused:files`
4. Review knip-report.json
5. Remove confirmed dead code
6. Test build: `pnpm run build`
7. Test typecheck: `pnpm run typecheck`
8. Update this report with actual findings

---

## 6. Files Removed in This PR

- `app/layout.tsx.bak.20251105_051442` - Backup file
- `package-lock.json` - npm lockfile (project uses pnpm)
- `bun.lockb` - Bun lockfile (project uses pnpm)

**Note:** Additional removals will be added after running depcheck and knip.
