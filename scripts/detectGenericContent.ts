import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, type BlogPost } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { findVenueByKeyword, type VenueInfo } from './venueUrlMapper';

/**
 * Detección de contenido genérico
 */
export interface GenericContentDetection {
  postId: string;
  category: string;
  locale: string;
  title: string;
  isGeneric: boolean;
  genericScore: number; // 0-100, 100 = muy genérico
  issues: GenericContentIssue[];
  suggestions: string[];
}

export interface GenericContentIssue {
  type: 'generic_phrase' | 'missing_specifics' | 'vague_references' | 'no_venue_details' | 'repetitive_content';
  severity: 'high' | 'medium' | 'low';
  message: string;
  examples: string[];
  suggestion?: string;
}

/**
 * Frases genéricas comunes que indican contenido no específico
 */
const GENERIC_PHRASES = {
  es: [
    'el mejor lugar',
    'un lugar increíble',
    'experiencias únicas',
    'no te lo pierdas',
    'diversión garantizada',
    'la mejor experiencia',
    'lugares increíbles',
    'eventos únicos',
    'una experiencia inolvidable',
    'lo mejor de',
    'imperdible',
    'debe visitar',
    'altamente recomendado',
    'sin duda',
    'definitivamente',
  ],
  en: [
    'the best place',
    'an amazing place',
    'unique experiences',
    "don't miss it",
    'guaranteed fun',
    'the best experience',
    'amazing places',
    'unique events',
    'an unforgettable experience',
    'the best of',
    'unmissable',
    'must visit',
    'highly recommended',
    'without a doubt',
    'definitely',
  ],
  fr: [
    'le meilleur endroit',
    'un endroit incroyable',
    'expériences uniques',
    'ne le manquez pas',
    'amusement garanti',
    'la meilleure expérience',
    'endroits incroyables',
    'événements uniques',
    'une expérience inoubliable',
    'le meilleur de',
    'incontournable',
    'à visiter absolument',
    'fortement recommandé',
    'sans aucun doute',
    'définitivement',
  ],
  pt: [
    'o melhor lugar',
    'um lugar incrível',
    'experiências únicas',
    'não perca',
    'diversão garantida',
    'a melhor experiência',
    'lugares incríveis',
    'eventos únicos',
    'uma experiência inesquecível',
    'o melhor de',
    'imperdível',
    'deve visitar',
    'altamente recomendado',
    'sem dúvida',
    'definitivamente',
  ],
};

/**
 * Referencias vagas que deberían ser específicas
 */
const VAGUE_REFERENCES = {
  es: [
    'el club',
    'el lugar',
    'el venue',
    'el establecimiento',
    'este lugar',
    'este club',
    'el evento',
    'los eventos',
    'la fiesta',
    'las fiestas',
  ],
  en: [
    'the club',
    'the place',
    'the venue',
    'the establishment',
    'this place',
    'this club',
    'the event',
    'the events',
    'the party',
    'the parties',
  ],
  fr: [
    'le club',
    'le lieu',
    'le venue',
    'l\'établissement',
    'ce lieu',
    'ce club',
    'l\'événement',
    'les événements',
    'la fête',
    'les fêtes',
  ],
  pt: [
    'o clube',
    'o lugar',
    'o venue',
    'o estabelecimento',
    'este lugar',
    'este clube',
    'o evento',
    'os eventos',
    'a festa',
    'as festas',
  ],
};

/**
 * Detecta contenido genérico en un post
 */
