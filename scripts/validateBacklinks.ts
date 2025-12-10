import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, type BlogPost } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getVenueMap, findVenueByKeyword, getVenueUrl, type VenueInfo } from './venueUrlMapper';

/**
 * Validación específica de backlinks
 */
export interface BacklinkValidation {
  postId: string;
  category: string;
  locale: string;
  title: string;
  venuesMentioned: VenueInfo[];
  backlinksStatus: BacklinkStatus[];
  score: number; // 0-100, 100 = perfecto
  issues: BacklinkIssue[];
}

export interface BacklinkStatus {
  venue: VenueInfo;
  hasBacklink: boolean;
  backlinkUrl?: string;
  expectedUrl: string;
  anchorText?: string;
  anchorTextMatches: boolean;
  context?: string;
}

export interface BacklinkIssue {
  type: 'missing' | 'incorrect_url' | 'wrong_anchor' | 'missing_anchor';
  severity: 'high' | 'medium' | 'low';
  venue: string;
  message: string;
  expectedUrl?: string;
  foundUrl?: string;
  expectedAnchorTexts?: string[];
  foundAnchorText?: string;
}

/**
 * Extrae backlinks del contenido HTML con más detalle
 */
function extractBacklinksDetailed(content: string): Array<{
  url: string;
  anchorText: string;
  context: string;
  position: number;
}> {
  const backlinks: Array<{
    url: string;
    anchorText: string;
    context: string;
    position: number;
  }> = [];
  
  const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']*mandalatickets\.com[^"']*)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[1];
    const anchorText = match[2].replace(/<[^>]+>/g, '').trim();
    
    // Extraer contexto más amplio (100 caracteres antes y después)
    const startIndex = Math.max(0, match.index - 100);
    const endIndex = Math.min(content.length, match.index + match[0].length + 100);
    const context = content.substring(startIndex, endIndex)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    backlinks.push({
      url,
      anchorText,
      context,
      position: match.index,
    });
  }
  
  return backlinks;
}

/**
 * Valida backlinks para un post en un idioma específico
 */
function validateBacklinksForPost(
  post: BlogPost,
  locale: 'es' | 'en' | 'fr' | 'pt'
): BacklinkValidation {
  const content = getPostContent(post, locale);
  const postContent = generatePostContent(post, locale);
  const venueMap = getVenueMap();
  
  // Detectar venues mencionados
  const venuesMentioned = findVenueByKeyword(postContent, venueMap);
  
  // Extraer backlinks
  const backlinksFound = extractBacklinksDetailed(postContent);
  
  // Validar cada venue mencionado
  const backlinksStatus: BacklinkStatus[] = [];
  const issues: BacklinkIssue[] = [];
  
  for (const venue of venuesMentioned) {
    const expectedUrl = venue.urls[locale] || '';
    
    if (!expectedUrl) {
      issues.push({
        type: 'missing',
        severity: 'high',
        venue: venue.name,
        message: `Venue "${venue.name}" no tiene URL configurada para ${locale}`,
      });
      continue;
    }
    
    // Buscar backlink que corresponda a este venue
    const venueSlug = expectedUrl.split('/').pop() || '';
    const matchingBacklink = backlinksFound.find(bl => {
      return bl.url === expectedUrl || 
             bl.url.includes(venueSlug) ||
             bl.url.includes(venue.name.toLowerCase().replace(/\s+/g, '-'));
    });
    
    const hasBacklink = !!matchingBacklink;
    let anchorTextMatches = false;
    
    if (matchingBacklink) {
      // Verificar si el anchor text es apropiado
      const anchorLower = matchingBacklink.anchorText.toLowerCase();
      const venueNameLower = venue.name.toLowerCase();
      const cityLower = venue.city.toLowerCase();
      
      // Verificar si el anchor text menciona el venue o ciudad
      anchorTextMatches = anchorLower.includes(venueNameLower) || 
                         anchorLower.includes(cityLower) ||
                         venue.anchorTexts.some(at => anchorLower.includes(at.toLowerCase()));
      
      if (!anchorTextMatches && venue.anchorTexts.length > 0) {
        issues.push({
          type: 'wrong_anchor',
          severity: 'medium',
          venue: venue.name,
          message: `Anchor text "${matchingBacklink.anchorText}" no es óptimo para "${venue.name}"`,
          foundAnchorText: matchingBacklink.anchorText,
          expectedAnchorTexts: venue.anchorTexts,
        });
      }
    } else {
      issues.push({
        type: 'missing',
        severity: 'high',
        venue: venue.name,
        message: `Venue "${venue.name}" mencionado pero no tiene backlink en el contenido`,
        expectedUrl,
        expectedAnchorTexts: venue.anchorTexts,
      });
    }
    
    backlinksStatus.push({
      venue,
      hasBacklink,
      backlinkUrl: matchingBacklink?.url,
      expectedUrl,
      anchorText: matchingBacklink?.anchorText,
      anchorTextMatches,
      context: matchingBacklink?.context,
    });
  }
  
  // Verificar backlinks que no corresponden a ningún venue mencionado
  for (const backlink of backlinksFound) {
    const matchesAnyVenue = venuesMentioned.some(venue => {
      const venueUrl = venue.urls[locale];
      if (!venueUrl) return false;
      const venueSlug = venueUrl.split('/').pop() || '';
      return backlink.url === venueUrl || 
             backlink.url.includes(venueSlug) ||
             backlink.url.includes(venue.name.toLowerCase().replace(/\s+/g, '-'));
    });
    
    if (!matchesAnyVenue && backlink.url.includes('/disco/')) {
      // Podría ser un backlink incorrecto o a un venue no mencionado
      issues.push({
        type: 'incorrect_url',
        severity: 'low',
        venue: 'Unknown',
        message: `Backlink encontrado que no corresponde a ningún venue mencionado en el contenido`,
        foundUrl: backlink.url,
      });
    }
  }
  
  // Calcular score (0-100)
  let score = 100;
  if (venuesMentioned.length === 0) {
    // Si no hay venues mencionados, no podemos validar backlinks
    score = 50; // Neutral
  } else {
    const missingCount = backlinksStatus.filter(bs => !bs.hasBacklink).length;
    const wrongAnchorCount = backlinksStatus.filter(bs => bs.hasBacklink && !bs.anchorTextMatches).length;
    
    score = 100 - (missingCount * 30) - (wrongAnchorCount * 10);
    score = Math.max(0, score);
  }
  
  return {
    postId: post.id,
    category: post.category,
    locale,
    title: content.title,
    venuesMentioned,
    backlinksStatus,
    score,
    issues,
  };
}

