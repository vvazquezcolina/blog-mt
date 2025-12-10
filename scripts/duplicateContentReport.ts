import { blogPosts } from '../data/blogPosts';
import { postTranslations } from '../data/blogPostTranslations';
import { generatePostContent } from '../utils/contentGenerator';
import * as fs from 'fs';

interface DuplicateMatch {
  postId1: string;
  postId2: string;
  locale: string;
  paragraph: string;
  similarity: number;
}

function extractParagraphs(html: string): string[] {
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gis;
  const paragraphs: string[] = [];
  let match;
  
  while ((match = paragraphRegex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text.length > 50) {
      paragraphs.push(text);
    }
  }
  
  return paragraphs;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  if (normalized1 === normalized2) {
    return 100;
  }
  
  const words1 = new Set(normalized1.split(' '));
  const words2 = new Set(normalized2.split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  
  return (intersection.size / union.size) * 100;
}

console.log('Analizando contenido duplicado...\n');

const locales: Array<'es' | 'en' | 'fr' | 'pt'> = ['es', 'en', 'fr', 'pt'];
const postContents: Map<string, Map<string, string[]>> = new Map();

// Generar contenido
for (const post of blogPosts) {
  const localeContents = new Map<string, string[]>();
  
  for (const locale of locales) {
    try {
      const html = generatePostContent(post, locale);
      const paragraphs = extractParagraphs(html);
      localeContents.set(locale, paragraphs);
    } catch (error) {
      // Ignorar errores para posts con funciones faltantes
    }
  }
  
  if (localeContents.size > 0) {
    postContents.set(post.id, localeContents);
  }
}

console.log(`✓ Analizados ${postContents.size} posts\n`);

// Encontrar duplicados idénticos (100%)
const identicalDuplicates: Map<string, { posts: Set<string>, paragraph: string, locale: string }> = new Map();

const postIds = Array.from(postContents.keys());

for (let i = 0; i < postIds.length; i++) {
  for (let j = i + 1; j < postIds.length; j++) {
    const postId1 = postIds[i];
    const postId2 = postIds[j];
    
    const content1 = postContents.get(postId1)!;
    const content2 = postContents.get(postId2)!;
    
    for (const locale of locales) {
      const paragraphs1 = content1.get(locale) || [];
      const paragraphs2 = content2.get(locale) || [];
      
      for (const para1 of paragraphs1) {
        for (const para2 of paragraphs2) {
          if (normalizeText(para1) === normalizeText(para2)) {
            const key = normalizeText(para1);
            if (!identicalDuplicates.has(key)) {
              identicalDuplicates.set(key, {
                posts: new Set(),
                paragraph: para1.substring(0, 200),
                locale
              });
            }
            identicalDuplicates.get(key)!.posts.add(postId1);
            identicalDuplicates.get(key)!.posts.add(postId2);
          }
        }
      }
    }
  }
}

// Generar reporte
const report: string[] = [];
report.push('# REPORTE DE CONTENIDO DUPLICADO\n');
report.push(`Fecha: ${new Date().toLocaleDateString('es-MX')}\n`);
report.push(`Total de posts analizados: ${postContents.size}\n`);
report.push(`Párrafos idénticos encontrados: ${identicalDuplicates.size}\n\n`);

report.push('## RESUMEN POR IDIOMA\n\n');

for (const locale of locales) {
  const localeDuplicates = Array.from(identicalDuplicates.entries())
    .filter(([_, dup]) => dup.locale === locale);
  
  report.push(`### ${locale.toUpperCase()}: ${localeDuplicates.length} párrafos únicos duplicados\n\n`);
  
  if (localeDuplicates.length > 0) {
    // Ordenar por cantidad de posts que comparten el párrafo
    localeDuplicates.sort((a, b) => b[1].posts.size - a[1].posts.size);
    
    report.push(`**Top 10 párrafos más duplicados:**\n\n`);
    
    localeDuplicates.slice(0, 10).forEach(([key, dup], index) => {
      const postList = Array.from(dup.posts).sort((a, b) => parseInt(a) - parseInt(b)).join(', ');
      report.push(`${index + 1}. **Aparece en ${dup.posts.size} posts:** POST ${postList}\n`);
      report.push(`   Párrafo: "${dup.paragraph}${dup.paragraph.length >= 200 ? '...' : ''}"\n\n`);
    });
  }
}

report.push('\n## DETALLE POR POST\n\n');

// Contar duplicados por post
const postDuplicateCount: Map<string, number> = new Map();

for (const [key, dup] of identicalDuplicates.entries()) {
  for (const postId of dup.posts) {
    postDuplicateCount.set(postId, (postDuplicateCount.get(postId) || 0) + 1);
  }
}

const sortedPosts = Array.from(postDuplicateCount.entries())
  .sort((a, b) => b[1] - a[1]);

report.push('Posts con más párrafos duplicados:\n\n');
sortedPosts.slice(0, 20).forEach(([postId, count]) => {
  const title = postTranslations[postId]?.es?.title || postId;
  report.push(`- POST ${postId}: ${count} párrafo(s) duplicado(s) - "${title}"\n`);
});

// Guardar reporte
const reportPath = 'scripts/duplicateContentReport.md';
fs.writeFileSync(reportPath, report.join(''));
console.log(`\n✓ Reporte guardado en: ${reportPath}\n`);

// Mostrar resumen en consola
console.log('=== RESUMEN ===\n');
console.log(`Total de párrafos idénticos únicos: ${identicalDuplicates.size}\n`);

for (const locale of locales) {
  const localeDuplicates = Array.from(identicalDuplicates.entries())
    .filter(([_, dup]) => dup.locale === locale);
  
  if (localeDuplicates.length > 0) {
    const totalPostsAffected = new Set();
    localeDuplicates.forEach(([_, dup]) => {
      dup.posts.forEach(p => totalPostsAffected.add(p));
    });
    
    console.log(`${locale.toUpperCase()}: ${localeDuplicates.length} párrafos únicos duplicados en ${totalPostsAffected.size} posts`);
  }
}
