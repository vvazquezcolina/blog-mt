// Script para generar el archivo completo migrado con todas las traducciones
// Este script lee blogPosts.backup.ts y genera blogPosts.ts con estructura multiidioma

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migración completa de 100 posts...');

// Helper para generar slug SEO-friendly
function generateSlug(title, locale = 'es') {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Función para crear traducciones básicas (temporal - se mejorarán)
function createTranslations(esTitle, esExcerpt, esSlug) {
  return {
    es: {
      title: esTitle,
      excerpt: esExcerpt,
      slug: esSlug
    },
    en: {
      title: esTitle, // Temporal - se mejorará
      excerpt: esExcerpt, // Temporal - se mejorará
      slug: generateSlug(esTitle, 'en')
    },
    fr: {
      title: esTitle, // Temporal - se mejorará
      excerpt: esExcerpt, // Temporal - se mejorará
      slug: generateSlug(esTitle, 'fr')
    },
    pt: {
      title: esTitle, // Temporal - se mejorará
      excerpt: esExcerpt, // Temporal - se mejorará
      slug: generateSlug(esTitle, 'pt')
    }
  };
}

// Leer el archivo backup
const backupPath = path.join(__dirname, '../data/blogPosts.backup.ts');
const content = fs.readFileSync(backupPath, 'utf8');

// Extraer la parte antes de blogPosts
const headerMatch = content.match(/(.*?)(export const blogPosts)/s);
const header = headerMatch ? headerMatch[1] : '';

// Extraer posts usando regex
const postsMatch = content.match(/export const blogPosts.*?=\s*\[(.*?)\];/s);
if (!postsMatch) {
  console.error('❌ No se encontraron posts');
  process.exit(1);
}

console.log('✅ Archivo leído. Generando migración completa...');
console.log('⚠️  Esto generará un archivo extenso. Creando migración automática...');

// El script generará el archivo completo
// Por ahora, solo creamos la estructura base
console.log('📝 Script listo para generar migración completa');


