import { NextResponse } from 'next/server';
import { blogPosts, getPostContent, getCategoryById } from '@/data/blogPosts';
import { locales } from '@/i18n/config';

/**
 * API endpoint que proporciona un índice estructurado de todo el contenido del blog
 * Optimizado para motores generativos de IA (GEO - Generative Engine Optimization)
 * Formato JSON fácil de parsear por LLMs
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';
  
  const contentIndex = {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name: 'MandalaTickets Blog Content Index',
    description: 'Structured index of all blog posts for AI and LLM consumption',
    url: `${baseUrl}/api/content-index`,
    numberOfItems: blogPosts.length,
    itemListElement: blogPosts.map((post, index) => {
      const category = getCategoryById(post.category);
      
      // Extraer keywords del título
      const extractKeywords = (title: string): string[] => {
        const titleLower = title.toLowerCase();
        const keywords: string[] = [];
        
        const commonKeywords = [
          'eventos', 'events', 'fiestas', 'parties', 'vida nocturna', 'nightlife',
          'beach club', 'cancún', 'cancun', 'tulum', 'playa del carmen',
          'los cabos', 'puerto vallarta', 'mandalatickets', 'guía', 'guide',
          'consejos', 'tips', 'entrevista', 'interview'
        ];
        
        commonKeywords.forEach(kw => {
          if (titleLower.includes(kw.toLowerCase())) {
            keywords.push(kw);
          }
        });
        
        if (category) keywords.push(category.name);
        
        return [...new Set(keywords)];
      };
      
      // Detectar tipo de contenido
      const detectContentType = (title: string): string => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('entrevista') || titleLower.includes('interview')) return 'interview';
        if (titleLower.includes('guía') || titleLower.includes('guide')) return 'guide';
        if (titleLower.includes('consejo') || titleLower.includes('tip')) return 'tips';
        if (titleLower.includes('promoción') || titleLower.includes('promotion')) return 'promotion';
        if (titleLower.includes('historia') || titleLower.includes('history')) return 'history';
        return 'article';
      };
      
      // Crear objeto con todas las traducciones
      const translations: Record<string, {
        title: string;
        excerpt: string;
        slug: string;
        url: string;
        keywords: string[];
        contentType: string;
      }> = {};
      
      locales.forEach(locale => {
        const content = getPostContent(post, locale);
        if (!content || !content.title || !content.slug) {
          // Si no hay contenido válido, usar el contenido en español como fallback
          const fallbackContent = getPostContent(post, 'es');
          translations[locale] = {
            title: fallbackContent?.title || post.content.es.title,
            excerpt: fallbackContent?.excerpt || post.content.es.excerpt,
            slug: fallbackContent?.slug || post.content.es.slug,
            url: `${baseUrl}/${locale}/posts/${fallbackContent?.slug || post.content.es.slug}`,
            keywords: extractKeywords(fallbackContent?.title || post.content.es.title),
            contentType: detectContentType(fallbackContent?.title || post.content.es.title),
          };
        } else {
          translations[locale] = {
            title: content.title,
            excerpt: content.excerpt,
            slug: content.slug,
            url: `${baseUrl}/${locale}/posts/${content.slug}`,
            keywords: extractKeywords(content.title),
            contentType: detectContentType(content.title),
          };
        }
      });
      
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          identifier: post.id,
          category: category ? {
            '@type': 'Thing',
            name: category.name,
            description: category.description,
            identifier: category.id,
          } : undefined,
          datePublished: post.date,
          author: {
            '@type': 'Organization',
            name: post.author,
          },
          featured: post.featured,
          translations: translations,
          mainEntity: {
            '@type': 'Place',
            name: category?.name || 'México',
            description: category?.description || '',
          },
        },
      };
    }),
    metadata: {
      totalPosts: blogPosts.length,
      totalLanguages: locales.length,
      categories: blogPosts.reduce((acc, post) => {
        const category = getCategoryById(post.category);
        if (category && !acc.find(c => c.id === category.id)) {
          acc.push({
            id: category.id,
            name: category.name,
            description: category.description,
          });
        }
        return acc;
      }, [] as Array<{ id: string; name: string; description: string }>),
      lastUpdated: new Date().toISOString(),
    },
  };
  
  return NextResponse.json(contentIndex, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}







