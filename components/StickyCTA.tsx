'use client';

import { useEffect, useState } from 'react';
import CTAButton from './CTAButton';
import { getTranslations, type Locale } from '@/i18n';
import { getMandalaTicketsUrl } from '@/utils/urlUtils';
import type { CategoryId } from '@/data/blogPosts';

interface StickyCTAProps {
  locale: Locale;
  categoryId: CategoryId;
  postTitle?: string;
}

export default function StickyCTA({ locale, categoryId, postTitle }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const t = getTranslations(locale);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar CTA después de 300px de scroll
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="sticky-cta"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, rgba(26, 105, 217, 0.95) 0%, rgba(101, 247, 238, 0.95) 100%)',
        padding: '1rem',
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CTAButton
          href={getMandalaTicketsUrl(categoryId, locale)}
          text={t.post.buyTicketsNow || 'Reservar Ahora'}
          location="sticky_mobile"
          postTitle={postTitle}
          className="cta-button"
        />
      </div>
    </div>
  );
}





