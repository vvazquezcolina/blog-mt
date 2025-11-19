import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { blogPosts, getCategoryById, isValidCategoryId, categories } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import { getTranslations, type Locale } from '@/i18n';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    locale: Locale;
    categoryId: string;
  }>;
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; categoryId: string }> = [];
  locales.forEach((locale) => {
    categories.forEach((category) => {
      params.push({ locale, categoryId: category.id });
    });
  });
  return params;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'es';
  const t = getTranslations(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  if (!isValidCategoryId(resolvedParams.categoryId)) {
    return {
      title: t.notFound.heading,
      description: t.notFound.message,
    };
  }

  const category = getCategoryById(resolvedParams.categoryId);
  if (!category) {
    return {
      title: t.notFound.heading,
      description: t.notFound.message,
    };
  }

  const categoryPosts = blogPosts.filter(post => post.category === resolvedParams.categoryId);
  const { locales } = await import('@/i18n/config');
  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    alternates.languages[loc] = `${baseUrl}/${loc}/categorias/${resolvedParams.categoryId}`;
  });

  const title = `${category.name} | ${t.metadata.siteName}`;
  const description = `${t.category.postsIn} ${category.name}. ${category.description}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/categorias/${resolvedParams.categoryId}`,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      siteName: t.metadata.siteName,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale) as string[],
      type: 'website',
      url: `${baseUrl}/${locale}/categorias/${resolvedParams.categoryId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const t = getTranslations(resolvedParams.locale);
  
  // Validar que el categoryId sea válido antes de buscar la categoría
  if (!isValidCategoryId(resolvedParams.categoryId)) {
    notFound();
  }
  
  const category = getCategoryById(resolvedParams.categoryId);
  
  if (!category) {
    notFound();
  }

  const categoryPosts = blogPosts.filter(post => post.category === resolvedParams.categoryId);

  return (
    <>
      <Header locale={resolvedParams.locale} />
      
      <section className="category-header" style={{ background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)` }}>
        <div className="container">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </section>

      <section className="posts-section">
        <div className="container">
          <h2 className="section-title">{t.category.postsIn} {category.name}</h2>
          {categoryPosts.length > 0 ? (
            <div className="posts-grid">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} locale={resolvedParams.locale} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', padding: '2rem' }}>
              {t.category.noPosts}
            </p>
          )}
        </div>
      </section>

      <Footer locale={resolvedParams.locale} />
    </>
  );
}

