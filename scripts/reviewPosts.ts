import { blogPosts } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getImageForPost } from '../utils/imageUtils';
import { getCategoryById, getPostContent } from '../data/blogPosts';

interface PostReview {
  postId: string;
  title: string;
  slug: string;
  category: string;
  issues: string[];
  imageUrl: string | null;
  contentPreview: string;
  score: number; // 0-100
}

function reviewPost(post: typeof blogPosts[0], locale: 'es' | 'en' | 'fr' | 'pt' = 'es'): PostReview {
  const content = getPostContent(post, locale);
  const category = getCategoryById(post.category);
  const issues: string[] = [];
  let score = 100;

  // Generar contenido
  const generatedContent = generatePostContent(post, locale);
  
  // Obtener imagen asignada
  const imageUrl = post.image || getImageForPost(post.category, post.id, content.title, content.slug);
  
  // Verificar coherencia título-contenido
  const titleLower = content.title.toLowerCase();
  const contentLower = generatedContent.toLowerCase();
  
  // Detectar palabras clave del título
  const titleKeywords = extractKeywords(content.title);
  const contentKeywords = extractKeywords(generatedContent);
  
  // Verificar que las palabras clave del título aparezcan en el contenido
  const missingKeywords = titleKeywords.filter(kw => !contentLower.includes(kw.toLowerCase()));
  if (missingKeywords.length > 0) {
    issues.push(`⚠️ Palabras clave del título no aparecen en el contenido: ${missingKeywords.join(', ')}`);
    score -= 20;
  }
  
  // Verificar que el contenido sea específico (no genérico)
  const genericPhrases = [
    'exploramos los detalles más destacados',
    'descubre más contenido exclusivo',
    'nuestro equipo ha recopilado',
    'descubre con mandalatickets'
  ];
  
  const hasGenericContent = genericPhrases.some(phrase => contentLower.includes(phrase));
  if (hasGenericContent && titleKeywords.length > 0) {
    // Si tiene palabras clave específicas pero contenido genérico, es un problema
    const specificKeywords = titleKeywords.filter(kw => 
      ['mandala', 'dj', 'residente', 'vaquita', 'rakata', 'hof', 'dcave', 'santito', 
       'bagatelle', 'bonbonniere', 'themplo', 'vagalume', 'santa', 'señor frogs', 'chicabal'].includes(kw.toLowerCase())
    );
    if (specificKeywords.length > 0) {
      issues.push(`⚠️ Contenido demasiado genérico para un título con palabras clave específicas`);
      score -= 15;
    }
  }
  
  // Verificar coherencia imagen-título
  if (imageUrl) {
    const imagePath = imageUrl.toLowerCase();
    const imageVenue = extractVenueFromImage(imagePath);
    const titleVenue = extractVenueFromTitle(content.title);
    
    if (titleVenue && imageVenue && titleVenue !== imageVenue) {
      issues.push(`⚠️ Venue del título (${titleVenue}) no coincide con venue de la imagen (${imageVenue})`);
      score -= 25;
    }
    
    // Verificar que la imagen sea del destino correcto
    const imageDestination = extractDestinationFromImage(imagePath);
    const expectedDestination = getExpectedDestination(post.category);
    if (imageDestination && expectedDestination && imageDestination !== expectedDestination) {
      issues.push(`⚠️ Destino de la imagen (${imageDestination}) no coincide con categoría del post (${expectedDestination})`);
      score -= 15;
    }
  } else {
    issues.push(`❌ No se asignó imagen al post`);
    score -= 30;
  }
  
  // Verificar extensión del contenido (debe ser 800-1200 palabras)
  const wordCount = generatedContent.split(/\s+/).length;
  if (wordCount < 800) {
    issues.push(`⚠️ Contenido muy corto: ${wordCount} palabras (mínimo recomendado: 800)`);
    score -= 10;
  } else if (wordCount > 1500) {
    issues.push(`⚠️ Contenido muy largo: ${wordCount} palabras (máximo recomendado: 1200)`);
    score -= 5;
  }
  
  // Verificar que el contenido tenga estructura (H2, H3)
  const hasH2 = generatedContent.includes('<h2>');
  const hasH3 = generatedContent.includes('<h3>');
  if (!hasH2 || !hasH3) {
    issues.push(`⚠️ Contenido sin estructura adecuada (falta H2 o H3)`);
    score -= 5;
  }
  
  return {
    postId: post.id,
    title: content.title,
    slug: content.slug,
    category: category?.name || post.category,
    issues,
    imageUrl,
    contentPreview: generatedContent.substring(0, 200) + '...',
    score: Math.max(0, score)
  };
}

function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const lower = text.toLowerCase();
  
  // Venues
  const venues = ['mandala', 'mandala beach', 'vaquita', 'rakata', 'hof', 'dcave', 
                  'santito', 'bagatelle', 'bonbonniere', 'themplo', 'vagalume', 
                  'santa', 'señor frogs', 'chicabal'];
  venues.forEach(venue => {
    if (lower.includes(venue)) {
      keywords.push(venue);
    }
  });
  
  // Términos específicos
  const terms = ['dj residente', 'dj', 'entrevista', 'guía', 'consejos', 
                 'eventos', 'beach club', 'vida nocturna'];
  terms.forEach(term => {
    if (lower.includes(term)) {
      keywords.push(term);
    }
  });
  
  return keywords;
}

