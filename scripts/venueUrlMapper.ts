import * as fs from 'fs';
import * as path from 'path';

/**
 * Mapeo de venues a URLs MandalaTickets basado en VENUES_GUIDE.md
 * Extrae información de venues, sus URLs por idioma y anchor texts sugeridos
 */

export interface VenueInfo {
  name: string;
  city: string;
  description: string;
  urls: {
    es: string;
    en: string;
    fr: string;
    pt: string;
  };
  anchorTexts: string[];
  keywords: string[]; // Keywords para detectar menciones del venue
}

export interface VenueMap {
  [venueKey: string]: VenueInfo;
}

/**
 * Parsea VENUES_GUIDE.md y extrae información de venues
 */
function parseVenuesGuide(): VenueMap {
  // VENUES_GUIDE.md está en la raíz del proyecto
  // Si estamos en scripts/, subir un nivel
  let guidePath = path.join(process.cwd(), 'VENUES_GUIDE.md');
  if (!fs.existsSync(guidePath)) {
    // Intentar desde el directorio del script
    guidePath = path.join(__dirname, '..', 'VENUES_GUIDE.md');
  }
  if (!fs.existsSync(guidePath)) {
    throw new Error(`VENUES_GUIDE.md no encontrado. Buscado en: ${path.join(process.cwd(), 'VENUES_GUIDE.md')} y ${path.join(__dirname, '..', 'VENUES_GUIDE.md')}`);
  }
  const guideContent = fs.readFileSync(guidePath, 'utf-8');
  
  const venues: VenueMap = {};
  const lines = guideContent.split('\n');
  
  let currentCity = '';
  let currentVenue: Partial<VenueInfo> | null = null;
  let currentSection = '';
  let venueDescription: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detectar ciudad
    if (line.startsWith('## ')) {
      currentCity = line.replace('## ', '').trim();
      // Limpiar ciudad de notas adicionales
      if (currentCity.includes('*')) {
        currentCity = currentCity.split('*')[0].trim();
      }
      continue;
    }
    
    // Detectar venue
    if (line.startsWith('### ')) {
      // Guardar venue anterior si existe
      if (currentVenue && currentVenue.name) {
        // Determinar ciudad correcta del venue basado en el nombre y la sección actual
        let venueCity = currentCity;
        
        // Corregir ciudad basado en el nombre del venue si contiene el nombre de la ciudad
        const venueNameLower = currentVenue.name.toLowerCase();
        if (venueNameLower.includes('cancún') || venueNameLower.includes('cancun')) {
          venueCity = 'CANCÚN';
        } else if (venueNameLower.includes('tulum')) {
          venueCity = 'TULUM';
        } else if (venueNameLower.includes('playa del carmen') || venueNameLower.includes('playa')) {
          venueCity = 'PLAYA DEL CARMEN';
        } else if (venueNameLower.includes('los cabos') || venueNameLower.includes('cabo')) {
          venueCity = 'LOS CABOS';
        } else if (venueNameLower.includes('puerto vallarta') || venueNameLower.includes('vallarta')) {
          venueCity = 'PUERTO VALLARTA';
        }
        
        const venueKey = `${currentVenue.name.toLowerCase().replace(/\s+/g, '-')}-${venueCity.toLowerCase().replace(/\s+/g, '-')}`;
        venues[venueKey] = {
          name: currentVenue.name,
          city: venueCity,
          description: venueDescription.join(' '),
          urls: currentVenue.urls || { es: '', en: '', fr: '', pt: '' },
          anchorTexts: currentVenue.anchorTexts || [],
          keywords: generateKeywords(currentVenue.name, venueCity),
        };
      }
      
      // Iniciar nuevo venue
      const venueName = line.replace('### ', '').trim();
      currentVenue = {
        name: venueName,
        urls: { es: '', en: '', fr: '', pt: '' },
        anchorTexts: [],
      };
      venueDescription = [];
      currentSection = 'description';
      continue;
    }
    
    // Detectar sección de links
    if (line.includes('**Links MandalaTickets**')) {
      currentSection = 'links';
      continue;
    }
    
    // Detectar sección de anchor texts
    if (line.includes('**Anchor texts sugeridos**')) {
      currentSection = 'anchorTexts';
      continue;
    }
    
    // Procesar según sección actual
    if (currentVenue) {
      if (currentSection === 'description' && line && !line.startsWith('**') && !line.startsWith('-')) {
        venueDescription.push(line);
      } else if (currentSection === 'links') {
        // Extraer URLs
        const urlMatch = line.match(/`(https:\/\/mandalatickets\.com\/(es|en|fr|pt)\/[^`]+)`/);
        if (urlMatch) {
          const url = urlMatch[1];
          const lang = urlMatch[2] as 'es' | 'en' | 'fr' | 'pt';
          if (currentVenue.urls) {
            currentVenue.urls[lang] = url;
          }
        }
      } else if (currentSection === 'anchorTexts') {
        // Extraer anchor texts
        const anchorMatch = line.match(/^-\s*(.+)$/);
        if (anchorMatch) {
          currentVenue.anchorTexts = currentVenue.anchorTexts || [];
          currentVenue.anchorTexts.push(anchorMatch[1].trim());
        }
      }
    }
  }
  
  // Guardar último venue
  if (currentVenue && currentVenue.name) {
    // Determinar ciudad correcta del venue basado en el nombre
    let venueCity = currentCity;
    const venueNameLower = currentVenue.name.toLowerCase();
    if (venueNameLower.includes('cancún') || venueNameLower.includes('cancun')) {
      venueCity = 'CANCÚN';
    } else if (venueNameLower.includes('tulum')) {
      venueCity = 'TULUM';
    } else if (venueNameLower.includes('playa del carmen') || venueNameLower.includes('playa')) {
      venueCity = 'PLAYA DEL CARMEN';
    } else if (venueNameLower.includes('los cabos') || venueNameLower.includes('cabo')) {
      venueCity = 'LOS CABOS';
    } else if (venueNameLower.includes('puerto vallarta') || venueNameLower.includes('vallarta')) {
      venueCity = 'PUERTO VALLARTA';
    }
    
    const venueKey = `${currentVenue.name.toLowerCase().replace(/\s+/g, '-')}-${venueCity.toLowerCase().replace(/\s+/g, '-')}`;
    venues[venueKey] = {
      name: currentVenue.name,
      city: venueCity,
      description: venueDescription.join(' '),
      urls: currentVenue.urls || { es: '', en: '', fr: '', pt: '' },
      anchorTexts: currentVenue.anchorTexts || [],
      keywords: generateKeywords(currentVenue.name, venueCity),
    };
  }
  
  return venues;
}

/**
 * Genera keywords para detectar menciones del venue en el contenido
 */
function generateKeywords(venueName: string, city: string): string[] {
  const keywords: string[] = [];
  
  // Nombre del venue en diferentes variaciones
  const venueLower = venueName.toLowerCase();
  keywords.push(venueLower);
  keywords.push(venueName);
  
  // Variaciones comunes
  if (venueLower.includes('mandala beach')) {
    keywords.push('mandala beach', 'mandala beach day', 'mandala beach night');
  } else if (venueLower.includes('mandala')) {
    keywords.push('mandala', 'mandala cancún', 'mandala cabo', 'mandala playa');
  } else if (venueLower.includes('vaquita')) {
    keywords.push('vaquita', 'la vaquita');
  } else if (venueLower.includes('rakata')) {
    keywords.push('rakata');
  } else if (venueLower.includes('d\'cave') || venueLower.includes('dcave')) {
    keywords.push('d\'cave', 'dcave', 'd-cave');
  } else if (venueLower.includes('house of fiesta') || venueLower.includes('hof')) {
    keywords.push('house of fiesta', 'hof');
  } else if (venueLower.includes('santito')) {
    keywords.push('santito tun-tun', 'santito', 'tun-tun');
  } else if (venueLower.includes('chicabal')) {
    keywords.push('chicabal', 'chicabal sunset club');
  } else if (venueLower.includes('santa')) {
    keywords.push('la santa', 'santa');
  } else if (venueLower.includes('tehmplo') || venueLower.includes('themplo')) {
    keywords.push('tehmplo', 'themplo');
  } else if (venueLower.includes('bonbonniere')) {
    keywords.push('bonbonniere', 'bonbonnière');
  } else if (venueLower.includes('vagalume')) {
    keywords.push('vagalume');
  } else if (venueLower.includes('bagatelle')) {
    keywords.push('bagatelle');
  } else if (venueLower.includes('señor frog') || venueLower.includes('senor frog')) {
    keywords.push('señor frog\'s', 'senor frog\'s', 'frogs');
  }
  
  // Nombre + ciudad
  const cityLower = city.toLowerCase();
  keywords.push(`${venueLower} ${cityLower}`);
  
  return [...new Set(keywords)];
}

/**
 * Obtiene el mapeo completo de venues
 */
export function getVenueMap(): VenueMap {
  return parseVenuesGuide();
}

/**
 * Encuentra un venue por keyword en el texto
 */
export function findVenueByKeyword(text: string, venueMap: VenueMap): VenueInfo[] {
  const textLower = text.toLowerCase();
  const foundVenues: VenueInfo[] = [];
  
  for (const venue of Object.values(venueMap)) {
    for (const keyword of venue.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        if (!foundVenues.find(v => v.name === venue.name && v.city === venue.city)) {
          foundVenues.push(venue);
        }
        break;
      }
    }
  }
  
  return foundVenues;
}

/**
 * Obtiene la URL de un venue para un idioma específico
 */
export function getVenueUrl(venueName: string, city: string, locale: 'es' | 'en' | 'fr' | 'pt'): string | null {
  const venueMap = getVenueMap();
  const venueKey = `${venueName.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`;
  const venue = venueMap[venueKey];
  
  if (!venue) {
    // Buscar por nombre parcial
    for (const v of Object.values(venueMap)) {
      if (v.name.toLowerCase().includes(venueName.toLowerCase()) && v.city === city) {
        return v.urls[locale] || null;
      }
    }
    return null;
  }
  
  return venue.urls[locale] || null;
}

// Si se ejecuta directamente, generar JSON del mapeo
if (require.main === module) {
  const venueMap = getVenueMap();
  const outputPath = path.join(__dirname, 'venueMap.json');
  fs.writeFileSync(outputPath, JSON.stringify(venueMap, null, 2), 'utf-8');
  console.log(`Venue map generado en: ${outputPath}`);
  console.log(`Total de venues: ${Object.keys(venueMap).length}`);
}



