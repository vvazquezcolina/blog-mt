import { MetadataRoute } from 'next';
import { blogPosts, categories, getPostContent } from '@/data/blogPosts';
import { locales } from '@/i18n/config';

/**
 * Genera el sitemap.xml dinámico para el sitio
 * Incluye todas las páginas: home, categorías, listados y posts individuales
 * Cada página incluye información de idiomas alternativos (hreflang)
 * Prioridades y frecuencias de actualización optimizadas para SEO
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';
  const currentDate = new Date().toISOString();

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Páginas principales por idioma (home)
  locales.forEach((locale) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}`])
        ),
      },
    });
  });

  // Página de todas las categorías por idioma
  locales.forEach((locale) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/categorias`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/categorias`])
        ),
      },
    });
  });

  // Páginas de categorías individuales por idioma
  categories.forEach((category) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/categorias/${category.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [loc, `${baseUrl}/${loc}/categorias/${category.id}`])
          ),
        },
      });
    });
  });

  // Página de todos los posts por idioma
  locales.forEach((locale) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/posts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/posts`])
        ),
      },
    });
  });

  // Páginas individuales de posts por idioma
  blogPosts.forEach((post) => {
    locales.forEach((locale) => {
      const content = getPostContent(post, locale);
      const postDate = new Date(post.date);
      
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/posts/${content.slug}`,
        lastModified: postDate.toISOString(),
        changeFrequency: 'monthly',
        priority: post.featured ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => {
              const locContent = getPostContent(post, loc);
              return [loc, `${baseUrl}/${loc}/posts/${locContent.slug}`];
            })
          ),
        },
      });
    });
  });

  return sitemapEntries;
}
