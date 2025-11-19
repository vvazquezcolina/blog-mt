import { Locale } from './config';
import esTranslations from './translations/es.json';
import enTranslations from './translations/en.json';
import frTranslations from './translations/fr.json';
import ptTranslations from './translations/pt.json';

const translations = {
  es: esTranslations,
  en: enTranslations,
  fr: frTranslations,
  pt: ptTranslations,
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.es;
}

export type Translations = typeof esTranslations;



