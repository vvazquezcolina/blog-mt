// Script para validar todas las traducciones de los posts
import { postTranslations } from '../data/blogPostTranslations';
import { blogPosts } from '../data/blogPosts';
import { getPostContent } from '../data/blogPosts';
import { generateSEOSlug } from '../data/blogPostTranslations';

const locales: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];

interface ValidationError {
  postId: string;
  locale?: string;
  field?: string;
  error: string;
}

const errors: ValidationError[] = [];
const warnings: ValidationError[] = [];

console.log('🔍 Iniciando validación de traducciones...\n');

// 1. Verificar que todos los posts tengan traducciones
console.log('1️⃣ Verificando que todos los posts tengan traducciones...');
for (let i = 1; i <= 100; i++) {
  const postId = i.toString();
  const post = blogPosts.find(p => p.id === postId);
  
  if (!post) {
    errors.push({
      postId,
      error: `Post ${postId} no existe en blogPosts`
    });
    continue;
  }
  
  const translation = postTranslations[postId];
  
  if (!translation) {
    errors.push({
      postId,
      error: `Post ${postId} no tiene traducciones en postTranslations`
    });
    continue;
  }
  
  // Verificar que tenga los 4 idiomas
  for (const locale of locales) {
    if (!translation[locale]) {
      errors.push({
        postId,
        locale,
        error: `Falta traducción para ${locale}`
      });
      continue;
    }
    
    const trans = translation[locale];
    
    // Verificar que tenga título
    if (!trans.title || trans.title.trim() === '') {
      errors.push({
        postId,
        locale,
        field: 'title',
        error: 'Título vacío o faltante'
      });
    }
    
    // Verificar que tenga excerpt
    if (!trans.excerpt || trans.excerpt.trim() === '') {
      errors.push({
        postId,
        locale,
        field: 'excerpt',
        error: 'Excerpt vacío o faltante'
      });
    }
    
    // Verificar que tenga slug
    if (!trans.slug || trans.slug.trim() === '') {
      errors.push({
        postId,
        locale,
        field: 'slug',
        error: 'Slug vacío o faltante'
      });
    }
    
    // Verificar que el slug sea SEO-friendly (sin caracteres especiales, solo guiones)
    if (trans.slug && !/^[a-z0-9-]+$/.test(trans.slug)) {
      errors.push({
        postId,
        locale,
        field: 'slug',
        error: `Slug contiene caracteres inválidos: ${trans.slug}`
      });
    }
    
    // Verificar que el slug no termine ni empiece con guión
    if (trans.slug && (trans.slug.startsWith('-') || trans.slug.endsWith('-'))) {
      errors.push({
        postId,
        locale,
        field: 'slug',
        error: `Slug no debe empezar ni terminar con guión: ${trans.slug}`
      });
    }
    
    // Verificar que el slug generado coincida con el slug almacenado
    const expectedSlug = generateSEOSlug(trans.title, locale);
    if (trans.slug !== expectedSlug) {
      warnings.push({
        postId,
        locale,
        field: 'slug',
        error: `Slug no coincide con el generado. Esperado: ${expectedSlug}, Actual: ${trans.slug}`
      });
    }
  }
}

// 2. Verificar que los slugs sean únicos por idioma
console.log('2️⃣ Verificando unicidad de slugs por idioma...');
for (const locale of locales) {
  const slugs = new Map<string, string>();
  
  for (let i = 1; i <= 100; i++) {
    const postId = i.toString();
    const translation = postTranslations[postId];
    
    if (translation && translation[locale]) {
      const slug = translation[locale].slug;
      
      if (slugs.has(slug)) {
        errors.push({
          postId,
          locale,
          field: 'slug',
          error: `Slug duplicado: ${slug} (también usado en post ${slugs.get(slug)})`
        });
      } else {
        slugs.set(slug, postId);
      }
    }
  }
}

