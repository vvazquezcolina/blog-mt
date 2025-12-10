import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, type BlogPost } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getVenueMap, findVenueByKeyword, type VenueInfo } from './venueUrlMapper';

/**
 * Sugerencias de corrección de backlinks
 */
export interface BacklinkFix {
  postId: string;
  locale: string;
  title: string;
  fixes: Array<{
    venue: VenueInfo;
    action: 'add' | 'update' | 'remove';
    currentUrl?: string;
    suggestedUrl: string;
    suggestedAnchorText: string;
    context: string;
    position?: number; // Posición sugerida en el contenido
  }>;
}

/**
 * Analiza y genera sugerencias de corrección de backlinks
 */
export function analyzeBacklinkFixes(): BacklinkFix[] {
  const venueMap = getVenueMap();
  const fixes: BacklinkFix[] = [];
  
  console.log(`Analizando backlinks para ${blogPosts.length} posts...`);
  
  for (const post of blogPosts) {
    const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
    
    for (const locale of locales) {
      try {
        const content = getPostContent(post, locale);
        const postContent = generatePostContent(post, locale);
        
        // Detectar venues mencionados
        const venuesMentioned = findVenueByKeyword(postContent, venueMap);
        
        // Extraer backlinks existentes
        const backlinkRegex = /<a[^>]+href=["'](https?:\/\/[^"']*mandalatickets\.com[^"']*)["'][^>]*>(.*?)<\/a>/gi;
        const existingBacklinks: Array<{
          url: string;
          anchorText: string;
          position: number;
          context: string;
        }> = [];
        
        let match;
        while ((match = backlinkRegex.exec(postContent)) !== null) {
          const url = match[1];
          const anchorText = match[2].replace(/<[^>]+>/g, '').trim();
          const position = match.index;
          
          // Extraer contexto
          const startIndex = Math.max(0, position - 100);
          const endIndex = Math.min(postContent.length, position + match[0].length + 100);
          const context = postContent.substring(startIndex, endIndex).replace(/<[^>]+>/g, ' ').trim();
          
          existingBacklinks.push({
            url,
            anchorText,
            position,
            context,
          });
        }
        
        // Generar sugerencias de fixes
        const postFixes: BacklinkFix['fixes'] = [];
        
        for (const venue of venuesMentioned) {
          const expectedUrl = venue.urls[locale];
          if (!expectedUrl) {
            continue; // Venue no tiene URL para este idioma
          }
          
          // Buscar si ya existe un backlink para este venue
          const venueSlug = expectedUrl.split('/').pop() || '';
          const existingBacklink = existingBacklinks.find(bl => 
            bl.url === expectedUrl || 
            bl.url.includes(venueSlug) ||
            bl.url.includes(venue.name.toLowerCase().replace(/\s+/g, '-'))
          );
          
          if (!existingBacklink) {
            // Necesitamos agregar un backlink
            // Buscar la mejor posición (cerca de donde se menciona el venue)
            const venueNameLower = venue.name.toLowerCase();
            const venueIndex = postContent.toLowerCase().indexOf(venueNameLower);
            
            if (venueIndex !== -1) {
              // Buscar un anchor text apropiado
              const anchorText = venue.anchorTexts.length > 0 
                ? venue.anchorTexts[0] 
                : `entradas ${venue.name} ${venue.city}`;
              
              // Extraer contexto alrededor de la mención del venue
              const contextStart = Math.max(0, venueIndex - 150);
              const contextEnd = Math.min(postContent.length, venueIndex + venueNameLower.length + 150);
              const context = postContent.substring(contextStart, contextEnd).replace(/<[^>]+>/g, ' ').trim();
              
              postFixes.push({
                venue,
                action: 'add',
                suggestedUrl: expectedUrl,
                suggestedAnchorText: anchorText,
                context,
                position: venueIndex,
              });
            }
          } else {
            // Verificar si el backlink existente es correcto
            if (existingBacklink.url !== expectedUrl) {
              postFixes.push({
                venue,
                action: 'update',
                currentUrl: existingBacklink.url,
                suggestedUrl: expectedUrl,
                suggestedAnchorText: existingBacklink.anchorText,
                context: existingBacklink.context,
                position: existingBacklink.position,
              });
            } else {
              // Verificar si el anchor text es apropiado
              const anchorLower = existingBacklink.anchorText.toLowerCase();
              const venueNameLower = venue.name.toLowerCase();
              const cityLower = venue.city.toLowerCase();
              
              const isAppropriate = anchorLower.includes(venueNameLower) || 
                                   anchorLower.includes(cityLower) ||
                                   venue.anchorTexts.some(at => anchorLower.includes(at.toLowerCase()));
              
              if (!isAppropriate && venue.anchorTexts.length > 0) {
                postFixes.push({
                  venue,
                  action: 'update',
                  currentUrl: existingBacklink.url,
                  suggestedUrl: expectedUrl,
                  suggestedAnchorText: venue.anchorTexts[0],
                  context: existingBacklink.context,
                  position: existingBacklink.position,
                });
              }
            }
          }
        }
        
        if (postFixes.length > 0) {
          fixes.push({
            postId: post.id,
            locale,
            title: content.title,
            fixes: postFixes,
          });
        }
      } catch (error) {
        console.error(`Error analizando post ${post.id} en ${locale}:`, error);
      }
    }
    
    if (parseInt(post.id) % 10 === 0) {
      console.log(`Procesados ${post.id} posts...`);
    }
  }
  
  return fixes;
}