/**
 * Valida backlinks para todos los posts
 */
export function validateAllBacklinks(): BacklinkValidation[] {
  const validations: BacklinkValidation[] = [];
  const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
  
  console.log(`Validando backlinks para ${blogPosts.length} posts en 4 idiomas...`);
  
  for (const post of blogPosts) {
    for (const locale of locales) {
      try {
        const validation = validateBacklinksForPost(post, locale);
        validations.push(validation);
      } catch (error) {
        console.error(`Error validando backlinks para post ${post.id} en ${locale}:`, error);
        const content = getPostContent(post, locale);
        validations.push({
          postId: post.id,
          category: post.category,
          locale,
          title: content.title,
          venuesMentioned: [],
          backlinksStatus: [],
          score: 0,
          issues: [{
            type: 'missing',
            severity: 'high',
            venue: 'Unknown',
            message: `Error al validar: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }],
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
function generateValidationReport(validations: BacklinkValidation[]): void {
  const outputPath = path.join(__dirname, 'backlinkValidation.json');
  fs.writeFileSync(outputPath, JSON.stringify(validations, null, 2), 'utf-8');
  console.log(`\nReporte de validación generado en: ${outputPath}`);
  
  // Generar resumen
  const summary = {
    totalValidations: validations.length,
    averageScore: validations.reduce((sum, v) => sum + v.score, 0) / validations.length,
    postsWithIssues: validations.filter(v => v.issues.length > 0).length,
    totalIssues: validations.reduce((sum, v) => sum + v.issues.length, 0),
    issuesByType: {} as { [key: string]: number },
    issuesBySeverity: {
      high: 0,
      medium: 0,
      low: 0,
    },
    postsWithMissingBacklinks: validations.filter(v => 
      v.issues.some(i => i.type === 'missing')
    ).length,
    postsWithIncorrectBacklinks: validations.filter(v => 
      v.issues.some(i => i.type === 'incorrect_url')
    ).length,
    postsWithWrongAnchors: validations.filter(v => 
      v.issues.some(i => i.type === 'wrong_anchor')
    ).length,
    worstPosts: validations
      .sort((a, b) => a.score - b.score)
      .slice(0, 20)
      .map(v => ({
        postId: v.postId,
        locale: v.locale,
        title: v.title,
        score: v.score,
        issuesCount: v.issues.length,
      })),
  };
  
  // Contar issues por tipo y severidad
  for (const validation of validations) {
    for (const issue of validation.issues) {
      summary.issuesByType[issue.type] = (summary.issuesByType[issue.type] || 0) + 1;
      summary.issuesBySeverity[issue.severity]++;
    }
  }
  
  const summaryPath = path.join(__dirname, 'backlinkValidationSummary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Resumen generado en: ${summaryPath}`);
  
  console.log('\n=== RESUMEN DE VALIDACIÓN DE BACKLINKS ===');
  console.log(`Total validaciones: ${summary.totalValidations}`);
  console.log(`Score promedio: ${summary.averageScore.toFixed(2)}/100`);
  console.log(`Posts con issues: ${summary.postsWithIssues}`);
  console.log(`Total issues: ${summary.totalIssues}`);
  console.log(`Posts con backlinks faltantes: ${summary.postsWithMissingBacklinks}`);
  console.log(`Posts con backlinks incorrectos: ${summary.postsWithIncorrectBacklinks}`);
  console.log(`Posts con anchor texts incorrectos: ${summary.postsWithWrongAnchors}`);
  console.log('\nIssues por tipo:');
  for (const [type, count] of Object.entries(summary.issuesByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nIssues por severidad:');
  for (const [severity, count] of Object.entries(summary.issuesBySeverity)) {
    console.log(`  ${severity}: ${count}`);
  }
  console.log('\nTop 10 posts con más problemas:');
  summary.worstPosts.slice(0, 10).forEach((post, idx) => {
    console.log(`  ${idx + 1}. Post ${post.postId} (${post.locale}): ${post.title.substring(0, 60)}... - Score: ${post.score}, Issues: ${post.issuesCount}`);
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Iniciando validación de backlinks...\n');
  const validations = validateAllBacklinks();
  generateValidationReport(validations);
  console.log('\nValidación completada!');
}



