> Archived on 2025-11-12. Superseded by: (see docs/final index)

# External UI Ingestion - Codemod Plan

## Overview

This document outlines the codemod plan for converting external UI code (from Lovable or other visual builders) into our normalized React component structure.

## Import Pipeline

### Step 1: HTML → React Component
- Convert `class` → `className`
- Convert `for` → `htmlFor`
- Remove self-closing tags like `</img>`
- Strip `<script>` tags
- Wrap in React component with PascalCase name

### Step 2: CSS → Tailwind Tokens
- Identify inline styles
- Map to design tokens:
  - Colors → CSS variables (`--primary`, `--secondary`, etc.)
  - Spacing → Tailwind spacing scale
  - Typography → Design system typography
  - Shadows → `--shadow-card` or custom shadows

### Step 3: Asset Processing
- **SVG**: Run through SVGO, then SVGR for React components
- **Images**: Copy to `/public` with optimization
- **Fonts**: Dedupe and move to `/public/fonts`

### Step 4: Component Normalization
- Extract to `components/external/[ComponentName].tsx`
- Add proper TypeScript types
- Ensure accessibility (ARIA labels, semantic HTML)
- Add motion props (respects reduced motion)

## Codemod Rules

### Tailwind Token Replacements

```javascript
// Inline styles → Tailwind classes
'background-color: hsl(221, 83%, 53%)' → 'bg-primary'
'padding: 1rem' → 'p-4'
'border-radius: 14px' → 'rounded-xl'
'box-shadow: 0 6px 24px rgba(0,0,0,0.08)' → 'shadow-card'
```

### Component Splitting

```javascript
// Client vs Server Components
- Interactive (useState, onClick) → "use client"
- Data fetching → Server Component
- Form handling → Server Actions
```

### Class Name Namespacing

```javascript
// External classes → Namespaced
'external-button' → 'external-button-[hash]'
// Or convert to Tailwind utilities
```

## Asset Processing

### SVGO Optimization
```bash
npx svgo -i input.svg -o output.svg
```

### SVGR Conversion
```bash
npx @svgr/cli input.svg --out-dir components/external --ext tsx
```

### Font Deduplication
- Check font-family names
- Match to existing fonts
- Avoid duplicate @font-face declarations

## Tree Shaking

### Unused CSS Removal
- Use Lightning CSS or PostCSS
- Remove unused Tailwind classes
- Strip unused CSS Modules

### JavaScript Optimization
- Next.js automatically tree-shakes
- Use dynamic imports for heavy components
- Remove unused dependencies

## Quality Checks

### Accessibility
- Run Axe DevTools scan
- Check keyboard navigation
- Verify screen reader compatibility

### Performance
- Check bundle size
- Verify image optimization
- Ensure no blocking resources

### Code Quality
- ESLint checks
- TypeScript type checking
- Prettier formatting

## Example Transformation

### Before (HTML)
```html
<div class="button" style="background-color: #2563eb; padding: 0.75rem 1.5rem;">
  Click me
</div>
```

### After (React + Tailwind)
```tsx
"use client";
import { Button } from "@/components/ui/button";

export function ExternalButton() {
  return (
    <Button variant="default" size="md">
      Click me
    </Button>
  );
}
```

## Report Generation

The ingestion script generates `_import-report.txt` with:
- Component names and file paths
- Assets processed
- CSS tokens replaced
- Issues/warnings

## CI Integration

The GitHub Actions workflow:
1. Checks for `external-dump` directory
2. Runs ingestion script
3. Builds project to verify changes
4. Fails build on errors

## Manual Refinement

After automated ingestion:
1. Review component structure
2. Replace remaining inline styles with tokens
3. Add proper TypeScript types
4. Ensure accessibility compliance
5. Add proper error boundaries
6. Test with reduced motion preferences