/**
 * Genera código sugerido para insertar backlinks en contentGenerator.ts
 */
function generateCodeSuggestions(fixes: BacklinkFix[]): string {
  const suggestions: string[] = [];
  
  // Agrupar por post
  const fixesByPost = new Map<string, BacklinkFix[]>();
  for (const fix of fixes) {
    const key = fix.postId;
    if (!fixesByPost.has(key)) {
      fixesByPost.set(key, []);
    }
    fixesByPost.get(key)!.push(fix);
  }
  
  suggestions.push('// SUGERENCIAS DE CORRECCIÓN DE BACKLINKS');
  suggestions.push('// Estas sugerencias deben ser revisadas y aplicadas manualmente en contentGenerator.ts');
  suggestions.push('');
  
  for (const [postId, postFixes] of fixesByPost.entries()) {
    suggestions.push(`// Post ${postId}:`);
    
    for (const fix of postFixes) {
      suggestions.push(`//   ${fix.locale.toUpperCase()}: ${fix.title}`);
      
      for (const fixDetail of fix.fixes) {
        if (fixDetail.action === 'add') {
          suggestions.push(`//   AGREGAR backlink para "${fixDetail.venue.name}":`);
          suggestions.push(`//   <a href="${fixDetail.suggestedUrl}">${fixDetail.suggestedAnchorText}</a>`);
          suggestions.push(`//   Contexto: ${fixDetail.context.substring(0, 100)}...`);
        } else if (fixDetail.action === 'update') {
          suggestions.push(`//   ACTUALIZAR backlink para "${fixDetail.venue.name}":`);
          suggestions.push(`//   De: ${fixDetail.currentUrl}`);
          suggestions.push(`//   A: ${fixDetail.suggestedUrl}`);
          suggestions.push(`//   Anchor text sugerido: ${fixDetail.suggestedAnchorText}`);
        }
        suggestions.push('');
      }
    }
  }
  
  return suggestions.join('\n');
}

/**
 * Genera reporte de fixes
 */