function extractVenueFromTitle(title: string): string | null {
  const lower = title.toLowerCase();
  const venues: Record<string, string> = {
    'mandala': 'MANDALA',
    'mandala beach': 'MANDALA',
    'vaquita': 'VAQUITA',
    'rakata': 'RAKATA',
    'hof': 'HOF',
    'dcave': 'Dcave',
    'santito': 'SANTITO',
    'bagatelle': 'BAGATELLE',
    'bonbonniere': 'BONBONNIERE',
    'themplo': 'TEHMPLO',
    'vagalume': 'VAGALUME',
    'santa': 'SANTA',
    'señor frogs': 'SEÑOR FROGS',
    'chicabal': 'CHICABAL'
  };
  
  for (const [key, value] of Object.entries(venues)) {
    if (lower.includes(key)) {
      return value;
    }
  }
  
  return null;
}

function extractVenueFromImage(imagePath: string): string | null {
  const parts = imagePath.split('/');
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i].toUpperCase();
    if (['MANDALA', 'VAQUITA', 'VAQUITAA', 'RAKATA', 'HOF', 'DCAVE', 'SANTITO',
         'BAGATELLE', 'BONBONNIERE', 'TEHMPLO', 'VAGALUME', 'SANTA', 
         'SEÑOR FROGS', 'CHICABAL', 'MB DAY', 'MB NIGHT'].includes(part)) {
      return part;
    }
  }
  return null;
}

function extractDestinationFromImage(imagePath: string): string | null {
  const parts = imagePath.split('/');
  for (const part of parts) {
    const upper = part.toUpperCase();
    if (['CUN', 'TULUM', 'PDC', 'CSL', 'VTA'].includes(upper)) {
      return upper;
    }
  }
  return null;
}

function getExpectedDestination(category: string): string | null {
  const map: Record<string, string> = {
    'cancun': 'CUN',
    'tulum': 'TULUM',
    'playa-del-carmen': 'PDC',
    'los-cabos': 'CSL',
    'puerto-vallarta': 'VTA',
    'general': null as any
  };
  return map[category] || null;
}

// Revisar todos los posts
console.log('🔍 REVISIÓN COMPLETA DE POSTS\n');
console.log('='.repeat(80));

const reviews: PostReview[] = [];
let totalScore = 0;
let postsWithIssues = 0;

blogPosts.forEach(post => {
  const review = reviewPost(post, 'es');
  reviews.push(review);
  totalScore += review.score;
  if (review.issues.length > 0) {
    postsWithIssues++;
  }
});

// Ordenar por score (peores primero)
reviews.sort((a, b) => a.score - b.score);

// Mostrar resumen
console.log(`\n📊 RESUMEN GENERAL:`);
console.log(`Total de posts: ${blogPosts.length}`);
console.log(`Posts con problemas: ${postsWithIssues}`);
console.log(`Score promedio: ${(totalScore / blogPosts.length).toFixed(1)}/100`);
console.log(`\n`);

// Mostrar posts con problemas
console.log(`\n⚠️ POSTS CON PROBLEMAS (ordenados por severidad):\n`);
reviews.filter(r => r.issues.length > 0).forEach((review, index) => {
  console.log(`${index + 1}. [Score: ${review.score}/100] Post ID: ${review.postId}`);
  console.log(`   Título: ${review.title}`);
  console.log(`   Categoría: ${review.category}`);
  console.log(`   Imagen: ${review.imageUrl || 'NO ASIGNADA'}`);
  console.log(`   Problemas:`);
  review.issues.forEach(issue => {
    console.log(`     ${issue}`);
  });
  console.log(`\n`);
});

// Mostrar los 10 peores
console.log(`\n🔴 TOP 10 POSTS CON MÁS PROBLEMAS:\n`);
reviews.slice(0, 10).forEach((review, index) => {
  console.log(`${index + 1}. [${review.score}/100] ${review.title}`);
  console.log(`   Issues: ${review.issues.length}`);
  review.issues.slice(0, 3).forEach(issue => {
    console.log(`   - ${issue}`);
  });
  console.log(``);
});

// Generar reporte detallado
const reportPath = './REVISION_POSTS_DETALLADA.md';
const fs = require('fs');
let report = '# 📋 REVISIÓN DETALLADA DE POSTS\n\n';
report += `**Fecha:** ${new Date().toLocaleDateString()}\n\n`;
report += `## 📊 Resumen General\n\n`;
report += `- Total de posts: ${blogPosts.length}\n`;
report += `- Posts con problemas: ${postsWithIssues}\n`;
report += `- Score promedio: ${(totalScore / blogPosts.length).toFixed(1)}/100\n\n`;
report += `## ⚠️ Posts con Problemas\n\n`;

reviews.filter(r => r.issues.length > 0).forEach((review, index) => {
  report += `### ${index + 1}. Post ID: ${review.postId} (Score: ${review.score}/100)\n\n`;
  report += `**Título:** ${review.title}\n\n`;
  report += `**Categoría:** ${review.category}\n\n`;
  report += `**Slug:** ${review.slug}\n\n`;
  report += `**Imagen:** ${review.imageUrl || 'NO ASIGNADA'}\n\n`;
  report += `**Problemas encontrados:**\n\n`;
  review.issues.forEach(issue => {
    report += `- ${issue}\n`;
  });
  report += `\n---\n\n`;
});

fs.writeFileSync(reportPath, report);
console.log(`\n✅ Reporte detallado guardado en: ${reportPath}`);

