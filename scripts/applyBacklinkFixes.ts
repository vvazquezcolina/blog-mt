import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getVenueMap, findVenueByKeyword } from './venueUrlMapper';

/**
 * Script para aplicar correcciones de backlinks directamente en el contenido
 */

interface BacklinkFix {
  postId: string;
  locale: string;
  venueName: string;
  venueUrl: string;
  anchorText: string;
  position: number;
  context: string;
}

/**
 * Aplica fixes de backlinks directamente en el contenido generado
 */
function applyBacklinkFixes(): void {
  const venueMap = getVenueMap();
  const fixes: BacklinkFix[] = [];
  
  console.log('Analizando y aplicando fixes de backlinks...\n');
  
  for (const post of blogPosts) {
    const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
    
    for (const locale of locales) {
      try {
        const content = getPostContent(post, locale);
        let postContent = generatePostContent(post, locale);
        
        // Detectar venues mencionados
        const venuesMentioned = findVenueByKeyword(postContent, venueMap);
        
        // Filtrar venues por categoría
        const categoryCityMap: { [key: string]: string[] } = {
          'cancun': ['CANCÚN', 'CANCUN'],
          'tulum': ['TULUM'],
          'playa-del-carmen': ['PLAYA DEL CARMEN', 'PLAYA'],
          'los-cabos': ['LOS CABOS', 'CABOS', 'CABO'],
          'puerto-vallarta': ['PUERTO VALLARTA', 'VALLARTA'],
        };
        const expectedCities = categoryCityMap[post.category] || [];
        
        const relevantVenues = venuesMentioned.filter(v => {
          if (expectedCities.length === 0) return true;
          const venueCityUpper = v.city.toUpperCase();
          const venueNameUpper = v.name.toUpperCase();
          return expectedCities.some(ec => venueCityUpper.includes(ec) || venueNameUpper.includes(ec));
        });
        
        // Para cada venue, verificar si tiene backlink
        for (const venue of relevantVenues) {
          const venueUrl = venue.urls[locale];
          if (!venueUrl) continue;
          
          const venueSlug = venueUrl.split('/').pop() || '';
          
          // Verificar si ya existe un backlink
          const hasBacklink = postContent.includes(venueUrl) || 
                             postContent.includes(venueSlug) ||
                             new RegExp(`<a[^>]+href=["'][^"']*${venueSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*["']`, 'i').test(postContent);
          
          if (!hasBacklink) {
            // Buscar la primera mención del venue
            const venueKeywords = [...venue.keywords, venue.name];
            let mentionIndex = -1;
            let mentionText = '';
            
            for (const keyword of venueKeywords) {
              if (!keyword || keyword.length < 3) continue;
              const keywordLower = keyword.toLowerCase();
              const contentLower = postContent.toLowerCase();
              const index = contentLower.indexOf(keywordLower);
              
              if (index !== -1 && (mentionIndex === -1 || index < mentionIndex)) {
                // Verificar que no esté dentro de un tag HTML
                const beforeTag = postContent.lastIndexOf('<', index);
                const afterTag = postContent.indexOf('>', beforeTag);
                if (beforeTag === -1 || afterTag === -1 || afterTag < index) {
                  mentionIndex = index;
                  mentionText = postContent.substring(index, index + keyword.length);
                }
              }
            }
            
            if (mentionIndex !== -1) {
              // Generar anchor text
              const anchorTextTemplates: { [key: string]: string } = {
                es: 'entradas',
                en: 'tickets',
                fr: 'billets',
                pt: 'ingressos',
              };
              
              const baseText = anchorTextTemplates[locale] || 'tickets';
              let anchorText = '';
              if (venue.anchorTexts && venue.anchorTexts.length > 0) {
                anchorText = venue.anchorTexts[0];
              } else {
                const cityLower = venue.city.toLowerCase();
                const nameLower = venue.name.toLowerCase();
                if (nameLower.includes(cityLower) && nameLower !== cityLower) {
                  anchorText = `${baseText} ${venue.name}`;
                } else {
                  anchorText = `${baseText} ${venue.name} ${venue.city}`;
                }
              }
              
              // Determinar posición de inserción
              let insertPosition = mentionIndex + mentionText.length;
              const afterMention = postContent.substring(insertPosition, insertPosition + 150);
              
              const paragraphEnd = afterMention.search(/<\/p>/);
              const sentenceEnd = afterMention.search(/[.!?]\s+/);
              const spaceAfter = afterMention.search(/\s+/);
              
              if (paragraphEnd !== -1 && paragraphEnd < 80) {
                insertPosition += paragraphEnd;
              } else if (sentenceEnd !== -1 && sentenceEnd < 100) {
                insertPosition += sentenceEnd + 1;
              } else if (spaceAfter !== -1) {
                insertPosition += spaceAfter + 1;
              }
              
              // Insertar backlink
              const backlink = ` <a href="${venueUrl}" target="_blank" rel="noopener noreferrer" title="${anchorText}">${anchorText}</a>`;
              postContent = 
                postContent.substring(0, insertPosition) +
                backlink +
                postContent.substring(insertPosition);
              
              fixes.push({
                postId: post.id,
                locale,
                venueName: venue.name,
                venueUrl,
                anchorText,
                position: insertPosition,
                context: postContent.substring(Math.max(0, mentionIndex - 50), Math.min(postContent.length, insertPosition + 100)),
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error procesando post ${post.id} (${locale}):`, error);
      }
    }
  }
  
  // Guardar reporte de fixes aplicados
  const reportPath = path.join(__dirname, 'appliedBacklinkFixes.json');
  fs.writeFileSync(reportPath, JSON.stringify(fixes, null, 2), 'utf-8');
  
  console.log(`\n✓ Fixes aplicados: ${fixes.length}`);
  console.log(`Reporte guardado en: ${reportPath}`);
  
  // Resumen por post
  const fixesByPost: { [key: string]: number } = {};
  for (const fix of fixes) {
    fixesByPost[fix.postId] = (fixesByPost[fix.postId] || 0) + 1;
  }
  
  console.log('\nFixes por post:');
  Object.entries(fixesByPost)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([postId, count]) => {
      console.log(`  Post ${postId}: ${count} fixes`);
    });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  applyBacklinkFixes();
  console.log('\n✓ Proceso completado!');
}



