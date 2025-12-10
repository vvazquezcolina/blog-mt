import { blogPosts } from '../data/blogPosts';
import { postTranslations } from '../data/blogPostTranslations';
import { generatePostContent } from '../utils/contentGenerator';

interface DuplicateMatch {
  postId1: string;
  postId2: string;
  locale: string;
  paragraph1: string;
  paragraph2: string;
  similarity: number;
}

function extractParagraphs(html: string): string[] {
  // Extraer texto de párrafos <p>
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gis;
  const paragraphs: string[] = [];
  let match;
  
  while ((match = paragraphRegex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '') // Remover tags HTML
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
    
    // Solo incluir párrafos con contenido significativo (más de 50 caracteres)
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
  
  // Si son idénticos después de normalizar
  if (normalized1 === normalized2) {
    return 100;
  }
  
  // Calcular similitud usando palabras comunes
  const words1 = new Set(normalized1.split(' '));
  const words2 = new Set(normalized2.split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  
  return (intersection.size / union.size) * 100;
}

function findDuplicateParagraphs(): DuplicateMatch[] {
  const duplicates: DuplicateMatch[] = [];
  const locales: Array<'es' | 'en' | 'fr' | 'pt'> = ['es', 'en', 'fr', 'pt'];
  
  console.log('Analizando contenido de posts para detectar párrafos duplicados...\n');
  
  // Generar contenido para todos los posts en todos los idiomas
  const postContents: Map<string, Map<string, string[]>> = new Map();
  
  for (const post of blogPosts) {
    const translation = postTranslations[post.id];
    if (!translation) continue;
    
    const localeContents = new Map<string, string[]>();
    
    for (const locale of locales) {
      try {
        const html = generatePostContent(post, locale);
        const paragraphs = extractParagraphs(html);
        localeContents.set(locale, paragraphs);
      } catch (error) {
        console.error(`Error generando contenido para POST ${post.id} (${locale}):`, error);
      }
    }
    
    postContents.set(post.id, localeContents);
  }
  
  console.log(`✓ Contenido generado para ${postContents.size} posts\n`);
  
  // Comparar párrafos entre todos los posts
  const postIds = Array.from(postContents.keys());
  let comparisons = 0;
  
  for (let i = 0; i < postIds.length; i++) {
    for (let j = i + 1; j < postIds.length; j++) {
      const postId1 = postIds[i];
      const postId2 = postIds[j];
      
      const content1 = postContents.get(postId1)!;
      const content2 = postContents.get(postId2)!;
      
      for (const locale of locales) {
        const paragraphs1 = content1.get(locale) || [];
        const paragraphs2 = content2.get(locale) || [];
        
        // Comparar cada párrafo del post 1 con cada párrafo del post 2
        for (const para1 of paragraphs1) {
          for (const para2 of paragraphs2) {
            comparisons++;
            const similarity = calculateSimilarity(para1, para2);
            
            // Considerar duplicado si similitud > 70%
            if (similarity >= 70) {
              duplicates.push({
                postId1,
                postId2,
                locale,
                paragraph1: para1.substring(0, 150) + (para1.length > 150 ? '...' : ''),
                paragraph2: para2.substring(0, 150) + (para2.length > 150 ? '...' : ''),
                similarity
              });
            }
          }
        }
      }
    }
    
    // Mostrar progreso cada 10 posts
    if ((i + 1) % 10 === 0) {
      console.log(`Procesados ${i + 1}/${postIds.length} posts...`);
    }
  }
  
  console.log(`\n✓ Comparaciones realizadas: ${comparisons.toLocaleString()}\n`);
  
  return duplicates;
}

// Ejecutar análisis
const duplicates = findDuplicateParagraphs();

console.log('=== RESUMEN DE PÁRRAFOS DUPLICADOS ===\n');
console.log(`Total de duplicados encontrados: ${duplicates.length}\n`);

if (duplicates.length > 0) {
  // Agrupar por nivel de similitud
  const identical = duplicates.filter(d => d.similarity === 100);
  const verySimilar = duplicates.filter(d => d.similarity >= 90 && d.similarity < 100);
  const similar = duplicates.filter(d => d.similarity >= 70 && d.similarity < 90);
  
  console.log(`- Idénticos (100%): ${identical.length}`);
  console.log(`- Muy similares (90-99%): ${verySimilar.length}`);
  console.log(`- Similares (70-89%): ${similar.length}\n`);
  
  // Mostrar detalles de los más problemáticos primero
  console.log('=== DETALLES DE DUPLICADOS ===\n');
  
  // Mostrar idénticos primero
  if (identical.length > 0) {
    console.log('🔴 PÁRRAFOS IDÉNTICOS (100% de similitud):\n');
    identical.slice(0, 20).forEach((dup, index) => {
      const post1Title = postTranslations[dup.postId1]?.[dup.locale]?.title || dup.postId1;
      const post2Title = postTranslations[dup.postId2]?.[dup.locale]?.title || dup.postId2;
      
      console.log(`${index + 1}. POST ${dup.postId1} ↔ POST ${dup.postId2} (${dup.locale.toUpperCase()})`);
      console.log(`   Post 1: "${post1Title}"`);
      console.log(`   Post 2: "${post2Title}"`);
      console.log(`   Párrafo 1: "${dup.paragraph1}"`);
      console.log(`   Párrafo 2: "${dup.paragraph2}"`);
      console.log('');
    });
    
    if (identical.length > 20) {
      console.log(`   ... y ${identical.length - 20} más duplicados idénticos\n`);
    }
  }
  
  // Mostrar muy similares
  if (verySimilar.length > 0) {
    console.log('\n🟡 PÁRRAFOS MUY SIMILARES (90-99% de similitud):\n');
    verySimilar.slice(0, 10).forEach((dup, index) => {
      const post1Title = postTranslations[dup.postId1]?.[dup.locale]?.title || dup.postId1;
      const post2Title = postTranslations[dup.postId2]?.[dup.locale]?.title || dup.postId2;
      
      console.log(`${index + 1}. POST ${dup.postId1} ↔ POST ${dup.postId2} (${dup.locale.toUpperCase()}) - ${dup.similarity.toFixed(1)}%`);
      console.log(`   Post 1: "${post1Title}"`);
      console.log(`   Post 2: "${post2Title}"`);
      console.log(`   Párrafo: "${dup.paragraph1.substring(0, 100)}..."`);
      console.log('');
    });
    
    if (verySimilar.length > 10) {
      console.log(`   ... y ${verySimilar.length - 10} más muy similares\n`);
    }
  }
  
  // Resumen por post
  console.log('\n=== RESUMEN POR POST ===\n');
  const postDuplicates = new Map<string, number>();
  
  duplicates.forEach(dup => {
    postDuplicates.set(dup.postId1, (postDuplicates.get(dup.postId1) || 0) + 1);
    postDuplicates.set(dup.postId2, (postDuplicates.get(dup.postId2) || 0) + 1);
  });
  
  const sortedPosts = Array.from(postDuplicates.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  sortedPosts.forEach(([postId, count]) => {
    const title = postTranslations[postId]?.es?.title || postId;
    console.log(`POST ${postId}: ${count} párrafo(s) duplicado(s) - "${title}"`);
  });
  
} else {
  console.log('✓ No se encontraron párrafos duplicados significativos.');
}
