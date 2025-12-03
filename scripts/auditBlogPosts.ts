import { blogPosts, BlogPost } from '../data/blogPosts';
import * as fs from 'fs';
import * as path from 'path';

// Venues según VENUES_GUIDE.md organizados por ciudad
const VENUES_BY_CITY: Record<string, Array<{ name: string; description: string; links: { es: string; en: string; pt: string; fr: string } }>> = {
  cancun: [
    {
      name: 'Rakata Cancún',
      description: 'punto de encuentro para reggaetón, dembow y urbano toda la noche, zona de fiesta km 9, ambiente oscuro, luces intensas, pista para perreo sin pausa',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/rakata',
        en: 'https://mandalatickets.com/en/cancun/disco/rakata',
        pt: 'https://mandalatickets.com/pt/cancun/disco/rakata',
        fr: 'https://mandalatickets.com/fr/cancun/disco/rakata'
      }
    },
    {
      name: "D'Cave Cancún",
      description: 'concepto underground del Party Center, diseño caverna futurista, pantallas LED, house y electrónica comercial, DJs invitados, performances',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/d-cave',
        en: 'https://mandalatickets.com/en/cancun/disco/d-cave',
        pt: 'https://mandalatickets.com/pt/cancun/disco/d-cave',
        fr: 'https://mandalatickets.com/fr/cancun/disco/d-cave'
      }
    },
    {
      name: 'La Vaquita Cancún',
      description: 'antro relajado y desenfadado, temática de vaca, vasos gigantes, reggaetón, hip hop, pop, sin dress code rígido, spring breakers',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/la-vaquita',
        en: 'https://mandalatickets.com/en/cancun/disco/la-vaquita',
        pt: 'https://mandalatickets.com/pt/cancun/disco/la-vaquita',
        fr: 'https://mandalatickets.com/fr/cancun/disco/la-vaquita'
      }
    },
    {
      name: 'Mandala Cancún',
      description: 'ícono de vida nocturna, fachada abierta, decoración oriental, EDM, pop, reggaetón selecto, big club, mesas con botella, producción de luces',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/mandala',
        en: 'https://mandalatickets.com/en/cancun/disco/mandala',
        pt: 'https://mandalatickets.com/pt/cancun/disco/mandala',
        fr: 'https://mandalatickets.com/fr/cancun/disco/mandala'
      }
    },
    {
      name: 'Mandala Beach Day (Cancún)',
      description: 'beach club diurno más famoso, abierto desde mediodía, albercas, camastros, camas, jacuzzi, electrónica ligera, Top 40, vibe playero',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/mandala-beach',
        en: 'https://mandalatickets.com/en/cancun/disco/mandala-beach',
        pt: 'https://mandalatickets.com/pt/cancun/disco/mandala-beach',
        fr: 'https://mandalatickets.com/fr/cancun/disco/mandala-beach'
      }
    },
    {
      name: 'Mandala Beach Night (Cancún)',
      description: 'pool party nocturna, DJ, shows, concursos, bikini contest, house y Top 40, traje de baño, pista alrededor de la alberca',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/mandala-pp',
        en: 'https://mandalatickets.com/en/cancun/disco/mandala-pp',
        pt: 'https://mandalatickets.com/pt/cancun/disco/mandala-pp',
        fr: 'https://mandalatickets.com/fr/cancun/disco/mandala-pp'
      }
    },
    {
      name: "Señor Frog's Cancún",
      description: 'restaurante, bar y antro, animadores, concursos, globos, espuma, yardas de bebida, shots, ambiente informal',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/frogs',
        en: 'https://mandalatickets.com/en/cancun/disco/frogs',
        pt: 'https://mandalatickets.com/pt/cancun/disco/frogs',
        fr: 'https://mandalatickets.com/fr/cancun/disco/frogs'
      }
    },
    {
      name: 'House Of Fiesta (Cancún)',
      description: 'casa de fraternidad épica, descontrol, música al límite, tribu de fiesteros, shots sin tregua, beats que revientan el alma, libertad',
      links: {
        es: 'https://mandalatickets.com/es/cancun/disco/house-of-fiesta',
        en: 'https://mandalatickets.com/en/cancun/disco/house-of-fiesta',
        pt: 'https://mandalatickets.com/pt/cancun/disco/house-of-fiesta',
        fr: 'https://mandalatickets.com/fr/cancun/disco/house-of-fiesta'
      }
    }
  ],
  tulum: [
    {
      name: 'Tehmplo Tulum',
      description: 'venue inmerso en la jungla, eventos masivos, electrónica de alto nivel, santuario bohemio, naturaleza y escena electrónica, techno, house',
      links: {
        es: 'https://mandalatickets.com/es/tulum/disco/tehmplo',
        en: 'https://mandalatickets.com/en/tulum/disco/tehmplo',
        pt: 'https://mandalatickets.com/pt/tulum/disco/tehmplo',
        fr: 'https://mandalatickets.com/fr/tulum/disco/tehmplo'
      }
    },
    {
      name: 'Bonbonniere Tulum',
      description: 'club boutique de alta gama, first-class party, producción, servicio, clientela selecta, diseño elegante, glamour nocturno, mesas VIP',
      links: {
        es: 'https://mandalatickets.com/es/tulum/disco/bonbonniere',
        en: 'https://mandalatickets.com/en/tulum/disco/bonbonniere',
        pt: 'https://mandalatickets.com/pt/tulum/disco/bonbonniere',
        fr: 'https://mandalatickets.com/fr/tulum/disco/bonbonniere'
      }
    },
    {
      name: 'Vagalume Tulum',
      description: 'beach club de día y nightclub de noche, música electrónica, camastros, playa, relax, ambiente boho-chic, beachwear, bohemian chic',
      links: {
        es: 'https://mandalatickets.com/es/tulum/disco/vagalume',
        en: 'https://mandalatickets.com/en/tulum/disco/vagalume',
        pt: 'https://mandalatickets.com/pt/tulum/disco/vagalume',
        fr: 'https://mandalatickets.com/fr/tulum/disco/vagalume'
      }
    },
    {
      name: 'Bagatelle Tulum',
      description: 'fiesta elegante, música, tragos, champagne-party, long lunches, house y sonidos disco, beach glam, tono chic, internacional, fotogénico',
      links: {
        es: 'https://mandalatickets.com/es/tulum/disco/bagatelle',
        en: 'https://mandalatickets.com/en/tulum/disco/bagatelle',
        pt: 'https://mandalatickets.com/pt/tulum/disco/bagatelle',
        fr: 'https://mandalatickets.com/fr/tulum/disco/bagatelle'
      }
    }
  ],
  'playa-del-carmen': [
    {
      name: 'La Vaquita Playa del Carmen',
      description: 'calle 12, concepto de vaca y fiesta extrema, música urbana, reggaetón, pop, pista siempre llena, interacción del staff',
      links: {
        es: 'https://mandalatickets.com/es/playa/disco/la-vaquita',
        en: 'https://mandalatickets.com/en/playa/disco/la-vaquita',
        pt: 'https://mandalatickets.com/pt/playa/disco/la-vaquita',
        fr: 'https://mandalatickets.com/fr/playa/disco/la-vaquita'
      }
    },
    {
      name: 'Mandala Playa del Carmen',
      description: 'estilo oriental, fachada abierta, calle 12, EDM, pop internacional, hits latinos, club elegante pero fiestero, mesas VIP',
      links: {
        es: 'https://mandalatickets.com/es/playa/disco/mandala',
        en: 'https://mandalatickets.com/en/playa/disco/mandala',
        pt: 'https://mandalatickets.com/pt/playa/disco/mandala',
        fr: 'https://mandalatickets.com/fr/playa/disco/mandala'
      }
    },
    {
      name: 'Santito Tun-Tun (Playa del Carmen)',
      description: 'palapa funky, calle 12, club abierto, funk, house, disco, edits latinos, DJ cercano, ambiente relajado pero encendido',
      links: {
        es: 'https://mandalatickets.com/es/playa/disco/santito-tun-tun',
        en: 'https://mandalatickets.com/en/playa/disco/santito-tun-tun',
        pt: 'https://mandalatickets.com/pt/playa/disco/santito-tun-tun',
        fr: 'https://mandalatickets.com/fr/playa/disco/santito-tun-tun'
      }
    }
  ],
  'los-cabos': [
    {
      name: 'Mandala Los Cabos',
      description: 'club insignia, zona marina, EDM, pop, Top 40, dress to impress, mesas con botella, servicio cercano, big-room',
      links: {
        es: 'https://mandalatickets.com/es/cabos/disco/mandala',
        en: 'https://mandalatickets.com/en/cabos/disco/mandala',
        pt: 'https://mandalatickets.com/pt/cabos/disco/mandala',
        fr: 'https://mandalatickets.com/fr/cabos/disco/mandala'
      }
    },
    {
      name: 'La Vaquita Los Cabos',
      description: 'concepto relajado y divertido, R&B, hip hop, pop, reggaetón, foco en baile y coro, despedidas, ambiente sin formalidad',
      links: {
        es: 'https://mandalatickets.com/es/cabos/disco/la-vaquita',
        en: 'https://mandalatickets.com/en/cabos/disco/la-vaquita',
        pt: 'https://mandalatickets.com/pt/cabos/disco/la-vaquita',
        fr: 'https://mandalatickets.com/fr/cabos/disco/la-vaquita'
      }
    }
  ],
  'puerto-vallarta': [
    {
      name: 'Chicabal Sunset Club Puerto Vallarta',
      description: 'beach club chic del Pacífico, zona hotelera, vista al atardecer, gastronomía urbana, cabanas de lujo, servicio de yate, exclusividad',
      links: {
        es: 'https://mandalatickets.com/es/vallarta/disco/chicabal',
        en: 'https://mandalatickets.com/en/vallarta/disco/chicabal',
        pt: 'https://mandalatickets.com/pt/vallarta/disco/chicabal',
        fr: 'https://mandalatickets.com/fr/vallarta/disco/chicabal'
      }
    },
    {
      name: "Señor Frog's Puerto Vallarta",
      description: 'restaurante-bar, juegos, animadores, música en vivo/DJ, malecón, ambiente relajado pero animado, globos, concursos, shots',
      links: {
        es: 'https://mandalatickets.com/es/vallarta/disco/frogs',
        en: 'https://mandalatickets.com/en/vallarta/disco/frogs',
        pt: 'https://mandalatickets.com/pt/vallarta/disco/frogs',
        fr: 'https://mandalatickets.com/fr/vallarta/disco/frogs'
      }
    },
    {
      name: 'La Vaquita Puerto Vallarta',
      description: 'reggaetón, urbano, fiesta desenfadada, baile y convivencia, sin dress code complicado, música latina toda la noche',
      links: {
        es: 'https://mandalatickets.com/es/vallarta/disco/la-vaquita',
        en: 'https://mandalatickets.com/en/vallarta/disco/la-vaquita',
        pt: 'https://mandalatickets.com/pt/vallarta/disco/la-vaquita',
        fr: 'https://mandalatickets.com/fr/vallarta/disco/la-vaquita'
      }
    },
    {
      name: 'Mandala Puerto Vallarta',
      description: 'frente al mar, fachada abierta, decoración oriental, club más famoso, EDM, pop, Top 40, open bar, mesas VIP, DJ residente',
      links: {
        es: 'https://mandalatickets.com/es/vallarta/disco/mandala',
        en: 'https://mandalatickets.com/en/vallarta/disco/mandala',
        pt: 'https://mandalatickets.com/pt/vallarta/disco/mandala',
        fr: 'https://mandalatickets.com/fr/vallarta/disco/mandala'
      }
    },
    {
      name: 'Rakata Puerto Vallarta',
      description: 'opción urbana del malecón, reggaetón, trap latino, dembow, perreo en Vallarta, música latina actual, afters',
      links: {
        es: 'https://mandalatickets.com/es/vallarta/disco/rakata',
        en: 'https://mandalatickets.com/en/vallarta/disco/rakata',
        pt: 'https://mandalatickets.com/pt/vallarta/disco/rakata',
        fr: 'https://mandalatickets.com/fr/vallarta/disco/rakata'
      }
    },
    {
      name: 'La Santa Puerto Vallarta',
      description: 'club de alta energía, zona hotelera, producción de luces, pantallas LED, música electrónica y urbana, premium, eventos especiales',
      links: {
        es: 'https://mandalatickets.com/es/vallarta/disco/la-santa',
        en: 'https://mandalatickets.com/en/vallarta/disco/la-santa',
        pt: 'https://mandalatickets.com/pt/vallarta/disco/la-santa',
        fr: 'https://mandalatickets.com/fr/vallarta/disco/la-santa'
      }
    }
  ]
};

