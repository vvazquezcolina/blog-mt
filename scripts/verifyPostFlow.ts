// Script para verificar el flujo completo de un post específico
import { blogPosts, getPostContent, findPostBySlug } from '../data/blogPosts';
import { postTranslations } from '../data/blogPostTranslations';
import { generatePostContent } from '../utils/contentGenerator';

const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];

// Verificar el post 2 específicamente (el que el usuario mencionó)
console.log('🔍 Verificando Post 2 (Tulum) en detalle...\n');

const postId = '2';
const post = blogPosts.find(p => p.id === postId);

if (!post) {
  console.error('❌ Post 2 no encontrado');
  process.exit(1);
}

const translation = postTranslations[postId];

if (!translation) {
  console.error('❌ Traducciones del Post 2 no encontradas');
  process.exit(1);
}

console.log('📝 POST 2: Guía completa para disfrutar de Tulum\n');
console.log('='.repeat(80));

for (const locale of locales) {
  console.log(`\n🌐 IDIOMA: ${locale.toUpperCase()}`);
  console.log('-'.repeat(80));
  
  // 1. Verificar traducción
  const trans = translation[locale];
  if (!trans) {
    console.error(`  ❌ No hay traducción para ${locale}`);
    continue;
  }
  
  console.log(`  ✅ Traducción encontrada`);
  console.log(`     Título: ${trans.title}`);
  console.log(`     Excerpt: ${trans.excerpt.substring(0, 80)}...`);
  console.log(`     Slug: ${trans.slug}`);
  
  // 2. Verificar getPostContent
  const content = getPostContent(post, locale);
  if (!content) {
    console.error(`  ❌ getPostContent retornó undefined`);
    continue;
  }
  
  console.log(`  ✅ getPostContent funciona`);
  console.log(`     Título: ${content.title}`);
  console.log(`     Slug: ${content.slug}`);
  
  if (content.slug !== trans.slug) {
    console.error(`  ❌ Slug no coincide! Esperado: ${trans.slug}, Actual: ${content.slug}`);
  } else {
    console.log(`  ✅ Slug coincide correctamente`);
  }
  
  // 3. Verificar findPostBySlug
  const foundPost = findPostBySlug(trans.slug, locale);
  if (!foundPost) {
    console.error(`  ❌ findPostBySlug no encontró el post con slug: ${trans.slug}`);
  } else if (foundPost.id !== postId) {
    console.error(`  ❌ findPostBySlug encontró el post incorrecto: ${foundPost.id} en lugar de ${postId}`);
  } else {
    console.log(`  ✅ findPostBySlug funciona correctamente`);
  }
  
  // 4. Verificar generador de contenido
  try {
    const generatedContent = generatePostContent(post, locale);
    if (!generatedContent || generatedContent.trim() === '') {
      console.error(`  ❌ generatePostContent retornó contenido vacío`);
    } else {
      console.log(`  ✅ generatePostContent funciona`);
      console.log(`     Longitud del contenido: ${generatedContent.length} caracteres`);
      
      // Verificar que no haya texto en español en otros idiomas
      if (locale !== 'es') {
        const spanishWords = ['los', 'las', 'del', 'para', 'con', 'que', 'una', 'este', 'esta'];
        const contentLower = generatedContent.toLowerCase();
        let foundSpanish = false;
        
        for (const word of spanishWords) {
          if (contentLower.includes(` ${word} `) || contentLower.includes(` ${word}.`) || contentLower.includes(` ${word},`)) {
            console.warn(`  ⚠️  Posible palabra en español encontrada: "${word}"`);
            foundSpanish = true;
          }
        }
        
        if (!foundSpanish) {
          console.log(`  ✅ No se encontró texto en español en el contenido`);
        }
      }
    }
  } catch (error) {
    console.error(`  ❌ Error al generar contenido: ${error}`);
  }
  
  // 5. Verificar URL esperada
  const expectedUrl = `/${locale}/posts/${trans.slug}`;
  console.log(`  📍 URL esperada: ${expectedUrl}`);
}

console.log('\n' + '='.repeat(80));
console.log('✅ Verificación del Post 2 completada\n');

// Verificar otros posts importantes
const importantPosts = ['1', '3', '10', '25', '50', '69', '90', '97', '100'];
console.log('🔍 Verificando otros posts importantes...\n');

for (const id of importantPosts) {
  const p = blogPosts.find(post => post.id === id);
  const t = postTranslations[id];
  
  if (!p || !t) {
    console.error(`❌ Post ${id} no encontrado o sin traducciones`);
    continue;
  }
  
  let allOk = true;
  for (const locale of locales) {
    if (!t[locale]) {
      console.error(`❌ Post ${id} falta traducción para ${locale}`);
      allOk = false;
      break;
    }
    
    const content = getPostContent(p, locale);
    if (!content || content.slug !== t[locale].slug) {
      console.error(`❌ Post ${id} problema con getPostContent para ${locale}`);
      allOk = false;
      break;
    }
  }
  
  if (allOk) {
    console.log(`✅ Post ${id}: ${p.content.es.title.substring(0, 50)}... - OK`);
  }
}

console.log('\n✅ Verificación completa\n');








