/**
 * Internationalization utilities
 */

interface Translation {
  key: string;
  en: string;
  [locale: string]: string;
}

export class I18n {
  private translations: Map<string, Map<string, string>> = new Map();

  loadTranslations(locale: string, translations: Record<string, string>) {
    if (!this.translations.has(locale)) {
      this.translations.set(locale, new Map());
    }
    const localeMap = this.translations.get(locale)!;
    for (const [key, value] of Object.entries(translations)) {
      localeMap.set(key, value);
    }
  }

  t(key: string, locale: string = 'en', params?: Record<string, string>): string {
    const localeMap = this.translations.get(locale) || this.translations.get('en');
    if (!localeMap) {
      return key;
    }

    let translation = localeMap.get(key) || key;
    
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(`{{${paramKey}}}`, paramValue);
      }
    }

    return translation;
  }

  extractKeys(source: string): string[] {
    // Extract translation keys from source code
    const keyPattern = /t\(['"]([^'"]+)['"]/g;
    const keys: string[] = [];
    let match;
    while ((match = keyPattern.exec(source)) !== null) {
      keys.push(match[1]);
    }
    return keys;
  }

  generateCSV(locales: string[]): string {
    const allKeys = new Set<string>();
    for (const locale of locales) {
      const localeMap = this.translations.get(locale);
      if (localeMap) {
        for (const key of localeMap.keys()) {
          allKeys.add(key);
        }
      }
    }

    const rows: string[] = ['key,' + locales.join(',')];
    for (const key of allKeys) {
      const values = locales.map((locale) => {
        const localeMap = this.translations.get(locale);
        return localeMap?.get(key) || '';
      });
      rows.push(`"${key}",${values.map((v) => `"${v}"`).join(',')}`);
    }

    return rows.join('\n');
  }

  validateKeys(locale: string): { missing: string[] } {
    const baseLocale = this.translations.get('en');
    const targetLocale = this.translations.get(locale);
    
    if (!baseLocale || !targetLocale) {
      return { missing: [] };
    }

    const missing: string[] = [];
    for (const key of baseLocale.keys()) {
      if (!targetLocale.has(key)) {
        missing.push(key);
      }
    }

    return { missing };
  }
}

export const i18n = new I18n();
