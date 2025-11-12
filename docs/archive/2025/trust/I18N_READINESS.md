> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Internationalization (i18n) Readiness

**Last Updated:** 2025-01-XX  
**Status:** Planning Phase

## Overview

This document outlines the strategy for internationalizing the application to support multiple languages, locales, and text directions (LTR/RTL).

## Current State

### Language Support

- **Default Language:** English (en)
- **HTML Lang Attribute:** Set to `en` in `app/layout.tsx`
- **Localization:** Not yet implemented

### Text Direction

- **Default:** LTR (Left-to-Right)
- **RTL Support:** Not implemented

### Date/Time Formatting

- **Current:** Browser default formatting
- **Standardization:** Not yet implemented

### Number Formatting

- **Current:** Browser default formatting
- **Standardization:** Not yet implemented

## i18n Key Extraction Strategy

### Approach

1. **Extract Static Strings:** Identify all user-facing text
2. **Create Translation Keys:** Use namespaced keys (e.g., `common.button.submit`, `trust.privacy.title`)
3. **Translation Files:** Store translations in JSON/YAML files per locale
4. **Runtime Loading:** Load translations based on user preference or browser locale

### Key Structure

```json
{
  "common": {
    "button": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "trust": {
    "title": "Trust & Transparency",
    "privacy": {
      "title": "Privacy Policy"
    }
  }
}
```

### File Organization

```
locales/
  en.json          # English (default)
  es.json          # Spanish
  fr.json          # French
  de.json          # German
  ar.json          # Arabic (RTL)
  he.json          # Hebrew (RTL)
```

## Implementation Plan

### Phase 1: Foundation (Current)

- [x] Document i18n strategy
- [ ] Choose i18n library (recommend: `next-intl` or `react-i18next`)
- [ ] Set up translation file structure
- [ ] Extract English strings to keys

### Phase 2: Core Implementation

- [ ] Integrate i18n library
- [ ] Create translation files for primary languages
- [ ] Implement language switcher UI
- [ ] Add language detection (browser locale)

### Phase 3: RTL Support

- [ ] Add RTL language files (Arabic, Hebrew)
- [ ] Implement RTL CSS support
- [ ] Test RTL layouts
- [ ] Add `dir` attribute toggle

### Phase 4: Formatting

- [ ] Implement date/time formatting (use `Intl.DateTimeFormat`)
- [ ] Implement number formatting (use `Intl.NumberFormat`)
- [ ] Implement currency formatting (use `Intl.NumberFormat` with currency)

### Phase 5: Content Translation

- [ ] Translate all user-facing text
- [ ] Translate documentation (if applicable)
- [ ] Professional translation review

## Date/Time Formatting

### Strategy

Use `Intl.DateTimeFormat` API for locale-aware formatting:

```typescript
const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/New_York'
});

formatter.format(new Date());
```

### Considerations

- **Time Zones:** Store UTC in database, convert to user's timezone
- **Format Preferences:** Respect user's locale preferences
- **Relative Time:** Use libraries like `date-fns` for "2 hours ago" format

## Number Formatting

### Strategy

Use `Intl.NumberFormat` API for locale-aware formatting:

```typescript
const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

formatter.format(1234.56); // "1,234.56"
```

### Currency Formatting

```typescript
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

formatter.format(1234.56); // "$1,234.56"
```

## RTL (Right-to-Left) Support

### Languages Requiring RTL

- **Arabic (ar)**
- **Hebrew (he)**
- **Persian/Farsi (fa)**
- **Urdu (ur)**

### Implementation

1. **HTML `dir` Attribute:**
   ```tsx
   <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
   ```

2. **CSS Logical Properties:**
   ```css
   /* Instead of: */
   margin-left: 1rem;
   
   /* Use: */
   margin-inline-start: 1rem;
   ```

3. **CSS Flexbox/Grid:**
   ```css
   /* Automatically flips with dir */
   display: flex;
   flex-direction: row; /* RTL-aware */
   ```

4. **Testing:**
   - Test all layouts in RTL mode
   - Verify icons and images flip correctly
   - Check form layouts

## Translation Fallbacks

### Strategy

1. **Primary Language:** User's selected language
2. **Fallback:** English (en)
3. **Missing Keys:** Display key path or English text

### Implementation

```typescript
function t(key: string, locale: string): string {
  const translations = loadTranslations(locale);
  return translations[key] || translations['en'][key] || key;
}
```

## Non-Blocking Loading

### Strategy

- **Initial Load:** English translations embedded
- **Lazy Load:** Load additional languages on-demand
- **Caching:** Cache translations in localStorage or service worker

### Implementation

```typescript
async function loadTranslations(locale: string) {
  if (locale === 'en') return embeddedTranslations;
  
  const cached = localStorage.getItem(`translations_${locale}`);
  if (cached) return JSON.parse(cached);
  
  const translations = await fetch(`/locales/${locale}.json`);
  localStorage.setItem(`translations_${locale}`, JSON.stringify(translations));
  return translations;
}
```

## Recommended Libraries

### Option 1: next-intl

- **Pros:** Built for Next.js App Router, excellent TypeScript support
- **Cons:** Next.js-specific
- **Usage:** `next-intl`

### Option 2: react-i18next

- **Pros:** Mature, widely used, flexible
- **Cons:** Requires additional setup for Next.js
- **Usage:** `react-i18next`, `i18next`

### Option 3: next-i18next

- **Pros:** Next.js wrapper for react-i18next
- **Cons:** SSR complexity
- **Usage:** `next-i18next`

**Recommendation:** `next-intl` for Next.js 14+ App Router projects.

## Testing Strategy

### Manual Testing

- [ ] Test all pages in each supported language
- [ ] Verify text doesn't overflow containers
- [ ] Check RTL layouts
- [ ] Test date/time formatting for each locale
- [ ] Test number/currency formatting

### Automated Testing

- [ ] Extract all translation keys
- [ ] Verify no missing translations
- [ ] Check for unused keys
- [ ] Validate JSON syntax

## Migration Path

### Step 1: Extract Strings

1. Identify all user-facing text
2. Replace with translation keys
3. Keep English as default

### Step 2: Add Translation Files

1. Create `locales/en.json` with all keys
2. Copy to other languages as templates
3. Fill in translations

### Step 3: Integrate Library

1. Install chosen i18n library
2. Configure middleware/routing
3. Update components to use translations

### Step 4: Test & Iterate

1. Test in each language
2. Fix layout issues
3. Refine translations

## Timeline

- **Q1 2025:** Foundation and core implementation
- **Q2 2025:** RTL support and formatting
- **Q3 2025:** Content translation and testing

## Notes

- Start with English-only, extract keys early
- Use professional translators for production
- Consider user-generated content translation (future)
- RTL support requires careful CSS planning

## References

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [MDN: Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [WCAG: Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)
