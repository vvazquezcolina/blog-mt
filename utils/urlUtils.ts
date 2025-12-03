import { CategoryId } from '@/data/blogPosts';
import { type Locale } from '@/i18n';

/**
 * Mapeo de categorías del blog a URLs del sitio principal
 */
const CATEGORY_TO_DESTINATION_URL: Record<CategoryId, string> = {
  'cancun': 'cancun',
  'tulum': 'tulum',
  'playa-del-carmen': 'playa',
  'los-cabos': 'cabos',
  'puerto-vallarta': 'vallarta',
  'general': 'cancun', // Default a cancun para posts generales
};

/**
 * Genera la URL del sitio principal de MandalaTickets basada en la categoría y el idioma
 * @param categoryId - ID de la categoría del post
 * @param locale - Idioma actual (es, en, fr, pt)
 * @returns URL completa al destino en el sitio principal
 */
export function getMandalaTicketsUrl(categoryId: CategoryId, locale: Locale = 'es'): string {
  const destination = CATEGORY_TO_DESTINATION_URL[categoryId];
  return `https://mandalatickets.com/${locale}/${destination}`;
}

