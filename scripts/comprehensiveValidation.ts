// Validación exhaustiva de todos los posts, idioma por idioma
import { blogPosts, getPostContent, findPostBySlug } from '../data/blogPosts';
import { postTranslations } from '../data/blogPostTranslations';
import { generatePostContent } from '../utils/contentGenerator';

const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];

interface ValidationResult {
  postId: string;
  postTitle: string;
  languages: {
    [key: string]: {
      hasTranslation: boolean;
      slug: string;
      getPostContentWorks: boolean;
      findPostBySlugWorks: boolean;
      contentGenerated: boolean;
      contentLength: number;
      hasSpanishText: boolean;
      spanishWordsFound: string[];
    };
  };
}

const results: ValidationResult[] = [];

console.log('🔍 VALIDACIÓN EXHAUSTIVA DE TODOS LOS POSTS\n');
console.log('='.repeat(100));

// Obtener el número total de posts dinámicamente
const totalPosts = blogPosts.length;
const maxPostId = Math.max(...blogPosts.map(p => parseInt(p.id, 10)));

console.log(`📊 Total de posts encontrados: ${totalPosts}`);
console.log(`📊 ID máximo: ${maxPostId}\n`);

// Verificar todos los posts
for (let i = 1; i <= maxPostId; i++) {
  const postId = i.toString();
  const post = blogPosts.find(p => p.id === postId);
  const translation = postTranslations[postId];
  
  if (!post || !translation) {
    console.error(`❌ Post ${postId}: No encontrado o sin traducciones`);
    continue;
  }
  
  const result: ValidationResult = {
    postId,
    postTitle: post.content.es.title,
    languages: {}
  };
  
  for (const locale of locales) {
    const langResult = {
      hasTranslation: false,
      slug: '',
      getPostContentWorks: false,
      findPostBySlugWorks: false,
      contentGenerated: false,
      contentLength: 0,
      hasSpanishText: false,
      spanishWordsFound: [] as string[]
    };
    
    // Verificar traducción
    if (translation[locale]) {
      langResult.hasTranslation = true;
      langResult.slug = translation[locale].slug;
      
      // Verificar getPostContent
      const content = getPostContent(post, locale);
      if (content && content.slug === translation[locale].slug) {
        langResult.getPostContentWorks = true;
      }
      
      // Verificar findPostBySlug
      const foundPost = findPostBySlug(translation[locale].slug, locale);
      if (foundPost && foundPost.id === postId) {
        langResult.findPostBySlugWorks = true;
      }
      
      // Verificar generador de contenido
      try {
        const generatedContent = generatePostContent(post, locale);
        if (generatedContent && generatedContent.trim() !== '') {
          langResult.contentGenerated = true;
          langResult.contentLength = generatedContent.length;
          
          // Verificar texto en español (solo para idiomas no-español)
          // Mejorar detección: buscar palabras con contexto (espacios alrededor)
          if (locale !== 'es') {
            const spanishWords = [
              ' los ', ' las ', ' del ', ' para ', ' con ', ' que ', ' una ', ' este ', ' esta ',
              ' los.', ' las.', ' del.', ' para.', ' con.', ' que.', ' una.', ' este.', ' esta.',
              ' los,', ' las,', ' del,', ' para,', ' con,', ' que,', ' una,', ' este,', ' esta,',
              ' de la ', ' de los ', ' en la ', ' en el ', ' por la ', ' por el '
            ];
            const contentLower = generatedContent.toLowerCase();
            
            for (const word of spanishWords) {
              if (contentLower.includes(word)) {
                langResult.hasSpanishText = true;
                langResult.spanishWordsFound.push(word.trim());
              }
            }
          }
        }
      } catch (error) {
        // Reportar error al generar contenido
        console.error(`❌ Post ${postId} [${locale}]: Error al generar contenido: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    result.languages[locale] = langResult;
  }
  
  results.push(result);
}

// Generar reporte
console.log('\n📊 REPORTE DE VALIDACIÓN\n');

let totalErrors = 0;
let totalWarnings = 0;
const postsWithErrors: string[] = [];
const postsWithWarnings: string[] = [];

for (const result of results) {
  let hasErrors = false;
  let hasWarnings = false;
  
  for (const locale of locales) {
    const lang = result.languages[locale];
    
    if (!lang.hasTranslation) {
      console.error(`❌ Post ${result.postId} [${locale}]: Sin traducción`);
      hasErrors = true;
      totalErrors++;
    }
    
    if (!lang.getPostContentWorks) {
      console.error(`❌ Post ${result.postId} [${locale}]: getPostContent no funciona`);
      hasErrors = true;
      totalErrors++;
    }
    
    if (!lang.findPostBySlugWorks) {
      console.error(`❌ Post ${result.postId} [${locale}]: findPostBySlug no funciona`);
      hasErrors = true;
      totalErrors++;
    }
    
    if (!lang.contentGenerated) {
      console.error(`❌ Post ${result.postId} [${locale}]: No se pudo generar contenido`);
      hasErrors = true;
      totalErrors++;
    }
    
    if (lang.hasSpanishText && locale !== 'es') {
      console.warn(`⚠️  Post ${result.postId} [${locale}]: Posible texto en español: ${lang.spanishWordsFound.join(', ')}`);
      hasWarnings = true;
      totalWarnings++;
    }
  }
  
  if (hasErrors) {
    postsWithErrors.push(result.postId);
  }
  
  if (hasWarnings) {
    postsWithWarnings.push(result.postId);
  }
}

// Resumen
console.log('\n' + '='.repeat(100));
console.log('📈 RESUMEN');
console.log('='.repeat(100));
console.log(`Total de posts en blogPosts: ${totalPosts}`);
console.log(`Total de posts verificados: ${results.length}`);
console.log(`Posts con errores: ${postsWithErrors.length}`);
console.log(`Posts con advertencias: ${postsWithWarnings.length}`);
console.log(`Total de errores: ${totalErrors}`);
console.log(`Total de advertencias: ${totalWarnings}`);

// Verificar que el número de posts coincida
if (results.length !== totalPosts) {
  console.warn(`\n⚠️  ADVERTENCIA: Se esperaban ${totalPosts} posts pero se verificaron ${results.length}`);
}

if (postsWithErrors.length > 0) {
  console.log(`\n❌ Posts con errores: ${postsWithErrors.join(', ')}`);
}

if (postsWithWarnings.length > 0) {
  console.log(`\n⚠️  Posts con advertencias: ${postsWithWarnings.join(', ')}`);
  console.log('   (Las advertencias pueden ser falsos positivos - palabras comunes en varios idiomas)');
}

// Verificar algunos posts específicos en detalle
console.log('\n' + '='.repeat(100));
console.log('🔍 VERIFICACIÓN DETALLADA DE POSTS ESPECÍFICOS');
console.log('='.repeat(100));

const specificPosts = ['2', '10', '25', '50', '69', '90', '97', '100'];
for (const postId of specificPosts) {
  const result = results.find(r => r.postId === postId);
  if (!result) continue;
  
  console.log(`\n📝 Post ${postId}: ${result.postTitle.substring(0, 60)}...`);
  console.log('-'.repeat(100));
  
  for (const locale of locales) {
    const lang = result.languages[locale];
    const status = lang.hasTranslation && lang.getPostContentWorks && lang.findPostBySlugWorks && lang.contentGenerated
      ? '✅' : '❌';
    
    console.log(`  ${status} ${locale.toUpperCase()}:`);
    console.log(`     Slug: ${lang.slug}`);
    console.log(`     Contenido: ${lang.contentLength} caracteres`);
    if (lang.hasSpanishText && locale !== 'es') {
      console.log(`     ⚠️  Palabras en español encontradas: ${lang.spanishWordsFound.join(', ')}`);
    }
  }
}

console.log('\n' + '='.repeat(100));

if (totalErrors === 0) {
  console.log('✅ ¡PERFECTO! Todos los posts están correctamente configurados.');
  console.log('   - Todas las traducciones están presentes');
  console.log('   - Todos los slugs funcionan correctamente');
  console.log('   - El contenido se genera correctamente en todos los idiomas');
  process.exit(0);
} else {
  console.log('❌ Se encontraron errores que deben corregirse.');
  process.exit(1);
}