function detectGenericContent(
  post: BlogPost,
  locale: 'es' | 'en' | 'fr' | 'pt'
): GenericContentDetection {
  const content = getPostContent(post, locale);
  const postContent = generatePostContent(post, locale);
  const contentLower = postContent.toLowerCase();
  
  const issues: GenericContentIssue[] = [];
  let genericScore = 0;
  
  // 1. Detectar frases genéricas
  const genericPhrases = GENERIC_PHRASES[locale];
  const foundGenericPhrases: string[] = [];
  
  for (const phrase of genericPhrases) {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = postContent.match(regex);
    if (matches) {
      foundGenericPhrases.push(...matches);
    }
  }
  
  if (foundGenericPhrases.length > 0) {
    const uniquePhrases = [...new Set(foundGenericPhrases)];
    genericScore += Math.min(30, uniquePhrases.length * 5);
    
    issues.push({
      type: 'generic_phrase',
      severity: uniquePhrases.length > 5 ? 'high' : uniquePhrases.length > 2 ? 'medium' : 'low',
      message: `Se encontraron ${uniquePhrases.length} frases genéricas diferentes`,
      examples: uniquePhrases.slice(0, 10),
      suggestion: 'Reemplazar frases genéricas con información específica sobre venues, ubicaciones y experiencias concretas',
    });
  }
  
  // 2. Detectar referencias vagas
  const vagueRefs = VAGUE_REFERENCES[locale];
  const foundVagueRefs: string[] = [];
  
  for (const ref of vagueRefs) {
    const regex = new RegExp(`\\b${ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = postContent.match(regex);
    if (matches) {
      foundVagueRefs.push(...matches);
    }
  }
  
  if (foundVagueRefs.length > 5) {
    genericScore += Math.min(25, (foundVagueRefs.length - 5) * 3);
    
    issues.push({
      type: 'vague_references',
      severity: foundVagueRefs.length > 10 ? 'high' : 'medium',
      message: `Se encontraron ${foundVagueRefs.length} referencias vagas (deberían ser nombres específicos de venues)`,
      examples: [...new Set(foundVagueRefs)].slice(0, 10),
      suggestion: 'Reemplazar referencias vagas como "el club" o "el lugar" con nombres específicos de venues',
    });
  }
  
  // 3. Verificar si menciona venues pero sin detalles específicos
  const { getVenueMap } = require('./venueUrlMapper');
  const venueMap = getVenueMap();
  const venuesMentioned = findVenueByKeyword(postContent, venueMap);
  
  let hasSpecificDetails = false;
  if (venuesMentioned.length > 0) {
    const venueDetails: string[] = [];
    
    for (const venue of venuesMentioned) {
      // Verificar que el contenido tenga información específica sobre el venue
      const venueNameLower = venue.name.toLowerCase();
      const venueKeywords = venue.keywords;
      
      // Buscar información específica: horarios, ubicaciones, tipos de música, características
      const specificPatterns = [
        /\d{1,2}:\d{2}\s*(am|pm|a\.m\.|p\.m\.)/gi, // Horarios
        /(abierto|open|ouvert|aberto).*?(lunes|monday|lundi|segunda|martes|tuesday|mardi|terça)/gi, // Días de apertura
        /(ubicado|located|situé|localizado).*?(zona|zone|area|calle|street|rue|rua)/gi, // Ubicaciones específicas
        /(música|music|musique|música).*?(reggaetón|reggaeton|hip hop|edm|electrónica|electronic)/gi, // Tipos de música
        /(mesa|table|table|mesa).*?(vip|premium)/gi, // Servicios específicos
      ];
      
      for (const pattern of specificPatterns) {
        if (pattern.test(postContent)) {
          hasSpecificDetails = true;
          venueDetails.push(`Información específica encontrada cerca de "${venue.name}"`);
          break;
        }
      }
    }
    
    if (!hasSpecificDetails) {
      genericScore += 30;
      
      issues.push({
        type: 'no_venue_details',
        severity: 'high',
        message: `Se mencionan ${venuesMentioned.length} venue(s) pero falta información específica sobre ellos`,
        examples: venuesMentioned.map(v => v.name),
        suggestion: 'Agregar detalles específicos sobre horarios, ubicación, tipo de música, servicios, o características únicas de cada venue mencionado',
      });
    }
  } else {
    // Si no menciona ningún venue específico, podría ser genérico
    genericScore += 20;
    
    issues.push({
      type: 'missing_specifics',
      severity: 'medium',
      message: 'No se mencionan venues específicos en el contenido',
      examples: [],
      suggestion: 'Mencionar venues específicos relacionados con el tema del post para hacer el contenido más relevante y específico',
    });
  }
  
  // 4. Detectar contenido repetitivo
  const sentences = postContent.split(/[.!?]\s+/).filter(s => s.trim().length > 20);
  const sentenceHashes = new Set<string>();
  let duplicateSentences = 0;
  
  for (const sentence of sentences) {
    const normalized = sentence.toLowerCase().replace(/\s+/g, ' ').trim();
    if (sentenceHashes.has(normalized)) {
      duplicateSentences++;
    } else {
      sentenceHashes.add(normalized);
    }
  }
  
  if (duplicateSentences > 2) {
    genericScore += Math.min(15, duplicateSentences * 3);
    
    issues.push({
      type: 'repetitive_content',
      severity: duplicateSentences > 5 ? 'high' : 'medium',
      message: `Se encontraron ${duplicateSentences} oraciones duplicadas o muy similares`,
      examples: [],
      suggestion: 'Revisar y eliminar contenido repetitivo, variar la redacción',
    });
  }
  
  // Normalizar score a 0-100
  genericScore = Math.min(100, genericScore);
  
  const isGeneric = genericScore > 50;
  
  // Generar sugerencias
  const suggestions: string[] = [];
  if (foundGenericPhrases.length > 0) {
    suggestions.push(`Reemplazar ${foundGenericPhrases.length} frases genéricas con información específica`);
  }
  if (foundVagueRefs.length > 5) {
    suggestions.push(`Especificar ${foundVagueRefs.length} referencias vagas con nombres de venues`);
  }
  if (venuesMentioned.length > 0 && !hasSpecificDetails) {
    suggestions.push(`Agregar detalles específicos sobre los ${venuesMentioned.length} venues mencionados`);
  }
  if (duplicateSentences > 2) {
    suggestions.push(`Eliminar ${duplicateSentences} oraciones duplicadas`);
  }
  
  return {
    postId: post.id,
    category: post.category,
    locale,
    title: content.title,
    isGeneric,
    genericScore,
    issues,
    suggestions,
  };
}

/**
 * Detecta contenido genérico en todos los posts
 */
export function detectGenericContentAll(): GenericContentDetection[] {
  const detections: GenericContentDetection[] = [];
  const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
  
  console.log(`Detectando contenido genérico en ${blogPosts.length} posts...`);
  
  for (const post of blogPosts) {
    for (const locale of locales) {
      try {
        const detection = detectGenericContent(post, locale);
        detections.push(detection);
      } catch (error) {
        console.error(`Error detectando contenido genérico en post ${post.id} (${locale}):`, error);
        const content = getPostContent(post, locale);
        detections.push({
          postId: post.id,
          category: post.category,
          locale,
          title: content.title,
          isGeneric: true,
          genericScore: 100,
          issues: [{
            type: 'generic_phrase',
            severity: 'high',
            message: `Error al analizar: ${error instanceof Error ? error.message : 'Unknown error'}`,
            examples: [],
          }],
          suggestions: ['Revisar manualmente este post'],
        });
      }
    }
    
    if (parseInt(post.id) % 10 === 0) {
      console.log(`Procesados ${post.id} posts...`);
    }
  }
  
  return detections;
}

/**
 * Genera reporte de detección
 */
function generateDetectionReport(detections: GenericContentDetection[]): void {
  const outputPath = path.join(__dirname, 'genericContentDetection.json');
  fs.writeFileSync(outputPath, JSON.stringify(detections, null, 2), 'utf-8');
  console.log(`\nReporte de detección generado en: ${outputPath}`);
  
  // Generar resumen
  const summary = {
    totalDetections: detections.length,
    postsWithGenericContent: detections.filter(d => d.isGeneric).length,
    averageGenericScore: detections.reduce((sum, d) => sum + d.genericScore, 0) / detections.length,
    totalIssues: detections.reduce((sum, d) => sum + d.issues.length, 0),
    issuesByType: {} as { [key: string]: number },
    worstPosts: detections
      .sort((a, b) => b.genericScore - a.genericScore)
      .slice(0, 20)
      .map(d => ({
        postId: d.postId,
        locale: d.locale,
        title: d.title,
        genericScore: d.genericScore,
        issuesCount: d.issues.length,
      })),
  };
  
  // Contar issues por tipo
  for (const detection of detections) {
    for (const issue of detection.issues) {
      summary.issuesByType[issue.type] = (summary.issuesByType[issue.type] || 0) + 1;
    }
  }
  
  const summaryPath = path.join(__dirname, 'genericContentSummary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Resumen generado en: ${summaryPath}`);
  
  console.log('\n=== RESUMEN DE DETECCIÓN DE CONTENIDO GENÉRICO ===');
  console.log(`Total detecciones: ${summary.totalDetections}`);
  console.log(`Posts con contenido genérico: ${summary.postsWithGenericContent}`);
  console.log(`Score genérico promedio: ${summary.averageGenericScore.toFixed(2)}/100`);
  console.log(`Total issues: ${summary.totalIssues}`);
  console.log('\nIssues por tipo:');
  for (const [type, count] of Object.entries(summary.issuesByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nTop 10 posts más genéricos:');
  summary.worstPosts.slice(0, 10).forEach((post, idx) => {
    console.log(`  ${idx + 1}. Post ${post.postId} (${post.locale}): ${post.title.substring(0, 60)}... - Score: ${post.genericScore.toFixed(1)}, Issues: ${post.issuesCount}`);
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Iniciando detección de contenido genérico...\n');
  const detections = detectGenericContentAll();
  generateDetectionReport(detections);
  console.log('\nDetección completada!');
}



