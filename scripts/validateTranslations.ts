import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, type BlogPost } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { findVenueByKeyword, type VenueInfo } from './venueUrlMapper';

/**
 * Validación de consistencia entre traducciones
 */
export interface TranslationValidation {
  postId: string;
  category: string;
  title: string;
  issues: TranslationIssue[];
  consistencyScore: number; // 0-100, 100 = perfecto
}

export interface TranslationIssue {
  type: 'venue_mismatch' | 'backlink_mismatch' | 'content_length_mismatch' | 'terminology_inconsistency' | 'missing_translation';
  severity: 'high' | 'medium' | 'low';
  message: string;
  locales: string[];
  details?: any;
}

/**
 * Valida consistencia de traducciones para un post
 */
function validateTranslations(post: BlogPost): TranslationValidation {
  const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
  const issues: TranslationIssue[] = [];
  
  // Obtener contenido de cada idioma
  const localeContents: {
    [locale: string]: {
      title: string;
      excerpt: string;
      content: string;
      venues: VenueInfo[];
      backlinks: Array<{ url: string; anchorText: string }>;
      wordCount: number;
    };
  } = {};
  
  for (const locale of locales) {
    try {
      const content = getPostContent(post, locale);
      const postContent = generatePostContent(post, locale);
      const { getVenueMap } = require('./venueUrlMapper');
      const venueMap = getVenueMap();
      const venuesMentioned = findVenueByKeyword(postContent, venueMap);
    
      // Extraer backlinks
      const backlinkRegex = /<a[^>]+href=["'](https?:\/\/[^"']*mandalatickets\.com[^"']*)["'][^>]*>(.*?)<\/a>/gi;
      const backlinks: Array<{ url: string; anchorText: string }> = [];
      let match;
      while ((match = backlinkRegex.exec(postContent)) !== null) {
        backlinks.push({
          url: match[1],
          anchorText: match[2].replace(/<[^>]+>/g, '').trim(),
      });
    }
    
      // Contar palabras (aproximado)
      const textContent = postContent.replace(/<[^>]+>/g, ' ');
      const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
      
      localeContents[locale] = {
        title: content.title,
        excerpt: content.excerpt,
        content: postContent,
        venues: venuesMentioned,
        backlinks,
        wordCount,
      };
    } catch (error) {
      console.error(`Error procesando post ${post.id} en ${locale}:`, error);
      issues.push({
        type: 'missing_translation',
        severity: 'high',
        message: `Error al generar contenido en ${locale}`,
        locales: [locale],
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
    }
    
  // 1. Verificar que los mismos venues estén mencionados en todos los idiomas
  const venuesByLocale = new Map<string, Set<string>>();
  for (const [locale, data] of Object.entries(localeContents)) {
    const venueKeys = new Set(data.venues.map(v => `${v.name}-${v.city}`));
    venuesByLocale.set(locale, venueKeys);
    }
    
  const allVenueKeys = new Set<string>();
  for (const venueSet of venuesByLocale.values()) {
    for (const key of venueSet) {
      allVenueKeys.add(key);
    }
  }
  
  for (const venueKey of allVenueKeys) {
    const localesWithVenue: string[] = [];
    const localesWithoutVenue: string[] = [];
    
    for (const [locale, venueSet] of venuesByLocale.entries()) {
      if (venueSet.has(venueKey)) {
        localesWithVenue.push(locale);
      } else {
        localesWithoutVenue.push(locale);
      }
    }
    
    if (localesWithVenue.length > 0 && localesWithoutVenue.length > 0) {
      const venueName = venueKey.split('-')[0];
      issues.push({
        type: 'venue_mismatch',
        severity: 'high',
        message: `Venue "${venueName}" mencionado en ${localesWithVenue.join(', ')} pero no en ${localesWithoutVenue.join(', ')}`,
        locales: [...localesWithVenue, ...localesWithoutVenue],
        details: {
          venue: venueName,
          presentIn: localesWithVenue,
          missingIn: localesWithoutVenue,
        },
      });
    }
  }

  // 2. Verificar que los backlinks sean consistentes
  const backlinksByLocale = new Map<string, Set<string>>();
  for (const [locale, data] of Object.entries(localeContents)) {
    const backlinkUrls = new Set(data.backlinks.map(bl => {
      // Normalizar URL (remover query params, trailing slashes)
      return bl.url.split('?')[0].replace(/\/$/, '');
    }));
    backlinksByLocale.set(locale, backlinkUrls);
  }
  
  const allBacklinkUrls = new Set<string>();
  for (const urlSet of backlinksByLocale.values()) {
    for (const url of urlSet) {
      allBacklinkUrls.add(url);
    }
  }
  
  // Verificar consistencia en número de backlinks
  const backlinkCounts = Array.from(backlinksByLocale.values()).map(s => s.size);
  const minBacklinks = Math.min(...backlinkCounts);
  const maxBacklinks = Math.max(...backlinkCounts);
    
  if (maxBacklinks - minBacklinks > 2) {
    const countsByLocale: { [locale: string]: number } = {};
    for (const [locale, urlSet] of backlinksByLocale.entries()) {
      countsByLocale[locale] = urlSet.size;
    }
    
    issues.push({
      type: 'backlink_mismatch',
      severity: 'medium',
      message: `Inconsistencia en número de backlinks: min ${minBacklinks}, max ${maxBacklinks}`,
      locales: Object.keys(localeContents),
      details: countsByLocale,
    });
}

  // Verificar que los mismos backlinks estén en todos los idiomas (para venues mencionados)
  for (const venueKey of allVenueKeys) {
    const venueName = venueKey.split('-')[0];
    const venueCity = venueKey.split('-').slice(1).join('-');
    
    // Buscar el venue en el mapa para obtener sus URLs
    const { getVenueMap } = require('./venueUrlMapper');
    const venueMap = getVenueMap();
    let venueInfo: VenueInfo | null = null;
  
    for (const venue of Object.values(venueMap)) {
      if (venue.name === venueName && venue.city === venueCity) {
        venueInfo = venue;
        break;
      }
    }
    
    if (venueInfo) {
      const expectedUrls = new Set([
        venueInfo.urls.es,
        venueInfo.urls.en,
        venueInfo.urls.fr,
        venueInfo.urls.pt,
      ].filter(url => url));
      
      for (const expectedUrl of expectedUrls) {
        const normalizedExpected = expectedUrl.split('?')[0].replace(/\/$/, '');
        const localesWithBacklink: string[] = [];
        const localesWithoutBacklink: string[] = [];
        
        for (const [locale, urlSet] of backlinksByLocale.entries()) {
          const normalizedUrls = Array.from(urlSet).map(u => u.split('?')[0].replace(/\/$/, ''));
          if (normalizedUrls.some(u => u.includes(normalizedExpected.split('/').pop() || ''))) {
            localesWithBacklink.push(locale);
          } else {
            localesWithoutBacklink.push(locale);
          }
        }
        
        if (localesWithBacklink.length > 0 && localesWithoutBacklink.length > 0) {
          issues.push({
            type: 'backlink_mismatch',
            severity: 'high',
            message: `Backlink a "${venueName}" presente en ${localesWithBacklink.join(', ')} pero no en ${localesWithoutBacklink.join(', ')}`,
            locales: [...localesWithBacklink, ...localesWithoutBacklink],
            details: {
              venue: venueName,
              expectedUrl: normalizedExpected,
              presentIn: localesWithBacklink,
              missingIn: localesWithoutBacklink,
            },
        });
      }
    }
  }
}

  // 3. Verificar consistencia en longitud de contenido
  const wordCounts = Object.values(localeContents).map(lc => lc.wordCount);
  const minWords = Math.min(...wordCounts);
  const maxWords = Math.max(...wordCounts);
  const wordCountDifference = ((maxWords - minWords) / minWords) * 100;
  
  if (wordCountDifference > 30) {
    const countsByLocale: { [locale: string]: number } = {};
    for (const [locale, data] of Object.entries(localeContents)) {
      countsByLocale[locale] = data.wordCount;
    }
    
    issues.push({
      type: 'content_length_mismatch',
      severity: 'low',
      message: `Gran diferencia en longitud de contenido: ${wordCountDifference.toFixed(1)}% de diferencia`,
      locales: Object.keys(localeContents),
      details: countsByLocale,
    });
  }
  
  // 4. Verificar consistencia en terminología
  // Buscar nombres de venues que deberían ser consistentes
  const venueNamesByLocale = new Map<string, Map<string, string>>();
  for (const [locale, data] of Object.entries(localeContents)) {
    const venueNames = new Map<string, string>();
    for (const venue of data.venues) {
      venueNames.set(`${venue.name}-${venue.city}`, venue.name);
    }
    venueNamesByLocale.set(locale, venueNames);
}

  // Verificar que los nombres de venues sean consistentes (pueden variar ligeramente por idioma, pero deberían ser reconocibles)
  // Esto es más una verificación básica - se puede mejorar
  
  // Calcular score de consistencia
  let consistencyScore = 100;
  consistencyScore -= issues.filter(i => i.severity === 'high').length * 20;
  consistencyScore -= issues.filter(i => i.severity === 'medium').length * 10;
  consistencyScore -= issues.filter(i => i.severity === 'low').length * 5;
  consistencyScore = Math.max(0, consistencyScore);
  
  const content = getPostContent(post, 'es');
  
  return {
    postId: post.id,
    category: post.category,
    title: content.title,
    issues,
    consistencyScore,
  };
}

/**
 * Valida traducciones de todos los posts
 */
export function validateAllTranslations(): TranslationValidation[] {
  const validations: TranslationValidation[] = [];
  
  console.log(`Validando consistencia de traducciones en ${blogPosts.length} posts...`);
  
  for (const post of blogPosts) {
    try {
      const validation = validateTranslations(post);
      validations.push(validation);
    } catch (error) {
      console.error(`Error validando traducciones para post ${post.id}:`, error);
      const content = getPostContent(post, 'es');
      validations.push({
        postId: post.id,
        category: post.category,
        title: content.title,
        issues: [{
          type: 'missing_translation',
          severity: 'high',
          message: `Error al validar: ${error instanceof Error ? error.message : 'Unknown error'}`,
          locales: [],
        }],
        consistencyScore: 0,
      });
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
function generateValidationReport(validations: TranslationValidation[]): void {
  const outputPath = path.join(__dirname, 'translationValidation.json');
  fs.writeFileSync(outputPath, JSON.stringify(validations, null, 2), 'utf-8');
  console.log(`\nReporte de validación generado en: ${outputPath}`);
  
  // Generar resumen
  const summary = {
    totalValidations: validations.length,
    averageConsistencyScore: validations.reduce((sum, v) => sum + v.consistencyScore, 0) / validations.length,
    postsWithIssues: validations.filter(v => v.issues.length > 0).length,
    totalIssues: validations.reduce((sum, v) => sum + v.issues.length, 0),
    issuesByType: {} as { [key: string]: number },
    worstPosts: validations
      .sort((a, b) => a.consistencyScore - b.consistencyScore)
      .slice(0, 20)
      .map(v => ({
        postId: v.postId,
        title: v.title,
        consistencyScore: v.consistencyScore,
        issuesCount: v.issues.length,
      })),
  };
  
  // Contar issues por tipo
  for (const validation of validations) {
    for (const issue of validation.issues) {
      summary.issuesByType[issue.type] = (summary.issuesByType[issue.type] || 0) + 1;
    }
  }
  
  const summaryPath = path.join(__dirname, 'translationValidationSummary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Resumen generado en: ${summaryPath}`);
  
  console.log('\n=== RESUMEN DE VALIDACIÓN DE TRADUCCIONES ===');
  console.log(`Total validaciones: ${summary.totalValidations}`);
  console.log(`Score de consistencia promedio: ${summary.averageConsistencyScore.toFixed(2)}/100`);
  console.log(`Posts con issues: ${summary.postsWithIssues}`);
  console.log(`Total issues: ${summary.totalIssues}`);
  console.log('\nIssues por tipo:');
  for (const [type, count] of Object.entries(summary.issuesByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nTop 10 posts con más problemas de consistencia:');
  summary.worstPosts.slice(0, 10).forEach((post, idx) => {
    console.log(`  ${idx + 1}. Post ${post.postId}: ${post.title.substring(0, 60)}... - Score: ${post.consistencyScore}, Issues: ${post.issuesCount}`);
    });
  }

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Iniciando validación de traducciones...\n');
  const validations = validateAllTranslations();
  generateValidationReport(validations);
  console.log('\nValidación completada!');
}



