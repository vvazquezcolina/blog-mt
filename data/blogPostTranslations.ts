// Traducciones SEO/GEO optimizadas para todos los posts del blog
// Este archivo contiene las traducciones de títulos y excerpts para los 100 posts
// en los 4 idiomas: español, inglés, francés y portugués

import { CategoryId } from './blogPosts';

export interface PostTranslation {
  title: string;
  excerpt: string;
  slug: string; // Slug SEO optimizado por idioma
}

export type PostTranslations = {
  es: PostTranslation;
  en: PostTranslation;
  fr: PostTranslation;
  pt: PostTranslation;
};

// Mapeo de traducciones para cada post (key = post id)
export const postTranslations: Record<string, PostTranslations> = {
  // Post 1: Los 10 eventos imperdibles en Cancún este verano
  '1': {
    es: {
      title: 'Los 10 eventos imperdibles en Cancún este verano',
      excerpt: 'Descubre los eventos más emocionantes que Cancún tiene preparados para esta temporada de verano. Desde fiestas en la playa hasta festivales de música electrónica.',
      slug: '10-eventos-imperdibles-cancun-verano'
    },
    en: {
      title: 'The 10 Unmissable Events in Cancun This Summer',
      excerpt: 'Discover the most exciting events that Cancun has prepared for this summer season. From beach parties to electronic music festivals.',
      slug: '10-unmissable-events-cancun-summer'
    },
    fr: {
      title: 'Les 10 événements incontournables à Cancún cet été',
      excerpt: 'Découvrez les événements les plus excitants que Cancún a préparés pour cette saison estivale. Des fêtes sur la plage aux festivals de musique électronique.',
      slug: '10-evenements-incontournables-cancun-ete'
    },
    pt: {
      title: 'Os 10 Eventos Imperdíveis em Cancún neste Verão',
      excerpt: 'Descubra os eventos mais emocionantes que Cancún preparou para esta temporada de verão. De festas na praia a festivais de música eletrônica.',
      slug: '10-eventos-imperdiveis-cancun-verao'
    }
  },
  // Continuará con los otros 99 posts...
};

// Helper para generar slug SEO-friendly
export function generateSEOSlug(text: string, locale: 'es' | 'en' | 'fr' | 'pt'): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}








