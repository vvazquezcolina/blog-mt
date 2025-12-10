import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, type BlogPost } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getVenueMap, findVenueByKeyword, type VenueInfo } from './venueUrlMapper';

/**
 * Validación de información factual
 */
export interface PostInfoValidation {
  postId: string;
  category: string;
  locale: string;
  title: string;
  issues: InfoIssue[];
  suspiciousInfo: SuspiciousInfo[];
  score: number; // 0-100, 100 = información correcta
}

export interface InfoIssue {
  type: 'incorrect_hours' | 'incorrect_location' | 'incorrect_music_type' | 'fake_event' | 'inconsistent_info';
  severity: 'high' | 'medium' | 'low';
  message: string;
  venue?: string;
  found?: string;
  expected?: string;
  context?: string;
}

export interface SuspiciousInfo {
  type: 'unverifiable_event' | 'specific_date_without_source' | 'specific_price' | 'specific_dj_name';
  message: string;
  content: string;
  context?: string;
}

/**
 * Información de venues del VENUES_GUIDE.md (parseada)
 */
interface VenueDetails {
  name: string;
  city: string;
  musicTypes: string[];
  location: string;
  description: string;
}

/**
 * Extrae información de venues del VENUES_GUIDE.md
 */
function getVenueDetails(): Map<string, VenueDetails> {
  const venueMap = getVenueMap();
  const details = new Map<string, VenueDetails>();
  
  for (const [key, venue] of Object.entries(venueMap)) {
    const musicTypes: string[] = [];
    const description = venue.description.toLowerCase();
    
    // Extraer tipos de música de la descripción
    const musicKeywords = [
      'reggaetón', 'reggaeton', 'hip hop', 'r&b', 'edm', 'electrónica', 'electronic',
      'house', 'techno', 'pop', 'latino', 'urbano', 'dembow', 'trap',
      'funk', 'disco', 'commercial', 'top 40',
    ];
    
    for (const keyword of musicKeywords) {
      if (description.includes(keyword)) {
        musicTypes.push(keyword);
      }
    }
    
    // Extraer ubicación
    let location = '';
    const locationPatterns = [
      /(zona hotelera|hotel zone|zone hôtelière)/i,
      /(km \d+)/i,
      /(calle \d+)/i,
      /(malecón|boardwalk)/i,
      /(marina)/i,
      /(party center)/i,
    ];
    
    for (const pattern of locationPatterns) {
      const match = venue.description.match(pattern);
      if (match) {
        location = match[0];
        break;
      }
    }
    
    details.set(key, {
      name: venue.name,
      city: venue.city,
      musicTypes,
      location,
      description: venue.description,
    });
  }
  
  return details;
}

/**
 * Valida información factual de un post
 */
