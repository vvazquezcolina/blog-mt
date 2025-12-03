import type { Metadata } from 'next'
import '../globals.css'
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import Analytics from '@/components/Analytics';

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
      icon: [
        { url: 'https://mandalatickets.com/assets/img/favicon_nuevo.ico', type: 'image/x-icon' },
        { url: 'https://mandalatickets.com/assets/img/favicon_nuevo.png', type: 'image/png' },
        { url: 'https://mandalatickets.com/assets/img/touch-icon-android.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: 'https://mandalatickets.com/assets/img/touch-icon-60.png', sizes: '60x60' },
        { url: 'https://mandalatickets.com/assets/img/touch-icon-120.png', sizes: '120x120' },
      ],
      other: [
        { rel: 'apple-touch-startup-image', url: 'https://mandalatickets.com/assets/img/start-up.png' },
      ],
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
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="https://mandalatickets.com/assets/img/favicon_nuevo.ico" />
        <link rel="icon" type="image/png" href="https://mandalatickets.com/assets/img/favicon_nuevo.png" />
        <link rel="icon" sizes="192x192" href="https://mandalatickets.com/assets/img/touch-icon-android.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="https://mandalatickets.com/assets/img/touch-icon-60.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://mandalatickets.com/assets/img/touch-icon-120.png" />
        <link rel="apple-touch-startup-image" href="https://mandalatickets.com/assets/img/start-up.png" />
        {/* Para Acumin Variable desde Adobe Fonts, descomenta y agrega tu kit ID: */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/[tu-kit-id].css" /> */}
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}

