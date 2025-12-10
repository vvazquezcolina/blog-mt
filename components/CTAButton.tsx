'use client';

import { trackBlogEvent } from '@/utils/analytics';

interface CTAButtonProps {
  href: string;
  text: string;
  location: string;
  postTitle?: string;
  className?: string;
  target?: string;
  rel?: string;
}

export default function CTAButton({ 
  href, 
  text, 
  location, 
  postTitle,
  className = 'cta-button',
  target = '_blank',
  rel = 'noopener noreferrer'
}: CTAButtonProps) {
  const handleClick = () => {
    // Extraer el dominio del href
    let destination = 'mandalatickets.com';
    try {
      const url = new URL(href);
      destination = url.hostname.replace('www.', '');
    } catch {
      // Si href no es una URL válida, usar el valor por defecto
    }
    
    trackBlogEvent.clickCTA(location, postTitle, destination);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
    >
      {text}
    </a>
  );
}
















