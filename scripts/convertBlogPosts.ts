import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../data/blogPosts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Patrón para encontrar posts con estructura antigua
const oldPostPattern = /\{\s*id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"],\s*category:\s*([^,]+),\s*excerpt:\s*['"]([^'"]+)['"],\s*date:\s*['"]([^'"]+)['"],\s*author:\s*['"]([^'"]+)['"],\s*featured:\s*([^}]+)\s*\}/g;

let match;
let replacements: Array<{ old: string; new: string }> = [];

while ((match = oldPostPattern.exec(content)) !== null) {
  const [fullMatch, id, title, slug, category, excerpt, date, author, featured] = match;
  
  // Escapar comillas en title y excerpt
  const escapedTitle = title.replace(/'/g, "\\'");
  const escapedExcerpt = excerpt.replace(/'/g, "\\'");
  
  const newPost = `createBlogPost(
    '${id}',
    '${escapedTitle}',
    '${slug}',
    ${category.trim()},
    '${escapedExcerpt}',
    '${date}',
    '${author}',
    ${featured.trim()}
  )`;
  
  replacements.push({ old: fullMatch, new: newPost });
}

// Aplicar reemplazos en orden inverso para mantener las posiciones
replacements.reverse().forEach(({ old, new: newPost }) => {
  content = content.replace(old, newPost);
});

// Guardar el archivo convertido
fs.writeFileSync(filePath, content, 'utf8');
console.log(`Converted ${replacements.length} posts`);
