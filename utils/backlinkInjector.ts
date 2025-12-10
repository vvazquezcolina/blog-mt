/**
 * Utilidad para inyectar backlinks automáticamente cuando se mencionan venues
 */

import { getVenueMap, findVenueByKeyword, type VenueInfo } from '../scripts/venueUrlMapper';

/**
 * Inyecta backlinks a venues mencionados en el contenido
 * @param content - Contenido HTML del post
 * @param locale - Idioma del contenido
 * @param category - Categoría del post (para filtrar venues relevantes)
 * @returns Contenido con backlinks agregados
 */
export function injectVenueBacklinks(
  content: string,
  locale: 'es' | 'en' | 'fr' | 'pt',
  category?: string
): string {
  const venueMap = getVenueMap();
  
  // Buscar venues mencionados de forma más agresiva
  let venuesMentioned = findVenueByKeyword(content, venueMap);
  
  // Si no encontramos venues, intentar búsqueda más amplia
  if (venuesMentioned.length === 0) {
    // Buscar menciones directas de nombres de venues en el contenido
    const allVenues = Object.values(venueMap);
    for (const venue of allVenues) {
      const venueNameLower = venue.name.toLowerCase();
      const contentLower = content.toLowerCase();
      
      // Buscar el nombre completo del venue
      if (contentLower.includes(venueNameLower)) {
        // Verificar que no esté ya en la lista
        if (!venuesMentioned.find(v => v.name === venue.name && v.city === venue.city)) {
          venuesMentioned.push(venue);
        }
      }
    }
  }
  
  if (venuesMentioned.length === 0) {
    return content;
  }
  
  // Filtrar venues por categoría - solo incluir venues relevantes para la categoría del post
  let relevantVenues = venuesMentioned;
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
      relevantVenues = venuesMentioned.filter(v => {
        const venueCityUpper = v.city.toUpperCase();
        const venueNameUpper = v.name.toUpperCase();
        
        // Verificar que la ciudad del venue coincida con la categoría
        const cityMatches = expectedCities.some(ec => venueCityUpper.includes(ec) || ec.includes(venueCityUpper));
        
        // También verificar que el nombre del venue contenga la ciudad esperada
        const nameMatches = expectedCities.some(ec => venueNameUpper.includes(ec));
        
        return cityMatches || nameMatches;
      });
    }
  }
  
  let modifiedContent = content;
  const processedVenues = new Set<string>();
  
  // Para cada venue mencionado, agregar backlink después de la primera mención
  // Ordenar por relevancia (venues más específicos primero)
  const sortedVenues = [...relevantVenues].sort((a, b) => {
    // Priorizar venues con nombres más largos (más específicos)
    if (a.name.length !== b.name.length) {
      return b.name.length - a.name.length;
    }
    return 0;
  });
  
  for (const venue of sortedVenues) {
    const venueKey = `${venue.name}-${venue.city}`;
    if (processedVenues.has(venueKey)) {
      continue; // Ya procesamos este venue
    }
    
    const venueUrl = venue.urls[locale];
    if (!venueUrl) {
      continue; // No hay URL para este idioma
    }
    
    // Buscar todas las menciones del venue en el contenido
    const venueKeywords = venue.keywords;
    const mentions: Array<{ index: number; length: number; keyword: string }> = [];
    
    // También buscar variaciones del nombre del venue
    const venueNameVariations = [
      venue.name,
      venue.name.toLowerCase(),
      venue.name.toUpperCase(),
      venue.name.replace(/[^\w\s]/g, ''), // Sin caracteres especiales
      venue.name.split(' ')[0], // Solo primera palabra
    ];
    
    const allKeywords = [...venueKeywords, ...venueNameVariations];
    
    // Buscar menciones de forma más agresiva
    for (const keyword of allKeywords) {
      if (!keyword || keyword.trim().length < 2) continue; // Ignorar keywords muy cortos
      
      const keywordLower = keyword.toLowerCase().trim();
      const contentLower = modifiedContent.toLowerCase();
      let searchIndex = 0;
      
      while (true) {
        const index = contentLower.indexOf(keywordLower, searchIndex);
        if (index === -1) break;
        
        // Verificar que no esté dentro de un tag HTML
        const beforeTag = modifiedContent.lastIndexOf('<', index);
        const afterTag = modifiedContent.indexOf('>', beforeTag);
        if (beforeTag !== -1 && afterTag !== -1 && afterTag > index) {
          // Verificar si es un tag de link
          const tagContent = modifiedContent.substring(beforeTag, afterTag + 1);
          if (tagContent.includes('<a ') || tagContent.includes('href=')) {
            searchIndex = index + 1;
            continue; // Está dentro de un link existente
          }
        }
        
        // Verificar que no esté dentro de un link existente (buscar <a> antes y </a> después)
        const linkStart = modifiedContent.lastIndexOf('<a ', index);
        if (linkStart !== -1) {
          const linkEnd = modifiedContent.indexOf('</a>', linkStart);
          if (linkEnd !== -1 && linkEnd > index) {
            searchIndex = index + 1;
            continue; // Está dentro de un link existente
          }
        }
        
        // Verificar que no esté dentro de un atributo href
        const hrefStart = modifiedContent.lastIndexOf('href=', index);
        if (hrefStart !== -1) {
          const hrefEnd = modifiedContent.indexOf('"', hrefStart + 6);
          if (hrefEnd !== -1 && hrefEnd > index) {
            searchIndex = index + 1;
            continue; // Está dentro de un href
          }
        }
        
        mentions.push({
          index,
          length: keyword.length,
          keyword: modifiedContent.substring(index, index + keyword.length),
        });
        searchIndex = index + 1;
      }
    }
    
    // Si no encontramos menciones con keywords, buscar el nombre del venue directamente
    if (mentions.length === 0) {
      const venueNameLower = venue.name.toLowerCase();
      const contentLower = modifiedContent.toLowerCase();
      const index = contentLower.indexOf(venueNameLower);
      
      if (index !== -1) {
        // Verificar que no esté dentro de un tag o link
        const beforeTag = modifiedContent.lastIndexOf('<', index);
        const afterTag = modifiedContent.indexOf('>', beforeTag);
        if (beforeTag === -1 || afterTag === -1 || afterTag < index) {
          const linkStart = modifiedContent.lastIndexOf('<a ', index);
          if (linkStart === -1 || modifiedContent.indexOf('</a>', linkStart) === -1 || modifiedContent.indexOf('</a>', linkStart) < index) {
            mentions.push({
              index,
              length: venue.name.length,
              keyword: modifiedContent.substring(index, index + venue.name.length),
            });
          }
        }
      }
    }
    
    if (mentions.length === 0) {
      continue; // No se encontró mención del venue
    }
    
    // Ordenar menciones por posición
    mentions.sort((a, b) => a.index - b.index);
    
    // Buscar la primera mención que no tenga backlink cerca
    let targetMention: { index: number; length: number; keyword: string } | null = null;
    const venueSlug = venueUrl.split('/').pop() || '';
    
    for (const mention of mentions) {
      // Verificar si ya hay un backlink cerca de esta mención (rango más amplio)
      const contextStart = Math.max(0, mention.index - 500);
      const contextEnd = Math.min(modifiedContent.length, mention.index + mention.length + 500);
      const context = modifiedContent.substring(contextStart, contextEnd);
      
      // Verificar si ya existe un link a este venue (más flexible)
      const venueSlugEscaped = venueSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hasExistingLink = 
        context.includes(venueUrl) || 
        context.includes(venueSlug) ||
        (new RegExp(`<a[^>]+href=["'][^"']*${venueSlugEscaped}[^"']*["']`, 'i')).test(context) ||
        (new RegExp(`href=["'][^"']*${venueSlugEscaped}`, 'i')).test(context);
      
      if (!hasExistingLink) {
        targetMention = mention;
        break; // Encontramos una mención sin backlink
      }
    }
    
    if (!targetMention) {
      processedVenues.add(venueKey);
      continue; // Todas las menciones ya tienen backlinks
    }
    
    const firstMentionIndex = targetMention.index;
    const venueNameInContent = targetMention.keyword;
    
    // Generar anchor text apropiado
    let anchorText = '';
    if (venue.anchorTexts && venue.anchorTexts.length > 0) {
      anchorText = venue.anchorTexts[0];
    } else {
      // Generar anchor text basado en el locale y venue
      const anchorTextTemplates: { [key: string]: string } = {
        es: 'entradas',
        en: 'tickets',
        fr: 'billets',
        pt: 'ingressos',
      };
      
      const baseText = anchorTextTemplates[locale] || 'tickets';
      // Limpiar nombre del venue (remover ciudad si está duplicada)
      let venueName = venue.name;
      const cityLower = venue.city.toLowerCase();
      const nameLower = venueName.toLowerCase();
      if (nameLower.includes(cityLower) && nameLower !== cityLower) {
        // El nombre ya incluye la ciudad, usar solo el nombre
        anchorText = `${baseText} ${venueName}`;
      } else {
        // Agregar ciudad si no está en el nombre
        anchorText = `${baseText} ${venueName} ${venue.city}`;
      }
    }
    
    // Insertar backlink después de la primera mención del venue
    // Buscar el final de la palabra/oración donde se menciona
    let insertPosition = firstMentionIndex + venueNameInContent.length;
    
    // Buscar el final de la oración, párrafo, o después de algunos caracteres
    const afterMention = modifiedContent.substring(insertPosition, insertPosition + 150);
    
    // Buscar fin de párrafo primero (más natural)
    const paragraphEnd = afterMention.search(/<\/p>/);
    const sentenceEnd = afterMention.search(/[.!?]\s+/);
    const spaceAfter = afterMention.search(/\s+/);
    
    if (paragraphEnd !== -1 && paragraphEnd < 80) {
      // Insertar justo antes del cierre del párrafo
      insertPosition += paragraphEnd;
    } else if (sentenceEnd !== -1 && sentenceEnd < 100) {
      // Insertar después del fin de oración
      insertPosition += sentenceEnd + 1;
    } else if (spaceAfter !== -1) {
      // Insertar después del primer espacio
      insertPosition += spaceAfter + 1;
    } else {
      // Si no hay espacio cercano, insertar inmediatamente después
      // (puede ser que el venue esté al final de una palabra)
    }
    
    // Crear el link HTML con mejor formato
    const backlink = ` <a href="${venueUrl}" target="_blank" rel="noopener noreferrer" title="${anchorText}">${anchorText}</a>`;
    
    // Insertar el backlink
    modifiedContent = 
      modifiedContent.substring(0, insertPosition) +
      backlink +
      modifiedContent.substring(insertPosition);
    
    processedVenues.add(venueKey);
  }
  
  return modifiedContent;
}



