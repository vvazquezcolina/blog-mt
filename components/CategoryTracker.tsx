'use client';

import { useEffect } from 'react';
import { trackBlogEvent } from '@/utils/analytics';

interface CategoryTrackerProps {
  categoryName: string;
  locale: string;
}

export default function CategoryTracker({ categoryName, locale }: CategoryTrackerProps) {
  useEffect(() => {
    trackBlogEvent.viewCategory(categoryName, locale);
  }, [categoryName, locale]);

  return null;
}








