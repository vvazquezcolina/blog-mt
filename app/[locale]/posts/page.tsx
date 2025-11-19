import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { blogPosts } from '@/data/blogPosts';
import { getTranslations, type Locale } from '@/i18n';
import type { Metadata } from 'next';

interface AllPostsPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: AllPostsPageProps): Promise<Metadata> {
  const locale = params.locale || 'es';
  const t = getTranslations(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  const { locales } = await import('@/i18n/config');
  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    alternates.languages[loc] = `${baseUrl}/${loc}/posts`;
  });

  const title = `${t.allPosts.title} | ${t.metadata.siteName}`;
  const description = t.allPosts.subtitle.replace('{count}', blogPosts.length.toString());

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/posts`,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      siteName: t.metadata.siteName,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale) as string[],
      type: 'website',
      url: `${baseUrl}/${locale}/posts`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function AllPostsPage({ params }: AllPostsPageProps) {
  const t = getTranslations(params.locale);

  return (
    <>
      <Header locale={params.locale} />
      
      <section className="category-header">
        <div className="container">
          <h1>{t.allPosts.title}</h1>
          <p>{t.allPosts.subtitle.replace('{count}', blogPosts.length.toString())}</p>
        </div>
      </section>

      <section className="posts-section">
        <div className="container">
          <div className="posts-grid">
            {blogPosts.map((post) => (
              <PostCard key={post.id} post={post} locale={params.locale} />
            ))}
          </div>
        </div>
      </section>

      <Footer locale={params.locale} />
    </>
  );
}

