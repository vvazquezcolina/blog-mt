import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostTracker from '@/components/PostTracker';
import CTAButton from '@/components/CTAButton';
import StickyCTA from '@/components/StickyCTA';
import { blogPosts, getCategoryById, getPostContent, findPostBySlug } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/i18n';
import { locales } from '@/i18n/config';
import { getImageForPost, getMultipleImagesForPost, generateImageAltText, generateImageTitle } from '@/utils/imageUtils';
import { generatePostContent } from '@/utils/contentGenerator';
import { getMandalaTicketsUrl } from '@/utils/urlUtils';
import type { Metadata } from 'next';

interface PostPageProps {
  params?: Promise<{
    locale: Locale;
    slug: string;
  }> | {
    locale: Locale;
    slug: string;
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  locales.forEach((locale) => {
    blogPosts.forEach((post) => {
      const content = getPostContent(post, locale);
      params.push({ locale, slug: content.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  if (!params) {
    throw new Error('Params are required');
  }
  const resolvedParams = params instanceof Promise ? await params : params;
  if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
    throw new Error('Locale and slug parameters are required');
  }
  const locale = resolvedParams.locale || 'es';
  const t = getTranslations(locale);
  const post = findPostBySlug(resolvedParams.slug, locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  if (!post) {
    return {
      title: t.notFound.heading,
      description: t.notFound.message,
    };
  }

  const content = getPostContent(post, locale);
  const category = getCategoryById(post.category);
  const postUrl = `${baseUrl}/${locale}/posts/${content.slug}`;
  
  // Obtener la imagen del post para metadata
  const imageUrl = post.image || getImageForPost(post.category, post.id, content.title, content.slug);
  const imageAlt = imageUrl 
    ? generateImageAltText(imageUrl, content.title, category?.name)
    : content.title;
  
  // Construir URL completa de la imagen para Open Graph
  const fullImageUrl = imageUrl 
    ? imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${imageUrl}`
    : undefined;
  
  // Generate alternate links for all locales
  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    const locContent = getPostContent(post, loc);
    alternates.languages[loc] = `${baseUrl}/${loc}/posts/${locContent.slug}`;
  });

  return {
    title: `${content.title} | ${t.metadata.siteName}`,
    description: content.excerpt || t.metadata.post.defaultDescription,
    alternates: {
      canonical: postUrl,
      languages: alternates.languages,
    },
    openGraph: {
      title: content.title,
      description: content.excerpt || t.metadata.post.defaultDescription,
      siteName: t.metadata.siteName,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale) as string[],
      type: 'article',
      url: postUrl,
      publishedTime: post.date,
      authors: [post.author],
      ...(category && {
        section: category.name,
      }),
      ...(fullImageUrl && {
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: imageAlt,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.excerpt || t.metadata.post.defaultDescription,
      ...(fullImageUrl && {
        images: [fullImageUrl],
      }),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  if (!params) {
    notFound();
  }
  const resolvedParams = params instanceof Promise ? await params : params;
  if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
    notFound();
  }
  const t = getTranslations(resolvedParams.locale);
  const post = findPostBySlug(resolvedParams.slug, resolvedParams.locale);
  
  if (!post) {
    notFound();
  }

  const content = getPostContent(post, resolvedParams.locale);
  const category = getCategoryById(post.category);
  
  // Generar contenido completo si no existe
  const postBody = content.body || generatePostContent(post, resolvedParams.locale);
  
  let imageUrl = post.image || getImageForPost(post.category, post.id, content.title, content.slug);
  
  // Si no hay imagen, usar fallback según categoría
  if (!imageUrl) {
    const fallbackImages: Record<string, string> = {
      'cancun': '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      'tulum': '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      'playa-del-carmen': '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      'los-cabos': '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      'puerto-vallarta': '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
      'general': '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
    };
    imageUrl = fallbackImages[post.category] || fallbackImages['general'];
  }
  
  // Obtener imágenes adicionales para usar en el contenido (con fallback si es necesario)
  let contentImages = getMultipleImagesForPost(post.category, post.id, 3, content.title, content.slug);
  if (contentImages.length === 0) {
    // Si no hay imágenes, usar la imagen principal repetida o fallbacks
    const fallbackImages: Record<string, string[]> = {
      'cancun': [
        '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
        '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
        '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      ],
      'tulum': [
        '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
        '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
        '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      ],
      'playa-del-carmen': [
        '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
        '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_2.jpg',
        '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_3.jpg',
      ],
      'los-cabos': [
        '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
        '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
        '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      ],
      'puerto-vallarta': [
        '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
        '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_2.jpg',
        '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_3.jpg',
      ],
      'general': [
        '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
        '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
        '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      ],
    };
    contentImages = fallbackImages[post.category] || fallbackImages['general'] || [imageUrl || ''];
  }
  
  const imageAlt = imageUrl 
    ? generateImageAltText(imageUrl, content.title, category?.name)
    : content.title;
  const imageTitle = imageUrl
    ? generateImageTitle(imageUrl, content.title, category?.name)
    : content.title;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';
  const postUrl = `${baseUrl}/${resolvedParams.locale}/posts/${content.slug}`;
  const fullImageUrl = imageUrl 
    ? imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${imageUrl}`
    : undefined;

  // Structured data JSON-LD para SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.excerpt || '',
    image: fullImageUrl ? [fullImageUrl] : [],
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MandalaTickets',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/img/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(category && {
      articleSection: category.name,
    }),
  };

  return (
    <>
      <Header locale={resolvedParams.locale} />
      <PostTracker 
        postTitle={content.title}
        categoryName={category?.name || ''}
        locale={resolvedParams.locale}
      />
      
      {/* Structured Data JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="post-article">
        <div className="post-header">
          <div className="container post-container">
            {category && (
              <Link 
                href={`/${resolvedParams.locale}/categorias/${category.id}`}
                className="post-category-badge"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </Link>
            )}
            
            <h1 className="post-title-main">
              {content.title}
            </h1>
            
            <div className="post-meta">
              <span>{new Date(post.date).toLocaleDateString(resolvedParams.locale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        <div className="post-featured-image">
          <img
            src={imageUrl!}
            alt={imageAlt}
            title={imageTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="post-content-wrapper">
          <div className="container post-container">
            <div className="post-content">
              <p className="post-excerpt-large">
                {content.excerpt}
              </p>
              
              {/* CTA después del excerpt - Más visible */}
              <div className="post-cta-inline" style={{ 
                margin: '2rem 0', 
                padding: '1.5rem', 
                background: 'linear-gradient(135deg, rgba(26, 105, 217, 0.1) 0%, rgba(101, 247, 238, 0.1) 100%)',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid rgba(101, 247, 238, 0.3)'
              }}>
                <CTAButton
                  href={getMandalaTicketsUrl(post.category, resolvedParams.locale)}
                  text={t.post.buyTicketsNow}
                  location="post_after_excerpt"
                  postTitle={content.title}
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  {resolvedParams.locale === 'es' ? 'Asegura tu lugar en los mejores eventos' : 
                   resolvedParams.locale === 'en' ? 'Secure your spot at the best events' :
                   resolvedParams.locale === 'fr' ? 'Réservez votre place aux meilleurs événements' :
                   'Garanta seu lugar nos melhores eventos'}
                </p>
              </div>
              
              <div className="post-body">
                {/* Renderizar contenido HTML del post */}
                <div dangerouslySetInnerHTML={{ __html: postBody }} />

                {/* Imágenes dentro del contenido */}
                {contentImages.length > 0 && (
                  <>
                    {/* Imagen mediana con caption */}
                    {contentImages[0] && (
                      <div className="post-image-wrapper">
                        <img
                          src={contentImages[0]}
                          alt={generateImageAltText(contentImages[0], content.title, category?.name)}
                          className="post-image-medium"
                          style={{ width: '100%', height: 'auto' }}
                          loading="lazy"
                        />
                        <p className="post-image-caption">{t.postContent.imageCaption} {category?.name || t.category.postsIn}</p>
                      </div>
                    )}

                    {/* Imagen pequeña */}
                    {contentImages[1] && (
                      <div className="post-image-wrapper">
                        <img
                          src={contentImages[1]}
                          alt={generateImageAltText(contentImages[1], content.title, category?.name)}
                          className="post-image-small"
                          style={{ width: '100%', height: 'auto' }}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="post-cta-box">
                  <h3>{t.post.readyToExperience}</h3>
                  <CTAButton
                    href={getMandalaTicketsUrl(post.category, resolvedParams.locale)}
                    text={t.post.buyTicketsNow}
                    location="post_end"
                    postTitle={content.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <StickyCTA locale={resolvedParams.locale} categoryId={post.category} postTitle={content.title} />
      <Footer locale={resolvedParams.locale} />
    </>
  );
}

