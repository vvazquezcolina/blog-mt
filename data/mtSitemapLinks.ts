// URLs del sitemap de MandalaTickets para link building interno
// Estructura de URLs disponibles para crear anchor texts contextuales

export const MT_SITEMAP_LINKS = {
  destinations: {
    cancun: {
      es: 'https://mandalatickets.com/es/cancun',
      en: 'https://mandalatickets.com/en/cancun',
      fr: 'https://mandalatickets.com/fr/cancun',
      pt: 'https://mandalatickets.com/pt/cancun',
      anchorTexts: {
        es: ['Cancún', 'eventos en Cancún', 'vida nocturna Cancún', 'fiestas Cancún', 'Cancún México'],
        en: ['Cancun', 'events in Cancun', 'nightlife Cancun', 'Cancun parties', 'Cancun Mexico'],
        fr: ['Cancún', 'événements à Cancún', 'vie nocturne Cancún', 'fêtes Cancún', 'Cancún Mexique'],
        pt: ['Cancún', 'eventos em Cancún', 'vida noturna Cancún', 'festas Cancún', 'Cancún México'],
      }
    },
    tulum: {
      es: 'https://mandalatickets.com/es/tulum',
      en: 'https://mandalatickets.com/en/tulum',
      fr: 'https://mandalatickets.com/fr/tulum',
      pt: 'https://mandalatickets.com/pt/tulum',
      anchorTexts: {
        es: ['Tulum', 'eventos en Tulum', 'vida nocturna Tulum', 'fiestas Tulum', 'Tulum México'],
        en: ['Tulum', 'events in Tulum', 'nightlife Tulum', 'Tulum parties', 'Tulum Mexico'],
        fr: ['Tulum', 'événements à Tulum', 'vie nocturne Tulum', 'fêtes Tulum', 'Tulum Mexique'],
        pt: ['Tulum', 'eventos em Tulum', 'vida noturna Tulum', 'festas Tulum', 'Tulum México'],
      }
    },
    'playa-del-carmen': {
      es: 'https://mandalatickets.com/es/playa',
      en: 'https://mandalatickets.com/en/playa',
      fr: 'https://mandalatickets.com/fr/playa',
      pt: 'https://mandalatickets.com/pt/playa',
      anchorTexts: {
        es: ['Playa del Carmen', 'eventos en Playa del Carmen', 'vida nocturna Playa del Carmen', 'fiestas Playa del Carmen'],
        en: ['Playa del Carmen', 'events in Playa del Carmen', 'nightlife Playa del Carmen', 'Playa del Carmen parties'],
        fr: ['Playa del Carmen', 'événements à Playa del Carmen', 'vie nocturne Playa del Carmen', 'fêtes Playa del Carmen'],
        pt: ['Playa del Carmen', 'eventos em Playa del Carmen', 'vida noturna Playa del Carmen', 'festas Playa del Carmen'],
      }
    },
    'los-cabos': {
      es: 'https://mandalatickets.com/es/cabos',
      en: 'https://mandalatickets.com/en/cabos',
      fr: 'https://mandalatickets.com/fr/cabos',
      pt: 'https://mandalatickets.com/pt/cabos',
      anchorTexts: {
        es: ['Los Cabos', 'eventos en Los Cabos', 'vida nocturna Los Cabos', 'fiestas Los Cabos', 'Cabo San Lucas'],
        en: ['Los Cabos', 'events in Los Cabos', 'nightlife Los Cabos', 'Los Cabos parties', 'Cabo San Lucas'],
        fr: ['Los Cabos', 'événements à Los Cabos', 'vie nocturne Los Cabos', 'fêtes Los Cabos', 'Cabo San Lucas'],
        pt: ['Los Cabos', 'eventos em Los Cabos', 'vida noturna Los Cabos', 'festas Los Cabos', 'Cabo San Lucas'],
      }
    },
    'puerto-vallarta': {
      es: 'https://mandalatickets.com/es/vallarta',
      en: 'https://mandalatickets.com/en/vallarta',
      fr: 'https://mandalatickets.com/fr/vallarta',
      pt: 'https://mandalatickets.com/pt/vallarta',
      anchorTexts: {
        es: ['Puerto Vallarta', 'eventos en Puerto Vallarta', 'vida nocturna Puerto Vallarta', 'fiestas Puerto Vallarta'],
        en: ['Puerto Vallarta', 'events in Puerto Vallarta', 'nightlife Puerto Vallarta', 'Puerto Vallarta parties'],
        fr: ['Puerto Vallarta', 'événements à Puerto Vallarta', 'vie nocturne Puerto Vallarta', 'fêtes Puerto Vallarta'],
        pt: ['Puerto Vallarta', 'eventos em Puerto Vallarta', 'vida noturna Puerto Vallarta', 'festas Puerto Vallarta'],
      }
    },
  },
  main: {
    es: 'https://mandalatickets.com/es',
    en: 'https://mandalatickets.com/en',
    fr: 'https://mandalatickets.com/fr',
    pt: 'https://mandalatickets.com/pt',
    anchorTexts: {
      es: ['MandalaTickets', 'comprar boletos', 'eventos exclusivos'],
      en: ['MandalaTickets', 'buy tickets', 'exclusive events'],
      fr: ['MandalaTickets', 'acheter des billets', 'événements exclusifs'],
      pt: ['MandalaTickets', 'comprar ingressos', 'eventos exclusivos'],
    }
  },
  eventosGrupales: {
    es: 'https://mandalatickets.com/es/eventos-grupales',
    en: 'https://mandalatickets.com/en/eventos-grupales',
    fr: 'https://mandalatickets.com/fr/eventos-grupales',
    pt: 'https://mandalatickets.com/pt/eventos-grupales',
    anchorTexts: {
      es: ['eventos grupales', 'eventos para grupos', 'fiestas grupales'],
      en: ['group events', 'events for groups', 'group parties'],
      fr: ['événements de groupe', 'événements pour groupes', 'fêtes de groupe'],
      pt: ['eventos em grupo', 'eventos para grupos', 'festas em grupo'],
    }
  }
};

/**
 * Obtiene un link de destino según el locale
 */
export function getDestinationLink(destination: string, locale: 'es' | 'en' | 'fr' | 'pt'): string {
  const dest = MT_SITEMAP_LINKS.destinations[destination as keyof typeof MT_SITEMAP_LINKS.destinations];
  return dest ? dest[locale] : MT_SITEMAP_LINKS.main[locale];
}

/**
 * Obtiene anchor texts disponibles para un destino
 */
export function getDestinationAnchorTexts(destination: string, locale: 'es' | 'en' | 'fr' | 'pt'): string[] {
  const dest = MT_SITEMAP_LINKS.destinations[destination as keyof typeof MT_SITEMAP_LINKS.destinations];
  return dest ? dest.anchorTexts[locale] : [];
}








