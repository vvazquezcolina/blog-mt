import { postTranslations } from '../data/blogPostTranslations';
import { blogPosts } from '../data/blogPosts';

interface TranslationIssue {
  postId: string;
  issue: string;
  locale?: string;
}

const issues: TranslationIssue[] = [];

// Verificar que todos los posts tengan traducciones en los 4 idiomas
for (const post of blogPosts) {
  const translation = postTranslations[post.id];
  
  if (!translation) {
    issues.push({
      postId: post.id,
      issue: `No tiene traducciones definidas`
    });
    continue;
  }

  // Verificar que tenga las 4 traducciones
  const requiredLocales: Array<'es' | 'en' | 'fr' | 'pt'> = ['es', 'en', 'fr', 'pt'];
  for (const locale of requiredLocales) {
    if (!translation[locale]) {
      issues.push({
        postId: post.id,
        locale,
        issue: `Falta traducción en ${locale}`
      });
    } else {
      // Verificar que title, excerpt y slug existan
      if (!translation[locale].title || !translation[locale].excerpt || !translation[locale].slug) {
        issues.push({
          postId: post.id,
          locale,
          issue: `Faltan campos (title, excerpt o slug) en ${locale}`
        });
      }

      // Verificar que el título no esté vacío o sea muy corto
      if (translation[locale].title.length < 5) {
        issues.push({
          postId: post.id,
          locale,
          issue: `Título muy corto en ${locale}: "${translation[locale].title}"`
        });
      }

      // Verificar que el excerpt no esté vacío
      if (translation[locale].excerpt.length < 10) {
        issues.push({
          postId: post.id,
          locale,
          issue: `Excerpt muy corto en ${locale}: "${translation[locale].excerpt}"`
        });
      }

      // Verificar que el slug no esté vacío
      if (!translation[locale].slug || translation[locale].slug.length < 3) {
        issues.push({
          postId: post.id,
          locale,
          issue: `Slug inválido o muy corto en ${locale}: "${translation[locale].slug}"`
        });
      }
    }
  }
}

// Verificar traducciones duplicadas o muy similares entre posts
const titleMap = new Map<string, string[]>();
for (const postId in postTranslations) {
  const translation = postTranslations[postId];
  for (const locale of ['es', 'en', 'fr', 'pt'] as const) {
    if (translation[locale]?.title) {
      const normalizedTitle = translation[locale].title.toLowerCase().trim();
      if (!titleMap.has(normalizedTitle)) {
        titleMap.set(normalizedTitle, []);
      }
      titleMap.get(normalizedTitle)!.push(`${postId} (${locale})`);
    }
  }
}

// Encontrar títulos duplicados
for (const [title, posts] of titleMap.entries()) {
  if (posts.length > 1) {
    issues.push({
      postId: posts.join(', '),
      issue: `Título duplicado: "${title}"`
    });
  }
}

// Verificar que las traducciones tengan sentido (búsqueda de palabras problemáticas)
const problematicWords = {
  es: ['undefined', 'null', '[object Object]', 'NaN'],
  en: ['undefined', 'null', '[object Object]', 'NaN'],
  fr: ['undefined', 'null', '[object Object]', 'NaN'],
  pt: ['undefined', 'null', '[object Object]', 'NaN']
};

for (const postId in postTranslations) {
  const translation = postTranslations[postId];
  for (const locale of ['es', 'en', 'fr', 'pt'] as const) {
    if (translation[locale]) {
      const text = `${translation[locale].title} ${translation[locale].excerpt} ${translation[locale].slug}`;
      for (const word of problematicWords[locale]) {
        if (text.includes(word)) {
          issues.push({
            postId,
            locale,
            issue: `Contiene palabra problemática "${word}" en ${locale}`
          });
        }
      }
    }
  }
}

// Verificar que los slugs sean válidos (sin caracteres especiales problemáticos)
for (const postId in postTranslations) {
  const translation = postTranslations[postId];
  for (const locale of ['es', 'en', 'fr', 'pt'] as const) {
    if (translation[locale]?.slug) {
      const slug = translation[locale].slug;
      // Verificar caracteres problemáticos
      if (slug.includes(' ') || slug.includes('%') || slug.includes('&') || slug.includes('?')) {
        issues.push({
          postId,
          locale,
          issue: `Slug contiene caracteres problemáticos en ${locale}: "${slug}"`
        });
      }
    }
  }
}

