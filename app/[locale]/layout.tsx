import type { Metadata } from 'next'
import '../globals.css'
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params?: Promise<{ locale: Locale }> | { locale: Locale } }): Promise<Metadata> {
  let locale: Locale = defaultLocale;
  if (params) {
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      locale = (resolvedParams?.locale) || defaultLocale;
    } catch (error) {
      // If params resolution fails, use default locale
      locale = defaultLocale;
    }
  }
  const t = getTranslations(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  // Generate alternate links for all locales
  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    alternates.languages[loc] = `${baseUrl}/${loc}`;
  });

  return {
    title: t.metadata.title,
    description: t.metadata.description,
    icons: {
      icon: '/assets/img/favicon.png',
    },
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale: Locale }> | { locale: Locale };
}) {
  let locale: Locale = defaultLocale;
  if (params) {
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      locale = (resolvedParams?.locale) || defaultLocale;
    } catch (error) {
      // If params resolution fails, use default locale
      locale = defaultLocale;
    }
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        {/* Para Acumin Variable desde Adobe Fonts, descomenta y agrega tu kit ID: */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/[tu-kit-id].css" /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}

