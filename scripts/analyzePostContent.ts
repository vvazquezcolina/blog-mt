import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, type BlogPost } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getVenueMap, findVenueByKeyword, type VenueInfo } from './venueUrlMapper';

/**
 * Análisis de contenido de posts
 */
export interface PostAnalysis {
  postId: string;
  category: string;
  locales: {
    [locale: string]: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      venuesMentioned: VenueInfo[];
      backlinksFound: BacklinkInfo[];
      expectedBacklinks: ExpectedBacklink[];
      issues: AnalysisIssue[];
    };
  };
  crossLocaleIssues: string[];
}

export interface BacklinkInfo {
  url: string;
  anchorText: string;
  context: string; // Texto alrededor del link
}

export interface ExpectedBacklink {
  venue: VenueInfo;
  locale: string;
  url: string;
  anchorTexts: string[];
}

export interface AnalysisIssue {
  type: 'missing_backlink' | 'incorrect_backlink' | 'generic_content' | 'suspicious_info' | 'missing_venue_info';
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: any;
}

/**
 * Extrae backlinks del contenido HTML
 */
function extractBacklinks(content: string): BacklinkInfo[] {
  const backlinks: BacklinkInfo[] = [];
  
  // Regex para encontrar links a mandalatickets.com
  const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']*mandalatickets\.com[^"']*)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[1];
    const anchorText = match[2].replace(/<[^>]+>/g, '').trim(); // Remover HTML del anchor text
    
    // Extraer contexto (50 caracteres antes y después)
    const startIndex = Math.max(0, match.index - 50);
    const endIndex = Math.min(content.length, match.index + match[0].length + 50);
    const context = content.substring(startIndex, endIndex).replace(/<[^>]+>/g, ' ').trim();
    
    backlinks.push({
      url,
      anchorText,
      context,
    });
  }
  
  return backlinks;
}

/**
 * Analiza un post en un idioma específico
 */
function analyzePostLocale(
  post: BlogPost,
  locale: 'es' | 'en' | 'fr' | 'pt',
  venueMap: { [key: string]: VenueInfo }
): PostAnalysis['locales'][string] {
  const content = getPostContent(post, locale);
  const postContent = generatePostContent(post, locale);
  
  // Detectar venues mencionados
  const venuesMentioned = findVenueByKeyword(postContent, venueMap);
  
  // Extraer backlinks
  const backlinksFound = extractBacklinks(postContent);
  
  // Generar backlinks esperados
  const expectedBacklinks: ExpectedBacklink[] = venuesMentioned.map(venue => ({
    venue,
    locale,
    url: venue.urls[locale] || '',
    anchorTexts: venue.anchorTexts || [],
  }));
  
  // Detectar issues
  const issues: AnalysisIssue[] = [];
  
  // Verificar backlinks faltantes
  for (const expected of expectedBacklinks) {
    if (!expected.url) {
      issues.push({
        type: 'missing_backlink',
        severity: 'high',
        message: `Venue "${expected.venue.name}" mencionado pero no tiene URL para ${locale}`,
        details: { venue: expected.venue.name, city: expected.venue.city },
      });
      continue;
    }
    
    const hasBacklink = backlinksFound.some(bl => 
      bl.url === expected.url || bl.url.includes(expected.venue.name.toLowerCase())
    );
    
    if (!hasBacklink) {
      issues.push({
        type: 'missing_backlink',
        severity: 'high',
        message: `Venue "${expected.venue.name}" mencionado pero no tiene backlink en el contenido`,
        details: {
          venue: expected.venue.name,
          city: expected.venue.city,
          expectedUrl: expected.url,
          anchorTexts: expected.anchorTexts,
        },
      });
    }
  }
  
  // Verificar backlinks incorrectos (link a otro destino cuando se menciona un venue específico)
  for (const backlink of backlinksFound) {
    // Si hay venues mencionados, verificar que el backlink apunte a uno de ellos
    if (venuesMentioned.length > 0) {
      const matchesVenue = venuesMentioned.some(venue => {
        const venueUrl = venue.urls[locale];
        return venueUrl && backlink.url.includes(venueUrl.split('/').pop() || '');
      });
      
      if (!matchesVenue && backlink.url.includes('/disco/')) {
        // Podría ser un backlink incorrecto
        issues.push({
          type: 'incorrect_backlink',
          severity: 'medium',
          message: `Backlink encontrado que no corresponde a ningún venue mencionado`,
          details: {
            backlinkUrl: backlink.url,
            venuesMentioned: venuesMentioned.map(v => v.name),
          },
        });
      }
    }
  }
  
  // Detectar contenido genérico (básico - se mejorará en otro script)
  const genericPhrases = [
    'el mejor lugar',
    'the best place',
    'un lugar increíble',
    'an amazing place',
    'experiencias únicas',
    'unique experiences',
    'no te lo pierdas',
    "don't miss it",
  ];
  
  const contentLower = postContent.toLowerCase();
  const genericCount = genericPhrases.filter(phrase => contentLower.includes(phrase)).length;
  
  if (genericCount > 3) {
    issues.push({
      type: 'generic_content',
      severity: 'medium',
      message: `Contenido potencialmente genérico: ${genericCount} frases genéricas detectadas`,
      details: { genericPhraseCount: genericCount },
    });
  }
  
  // Verificar si menciona venues pero no tiene información específica
  if (venuesMentioned.length > 0) {
    let hasSpecificInfo = false;
    for (const venue of venuesMentioned) {
      // Verificar que el contenido mencione detalles específicos del venue
      const venueKeywords = venue.keywords;
      const hasDetails = venueKeywords.some(kw => {
        const keywordLower = kw.toLowerCase();
        return contentLower.includes(keywordLower) && 
               contentLower.split(keywordLower).length > 1; // Mencionado más de una vez
      });
      
      if (hasDetails) {
        hasSpecificInfo = true;
        break;
      }
    }
    
    if (!hasSpecificInfo) {
      issues.push({
        type: 'missing_venue_info',
        severity: 'medium',
        message: `Venues mencionados pero falta información específica sobre ellos`,
        details: { venues: venuesMentioned.map(v => v.name) },
      });
    }
  }
  
  return {
    title: content.title,
    slug: content.slug,
    excerpt: content.excerpt,
    content: postContent,
    venuesMentioned,
    backlinksFound,
    expectedBacklinks,
    issues,
  };
}

