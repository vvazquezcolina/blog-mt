import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, type BlogPost } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getVenueMap, findVenueByKeyword, type VenueInfo } from './venueUrlMapper';

/**
 * Script para corregir inconsistencias de traducciones
 * Asegura que los mismos venues estén mencionados en todos los idiomas
 */

export interface TranslationFix {
  postId: string;
  title: string;
  issues: Array<{
    locale: string;
    missingVenues: VenueInfo[];
    extraVenues: VenueInfo[];
    suggestion: string;
  }>;
}

/**
 * Analiza inconsistencias de traducciones
 */
export function analyzeTranslationIssues(): TranslationFix[] {
  const venueMap = getVenueMap();
  const fixes: TranslationFix[] = [];
  const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
  
  console.log(`Analizando inconsistencias de traducciones en ${blogPosts.length} posts...`);
  
  for (const post of blogPosts) {
    const venuesByLocale: { [locale: string]: VenueInfo[] } = {};
    
    // Obtener venues mencionados por idioma
    for (const locale of locales) {
      try {
        const content = getPostContent(post, locale);
        const postContent = generatePostContent(post, locale);
        const venuesMentioned = findVenueByKeyword(postContent, venueMap);
        venuesByLocale[locale] = venuesMentioned;
      } catch (error) {
        console.error(`Error procesando post ${post.id} en ${locale}:`, error);
        venuesByLocale[locale] = [];
      }
    }
    
    // Detectar inconsistencias
    const allVenueKeys = new Set<string>();
    for (const venues of Object.values(venuesByLocale)) {
      for (const venue of venues) {
        allVenueKeys.add(`${venue.name}-${venue.city}`);
      }
    }
    
    const issues: TranslationFix['issues'] = [];
    
    for (const locale of locales) {
      const localeVenues = venuesByLocale[locale];
      const localeVenueKeys = new Set(localeVenues.map(v => `${v.name}-${v.city}`));
      
      // Venues que faltan en este idioma
      const missingVenues: VenueInfo[] = [];
      for (const venueKey of allVenueKeys) {
        if (!localeVenueKeys.has(venueKey)) {
          // Buscar el venue en el mapa
          for (const venue of Object.values(venueMap)) {
            if (`${venue.name}-${venue.city}` === venueKey) {
              missingVenues.push(venue);
              break;
            }
          }
        }
      }
      
      // Venues extra en este idioma (menos común, pero posible)
      const otherLocalesVenueKeys = new Set<string>();
      for (const [otherLocale, otherVenues] of Object.entries(venuesByLocale)) {
        if (otherLocale !== locale) {
          for (const venue of otherVenues) {
            otherLocalesVenueKeys.add(`${venue.name}-${venue.city}`);
          }
        }
      }
      
      const extraVenues: VenueInfo[] = [];
      for (const venue of localeVenues) {
        const venueKey = `${venue.name}-${venue.city}`;
        if (!otherLocalesVenueKeys.has(venueKey) && otherLocalesVenueKeys.size > 0) {
          extraVenues.push(venue);
        }
      }
      
      if (missingVenues.length > 0 || extraVenues.length > 0) {
        const content = getPostContent(post, locale);
        issues.push({
          locale,
          missingVenues,
          extraVenues,
          suggestion: missingVenues.length > 0
            ? `Agregar menciones de ${missingVenues.map(v => v.name).join(', ')} en el contenido de ${locale}`
            : `Revisar menciones de ${extraVenues.map(v => v.name).join(', ')} que solo aparecen en ${locale}`,
        });
      }
    }
    
    if (issues.length > 0) {
      const content = getPostContent(post, 'es');
      fixes.push({
        postId: post.id,
        title: content.title,
        issues,
      });
    }
  }
  
  return fixes;
}

/**
 * Genera reporte de fixes de traducciones
 */
function generateTranslationFixReport(fixes: TranslationFix[]): void {
  const outputPath = path.join(__dirname, 'translationFixes.json');
  fs.writeFileSync(outputPath, JSON.stringify(fixes, null, 2), 'utf-8');
  console.log(`\nReporte de fixes de traducciones generado en: ${outputPath}`);
  
  // Generar resumen
  const summary = {
    totalPostsWithIssues: fixes.length,
    totalIssues: fixes.reduce((sum, f) => sum + f.issues.length, 0),
    issuesByLocale: {} as { [locale: string]: number },
    totalMissingVenues: fixes.reduce((sum, f) => 
      sum + f.issues.reduce((s, i) => s + i.missingVenues.length, 0),
      0
    ),
    totalExtraVenues: fixes.reduce((sum, f) => 
      sum + f.issues.reduce((s, i) => s + i.extraVenues.length, 0),
      0
    ),
    worstPosts: fixes
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 20)
      .map(f => ({
        postId: f.postId,
        title: f.title,
        issuesCount: f.issues.length,
        totalMissing: f.issues.reduce((sum, i) => sum + i.missingVenues.length, 0),
      })),
  };
  
  // Contar issues por locale
  for (const fix of fixes) {
    for (const issue of fix.issues) {
      summary.issuesByLocale[issue.locale] = (summary.issuesByLocale[issue.locale] || 0) + 1;
    }
  }
  
  const summaryPath = path.join(__dirname, 'translationFixesSummary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Resumen generado en: ${summaryPath}`);
  
  console.log('\n=== RESUMEN DE FIXES DE TRADUCCIONES ===');
  console.log(`Posts con inconsistencias: ${summary.totalPostsWithIssues}`);
  console.log(`Total issues: ${summary.totalIssues}`);
  console.log(`Total venues faltantes: ${summary.totalMissingVenues}`);
  console.log(`Total venues extra: ${summary.totalExtraVenues}`);
  console.log('\nIssues por idioma:');
  for (const [locale, count] of Object.entries(summary.issuesByLocale)) {
    console.log(`  ${locale.toUpperCase()}: ${count}`);
  }
  console.log('\nTop 10 posts con más inconsistencias:');
  summary.worstPosts.slice(0, 10).forEach((post, idx) => {
    console.log(`  ${idx + 1}. Post ${post.postId}: ${post.title.substring(0, 60)}... - Issues: ${post.issuesCount}, Venues faltantes: ${post.totalMissing}`);
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Analizando inconsistencias de traducciones...\n');
  const fixes = analyzeTranslationIssues();
  generateTranslationFixReport(fixes);
  console.log('\nAnálisis completado!');
}



