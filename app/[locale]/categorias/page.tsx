import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/blogPosts';
import { getTranslations, type Locale } from '@/i18n';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';

interface CategoriesPageProps {
  params: Promise<{ locale: Locale }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams || !resolvedParams.locale) {
    throw new Error('Locale parameter is required');
  }
  const locale = resolvedParams.locale || 'es';
  const t = getTranslations(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    alternates.languages[loc] = `${baseUrl}/${loc}/categorias`;
  });

  const title = `${t.allCategories.title} | ${t.metadata.siteName}`;

  return {
    title,
    description: t.allCategories.subtitle,
    alternates: {
      canonical: `${baseUrl}/${locale}/categorias`,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description: t.allCategories.subtitle,
      siteName: t.metadata.siteName,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale) as string[],
      type: 'website',
      url: `${baseUrl}/${locale}/categorias`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t.allCategories.subtitle,
    },
  };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const resolvedParams = await params;
  if (!resolvedParams || !resolvedParams.locale) {
    throw new Error('Locale parameter is required');
  }
  const t = getTranslations(resolvedParams.locale);

  return (
    <>
      <Header locale={resolvedParams.locale} />
      
      <section className="category-header">
        <div className="container">
          <h1>{t.allCategories.title}</h1>
          <p>{t.allCategories.subtitle}</p>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={resolvedParams.locale} />
            ))}
          </div>
        </div>
      </section>

      <Footer locale={resolvedParams.locale} />
    </>
  );
}

