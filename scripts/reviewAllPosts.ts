import { blogPosts } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { getImageForPost } from '../utils/imageUtils';
import { getCategoryById } from '../data/blogPosts';

interface PostReview {
  postId: string;
  title: string;
  category: string;
  locale: string;
  issues: string[];
  contentLength: number;
  imageUrl: string | null;
  hasVenueInTitle: boolean;
  hasVenueInContent: boolean;
  imageMatchesVenue: boolean;
}

function countWords(text: string): number {
  // Remover tags HTML y contar solo palabras reales
  const textWithoutHtml = text.replace(/<[^>]+>/g, ' ');
  const words = textWithoutHtml.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

function reviewPost(post: typeof blogPosts[0], locale: 'es' | 'en' | 'fr' | 'pt'): PostReview {
  const content = post.content[locale] || post.content.es;
  const category = getCategoryById(post.category);
  const categoryName = category?.name || '';
  
  // Generar contenido
  const generatedContent = generatePostContent(post, locale);
  const contentLength = countWords(generatedContent);
  
  // Obtener imagen
  const imageUrl = getImageForPost(post.category, post.id, content.title, content.slug);
  
  // Detectar venues en título
  const titleLower = content.title.toLowerCase();
  const venueKeywords = ['mandala', 'vaquita', 'rakata', 'hof', 'dcave', 'santito', 'bagatelle', 'bonbonniere', 'themplo', 'vagalume', 'santa', 'señor frogs', 'chicabal'];
  const hasVenueInTitle = venueKeywords.some(v => titleLower.includes(v));
  
  // Detectar venues en contenido
  const contentLower = generatedContent.toLowerCase();
  const hasVenueInContent = venueKeywords.some(v => contentLower.includes(v));
  
  // Verificar si la imagen coincide con el venue del título
  let imageMatchesVenue = true;
  if (hasVenueInTitle && imageUrl) {
    const detectedVenue = venueKeywords.find(v => titleLower.includes(v));
    if (detectedVenue) {
      const venueInImage = imageUrl.toLowerCase().includes(detectedVenue.toLowerCase());
      imageMatchesVenue = venueInImage || detectedVenue === 'mandala'; // Mandala puede estar en cualquier imagen de Mandala
    }
  }
  
  // Detectar problemas
  const issues: string[] = [];
  
  // Verificar longitud mínima (800 palabras)
  if (contentLength < 800) {
    issues.push(`Contenido muy corto: ${contentLength} palabras (mínimo recomendado: 800)`);
  }
  
  // Verificar coherencia título-contenido
  if (hasVenueInTitle && !hasVenueInContent) {
    issues.push('El título menciona un venue pero el contenido no lo menciona');
  }
  
  // Verificar coherencia imagen-venue
  if (hasVenueInTitle && !imageMatchesVenue) {
    issues.push('La imagen no coincide con el venue mencionado en el título');
  }
  
  // Verificar que el contenido no sea genérico
  const genericPhrases = [
    'descubre méxico con mandalatickets',
    'la experiencia mandalatickets',
    'por qué elegir mandalatickets'
  ];
  const isTooGeneric = genericPhrases.every(phrase => contentLower.includes(phrase));
  if (isTooGeneric && contentLength < 1000) {
    issues.push('El contenido parece demasiado genérico y corto');
  }
  
  return {
    postId: post.id,
    title: content.title,
    category: categoryName,
    locale,
    issues,
    contentLength,
    imageUrl,
    hasVenueInTitle,
    hasVenueInContent,
    imageMatchesVenue
  };
}

function main() {
  const locales: Array<'es' | 'en' | 'fr' | 'pt'> = ['es', 'en', 'fr', 'pt'];
  const allReviews: PostReview[] = [];
  const postsWithIssues: PostReview[] = [];
  
  console.log('🔍 Revisando todos los posts...\n');
  
  for (const post of blogPosts) {
    for (const locale of locales) {
      const review = reviewPost(post, locale);
      allReviews.push(review);
      
      if (review.issues.length > 0) {
        postsWithIssues.push(review);
      }
    }
  }
  
  console.log(`✅ Revisión completada:\n`);
  console.log(`   Total de posts revisados: ${allReviews.length} (${blogPosts.length} posts × 4 idiomas)`);
  console.log(`   Posts con problemas: ${postsWithIssues.length}\n`);
  
  if (postsWithIssues.length > 0) {
    console.log('📋 POSTS CON PROBLEMAS:\n');
    
    // Agrupar por post ID
    const issuesByPost = new Map<string, PostReview[]>();
    for (const review of postsWithIssues) {
      if (!issuesByPost.has(review.postId)) {
        issuesByPost.set(review.postId, []);
      }
      issuesByPost.get(review.postId)!.push(review);
    }
    
    for (const [postId, reviews] of Array.from(issuesByPost.entries())) {
      const firstReview = reviews[0];
      console.log(`\n📌 Post ID: ${postId}`);
      console.log(`   Título (ES): ${firstReview.title}`);
      console.log(`   Categoría: ${firstReview.category}`);
      
      for (const review of reviews) {
        if (review.issues.length > 0) {
          console.log(`\n   🌐 ${review.locale.toUpperCase()}:`);
          for (const issue of review.issues) {
            console.log(`      ⚠️  ${issue}`);
          }
          console.log(`      📊 Longitud: ${review.contentLength} palabras`);
          console.log(`      🖼️  Imagen: ${review.imageUrl ? '✓' : '✗'}`);
        }
      }
    }
    
    // Estadísticas
    console.log('\n\n📊 ESTADÍSTICAS:\n');
    
    const shortContent = allReviews.filter(r => r.contentLength < 800).length;
    const venueMismatch = allReviews.filter(r => r.hasVenueInTitle && !r.imageMatchesVenue).length;
    const missingVenueInContent = allReviews.filter(r => r.hasVenueInTitle && !r.hasVenueInContent).length;
    
    console.log(`   Posts con contenido corto (<800 palabras): ${shortContent}`);
    console.log(`   Posts con imagen que no coincide con venue: ${venueMismatch}`);
    console.log(`   Posts con venue en título pero no en contenido: ${missingVenueInContent}`);
    
    const avgLength = allReviews.reduce((sum, r) => sum + r.contentLength, 0) / allReviews.length;
    console.log(`   Longitud promedio del contenido: ${Math.round(avgLength)} palabras`);
    
    const minLength = Math.min(...allReviews.map(r => r.contentLength));
    const maxLength = Math.max(...allReviews.map(r => r.contentLength));
    console.log(`   Rango de longitud: ${minLength} - ${maxLength} palabras`);
  } else {
    console.log('🎉 ¡Todos los posts están correctos!\n');
  }
}

main();

