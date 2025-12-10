/**
 * Utilidad para sincronizar menciones de venues entre todos los idiomas
 * Asegura que si un venue se menciona en un idioma, también se mencione en los otros
 */

import { getVenueMap, findVenueByKeyword, type VenueInfo } from '../scripts/venueUrlMapper';

/**
 * Sincroniza menciones de venues entre idiomas
 * @param contentByLocale - Contenido por idioma
 * @param category - Categoría del post
 * @returns Contenido sincronizado por idioma
 */
export function synchronizeVenueMentions(
  contentByLocale: {
    es: string;
    en: string;
    fr: string;
    pt: string;
  },
  category?: string
): {
  es: string;
  en: string;
  fr: string;
  pt: string;
} {
  const venueMap = getVenueMap();
  const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
  
  // Encontrar todos los venues mencionados en todos los idiomas
  const allVenuesMentioned = new Set<string>();
  const venuesByLocale: { [locale: string]: VenueInfo[] } = {};
  
  for (const locale of locales) {
    const venues = findVenueByKeyword(contentByLocale[locale], venueMap);
    venuesByLocale[locale] = venues;
    for (const venue of venues) {
      allVenuesMentioned.add(`${venue.name}-${venue.city}`);
    }
  }
  
  // Filtrar venues por categoría si es necesario
  let relevantVenueKeys = Array.from(allVenuesMentioned);
  if (category) {
    const categoryCityMap: { [key: string]: string[] } = {
      'cancun': ['CANCÚN', 'CANCUN'],
      'tulum': ['TULUM'],
      'playa-del-carmen': ['PLAYA DEL CARMEN', 'PLAYA'],
      'los-cabos': ['LOS CABOS', 'CABOS', 'CABO'],
      'puerto-vallarta': ['PUERTO VALLARTA', 'VALLARTA'],
    };
    const expectedCities = categoryCityMap[category] || [];
    if (expectedCities.length > 0) {
      relevantVenueKeys = relevantVenueKeys.filter(venueKey => {
        const [venueName, venueCity] = venueKey.split('-');
        const venueCityUpper = venueCity.toUpperCase();
        const venueNameUpper = venueName.toUpperCase();
        return expectedCities.some(ec => venueCityUpper.includes(ec) || venueNameUpper.includes(ec));
      });
    }
  }
  
  // Para cada idioma, agregar menciones de venues que faltan
  const synchronizedContent: { [locale: string]: string } = { ...contentByLocale };
  
  for (const locale of locales) {
    let content = synchronizedContent[locale];
    const currentVenues = venuesByLocale[locale];
    const currentVenueKeys = new Set(currentVenues.map(v => `${v.name}-${v.city}`));
    
    // Encontrar venues que faltan en este idioma
    const missingVenueKeys = relevantVenueKeys.filter(key => !currentVenueKeys.has(key));
    
    for (const venueKey of missingVenueKeys) {
      // Buscar el venue en el mapa
      let venue: VenueInfo | null = null;
      for (const v of Object.values(venueMap)) {
        if (`${v.name}-${v.city}` === venueKey) {
          venue = v;
          break;
        }
      }
      
      if (!venue || !venue.urls[locale]) {
        continue; // Venue no tiene URL para este idioma
      }
      
      // Buscar dónde agregar la mención del venue
      // Intentar agregarlo en una sección relevante del contenido
      const venueName = venue.name;
      const venueNameLower = venueName.toLowerCase();
      const contentLower = content.toLowerCase();
      
      // Si el venue no está mencionado, agregarlo de forma natural
      if (!contentLower.includes(venueNameLower)) {
        // Buscar una sección donde mencionar el venue
        // Por ejemplo, después de mencionar otros venues similares
        const similarVenues = currentVenues.filter(v => v.city === venue.city);
        
        if (similarVenues.length > 0) {
          // Buscar la última mención de un venue similar
          let insertPosition = -1;
          for (const similarVenue of similarVenues) {
            const similarVenueNameLower = similarVenue.name.toLowerCase();
            const lastIndex = contentLower.lastIndexOf(similarVenueNameLower);
            if (lastIndex !== -1 && (insertPosition === -1 || lastIndex > insertPosition)) {
              insertPosition = lastIndex;
            }
          }
          
          if (insertPosition !== -1) {
            // Buscar el final de la oración o párrafo después de esta mención
            const afterMention = content.substring(insertPosition, insertPosition + 200);
            const paragraphEnd = afterMention.search(/<\/p>/);
            const sentenceEnd = afterMention.search(/[.!?]\s+/);
            
            let finalPosition = insertPosition;
            if (paragraphEnd !== -1 && paragraphEnd < 150) {
              finalPosition += paragraphEnd;
            } else if (sentenceEnd !== -1 && sentenceEnd < 150) {
              finalPosition += sentenceEnd + 1;
            } else {
              finalPosition += Math.min(100, afterMention.length);
            }
            
            // Generar texto de mención apropiado según el idioma
            const mentionTexts: { [key: string]: string } = {
              es: ` ${venueName} es otro venue destacado`,
              en: ` ${venueName} is another notable venue`,
              fr: ` ${venueName} est un autre lieu remarquable`,
              pt: ` ${venueName} é outro local destacado`,
            };
            
            const mentionText = mentionTexts[locale] || ` ${venueName}`;
            const venueUrl = venue.urls[locale];
            
            // Generar anchor text
            const anchorTextTemplates: { [key: string]: string } = {
              es: 'entradas',
              en: 'tickets',
              fr: 'billets',
              pt: 'ingressos',
            };
            
            const baseText = anchorTextTemplates[locale] || 'tickets';
            let anchorText = '';
            if (venue.anchorTexts && venue.anchorTexts.length > 0) {
              anchorText = venue.anchorTexts[0];
            } else {
              const cityLower = venue.city.toLowerCase();
              const nameLower = venue.name.toLowerCase();
              if (nameLower.includes(cityLower) && nameLower !== cityLower) {
                anchorText = `${baseText} ${venue.name}`;
              } else {
                anchorText = `${baseText} ${venue.name} ${venue.city}`;
              }
            }
            
            const backlink = ` <a href="${venueUrl}" target="_blank" rel="noopener noreferrer" title="${anchorText}">${anchorText}</a>`;
            const fullMention = mentionText + backlink;
            
            content = 
              content.substring(0, finalPosition) +
              fullMention +
              content.substring(finalPosition);
          }
        }
      }
    }
    
    synchronizedContent[locale] = content;
  }
  
  return {
    es: synchronizedContent.es,
    en: synchronizedContent.en,
    fr: synchronizedContent.fr,
    pt: synchronizedContent.pt,
  };
}



