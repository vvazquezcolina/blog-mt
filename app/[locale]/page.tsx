import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import PostCard from '@/components/PostCard';
import { categories, blogPosts } from '@/data/blogPosts';
import { getTranslations, type Locale } from '@/i18n';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';

interface HomeProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'es';
  const t = getTranslations(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  const { locales } = await import('@/i18n/config');
  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    alternates.languages[loc] = `${baseUrl}/${loc}`;
  });

  return {
    title: t.metadata.title,
    description: t.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternates.languages,
    },
    openGraph: {
      title: t.metadata.title,
      description: t.metadata.description,
      siteName: t.metadata.siteName,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale) as string[],
      type: 'website',
      url: `${baseUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.metadata.title,
      description: t.metadata.description,
    },
  };
}

export default async function Home({ params }: HomeProps) {
  const resolvedParams = await params;
  const t = getTranslations(resolvedParams.locale);
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 3);
  const recentPosts = blogPosts.slice(0, 6);

  return (
    <>
      <Header locale={resolvedParams.locale} />
      
      <section className="hero">
        <video 
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="https://mandalatickets.com/assets/img/video/n_home.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="container">
          <h1>{t.hero.title}</h1>
          <p>{t.hero.subtitle}</p>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">{t.sections.exploreCategories}</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={resolvedParams.locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="posts-section">
        <div className="container">
          <h2 className="section-title">{t.sections.featuredPosts}</h2>
          <div className="posts-grid">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} featured={true} locale={resolvedParams.locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="posts-section">
        <div className="container">
          <h2 className="section-title">{t.sections.recentPosts}</h2>
          <div className="posts-grid">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} locale={resolvedParams.locale} />
            ))}
          </div>
        </div>
      </section>

      <Footer locale={resolvedParams.locale} />
    </>
  );
}

