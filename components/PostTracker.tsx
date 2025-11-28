'use client';

import { useEffect } from 'react';
import { trackBlogEvent } from '@/utils/analytics';

interface PostTrackerProps {
  postTitle: string;
  categoryName: string;
  locale: string;
}

export default function PostTracker({ postTitle, categoryName, locale }: PostTrackerProps) {
  useEffect(() => {
    // Track post view
    trackBlogEvent.viewPost(postTitle, categoryName, locale);

    // Track scroll depth
    let scrollTracked = { 50: false, 80: false, 100: false };
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      
      if (scrollPercent >= 50 && !scrollTracked[50]) {
        trackBlogEvent.scrollDepth(50, postTitle);
        scrollTracked[50] = true;
      }
      if (scrollPercent >= 80 && !scrollTracked[80]) {
        trackBlogEvent.scrollDepth(80, postTitle);
        scrollTracked[80] = true;
      }
      if (scrollPercent >= 100 && !scrollTracked[100]) {
        trackBlogEvent.scrollDepth(100, postTitle);
        scrollTracked[100] = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Track time on page
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent === 30) {
        trackBlogEvent.timeOnPage(30, postTitle);
      }
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, [postTitle, categoryName, locale]);

  return null;
}