function validatePostInfo(
  post: BlogPost,
  locale: 'es' | 'en' | 'fr' | 'pt'
): PostInfoValidation {
  const content = getPostContent(post, locale);
  const postContent = generatePostContent(post, locale);
  const contentLower = postContent.toLowerCase();
  
  const issues: InfoIssue[] = [];
  const suspiciousInfo: SuspiciousInfo[] = [];
  const venueDetails = getVenueDetails();
  const venueMap = getVenueMap();
  const venuesMentioned = findVenueByKeyword(postContent, venueMap);
  
  // 1. Validar tipos de música mencionados vs. descripción del venue
  for (const venue of venuesMentioned) {
    const venueKey = `${venue.name.toLowerCase().replace(/\s+/g, '-')}-${venue.city.toLowerCase().replace(/\s+/g, '-')}`;
    const details = venueDetails.get(venueKey);
    
    if (details && details.musicTypes.length > 0) {
      // Buscar menciones de tipos de música en el contenido
      const musicMentions: string[] = [];
      const musicKeywords = [
        'reggaetón', 'reggaeton', 'hip hop', 'r&b', 'edm', 'electrónica', 'electronic',
        'house', 'techno', 'pop', 'latino', 'urbano', 'dembow', 'trap',
        'funk', 'disco', 'commercial', 'top 40',
      ];
      
      for (const keyword of musicKeywords) {
        if (contentLower.includes(keyword)) {
          musicMentions.push(keyword);
        }
      }
      
      // Verificar si los tipos de música mencionados coinciden con el venue
      const mentionedButNotInVenue = musicMentions.filter(m => 
        !details.musicTypes.some(vm => vm.toLowerCase().includes(m) || m.includes(vm.toLowerCase()))
      );
      
      if (mentionedButNotInVenue.length > 0 && musicMentions.length > 0) {
        // Verificar contexto - podría estar hablando de otro venue
        const venueNameLower = venue.name.toLowerCase();
        const contextBefore = contentLower.substring(
          Math.max(0, contentLower.indexOf(venueNameLower) - 200),
          contentLower.indexOf(venueNameLower)
        );
        const contextAfter = contentLower.substring(
          contentLower.indexOf(venueNameLower) + venueNameLower.length,
          Math.min(contentLower.length, contentLower.indexOf(venueNameLower) + venueNameLower.length + 200)
        );
        
        const isNearVenue = mentionedButNotInVenue.some(m => 
          contextBefore.includes(m) || contextAfter.includes(m)
        );
        
        if (isNearVenue) {
          issues.push({
            type: 'incorrect_music_type',
            severity: 'medium',
            message: `Tipo de música "${mentionedButNotInVenue[0]}" mencionado cerca de "${venue.name}" pero no coincide con la descripción del venue`,
            venue: venue.name,
            found: mentionedButNotInVenue[0],
            expected: details.musicTypes.join(', '),
            context: `${contextBefore}...${venue.name}...${contextAfter}`.substring(0, 200),
          });
        }
      }
    }
  }
  
  // 2. Detectar información sospechosa o no verificable
  // Eventos con fechas específicas sin fuente
  const datePattern = /\d{1,2}\s+(de\s+)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december)/gi;
  const dateMatches = postContent.match(datePattern);
  
  if (dateMatches && dateMatches.length > 0) {
    for (const dateMatch of dateMatches) {
      // Verificar si hay contexto de evento
      const dateIndex = postContent.indexOf(dateMatch);
      const context = postContent.substring(
        Math.max(0, dateIndex - 100),
        Math.min(postContent.length, dateIndex + dateMatch.length + 100)
      );
      
      if (context.toLowerCase().includes('evento') || context.toLowerCase().includes('event') ||
          context.toLowerCase().includes('fiesta') || context.toLowerCase().includes('party')) {
        suspiciousInfo.push({
          type: 'specific_date_without_source',
          message: `Fecha específica mencionada para un evento: "${dateMatch}"`,
          content: dateMatch,
          context: context.substring(0, 150),
        });
      }
    }
  }
  
  // Precios específicos mencionados
  const pricePattern = /\$\d+|\d+\s*(pesos|dólares|dollars|euros)/gi;
  const priceMatches = postContent.match(pricePattern);
  
  if (priceMatches && priceMatches.length > 0) {
    for (const priceMatch of priceMatches) {
      suspiciousInfo.push({
        type: 'specific_price',
        message: `Precio específico mencionado: "${priceMatch}" - Verificar que sea actualizado`,
        content: priceMatch,
      });
    }
  }
  
  // Nombres de DJs específicos
  const djPattern = /(dj|disc jockey)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
  const djMatches = [...postContent.matchAll(djPattern)];
  
  if (djMatches.length > 0) {
    for (const djMatch of djMatches) {
      const djName = djMatch[2];
      // Verificar si es un nombre común o podría ser inventado
      const commonNames = ['resident', 'residente', 'local', 'invitado', 'guest', 'invité'];
      if (!commonNames.some(cn => djName.toLowerCase().includes(cn))) {
        suspiciousInfo.push({
          type: 'specific_dj_name',
          message: `DJ específico mencionado: "${djName}" - Verificar que sea real`,
          content: djName,
        });
      }
    }
  }
  
  // Eventos o festivales mencionados
  const eventPattern = /(festival|evento|event|fiesta|party)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
  const eventMatches = [...postContent.matchAll(eventPattern)];
  
  if (eventMatches.length > 0) {
    for (const eventMatch of eventMatches) {
      const eventName = eventMatch[2];
      // Lista de eventos conocidos (podría expandirse)
      const knownEvents = [
        'ava summer', 'superbia summer', 'summer like heaven',
        'madness tour', 'coco bongo', 'surf pool party',
      ];
      
      const isKnownEvent = knownEvents.some(ke => 
        eventName.toLowerCase().includes(ke) || ke.includes(eventName.toLowerCase())
      );
      
      if (!isKnownEvent && eventName.length > 3) {
        suspiciousInfo.push({
          type: 'unverifiable_event',
          message: `Evento mencionado que no está en la lista de eventos conocidos: "${eventName}"`,
          content: eventName,
        });
      }
    }
  }
  
  // 3. Detectar información inconsistente
  // Horarios contradictorios
  const timePattern = /(\d{1,2}):(\d{2})\s*(am|pm|a\.m\.|p\.m\.)/gi;
  const timeMatches = [...postContent.matchAll(timePattern)];
  
  if (timeMatches.length > 1) {
    const times: number[] = [];
    for (const match of timeMatches) {
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toLowerCase();
      
      if (period.includes('pm') || period.includes('p.m')) {
        if (hours !== 12) hours += 12;
      } else if (hours === 12) {
        hours = 0;
      }
      
      times.push(hours * 60 + minutes);
    }
    
    // Verificar si hay horarios que no tienen sentido (ej: cierra antes de abrir)
    times.sort((a, b) => a - b);
    if (times.length >= 2) {
      const first = times[0];
      const last = times[times.length - 1];
      
      // Si el último es muy temprano (antes de las 6am) y el primero es tarde, podría ser inconsistente
      if (last < 360 && first > 1200) {
        issues.push({
          type: 'incorrect_hours',
          severity: 'low',
          message: 'Posible inconsistencia en horarios mencionados',
          found: `${timeMatches[0][0]} - ${timeMatches[timeMatches.length - 1][0]}`,
          context: postContent.substring(
            Math.max(0, timeMatches[0].index! - 50),
            Math.min(postContent.length, (timeMatches[timeMatches.length - 1].index || 0) + 50)
          ),
        });
      }
    }
  }
  
  // Calcular score
  let score = 100;
  score -= issues.length * 15; // Cada issue reduce 15 puntos
  score -= suspiciousInfo.length * 5; // Cada info sospechosa reduce 5 puntos
  score = Math.max(0, score);
  
  return {
    postId: post.id,
    category: post.category,
    locale,
    title: content.title,
    issues,
    suspiciousInfo,
    score,
  };
}