// 3. Verificar que getPostContent funcione correctamente
console.log('3️⃣ Verificando que getPostContent funcione correctamente...');
for (let i = 1; i <= 100; i++) {
  const postId = i.toString();
  const post = blogPosts.find(p => p.id === postId);
  
  if (!post) continue;
  
  for (const locale of locales) {
    const content = getPostContent(post, locale);
    
    if (!content) {
      errors.push({
        postId,
        locale,
        error: 'getPostContent retornó undefined'
      });
      continue;
    }
    
    if (!content.title || content.title.trim() === '') {
      errors.push({
        postId,
        locale,
        error: 'getPostContent retornó título vacío'
      });
    }
    
    if (!content.slug || content.slug.trim() === '') {
      errors.push({
        postId,
        locale,
        error: 'getPostContent retornó slug vacío'
      });
    }
    
    // Verificar que el slug del contenido coincida con la traducción
    const translation = postTranslations[postId];
    if (translation && translation[locale]) {
      if (content.slug !== translation[locale].slug) {
        errors.push({
          postId,
          locale,
          error: `Slug de getPostContent no coincide con traducción. Esperado: ${translation[locale].slug}, Actual: ${content.slug}`
        });
      }
    }
  }
}

// 4. Verificar algunos posts específicos en detalle
console.log('4️⃣ Verificando posts específicos en detalle...');
const specificPosts = ['1', '2', '3', '10', '25', '50', '75', '100'];
for (const postId of specificPosts) {
  const post = blogPosts.find(p => p.id === postId);
  const translation = postTranslations[postId];
  
  if (!post || !translation) continue;
  
  console.log(`\n  📝 Post ${postId}: ${post.content.es.title}`);
  
  for (const locale of locales) {
    const trans = translation[locale];
    const content = getPostContent(post, locale);
    
    console.log(`    ${locale.toUpperCase()}:`);
    console.log(`      Título: ${trans.title}`);
    console.log(`      Slug: ${trans.slug}`);
    console.log(`      getPostContent slug: ${content.slug}`);
    
    if (trans.slug !== content.slug) {
      errors.push({
        postId,
        locale,
        error: `Inconsistencia entre traducción y getPostContent`
      });
    }
  }
}

// 5. Verificar que no haya texto en español en traducciones de otros idiomas
console.log('\n5️⃣ Verificando que no haya texto en español en otras traducciones...');
const spanishWords = ['los', 'las', 'del', 'para', 'con', 'que', 'una', 'este', 'esta', 'estos', 'estas'];
for (let i = 1; i <= 100; i++) {
  const postId = i.toString();
  const translation = postTranslations[postId];
  
  if (!translation) continue;
  
  for (const locale of ['en', 'fr', 'pt'] as const) {
    const trans = translation[locale];
    
    if (!trans) continue;
    
    // Verificar título
    const titleLower = trans.title.toLowerCase();
    for (const word of spanishWords) {
      if (titleLower.includes(` ${word} `) || titleLower.startsWith(`${word} `) || titleLower.endsWith(` ${word}`)) {
        warnings.push({
          postId,
          locale,
          field: 'title',
          error: `Posible palabra en español en título: "${word}" en "${trans.title}"`
        });
      }
    }
    
    // Verificar excerpt
    const excerptLower = trans.excerpt.toLowerCase();
    for (const word of spanishWords) {
      if (excerptLower.includes(` ${word} `) || excerptLower.startsWith(`${word} `) || excerptLower.endsWith(` ${word}`)) {
        warnings.push({
          postId,
          locale,
          field: 'excerpt',
          error: `Posible palabra en español en excerpt: "${word}" en "${trans.excerpt}"`
        });
      }
    }
  }
}

// Reporte final
console.log('\n' + '='.repeat(80));
console.log('📊 REPORTE DE VALIDACIÓN');
console.log('='.repeat(80));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ ¡Perfecto! Todas las traducciones están correctas.');
  console.log(`   - 100 posts verificados`);
  console.log(`   - 4 idiomas por post (400 traducciones totales)`);
  console.log(`   - 0 errores encontrados`);
  console.log(`   - 0 advertencias encontradas`);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ERRORES ENCONTRADOS: ${errors.length}`);
    console.log('\nErrores críticos:');
    errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. Post ${err.postId}${err.locale ? ` [${err.locale}]` : ''}${err.field ? ` (${err.field})` : ''}: ${err.error}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ADVERTENCIAS: ${warnings.length}`);
    console.log('\nAdvertencias (revisar manualmente):');
    warnings.forEach((warn, idx) => {
      console.log(`  ${idx + 1}. Post ${warn.postId}${warn.locale ? ` [${warn.locale}]` : ''}${warn.field ? ` (${warn.field})` : ''}: ${warn.error}`);
    });
  }
}

console.log('\n' + '='.repeat(80));

// Exit code
if (errors.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
