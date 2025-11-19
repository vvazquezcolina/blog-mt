export const locales = ['es', 'en', 'fr', 'pt'] as const;
export const defaultLocale = 'es' as const;

export type Locale = typeof locales[number];

export const localeNames: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
  pt: 'PT',
};



