import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostTracker from '@/components/PostTracker';
import CTAButton from '@/components/CTAButton';
import StickyCTA from '@/components/StickyCTA';
import SafeImage from '@/components/SafeImage';
import { blogPosts, getCategoryById, getPostContent, findPostBySlug } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/i18n';
import { locales } from '@/i18n/config';
import { generateImageAltText, generateImageTitle } from '@/utils/imageUtils';
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
  // Asignar imagen determinística para metadata
  const categoryImageLists: Record<string, string[]> = {
    'cancun': ['/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg'],
    'tulum': ['/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg'],
    'playa-del-carmen': ['/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg'],
    'los-cabos': ['/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg'],
    'puerto-vallarta': ['/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg'],
    'general': ['/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg'],
  };
  const imageList = categoryImageLists[post.category] || categoryImageLists['general'];
  const postIdNum = parseInt(post.id) || 1;
  const imageIndex = (postIdNum - 1) % imageList.length;
  const imageUrl = post.image || imageList[imageIndex] || imageList[0];
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
  
  // Función hash simple para mejor distribución
  const hashPostId = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Listas expandidas de imágenes por categoría
  const categoryImageLists: Record<string, string[]> = {
    'cancun': [
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_04.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_05.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_06.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_07.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_08.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_09.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_10.jpg',
      '/blog/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_01.jpg',
      '/blog/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_02.jpg',
      '/blog/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_03.jpg',
      '/blog/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_1.jpg',
      '/blog/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_2.jpg',
      '/blog/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_1_V01.jpg',
    ],
    'tulum': [
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_04.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_05.jpg',
      '/blog/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_01.jpg',
      '/blog/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_02.jpg',
      '/blog/assets/PoolFotos/TULUM/VAGALUME/MT_Vagalume_1.jpg',
      '/blog/assets/PoolFotos/TULUM/BAGATELLE/Pic1.jpg',
    ],
    'playa-del-carmen': [
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_2.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_3.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_4.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_5.jpg',
      '/blog/assets/PoolFotos/PDC/VAQUITA/MT_Vaquita_PDC_1.jpg',
      '/blog/assets/PoolFotos/PDC/SANTITO/MT_SANTITO_01.png',
    ],
    'los-cabos': [
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_4_V01.jpg',
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_5_V01.jpg',
      '/blog/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U01.jpg',
    ],
    'puerto-vallarta': [
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_2.jpg',
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_3.jpg',
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_4.jpg',
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_5.jpg',
      '/blog/assets/PoolFotos/VTA/VAQUITA/V1.jpg',
      '/blog/assets/PoolFotos/VTA/RAKATA/MT_Rakata_VTA_1.jpg',
    ],
    'general': [
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
    ],
  };
  
  const imageList = categoryImageLists[post.category] || categoryImageLists['general'];
  const postIdNum = parseInt(post.id) || 1;
  // Usar hash para mejor distribución y evitar repeticiones
  const hashValue = hashPostId(post.id);
  const imageIndex = (postIdNum + hashValue) % imageList.length;
  const imageUrl = post.image || imageList[imageIndex] || imageList[0];
  
  // Imágenes para el contenido - usar diferentes índices con offset
  const contentImages = [
    imageList[(imageIndex + 3) % imageList.length] || imageList[0],
    imageList[(imageIndex + 6) % imageList.length] || imageList[1] || imageList[0],
  ];
  
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
          <SafeImage
            src={imageUrl!}
            alt={imageAlt}
            title={imageTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="eager"
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
                        <SafeImage
                          src={contentImages[0]}
                          alt={generateImageAltText(contentImages[0], content.title, category?.name)}
                          className="post-image-medium"
                          style={{ width: '100%', height: 'auto' }}
                          loading="lazy"
                        />
                        <p className="post-image-caption">
                          {(() => {
                            // Generar caption específico basado en el título del post
                            const titleLower = content.title.toLowerCase();
                            let specificCaption = '';
                            
                            if (titleLower.includes('evento') || titleLower.includes('event')) {
                              specificCaption = resolvedParams.locale === 'es' 
                                ? `Eventos exclusivos en ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Exclusive events in ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Événements exclusifs à ${category?.name || 'Cancún'}`
                                : `Eventos exclusivos em ${category?.name || 'Cancún'}`;
                            } else if (titleLower.includes('guía') || titleLower.includes('guide')) {
                              specificCaption = resolvedParams.locale === 'es'
                                ? `Guía completa de ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Complete guide to ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Guide complet de ${category?.name || 'Cancún'}`
                                : `Guia completa de ${category?.name || 'Cancún'}`;
                            } else if (titleLower.includes('vida nocturna') || titleLower.includes('nightlife')) {
                              specificCaption = resolvedParams.locale === 'es'
                                ? `Vida nocturna en ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Nightlife in ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Vie nocturne à ${category?.name || 'Cancún'}`
                                : `Vida noturna em ${category?.name || 'Cancún'}`;
                            } else if (titleLower.includes('beach club') || titleLower.includes('beach')) {
                              specificCaption = resolvedParams.locale === 'es'
                                ? `Beach clubs en ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Beach clubs in ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Beach clubs à ${category?.name || 'Cancún'}`
                                : `Beach clubs em ${category?.name || 'Cancún'}`;
                            } else {
                              // Caption genérico mejorado
                              specificCaption = resolvedParams.locale === 'es'
                                ? `${content.title} - ${category?.name || 'MandalaTickets'}`
                                : resolvedParams.locale === 'en'
                                ? `${content.title} - ${category?.name || 'MandalaTickets'}`
                                : resolvedParams.locale === 'fr'
                                ? `${content.title} - ${category?.name || 'MandalaTickets'}`
                                : `${content.title} - ${category?.name || 'MandalaTickets'}`;
                            }
                            
                            return specificCaption;
                          })()}
                        </p>
                      </div>
                    )}

                    {/* Imagen pequeña */}
                    {contentImages[1] && (
                      <div className="post-image-wrapper">
                        <SafeImage
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