/**
 * Valida información de todos los posts
 */
export function validateAllPostInfo(): PostInfoValidation[] {
  const validations: PostInfoValidation[] = [];
  const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
  
  console.log(`Validando información factual en ${blogPosts.length} posts...`);
  
  for (const post of blogPosts) {
    for (const locale of locales) {
      try {
        const validation = validatePostInfo(post, locale);
        validations.push(validation);
      } catch (error) {
        console.error(`Error validando información en post ${post.id} (${locale}):`, error);
        const content = getPostContent(post, locale);
        validations.push({
          postId: post.id,
          category: post.category,
          locale,
          title: content.title,
          issues: [{
            type: 'inconsistent_info',
            severity: 'high',
            message: `Error al validar: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }],
          suspiciousInfo: [],
          score: 0,
        });
      }
    }
    
    if (parseInt(post.id) % 10 === 0) {
      console.log(`Procesados ${post.id} posts...`);
    }
  }
  
  return validations;
}

/**
 * Genera reporte de validación
 */
function generateValidationReport(validations: PostInfoValidation[]): void {
  const outputPath = path.join(__dirname, 'postInfoValidation.json');
  fs.writeFileSync(outputPath, JSON.stringify(validations, null, 2), 'utf-8');
  console.log(`\nReporte de validación generado en: ${outputPath}`);
  
  // Generar resumen
  const summary = {
    totalValidations: validations.length,
    averageScore: validations.reduce((sum, v) => sum + v.score, 0) / validations.length,
    postsWithIssues: validations.filter(v => v.issues.length > 0).length,
    postsWithSuspiciousInfo: validations.filter(v => v.suspiciousInfo.length > 0).length,
    totalIssues: validations.reduce((sum, v) => sum + v.issues.length, 0),
    totalSuspiciousInfo: validations.reduce((sum, v) => sum + v.suspiciousInfo.length, 0),
    issuesByType: {} as { [key: string]: number },
    suspiciousInfoByType: {} as { [key: string]: number },
    worstPosts: validations
      .sort((a, b) => a.score - b.score)
      .slice(0, 20)
      .map(v => ({
        postId: v.postId,
        locale: v.locale,
        title: v.title,
        score: v.score,
        issuesCount: v.issues.length,
        suspiciousCount: v.suspiciousInfo.length,
      })),
  };
  
  // Contar issues y suspicious info por tipo
  for (const validation of validations) {
    for (const issue of validation.issues) {
      summary.issuesByType[issue.type] = (summary.issuesByType[issue.type] || 0) + 1;
    }
    for (const suspicious of validation.suspiciousInfo) {
      summary.suspiciousInfoByType[suspicious.type] = (summary.suspiciousInfoByType[suspicious.type] || 0) + 1;
    }
  }
  
  const summaryPath = path.join(__dirname, 'postInfoValidationSummary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Resumen generado en: ${summaryPath}`);
  
  console.log('\n=== RESUMEN DE VALIDACIÓN DE INFORMACIÓN ===');
  console.log(`Total validaciones: ${summary.totalValidations}`);
  console.log(`Score promedio: ${summary.averageScore.toFixed(2)}/100`);
  console.log(`Posts con issues: ${summary.postsWithIssues}`);
  console.log(`Posts con información sospechosa: ${summary.postsWithSuspiciousInfo}`);
  console.log(`Total issues: ${summary.totalIssues}`);
  console.log(`Total información sospechosa: ${summary.totalSuspiciousInfo}`);
  console.log('\nIssues por tipo:');
  for (const [type, count] of Object.entries(summary.issuesByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nInformación sospechosa por tipo:');
  for (const [type, count] of Object.entries(summary.suspiciousInfoByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nTop 10 posts con más problemas:');
  summary.worstPosts.slice(0, 10).forEach((post, idx) => {
    console.log(`  ${idx + 1}. Post ${post.postId} (${post.locale}): ${post.title.substring(0, 60)}... - Score: ${post.score}, Issues: ${post.issuesCount}, Suspicious: ${post.suspiciousCount}`);
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Iniciando validación de información factual...\n');
  const validations = validateAllPostInfo();
  generateValidationReport(validations);
  console.log('\nValidación completada!');
}