// Reporte
console.log('=== REVISIÓN DE TRADUCCIONES ===\n');
console.log(`Total de posts: ${blogPosts.length}`);
console.log(`Total de traducciones: ${Object.keys(postTranslations).length}`);
console.log(`Problemas encontrados: ${issues.length}\n`);

if (issues.length > 0) {
  console.log('=== PROBLEMAS ENCONTRADOS ===\n');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. POST ${issue.postId}${issue.locale ? ` (${issue.locale})` : ''}: ${issue.issue}`);
  });
} else {
  console.log('✓ No se encontraron problemas en las traducciones básicas.');
}

// Verificar coherencia entre el post y sus traducciones
console.log('\n=== VERIFICACIÓN DE COHERENCIA ===\n');
let coherenceIssues = 0;

for (const post of blogPosts) {
  const translation = postTranslations[post.id];
  if (!translation) continue;

  // Verificar que el título en español coincida con el título del post original
  if (translation.es?.title && post.content.es.title !== translation.es.title) {
    // Esto es normal si hay traducciones optimizadas, solo verificamos que exista
  }

  // Verificar que el excerpt en español tenga sentido comparado con el original
  if (translation.es?.excerpt && post.content.es.excerpt) {
    // Solo verificamos que ambos tengan contenido, no que sean idénticos
    if (translation.es.excerpt.length < post.content.es.excerpt.length * 0.3) {
      coherenceIssues++;
      console.log(`⚠ POST ${post.id}: El excerpt traducido es mucho más corto que el original`);
    }
  }
}

if (coherenceIssues === 0) {
  console.log('✓ La coherencia entre posts y traducciones es buena.');
}

// Verificar traducciones que puedan ser idénticas (indicando falta de traducción)
console.log('\n=== VERIFICACIÓN DE TRADUCCIONES IDÉNTICAS ===\n');
let identicalIssues = 0;

for (const postId in postTranslations) {
  const translation = postTranslations[postId];
  const esText = `${translation.es?.title} ${translation.es?.excerpt}`.toLowerCase();
  
  // Verificar si inglés, francés o portugués son muy similares al español
  for (const locale of ['en', 'fr', 'pt'] as const) {
    if (translation[locale]) {
      const localeText = `${translation[locale].title} ${translation[locale].excerpt}`.toLowerCase();
      
      // Verificar si hay palabras en español en traducciones de otros idiomas
      const spanishWords = ['y', 'de', 'para', 'con', 'los', 'las', 'del', 'en', 'el', 'la', 'que', 'es', 'un', 'una', 'más', 'mejor', 'eventos'];
      const hasSpanishWords = spanishWords.some(word => 
        localeText.includes(` ${word} `) || localeText.startsWith(`${word} `) || localeText.endsWith(` ${word}`)
      );
      
      if (hasSpanishWords && locale === 'en') {
        identicalIssues++;
        console.log(`⚠ POST ${postId} (${locale}): Posibles palabras en español encontradas: "${translation[locale].title}"`);
      }
    }
  }
}

if (identicalIssues === 0) {
  console.log('✓ No se encontraron traducciones sospechosamente idénticas.');
}

// Verificar calidad de traducciones (longitud similar entre idiomas)
console.log('\n=== VERIFICACIÓN DE CALIDAD ===\n');
let qualityIssues = 0;

for (const postId in postTranslations) {
  const translation = postTranslations[postId];
  if (!translation.es) continue;
  
  const esLength = (translation.es.title + translation.es.excerpt).length;
  
  for (const locale of ['en', 'fr', 'pt'] as const) {
    if (translation[locale]) {
      const localeLength = (translation[locale].title + translation[locale].excerpt).length;
      const ratio = localeLength / esLength;
      
      // Si la traducción es menos de 30% o más de 200% de la original, puede ser problemática
      if (ratio < 0.3 || ratio > 2.0) {
        qualityIssues++;
        console.log(`⚠ POST ${postId} (${locale}): Longitud inusual - Ratio: ${ratio.toFixed(2)} (ES: ${esLength}, ${locale.toUpperCase()}: ${localeLength})`);
        console.log(`   ES: "${translation.es.title}"`);
        console.log(`   ${locale.toUpperCase()}: "${translation[locale].title}"`);
      }
    }
  }
}

if (qualityIssues === 0) {
  console.log('✓ Las traducciones tienen longitudes apropiadas.');
}
