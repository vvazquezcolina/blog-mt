'use client';

import Link from 'next/link';
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
    trackBlogEvent.clickCTA(location, postTitle, 'mandalatickets.com');
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

