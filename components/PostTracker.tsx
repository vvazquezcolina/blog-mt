'use client';

import { useEffect, useRef } from 'react';
import { trackBlogEvent } from '@/utils/analytics';

interface PostTrackerProps {
  postTitle: string;
  categoryName: string;
  locale: string;
}

export default function PostTracker({ postTitle, categoryName, locale }: PostTrackerProps) {
  const scrollTrackedRef = useRef({ 50: false, 80: false, 100: false });
  const timeTrackedRef = useRef(false);

  useEffect(() => {
    // Track post view
    trackBlogEvent.viewPost(postTitle, categoryName, locale);

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      
      if (scrollPercent >= 50 && !scrollTrackedRef.current[50]) {
        trackBlogEvent.scrollDepth(50, postTitle);
        scrollTrackedRef.current[50] = true;
      }
      if (scrollPercent >= 80 && !scrollTrackedRef.current[80]) {
        trackBlogEvent.scrollDepth(80, postTitle);
        scrollTrackedRef.current[80] = true;
      }
      if (scrollPercent >= 100 && !scrollTrackedRef.current[100]) {
        trackBlogEvent.scrollDepth(100, postTitle);
        scrollTrackedRef.current[100] = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track time on page - usar setTimeout en lugar de setInterval para mejor performance
    const timeTimeout = setTimeout(() => {
      if (!timeTrackedRef.current) {
        trackBlogEvent.timeOnPage(30, postTitle);
        timeTrackedRef.current = true;
      }
    }, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeTimeout);
    };
  }, [postTitle, categoryName, locale]);

  return null;
}
















