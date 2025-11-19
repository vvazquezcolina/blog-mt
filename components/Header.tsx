import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { getTranslations, type Locale } from '@/i18n';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const t = getTranslations(locale);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href={`/${locale}`} className="logo">
            <Image 
              src="/assets/img/logo_nuevo_azul.png" 
              alt="MandalaTickets" 
              width={200} 
              height={50}
              priority
            />
            <span style={{ marginLeft: '10px' }}>Blog</span>
          </Link>
          <nav className="nav">
            <Link href={`/${locale}`}>{t.nav.home}</Link>
            <Link href={`/${locale}/categorias`}>{t.nav.categories}</Link>
            <Link href={`/${locale}/posts`}>{t.nav.allPosts}</Link>
            <Link href="https://mandalatickets.com" target="_blank">{t.nav.buyTickets}</Link>
          </nav>
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}

