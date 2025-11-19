import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts, getCategoryById } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/i18n';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  locales.forEach((locale) => {
    blogPosts.forEach((post) => {
      params.push({ locale, slug: post.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
    throw new Error('Locale and slug parameters are required');
  }
  const locale = resolvedParams.locale || 'es';
  const t = getTranslations(locale);
  const post = blogPosts.find(p => p.slug === resolvedParams.slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  if (!post) {
    return {
      title: t.notFound.heading,
      description: t.notFound.message,
    };
  }

  const category = getCategoryById(post.category);
  const postUrl = `${baseUrl}/${locale}/posts/${post.slug}`;
  
  // Generate alternate links for all locales
  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    alternates.languages[loc] = `${baseUrl}/${loc}/posts/${post.slug}`;
  });

  return {
    title: `${post.title} | ${t.metadata.siteName}`,
    description: post.excerpt || t.metadata.post.defaultDescription,
    alternates: {
      canonical: postUrl,
      languages: alternates.languages,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || t.metadata.post.defaultDescription,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || t.metadata.post.defaultDescription,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
    notFound();
  }
  const t = getTranslations(resolvedParams.locale);
  const post = blogPosts.find(p => p.slug === resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  const category = getCategoryById(post.category);

  return (
    <>
      <Header locale={resolvedParams.locale} />
      
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
              {post.title}
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

        <div className="post-featured-image image-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">🖼️</span>
            <span className="placeholder-text">1920px × 600px</span>
            <span className="placeholder-subtext">Featured Image<br/>1920 × 1080px recommended (16:9)</span>
          </div>
        </div>

        <div className="post-content-wrapper">
          <div className="container post-container">
            <div className="post-content">
              <p className="post-excerpt-large">
                {post.excerpt}
              </p>
              
              <div className="post-body">
                <p>
                  {t.postContent.placeholder}
                </p>

                {/* Placeholders de ejemplo para imágenes dentro del contenido */}
                
                {/* Imagen mediana con caption */}
                <div className="post-image-wrapper">
                  <div className="post-image-medium image-placeholder" style={{ height: 'auto', minHeight: '400px' }}>
                    <div className="placeholder-content">
                      <span className="placeholder-icon">🖼️</span>
                      <span className="placeholder-text">700px × 394px</span>
                      <span className="placeholder-subtext">Medium Image (16:9)<br/>1400 × 788px recommended (2x)</span>
                    </div>
                  </div>
                  <p className="post-image-caption">Descripción de la imagen</p>
                </div>

                {/* Imagen pequeña */}
                <div className="post-image-wrapper">
                  <div className="post-image-small image-placeholder" style={{ height: 'auto', minHeight: '300px' }}>
                    <div className="placeholder-content">
                      <span className="placeholder-icon">📸</span>
                      <span className="placeholder-text">500px × 281px</span>
                      <span className="placeholder-subtext">Small Image (16:9)<br/>1000 × 563px recommended (2x)</span>
                    </div>
                  </div>
                </div>

                <p>
                  {t.postContent.cta}
                </p>

                <div className="post-cta-box">
                  <h3>{t.post.readyToExperience}</h3>
                  <a 
                    href="https://mandalatickets.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button"
                  >
                    {t.post.buyTicketsNow}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer locale={resolvedParams.locale} />
    </>
  );
}

