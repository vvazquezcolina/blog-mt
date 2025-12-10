// Tipos para parámetros de analytics
type GAEventParams = Record<string, string | number | boolean | undefined>;
type FBEventParams = Record<string, string | number | undefined>;

// Declarar tipos para window
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GAEventParams) => void;
    fbq?: (command: string, eventName: string, params?: FBEventParams) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Track Google Analytics event
 */
export const trackGAEvent = (
  eventName: string,
  params?: GAEventParams
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  try {
    window.gtag('event', eventName, {
      content_type: 'blog',
      ...params,
    });
  } catch (error) {
    // Silently fail in production, but log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking GA event:', error);
    }
  }
};

/**
 * Track Facebook Pixel event
 */
export const trackFBEvent = (
  eventName: string,
  params?: FBEventParams
) => {
  if (typeof window === 'undefined' || !window.fbq) {
    return;
  }

  try {
    window.fbq('track', eventName, params);
  } catch (error) {
    // Silently fail in production, but log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking FB event:', error);
    }
  }
};

/**
 * Track blog-specific events
 */
export const trackBlogEvent = {
  // Track post view
  viewPost: (postTitle: string, category: string, locale: string) => {
    trackGAEvent('view_post', {
      post_title: postTitle,
      post_category: category,
      post_locale: locale,
    });
    trackFBEvent('ViewContent', {
      content_name: postTitle,
      content_category: category,
    });
  },

  // Track CTA click
  clickCTA: (
    ctaLocation: string,
    postTitle?: string,
    destination?: string
  ) => {
    trackGAEvent('click_cta', {
      cta_location: ctaLocation,
      post_title: postTitle,
      destination: destination || 'mandalatickets.com',
    });
    trackFBEvent('Lead', {
      content_name: postTitle,
      content_category: 'CTA Click',
    });
  },

  // Track scroll depth
  scrollDepth: (depth: number, postTitle: string) => {
    trackGAEvent('scroll_depth', {
      scroll_percentage: depth,
      post_title: postTitle,
    });
  },

  // Track time on page
  timeOnPage: (seconds: number, postTitle: string) => {
    trackGAEvent('time_on_page', {
      time_seconds: seconds,
      post_title: postTitle,
    });
  },

  // Track category view
  viewCategory: (categoryName: string, locale: string) => {
    trackGAEvent('view_category', {
      category_name: categoryName,
      category_locale: locale,
    });
  },

  // Track external link click (to mandalatickets.com)
  clickExternalLink: (url: string, postTitle?: string) => {
    trackGAEvent('click_external_link', {
      link_url: url,
      post_title: postTitle,
      destination: 'mandalatickets.com',
    });
    // Solo trackear InitiateCheckout si es un link de checkout/tickets
    if (url.includes('mandalatickets.com') && (url.includes('/checkout') || url.includes('/tickets'))) {
      trackFBEvent('InitiateCheckout', {
        content_name: postTitle,
      });
    } else {
      // Para otros links externos, usar evento más apropiado
      trackFBEvent('Lead', {
        content_name: postTitle,
      });
    }
  },

  // Track search (if implementas búsqueda)
  search: (searchTerm: string) => {
    trackGAEvent('search', {
      search_term: searchTerm,
    });
  },
};
















