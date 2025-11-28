'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { getTranslations, type Locale } from '@/i18n';
import { trackBlogEvent } from '@/utils/analytics';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = getTranslations(locale);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
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
              <span style={{ marginLeft: '10px' }}>{t.nav.blog}</span>
            </Link>
            <button 
              className="hamburger-menu"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link href={`/${locale}`} onClick={() => setIsMenuOpen(false)}>{t.nav.home}</Link>
              <Link href={`/${locale}/categorias`} onClick={() => setIsMenuOpen(false)}>{t.nav.categories}</Link>
              <Link href={`/${locale}/posts`} onClick={() => setIsMenuOpen(false)}>{t.nav.allPosts}</Link>
              <Link 
                href="https://mandalatickets.com" 
                target="_blank" 
                onClick={() => {
                  setIsMenuOpen(false);
                  trackBlogEvent.clickCTA('header_nav', undefined, 'mandalatickets.com');
                }}
              >
                {t.nav.buyTickets}
              </Link>
              <div className="nav-language-switcher">
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </nav>
            <div className="desktop-language-switcher">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div 
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