function generateFixReport(fixes: BacklinkFix[]): void {
  const outputPath = path.join(__dirname, 'backlinkFixes.json');
  fs.writeFileSync(outputPath, JSON.stringify(fixes, null, 2), 'utf-8');
  console.log(`\nReporte de fixes generado en: ${outputPath}`);
  
  // Generar código sugerido
  const codeSuggestions = generateCodeSuggestions(fixes);
  const suggestionsPath = path.join(__dirname, 'backlinkFixesSuggestions.txt');
  fs.writeFileSync(suggestionsPath, codeSuggestions, 'utf-8');
  console.log(`Sugerencias de código generadas en: ${suggestionsPath}`);
  
  // Generar resumen
  const summary = {
    totalFixes: fixes.length,
    totalActions: fixes.reduce((sum, f) => sum + f.fixes.length, 0),
    actionsByType: {
      add: 0,
      update: 0,
      remove: 0,
    },
    fixesByPost: fixes.reduce((acc, f) => {
      acc[f.postId] = (acc[f.postId] || 0) + f.fixes.length;
      return acc;
    }, {} as { [postId: string]: number }),
    fixesByLocale: fixes.reduce((acc, f) => {
      acc[f.locale] = (acc[f.locale] || 0) + f.fixes.length;
      return acc;
    }, {} as { [locale: string]: number }),
  };
  
  for (const fix of fixes) {
    for (const fixDetail of fix.fixes) {
      summary.actionsByType[fixDetail.action]++;
    }
  }
  
  const summaryPath = path.join(__dirname, 'backlinkFixesSummary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Resumen generado en: ${summaryPath}`);
  
  console.log('\n=== RESUMEN DE FIXES DE BACKLINKS ===');
  console.log(`Total posts con fixes necesarios: ${fixes.length}`);
  console.log(`Total acciones sugeridas: ${summary.totalActions}`);
  console.log(`  - Agregar: ${summary.actionsByType.add}`);
  console.log(`  - Actualizar: ${summary.actionsByType.update}`);
  console.log(`  - Remover: ${summary.actionsByType.remove}`);
  console.log('\nFixes por idioma:');
  for (const [locale, count] of Object.entries(summary.fixesByLocale)) {
    console.log(`  ${locale.toUpperCase()}: ${count}`);
  }
  console.log('\nTop 10 posts con más fixes necesarios:');
  const topPosts = Object.entries(summary.fixesByPost)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  topPosts.forEach(([postId, count], idx) => {
    console.log(`  ${idx + 1}. Post ${postId}: ${count} fixes`);
  });
}

/**
 * Genera HTML con sugerencias visuales de fixes
 */
function generateFixHTMLReport(fixes: BacklinkFix[]): string {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sugerencias de Corrección de Backlinks</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { color: #1A69D9; margin-bottom: 10px; }
    .fix-card {
      background: #f8f9fa;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 6px;
      border-left: 4px solid #1A69D9;
    }
    .fix-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
    }
    .fix-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
    .fix-meta {
      font-size: 12px;
      color: #666;
    }
    .fix-detail {
      background: white;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }
    .fix-detail.add {
      border-left: 3px solid #4caf50;
    }
    .fix-detail.update {
      border-left: 3px solid #f57c00;
    }
    .action-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .action-badge.add {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .action-badge.update {
      background: #fff3e0;
      color: #e65100;
    }
    .suggested-link {
      background: #e3f2fd;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
      font-family: monospace;
      font-size: 14px;
    }
    .context {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
      font-size: 12px;
      color: #666;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sugerencias de Corrección de Backlinks</h1>
    <p style="color: #666; margin-bottom: 30px;">Total: ${fixes.length} posts con ${fixes.reduce((sum, f) => sum + f.fixes.length, 0)} sugerencias</p>
    
    ${fixes.map(fix => `
      <div class="fix-card">
        <div class="fix-header">
          <div>
            <div class="fix-title">Post ${fix.postId}: ${fix.title}</div>
            <div class="fix-meta">Idioma: ${fix.locale.toUpperCase()}</div>
          </div>
        </div>
        
        ${fix.fixes.map(fixDetail => `
          <div class="fix-detail ${fixDetail.action}">
            <span class="action-badge ${fixDetail.action}">${fixDetail.action}</span>
            <div><strong>Venue:</strong> ${fixDetail.venue.name} - ${fixDetail.venue.city}</div>
            ${fixDetail.action === 'update' && fixDetail.currentUrl ? `
              <div style="margin-top: 8px;">
                <strong>URL actual:</strong> <code>${fixDetail.currentUrl}</code>
              </div>
            ` : ''}
            <div class="suggested-link">
              <strong>Sugerencia:</strong><br>
              &lt;a href="${fixDetail.suggestedUrl}"&gt;${fixDetail.suggestedAnchorText}&lt;/a&gt;
            </div>
            <div class="context">
              <strong>Contexto:</strong> ${fixDetail.context.substring(0, 200)}...
            </div>
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>
</body>
</html>`;
  
  return html;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Analizando y generando sugerencias de fixes de backlinks...\n');
  const fixes = analyzeBacklinkFixes();
  generateFixReport(fixes);
  
  // Generar HTML
  const html = generateFixHTMLReport(fixes);
  const htmlPath = path.join(__dirname, 'backlinkFixes.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`Reporte HTML generado en: ${htmlPath}`);
  console.log('\nAnálisis completado!');
}



