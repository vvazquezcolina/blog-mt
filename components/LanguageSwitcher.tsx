'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  alternateUrls?: Record<Locale, string>;
}

export default function LanguageSwitcher({ currentLocale, alternateUrls }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    
    // Si tenemos URLs alternativas (por ejemplo, para posts), usarlas directamente
    if (alternateUrls && alternateUrls[newLocale]) {
      router.push(alternateUrls[newLocale]);
      return;
    }
    
    // Si no hay URLs alternativas, usar la lógica original para otras páginas
    let pathWithoutLocale = pathname;
    
    // Check if pathname starts with current locale
    if (pathname.startsWith(`/${currentLocale}/`)) {
      pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    } else if (pathname === `/${currentLocale}`) {
      pathWithoutLocale = '/';
    }
    
    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    // Add new locale
    const newPath = pathWithoutLocale === '/' ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="language-switcher">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`lang-btn ${locale === currentLocale ? 'active' : ''}`}
          aria-label={`Switch to ${localeNames[locale]}`}
          aria-pressed={locale === currentLocale}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  );
}

