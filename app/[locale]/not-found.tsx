import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations, type Locale } from '@/i18n';

interface NotFoundProps {
  params?: Promise<{ locale: Locale }> | { locale: Locale };
}

export default async function NotFound({ params }: NotFoundProps) {
  if (!params) {
    const locale = 'es';
    const t = getTranslations(locale);
    return (
      <>
        <Header locale={locale} />
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 0',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '6rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
            {t.notFound.title}
          </h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--white)' }}>
            {t.notFound.heading}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem', maxWidth: '500px' }}>
            {t.notFound.message}
          </p>
          <Link 
            href={`/${locale}`}
            className="cta-button"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'linear-gradient(290deg, rgb(101, 247, 238) 0%, rgb(26, 105, 217) 90%)',
              color: 'var(--white)',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            {t.notFound.backHome}
          </Link>
        </div>
        <Footer locale={locale} />
      </>
    );
  }
  const resolvedParams = params instanceof Promise ? await params : params;
  const locale = (resolvedParams?.locale) || 'es';
  const t = getTranslations(locale);

  return (
    <>
      <Header locale={locale} />
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '6rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          {t.notFound.title}
        </h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--white)' }}>
          {t.notFound.heading}
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem', maxWidth: '500px' }}>
          {t.notFound.message}
        </p>
        <Link 
          href={`/${locale}`}
          className="cta-button"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'linear-gradient(290deg, rgb(101, 247, 238) 0%, rgb(26, 105, 217) 90%)',
            color: 'var(--white)',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          {t.notFound.backHome}
        </Link>
      </div>
      <Footer locale={locale} />
    </>
  );
}



