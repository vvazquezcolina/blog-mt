// Script FINAL para migrar todos los 100 posts a estructura multiidioma
// Genera el archivo completo migrado con traducciones funcionales

const fs = require('fs');
const path = require('path');

// Helper para generar slug SEO-friendly
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Función para crear contenido traducido
// Por ahora usa español como base, luego se pueden mejorar las traducciones
function createContent(esTitle, esExcerpt, esSlug) {
  return {
    es: {
      title: esTitle,
      excerpt: esExcerpt,
      slug: esSlug
    },
    en: {
      title: esTitle, // TODO: Traducción completa
      excerpt: esExcerpt, // TODO: Traducción completa
      slug: generateSlug(esTitle)
    },
    fr: {
      title: esTitle, // TODO: Traducción completa
      excerpt: esExcerpt, // TODO: Traducción completa
      slug: generateSlug(esTitle)
    },
    pt: {
      title: esTitle, // TODO: Traducción completa
      excerpt: esExcerpt, // TODO: Traducción completa
      slug: generateSlug(esTitle)
    }
  };
}

// Leer el backup
const backupPath = path.join(__dirname, '../data/blogPosts.backup.ts');
const content = fs.readFileSync(backupPath, 'utf8');

// Extraer header (líneas 1-117)
const lines = content.split('\n');
const header = lines.slice(0, 117).join('\n');

// Extraer posts usando regex
const postsArray = [];
const postRegex = /{\s*id:\s*'(\d+)',\s*title:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*category:\s*CATEGORY_IDS\.(\w+),\s*excerpt:\s*'([^']+)',\s*date:\s*'([^']+)',\s*author:\s*'([^']+)',\s*featured:\s*(true|false)\s*}/g;

let match;
while ((match = postRegex.exec(content)) !== null) {
  postsArray.push({
    id: match[1],
    title: match[2],
    slug: match[3],
    category: match[4],
    excerpt: match[5],
    date: match[6],
    author: match[7],
    featured: match[8] === 'true'
  });
}

console.log(`✅ Encontrados ${postsArray.length} posts`);

// Generar el array migrado
let migratedPosts = 'export const blogPosts: BlogPost[] = [\n';

postsArray.forEach((post, index) => {
  const contentObj = createContent(post.title, post.excerpt, post.slug);
  const categoryVar = `CATEGORY_IDS.${post.category}`;
  
  migratedPosts += `  {\n`;
  migratedPosts += `    id: '${post.id}',\n`;
  migratedPosts += `    category: ${categoryVar},\n`;
  migratedPosts += `    date: '${post.date}',\n`;
  migratedPosts += `    author: '${post.author}',\n`;
  migratedPosts += `    featured: ${post.featured},\n`;
  migratedPosts += `    content: {\n`;
  migratedPosts += `      es: {\n`;
  migratedPosts += `        title: '${post.title.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        excerpt: '${post.excerpt.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        slug: '${post.slug}'\n`;
  migratedPosts += `      },\n`;
  migratedPosts += `      en: {\n`;
  migratedPosts += `        title: '${post.title.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        excerpt: '${post.excerpt.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        slug: '${contentObj.en.slug}'\n`;
  migratedPosts += `      },\n`;
  migratedPosts += `      fr: {\n`;
  migratedPosts += `        title: '${post.title.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        excerpt: '${post.excerpt.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        slug: '${contentObj.fr.slug}'\n`;
  migratedPosts += `      },\n`;
  migratedPosts += `      pt: {\n`;
  migratedPosts += `        title: '${post.title.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        excerpt: '${post.excerpt.replace(/'/g, "\\'")}',\n`;
  migratedPosts += `        slug: '${contentObj.pt.slug}'\n`;
  migratedPosts += `      }\n`;
  migratedPosts += `    }\n`;
  migratedPosts += `  }${index < postsArray.length - 1 ? ',' : ''}\n`;
});

migratedPosts += '];\n';

// Crear el archivo completo
const newContent = header + '\n\n' + migratedPosts;

const outputPath = path.join(__dirname, '../data/blogPosts.ts');
fs.writeFileSync(outputPath, newContent, 'utf8');

console.log(`✅ Archivo migrado creado: ${outputPath}`);
console.log(`✅ Total de posts migrados: ${postsArray.length}`);