/**
 * Analiza todos los posts
 */
export function analyzeAllPosts(): PostAnalysis[] {
  const venueMap = getVenueMap();
  const analyses: PostAnalysis[] = [];
  
  console.log(`Analizando ${blogPosts.length} posts...`);
  
  for (const post of blogPosts) {
    const locales: PostAnalysis['locales'] = {};
    const localesList: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
    
    for (const locale of localesList) {
      try {
        locales[locale] = analyzePostLocale(post, locale, venueMap);
      } catch (error) {
        console.error(`Error analizando post ${post.id} en ${locale}:`, error);
        locales[locale] = {
          title: getPostContent(post, locale).title,
          slug: getPostContent(post, locale).slug,
          excerpt: getPostContent(post, locale).excerpt,
          content: '',
          venuesMentioned: [],
          backlinksFound: [],
          expectedBacklinks: [],
          issues: [{
            type: 'suspicious_info',
            severity: 'high',
            message: `Error al generar contenido: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }],
        };
      }
    }
    
    // Detectar issues cross-locale
    const crossLocaleIssues: string[] = [];
    
    // Verificar que los mismos venues estén mencionados en todos los idiomas
    const venuesByLocale = Object.values(locales).map(l => l.venuesMentioned.map(v => `${v.name}-${v.city}`));
    const allVenues = new Set(venuesByLocale.flat());
    
    for (const locale of localesList) {
      const localeVenues = new Set(venuesByLocale[localesList.indexOf(locale)]);
      for (const venue of allVenues) {
        if (!localeVenues.has(venue)) {
          crossLocaleIssues.push(`Venue "${venue}" mencionado en otros idiomas pero no en ${locale}`);
        }
      }
    }
    
    // Verificar que los backlinks sean consistentes
    const backlinkCounts = Object.values(locales).map(l => l.backlinksFound.length);
    const minBacklinks = Math.min(...backlinkCounts);
    const maxBacklinks = Math.max(...backlinkCounts);
    
    if (maxBacklinks - minBacklinks > 2) {
      crossLocaleIssues.push(`Inconsistencia en número de backlinks entre idiomas (min: ${minBacklinks}, max: ${maxBacklinks})`);
    }
    
    analyses.push({
      postId: post.id,
      category: post.category,
      locales,
      crossLocaleIssues,
    });
    
    if (parseInt(post.id) % 10 === 0) {
      console.log(`Procesados ${post.id} posts...`);
    }
  }
  
  return analyses;
}

/**
 * Genera reporte JSON
 */
function generateReport(analyses: PostAnalysis[]): void {
  const outputPath = path.join(__dirname, 'postAnalysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analyses, null, 2), 'utf-8');
  console.log(`\nReporte generado en: ${outputPath}`);
  
  // Generar resumen
  const summary = {
    totalPosts: analyses.length,
    totalLocales: analyses.length * 4,
    postsWithIssues: analyses.filter(a => 
      Object.values(a.locales).some(l => l.issues.length > 0) || a.crossLocaleIssues.length > 0
    ).length,
    totalIssues: analyses.reduce((sum, a) => 
      sum + Object.values(a.locales).reduce((s, l) => s + l.issues.length, 0) + a.crossLocaleIssues.length,
      0
    ),
    issuesByType: {} as { [key: string]: number },
    postsWithMissingBacklinks: analyses.filter(a =>
      Object.values(a.locales).some(l => 
        l.issues.some(i => i.type === 'missing_backlink')
      )
    ).length,
    postsWithGenericContent: analyses.filter(a =>
      Object.values(a.locales).some(l => 
        l.issues.some(i => i.type === 'generic_content')
      )
    ).length,
  };
  
  // Contar issues por tipo
  for (const analysis of analyses) {
    for (const localeData of Object.values(analysis.locales)) {
      for (const issue of localeData.issues) {
        summary.issuesByType[issue.type] = (summary.issuesByType[issue.type] || 0) + 1;
      }
    }
  }
  
  const summaryPath = path.join(__dirname, 'analysisSummary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Resumen generado en: ${summaryPath}`);
  console.log('\n=== RESUMEN ===');
  console.log(`Total posts: ${summary.totalPosts}`);
  console.log(`Posts con issues: ${summary.postsWithIssues}`);
  console.log(`Total issues: ${summary.totalIssues}`);
  console.log(`Posts con backlinks faltantes: ${summary.postsWithMissingBacklinks}`);
  console.log(`Posts con contenido genérico: ${summary.postsWithGenericContent}`);
  console.log('\nIssues por tipo:');
  for (const [type, count] of Object.entries(summary.issuesByType)) {
    console.log(`  ${type}: ${count}`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Iniciando análisis de posts...\n');
  const analyses = analyzeAllPosts();
  generateReport(analyses);
  console.log('\nAnálisis completado!');
}