interface AuditIssue {
  type: 'value' | 'venue_coherence' | 'venue_missing' | 'venue_incorrect';
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
}

interface PostAudit {
  postId: string;
  title: string;
  category: string;
  issues: AuditIssue[];
  venueMentions: string[];
  wordCount: number;
  hasValue: boolean;
  valueScore: number; // 0-10
}

// Palabras genéricas que indican contenido de bajo valor
const GENERIC_PHRASES = [
  'descubre los mejores',
  'los mejores lugares',
  'todo lo que necesitas',
  'guía completa',
  'consejos útiles',
  'no te pierdas',
  'imperdible',
  'experiencia única',
  'sin duda',
  'definitivamente',
  'absolutamente',
  'sin lugar a dudas'
];

// Frases que indican contenido de valor
const VALUABLE_PHRASES = [
  'horarios',
  'precios',
  'costo',
  'ubicación',
  'dirección',
  'cómo llegar',
  'qué llevar',
  'dress code',
  'reservar',
  'comprar boletos',
  'acceso',
  'capacidad',
  'recomendaciones específicas',
  'información práctica'
];

function extractVenueMentions(text: string): string[] {
  const venues: string[] = [];
  const textLower = text.toLowerCase();
  
  // Buscar menciones de venues con mejor precisión
  for (const city in VENUES_BY_CITY) {
    for (const venue of VENUES_BY_CITY[city]) {
      const venueNameLower = venue.name.toLowerCase();
      const cityNameLower = city.toLowerCase();
      
      // Primero intentar con el nombre completo (más preciso)
      const fullNamePattern = new RegExp(`\\b${venueNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (fullNamePattern.test(textLower)) {
        venues.push(venue.name);
        continue;
      }
      
      // También buscar el nombre sin la ciudad entre paréntesis (ej: "Mandala Beach Day" sin "(Cancún)")
      const nameWithoutCity = venueNameLower
        .replace(/\s*\([^)]*\)\s*$/, '') // Remover (Cancún) al final
        .replace(/\s+cancún\s*$/i, '')
        .replace(/\s+cancun\s*$/i, '')
        .replace(/\s+playa del carmen\s*$/i, '')
        .replace(/\s+los cabos\s*$/i, '')
        .replace(/\s+puerto vallarta\s*$/i, '')
        .replace(/\s+tulum\s*$/i, '')
        .trim();
      
      // Si el nombre sin ciudad es diferente y tiene al menos 3 caracteres, buscarlo
      if (nameWithoutCity !== venueNameLower && nameWithoutCity.length >= 3) {
        const nameWithoutCityPattern = new RegExp(`\\b${nameWithoutCity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const match = nameWithoutCityPattern.exec(textLower);
        
        if (match) {
          const matchIndex = match.index;
          // Verificar contexto: debe tener la ciudad cerca o estar en un link con la ciudad
          const contextStart = Math.max(0, matchIndex - 150);
          const contextEnd = Math.min(textLower.length, matchIndex + nameWithoutCity.length + 150);
          const context = textLower.substring(contextStart, contextEnd);
          
          // Verificar link con ciudad
          const citySlugs: Record<string, string[]> = {
            'cancun': ['cancun'],
            'tulum': ['tulum'],
            'playa-del-carmen': ['playa'],
            'los-cabos': ['cabos'],
            'puerto-vallarta': ['vallarta']
          };
          
          const slugs = citySlugs[city] || [];
          const linkPatterns = slugs.map(slug => 
            new RegExp(`mandalatickets\\.com/[^/]+/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`, 'i')
          );
          const hasLinkContext = linkPatterns.some(pattern => pattern.test(context));
          
          // Verificar contexto de ciudad
          const cityIndicators: Record<string, string[]> = {
            'cancun': ['cancún', 'cancun'],
            'tulum': ['tulum'],
            'playa-del-carmen': ['playa del carmen'],
            'los-cabos': ['los cabos'],
            'puerto-vallarta': ['puerto vallarta', 'vallarta']
          };
          
          const indicators = cityIndicators[city] || [];
          const hasCityContext = indicators.some(indicator => context.includes(indicator));
          
          if (hasLinkContext || hasCityContext) {
            venues.push(venue.name);
            continue;
          }
        }
      }
      
      // Si no se encuentra el nombre completo, buscar variaciones pero con contexto de ciudad
      const venueBaseName = venueNameLower
        .replace(' cancún', '').replace(' cancun', '')
        .replace(' playa del carmen', '')
        .replace(' los cabos', '')
        .replace(' puerto vallarta', '')
        .replace(' tulum', '')
        .replace(' (cancún)', '').replace(' (cancun)', '')
        .replace(' (playa del carmen)', '')
        .replace(' (los cabos)', '')
        .replace(' (puerto vallarta)', '')
        .replace(' (tulum)', '')
        .trim();
      
      if (venueBaseName.length < 3) continue;
      
      // Para nombres genéricos como "Mandala" o "La Vaquita", SIEMPRE requerir contexto de ciudad
      const genericNames = ['mandala', 'la vaquita', 'rakata'];
      const isGenericName = genericNames.some(gen => venueBaseName === gen || venueBaseName.startsWith(gen + ' '));
      
      // Si es genérico, buscar con contexto estricto
      if (isGenericName) {
        // Buscar el nombre base seguido de la ciudad o en un link con la ciudad
        const cityIndicators: Record<string, string[]> = {
          'cancun': ['cancún', 'cancun'],
          'tulum': ['tulum'],
          'playa-del-carmen': ['playa del carmen'],
          'los-cabos': ['los cabos', 'cabo'],
          'puerto-vallarta': ['puerto vallarta', 'vallarta']
        };
        
        const indicators = cityIndicators[city] || [];
        const citySlugs: Record<string, string[]> = {
          'cancun': ['cancun'],
          'tulum': ['tulum'],
          'playa-del-carmen': ['playa'],
          'los-cabos': ['cabos'],
          'puerto-vallarta': ['vallarta']
        };
        
        const slugs = citySlugs[city] || [];
        
        // Buscar patrón: "venueBaseName" seguido de ciudad O en link con ciudad
        let foundWithContext = false;
        
        for (const indicator of indicators) {
          const pattern = new RegExp(`\\b${venueBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+${indicator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (pattern.test(textLower)) {
            foundWithContext = true;
            break;
          }
        }
        
        // También verificar links
        if (!foundWithContext) {
          for (const slug of slugs) {
            const linkPattern = new RegExp(`mandalatickets\\.com/[^/]+/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[^"\\s]*${venueBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
            if (linkPattern.test(textLower)) {
              foundWithContext = true;
              break;
            }
          }
        }
        
        if (foundWithContext) {
          venues.push(venue.name);
        }
        continue; // No procesar más para este venue genérico
      }
      
      // Para venues únicos, buscar el nombre base
      const basePattern = new RegExp(`\\b${venueBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const baseMatch = basePattern.exec(textLower);
      
      if (baseMatch) {
        const matchIndex = baseMatch.index;
        // Extraer contexto alrededor (200 caracteres antes y después)
        const contextStart = Math.max(0, matchIndex - 200);
        const contextEnd = Math.min(textLower.length, matchIndex + venueBaseName.length + 200);
        const context = textLower.substring(contextStart, contextEnd);
        
        // Verificar que el contexto incluya la ciudad o un indicador claro
        const cityIndicators: Record<string, string[]> = {
          'cancun': ['cancún', 'cancun', 'zona hotelera', 'km 9', 'party center'],
          'tulum': ['tulum', 'riviera maya'],
          'playa-del-carmen': ['playa del carmen', 'calle 12'],
          'los-cabos': ['los cabos', 'cabo san lucas', 'marina'],
          'puerto-vallarta': ['puerto vallarta', 'vallarta', 'malecón']
        };
        
        const indicators = cityIndicators[city] || [];
        const hasCityContext = indicators.some(indicator => context.includes(indicator));
        
        // También verificar si está en un link que incluya la ciudad
        const citySlugs: Record<string, string[]> = {
          'cancun': ['cancun'],
          'tulum': ['tulum'],
          'playa-del-carmen': ['playa'],
          'los-cabos': ['cabos'],
          'puerto-vallarta': ['vallarta']
        };
        
        const slugs = citySlugs[city] || [];
        const linkPatterns = slugs.map(slug => 
          new RegExp(`mandalatickets\\.com/[^/]+/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`, 'i')
        );
        const hasLinkContext = linkPatterns.some(pattern => pattern.test(context));
        
        // Para venues únicos, aceptar si tiene contexto
        const uniqueVenueNames = ['house of fiesta', 'hof', 'd\'cave', 'd-cave', 'tehmplo', 'bonbonniere', 'vagalume', 'bagatelle', 'santito tun-tun', 'chicabal', 'la santa', 'señor frog', 'frogs'];
        const isUniqueVenue = uniqueVenueNames.some(unique => venueBaseName.includes(unique));
        
        if (hasCityContext || hasLinkContext || isUniqueVenue) {
          venues.push(venue.name);
        }
      }
    }
  }
  
  return [...new Set(venues)];
}

function checkVenueCoherence(text: string, venueName: string, category: string): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const textLower = text.toLowerCase();
  const venueNameLower = venueName.toLowerCase();
  
  // Obtener información del venue según la guía
  const cityKey = category === 'cancun' ? 'cancun' :
                  category === 'tulum' ? 'tulum' :
                  category === 'playa-del-carmen' ? 'playa-del-carmen' :
                  category === 'los-cabos' ? 'los-cabos' :
                  category === 'puerto-vallarta' ? 'puerto-vallarta' : null;
  
  if (!cityKey) return issues;
  
  // Buscar el venue en la ciudad correcta
  const venueInfo = VENUES_BY_CITY[cityKey]?.find(v => {
    const vNameLower = v.name.toLowerCase();
    return vNameLower.includes(venueNameLower) || 
           venueNameLower.includes(vNameLower.split(' ')[0]) ||
           // También buscar sin la ciudad
           venueNameLower.includes(vNameLower.replace(` ${cityKey}`, '').replace(' cancún', '').replace(' cancun', '').replace(' tulum', '').replace(' playa del carmen', '').replace(' los cabos', '').replace(' puerto vallarta', ''));
  });
  
  // Si no se encuentra en la ciudad correcta, verificar si está en otra ciudad
  if (!venueInfo) {
    // Buscar en todas las ciudades para ver si el venue existe pero en otra ciudad
    let foundInOtherCity = false;
    let otherCityName = '';
    
    for (const otherCity in VENUES_BY_CITY) {
      if (otherCity === cityKey) continue;
      
      const found = VENUES_BY_CITY[otherCity]?.find(v => {
        const vNameLower = v.name.toLowerCase();
        return vNameLower.includes(venueNameLower) || 
               venueNameLower.includes(vNameLower.split(' ')[0]);
      });
      
      if (found) {
        foundInOtherCity = true;
        otherCityName = otherCity;
        break;
      }
    }
    
    if (foundInOtherCity) {
      // Venue mencionado pero está en otra ciudad - esto es un problema
      issues.push({
        type: 'venue_incorrect',
        severity: 'high',
        message: `Venue "${venueName}" mencionado pero corresponde a la ciudad "${otherCityName}", no a "${category}" según VENUES_GUIDE.md`,
        details: `El venue debería estar en la ciudad correcta según la guía. Si es intencional (comparación), debería estar en una sección separada al final.`
      });
    }
    return issues;
  }
  
  // Verificar coherencia de descripción usando contexto cercano al venue
  // Buscar todas las ocurrencias del nombre del venue
  const venuePattern = new RegExp(venueNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = [...textLower.matchAll(venuePattern)];
  
  // Verificar si el texto menciona características incorrectas cerca del venue
  const incorrectDescriptions: Record<string, string[]> = {
    'rakata': ['beach club', 'beachclub', 'playa', 'alberca', 'camastro', 'camastros'],
    'd\'cave': ['beach club', 'beachclub', 'playa'],
    'd\'cave cancún': ['beach club', 'beachclub', 'playa'],
    'la vaquita': ['elegante', 'exclusivo', 'premium', 'dress code estricto', 'dress code formal'],
    'mandala beach day': ['nocturno', 'club nocturno', 'antro', 'noche'],
    'mandala beach night': ['diurno', 'día', 'mediodía', 'mañana', 'tarde'],
    'house of fiesta': ['elegante', 'exclusivo', 'premium', 'relajado', 'tranquilo']
  };
  
  const venueKey = venueNameLower.split(' ')[0];
  const fullVenueKey = venueNameLower;
  
  // Verificar cada mención del venue
  for (const match of matches) {
    const matchIndex = match.index || 0;
    // Extraer contexto: 300 caracteres antes y después
    const contextStart = Math.max(0, matchIndex - 300);
    const contextEnd = Math.min(textLower.length, matchIndex + venueNameLower.length + 300);
    const context = textLower.substring(contextStart, contextEnd);
    
    // Verificar características incorrectas en el contexto
    const descriptionsToCheck = incorrectDescriptions[fullVenueKey] || incorrectDescriptions[venueKey] || [];
    
    for (const incorrect of descriptionsToCheck) {
      // Buscar la palabra incorrecta en el contexto, pero no si está en una lista general o consejo
      const incorrectPattern = new RegExp(`\\b${incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (incorrectPattern.test(context)) {
        // Verificar que no sea parte de una frase general (ej: "Para eventos en beach clubs")
        const beforeContext = context.substring(0, context.indexOf(venueNameLower));
        const afterContext = context.substring(context.indexOf(venueNameLower) + venueNameLower.length);
        
        // Si la palabra incorrecta está muy lejos del venue (más de 150 caracteres), probablemente es contexto general
        const incorrectIndex = context.indexOf(incorrect);
        const distance = Math.abs(incorrectIndex - (matchIndex - contextStart));
        
        if (distance < 150) {
          // Verificar que no sea parte de una frase general como "Para eventos en beach clubs"
          const isGeneralPhrase = /para\s+(eventos|fiestas|visitas)\s+en/i.test(beforeContext) ||
                                  /en\s+(los|las|unos|unas)\s+/i.test(beforeContext);
          
          if (!isGeneralPhrase) {
            issues.push({
              type: 'venue_coherence',
              severity: 'medium',
              message: `Descripción incoherente: "${venueName}" mencionado con características que no corresponden según VENUES_GUIDE.md`,
              details: `Se menciona "${incorrect}" cerca de "${venueName}" pero según la guía este venue no tiene esas características`
            });
            break; // Solo reportar una vez por mención
          }
        }
      }
    }
  }
  
  return issues;
}

function assessContentValue(text: string): { hasValue: boolean; score: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];
  let score = 5; // Punto de partida neutral
  
  const textLower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  
  // Verificar longitud mínima (debe tener al menos 300 palabras para ser valioso)
  if (wordCount < 300) {
    issues.push({
      type: 'value',
      severity: 'high',
      message: `Contenido muy corto (${wordCount} palabras). Mínimo recomendado: 300 palabras para SEO y valor`,
    });
    score -= 3;
  } else if (wordCount >= 800) {
    score += 1; // Bonus por contenido extenso
  }
  
  // Contar frases genéricas
  let genericCount = 0;
  for (const phrase of GENERIC_PHRASES) {
    if (textLower.includes(phrase)) {
      genericCount++;
    }
  }
  
  if (genericCount > 5) {
    issues.push({
      type: 'value',
      severity: 'medium',
      message: `Demasiadas frases genéricas (${genericCount} encontradas). El contenido puede sonar demasiado promocional`,
    });
    score -= 2;
  }
  
  // Contar frases de valor
  let valuableCount = 0;
  for (const phrase of VALUABLE_PHRASES) {
    if (textLower.includes(phrase)) {
      valuableCount++;
    }
  }
  
  if (valuableCount > 3) {
    score += 2; // Bonus por información práctica
  } else if (valuableCount === 0) {
    issues.push({
      type: 'value',
      severity: 'medium',
      message: 'Falta información práctica (horarios, precios, ubicación, etc.)',
    });
    score -= 1;
  }
  
  // Verificar si tiene estructura (H2, H3, listas)
  const hasH2 = /<h2>/i.test(text);
  const hasH3 = /<h3>/i.test(text);
  const hasLists = /<ul>|<ol>/i.test(text);
  
  if (hasH2 && hasH3 && hasLists) {
    score += 1; // Bonus por buena estructura
  } else {
    issues.push({
      type: 'value',
      severity: 'low',
      message: 'Falta estructura clara (subtítulos H2/H3, listas)',
    });
  }
  
  // Verificar si menciona información específica (números, fechas, lugares específicos)
  const hasNumbers = /\d+/.test(text);
  const hasSpecificPlaces = /calle|avenida|km|zona|centro|hotel zone|party center/i.test(text);
  
  if (hasNumbers && hasSpecificPlaces) {
    score += 1;
  }
  
  score = Math.max(0, Math.min(10, score)); // Asegurar que esté entre 0 y 10
  
  return {
    hasValue: score >= 6,
    score,
    issues
  };
}

function auditPost(post: BlogPost): PostAudit {
  const issues: AuditIssue[] = [];
  const allVenueMentions: string[] = [];
  
  // Auditar cada idioma
  for (const locale of ['es', 'en', 'fr', 'pt'] as const) {
    const content = post.content[locale];
    if (!content || !content.body) continue;
    
    const body = content.body;
    const wordCount = body.split(/\s+/).length;
    
    // Evaluar valor del contenido
    const valueAssessment = assessContentValue(body);
    issues.push(...valueAssessment.issues.map(issue => ({
      ...issue,
      details: `${issue.details || ''} [${locale.toUpperCase()}]`
    })));
    
    // Extraer menciones de venues
    const venueMentions = extractVenueMentions(body);
    allVenueMentions.push(...venueMentions);
    
    // Verificar coherencia de venues
    for (const venue of venueMentions) {
      const coherenceIssues = checkVenueCoherence(body, venue, post.category);
      
      // Filtrar issues de venues de otras ciudades si están en contexto apropiado
      const filteredIssues = coherenceIssues.filter(issue => {
        if (issue.type === 'venue_incorrect') {
          // Verificar si el venue está en una sección contextual (otros destinos, etc.)
          const bodyLower = body.toLowerCase();
          const venueLower = venue.toLowerCase();
          const venueIndex = bodyLower.indexOf(venueLower);
          
          if (venueIndex > -1) {
            // Buscar contexto antes del venue (200 caracteres)
            const contextBefore = bodyLower.substring(Math.max(0, venueIndex - 200), venueIndex);
            const contextAfter = bodyLower.substring(venueIndex, Math.min(bodyLower.length, venueIndex + 500));
            
            // Frases que indican contexto apropiado
            const contextualPhrases = [
              'otros destinos',
              'también puedes visitar',
              'en otros destinos',
              'nuestros venues en',
              'explorar otros',
              'si quieres visitar',
              'además de',
              'también en',
              'en otras ciudades'
            ];
            
            const isContextual = contextualPhrases.some(phrase => 
              contextBefore.includes(phrase) || contextAfter.includes(phrase)
            );
            
            // Si está en los últimos 30% del texto, probablemente es una sección separada
            const isNearEnd = venueIndex > (bodyLower.length * 0.7);
            
            // Si está en un H2/H3 que sugiere sección separada
            const sectionBefore = body.substring(Math.max(0, venueIndex - 500), venueIndex);
            const isInSeparateSection = /<h[23]>/i.test(sectionBefore);
            
            if (isContextual || (isNearEnd && isInSeparateSection)) {
              // Es contextual, cambiar severidad a baja
              issue.severity = 'low';
              issue.details = `${issue.details || ''} (Mencionado en contexto de otros destinos - revisar si es apropiado)`;
              return true; // Mantener pero con severidad baja
            }
          }
        }
        return true;
      });
      
      issues.push(...filteredIssues.map(issue => ({
        ...issue,
        details: `${issue.details || ''} [${locale.toUpperCase()}]`
      })));
    }
  }
  
  // Verificar si debería mencionar venues pero no lo hace
  const expectedVenues = VENUES_BY_CITY[post.category];
  if (expectedVenues && expectedVenues.length > 0 && post.category !== 'general') {
    const uniqueMentions = [...new Set(allVenueMentions)];
    // Verificar si hay menciones de venues de la categoría correcta
    const mentionsFromCategory = uniqueMentions.filter(v => {
      return VENUES_BY_CITY[post.category]?.some(ev => ev.name === v);
    });
    
    if (mentionsFromCategory.length === 0) {
      issues.push({
        type: 'venue_missing',
        severity: 'medium',
        message: `No se mencionan venues del grupo de "${post.category}" en este post`,
        details: `Se esperaría al menos una mención de algún venue de ${post.category} según VENUES_GUIDE.md. Venues disponibles: ${expectedVenues.map(v => v.name).join(', ')}`
      });
    }
  }
  
  // Calcular valor general (promedio de todos los idiomas)
  let totalValueScore = 0;
  let valueCount = 0;
  for (const locale of ['es', 'en', 'fr', 'pt'] as const) {
    const content = post.content[locale];
    if (content && content.body) {
      const assessment = assessContentValue(content.body);
      totalValueScore += assessment.score;
      valueCount++;
    }
  }
  const avgValueScore = valueCount > 0 ? totalValueScore / valueCount : 0;
  
  return {
    postId: post.id,
    title: post.content.es?.title || post.content.en?.title || 'Sin título',
    category: post.category,
    issues: [...new Set(issues.map(i => JSON.stringify(i)))].map(i => JSON.parse(i)), // Eliminar duplicados
    venueMentions: [...new Set(allVenueMentions)],
    wordCount: post.content.es?.body?.split(/\s+/)?.length || 0,
    hasValue: avgValueScore >= 6,
    valueScore: Math.round(avgValueScore * 10) / 10
  };
}

function generateReport(audits: PostAudit[]): string {
  let report = '# AUDITORÍA DE MARKETING - BLOG MANDALATICKETS\n\n';
  report += `Fecha: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
  report += `Total de posts auditados: ${audits.length}\n\n`;
  
  // Resumen ejecutivo
  const postsWithIssues = audits.filter(a => a.issues.length > 0);
  const postsWithHighIssues = audits.filter(a => 
    a.issues.some(i => i.severity === 'high')
  );
  const postsWithLowValue = audits.filter(a => !a.hasValue);
  const postsWithoutVenues = audits.filter(a => a.venueMentions.length === 0);
  
  report += '## RESUMEN EJECUTIVO\n\n';
  report += `- **Posts con problemas**: ${postsWithIssues.length} (${Math.round(postsWithIssues.length / audits.length * 100)}%)\n`;
  report += `- **Posts con problemas críticos**: ${postsWithHighIssues.length} (${Math.round(postsWithHighIssues.length / audits.length * 100)}%)\n`;
  report += `- **Posts con bajo valor de contenido**: ${postsWithLowValue.length} (${Math.round(postsWithLowValue.length / audits.length * 100)}%)\n`;
  report += `- **Posts sin menciones de venues**: ${postsWithoutVenues.length} (${Math.round(postsWithoutVenues.length / audits.length * 100)}%)\n\n`;
  
  // Distribución por categoría
  report += '## DISTRIBUCIÓN POR CATEGORÍA\n\n';
  const byCategory: Record<string, PostAudit[]> = {};
  for (const audit of audits) {
    if (!byCategory[audit.category]) {
      byCategory[audit.category] = [];
    }
    byCategory[audit.category].push(audit);
  }
  
  for (const category in byCategory) {
    const categoryAudits = byCategory[category];
    const withIssues = categoryAudits.filter(a => a.issues.length > 0);
    report += `### ${category.toUpperCase()}\n`;
    report += `- Total: ${categoryAudits.length} posts\n`;
    report += `- Con problemas: ${withIssues.length}\n`;
    report += `- Score promedio de valor: ${(categoryAudits.reduce((sum, a) => sum + a.valueScore, 0) / categoryAudits.length).toFixed(1)}/10\n\n`;
  }
  
  // Posts con problemas críticos
  if (postsWithHighIssues.length > 0) {
    report += '## POSTS CON PROBLEMAS CRÍTICOS (ALTA PRIORIDAD)\n\n';
    for (const audit of postsWithHighIssues) {
      report += `### Post #${audit.postId}: ${audit.title}\n`;
      report += `- **Categoría**: ${audit.category}\n`;
      report += `- **Score de valor**: ${audit.valueScore}/10\n`;
      report += `- **Venues mencionados**: ${audit.venueMentions.length > 0 ? audit.venueMentions.join(', ') : 'Ninguno'}\n\n`;
      
      const highIssues = audit.issues.filter(i => i.severity === 'high');
      report += '**Problemas críticos:**\n';
      for (const issue of highIssues) {
        report += `- **[${issue.type.toUpperCase()}]** ${issue.message}\n`;
        if (issue.details) {
          report += `  - ${issue.details}\n`;
        }
      }
      report += '\n';
    }
  }
  
  // Posts con bajo valor
  if (postsWithLowValue.length > 0) {
    report += '## POSTS CON BAJO VALOR DE CONTENIDO\n\n';
    for (const audit of postsWithLowValue) {
      report += `### Post #${audit.postId}: ${audit.title}\n`;
      report += `- **Categoría**: ${audit.category}\n`;
      report += `- **Score de valor**: ${audit.valueScore}/10\n`;
      report += `- **Palabras**: ${audit.wordCount}\n\n`;
    }
  }
  
  // Posts sin menciones de venues
  if (postsWithoutVenues.length > 0) {
    report += '## POSTS SIN MENCIONES DE VENUES\n\n';
    for (const audit of postsWithoutVenues) {
      report += `- **#${audit.postId}**: ${audit.title} (${audit.category})\n`;
    }
    report += '\n';
  }
  
  // Detalle completo por post
  report += '## DETALLE COMPLETO POR POST\n\n';
  for (const audit of audits) {
    report += `### Post #${audit.postId}: ${audit.title}\n`;
    report += `- **Categoría**: ${audit.category}\n`;
    report += `- **Score de valor**: ${audit.valueScore}/10 ${audit.hasValue ? '✅' : '❌'}\n`;
    report += `- **Palabras**: ${audit.wordCount}\n`;
    report += `- **Venues mencionados**: ${audit.venueMentions.length > 0 ? audit.venueMentions.join(', ') : 'Ninguno'}\n`;
    
    if (audit.issues.length > 0) {
      report += `- **Problemas encontrados**: ${audit.issues.length}\n\n`;
      
      const byType: Record<string, AuditIssue[]> = {};
      for (const issue of audit.issues) {
        if (!byType[issue.type]) {
          byType[issue.type] = [];
        }
        byType[issue.type].push(issue);
      }
      
      for (const type in byType) {
        report += `#### ${type.toUpperCase()}\n`;
        for (const issue of byType[type]) {
          report += `- **[${issue.severity.toUpperCase()}]** ${issue.message}\n`;
          if (issue.details) {
            report += `  - ${issue.details}\n`;
          }
        }
        report += '\n';
      }
    } else {
      report += `- **Estado**: ✅ Sin problemas detectados\n\n`;
    }
    
    report += '---\n\n';
  }
  
  // Recomendaciones generales
  report += '## RECOMENDACIONES GENERALES\n\n';
  report += '1. **Aumentar valor del contenido**: Incluir información práctica (horarios, precios, ubicaciones específicas, cómo llegar)\n';
  report += '2. **Coherencia de venues**: Verificar que las descripciones de venues coincidan con VENUES_GUIDE.md\n';
  report += '3. **Menciones estratégicas**: Asegurar que posts de cada categoría mencionen al menos un venue del grupo\n';
  report += '4. **Estructura**: Usar subtítulos H2/H3 y listas para mejorar legibilidad y SEO\n';
  report += '5. **Longitud mínima**: Mantener mínimo 300 palabras, idealmente 800+ para mejor SEO\n';
  
  return report;
}

// Ejecutar auditoría
console.log('Iniciando auditoría de posts...\n');

const audits: PostAudit[] = [];
for (const post of blogPosts) {
  const audit = auditPost(post);
  audits.push(audit);
  console.log(`✓ Post #${post.id} auditado: ${audit.title.substring(0, 50)}...`);
}

console.log('\nGenerando reporte...\n');

const report = generateReport(audits);

// Guardar reporte
const reportPath = path.join(__dirname, '..', 'AUDITORIA_MARKETING_BLOG.md');
fs.writeFileSync(reportPath, report, 'utf-8');

console.log(`\n✅ Auditoría completada!`);
console.log(`📄 Reporte guardado en: ${reportPath}`);
console.log(`\nResumen:`);
console.log(`- Total de posts: ${audits.length}`);
console.log(`- Posts con problemas: ${audits.filter(a => a.issues.length > 0).length}`);
console.log(`- Posts con problemas críticos: ${audits.filter(a => a.issues.some(i => i.severity === 'high')).length}`);
console.log(`- Posts con bajo valor: ${audits.filter(a => !a.hasValue).length}`);
console.log(`- Posts sin venues: ${audits.filter(a => a.venueMentions.length === 0).length}`);

