import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, categories, getCategoryById, getPostContent, findPostBySlug, isValidCategoryId } from '../data/blogPosts';
import { locales, defaultLocale, type Locale } from '../i18n/config';
import { getTranslations } from '../i18n';
import { getImageForPost, getMultipleImagesForPost, generateImageAltText, generateImageTitle } from '../utils/imageUtils';
import { generatePostContent } from '../utils/contentGenerator';

const BASE_PATH = '/blog';
const OUTPUT_DIR = path.join(process.cwd(), 'dist', 'blog');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIST_ROOT = path.join(process.cwd(), 'dist');

// Helper para escapar HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Helper para generar rutas con prefijo /blog
function getPath(route: string): string {
  return `${BASE_PATH}${route}`;
}

// Helper para generar URLs de assets con prefijo /blog
function getAssetPath(assetPath: string): string {
  if (assetPath.startsWith('http')) return assetPath;
  if (assetPath.startsWith('/')) return `${BASE_PATH}${assetPath}`;
  return `${BASE_PATH}/${assetPath}`;
}

// Generar metadata HTML
function generateMetadata(metadata: {
  title: string;
  description: string;
  locale: Locale;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  category?: string;
}): string {
  const alternates = locales.map(loc => 
    `<link rel="alternate" hreflang="${loc}" href="${metadata.url.replace(`/${metadata.locale}`, `/${loc}`)}" />`
  ).join('\n    ');

  const ogImage = metadata.image 
    ? (metadata.image.startsWith('http') ? metadata.image : `https://www.mandalatickets.com${getAssetPath(metadata.image)}`)
    : undefined;

  let meta = `
    <title>${escapeHtml(metadata.title)}</title>
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <link rel="canonical" href="https://www.mandalatickets.com${metadata.url}" />
    ${alternates}
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:type" content="${metadata.type || 'website'}" />
    <meta property="og:url" content="https://www.mandalatickets.com${metadata.url}" />
    <meta property="og:site_name" content="MandalaTickets Blog" />
    <meta property="og:locale" content="${metadata.locale}" />
    ${locales.filter(l => l !== metadata.locale).map(l => `<meta property="og:locale:alternate" content="${l}" />`).join('\n    ')}
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
    ${ogImage ? `<meta property="og:image:width" content="1200" />` : ''}
    ${ogImage ? `<meta property="og:image:height" content="630" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ''}
  `;

  if (metadata.type === 'article' && metadata.publishedTime) {
    meta += `
    <meta property="article:published_time" content="${metadata.publishedTime}" />
    ${metadata.author ? `<meta property="article:author" content="${escapeHtml(metadata.author)}" />` : ''}
    ${metadata.category ? `<meta property="article:section" content="${escapeHtml(metadata.category)}" />` : ''}
    `;
  }

  return meta;
}

// Generar Analytics
function generateAnalytics(): string {
  return `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-DYNLXHBQBB"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-DYNLXHBQBB', {
        content_group1: 'Blog',
        content_group2: 'MandalaTickets Blog',
      });
    </script>

    <!-- Meta Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '677381386843950');
      fbq('track', 'PageView');
    </script>
    <noscript>
      <img
        height="1"
        width="1"
        style="display:none"
        src="https://www.facebook.com/tr?id=677381386843950&ev=PageView&noscript=1"
        alt=""
      />
    </noscript>
  `;
}

// Generar Language Switcher HTML
function generateLanguageSwitcher(currentLocale: Locale, currentPath: string): string {
  const localeNames: Record<Locale, string> = {
    es: 'ES',
    en: 'EN',
    fr: 'FR',
    pt: 'PT',
  };

  // Extraer la ruta sin el locale actual
  let pathWithoutLocale = currentPath;
  if (pathWithoutLocale.startsWith(`/${currentLocale}/`)) {
    pathWithoutLocale = pathWithoutLocale.replace(`/${currentLocale}`, '');
  } else if (pathWithoutLocale === `/${currentLocale}`) {
    pathWithoutLocale = '/';
  }
  if (!pathWithoutLocale.startsWith('/')) {
    pathWithoutLocale = '/' + pathWithoutLocale;
  }

  const buttons = locales.map(locale => {
    const newPath = pathWithoutLocale === '/' 
      ? `${BASE_PATH}/${locale}` 
      : `${BASE_PATH}/${locale}${pathWithoutLocale}`;
    const isActive = locale === currentLocale;
    return `
      <button
        class="lang-btn ${isActive ? 'active' : ''}"
        onclick="window.location.href='${newPath}'"
        aria-label="Switch to ${localeNames[locale]}"
        ${isActive ? 'aria-pressed="true"' : ''}
      >
        ${localeNames[locale]}
      </button>
    `;
  }).join('');

  return `
    <div class="language-switcher">
      ${buttons}
    </div>
  `;
}

// Generar Header HTML
function generateHeader(locale: Locale, currentPath: string): string {
  const t = getTranslations(locale);
  const langSwitcher = generateLanguageSwitcher(locale, currentPath);

  return `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a href="${getPath(`/${locale}`)}" class="logo">
            <img 
              src="${getAssetPath('/assets/img/logo_nuevo_azul.png')}" 
              alt="MandalaTickets" 
              style="height: 50px; width: auto;"
            />
            <span style="margin-left: 10px;">${escapeHtml(t.nav.blog)}</span>
          </a>
          <button 
            class="hamburger-menu"
            onclick="toggleMenu()"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav class="nav">
            <a href="${getPath(`/${locale}`)}">${escapeHtml(t.nav.home)}</a>
            <a href="${getPath(`/${locale}/categorias`)}">${escapeHtml(t.nav.categories)}</a>
            <a href="${getPath(`/${locale}/posts`)}">${escapeHtml(t.nav.allPosts)}</a>
            <a 
              href="https://mandalatickets.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              ${escapeHtml(t.nav.buyTickets)}
            </a>
            <div class="nav-language-switcher">
              ${langSwitcher}
            </div>
          </nav>
          <div class="desktop-language-switcher">
            ${langSwitcher}
          </div>
        </div>
      </div>
    </header>
    <div class="menu-overlay" onclick="closeMenu()" style="display: none;"></div>
    <script>
      function toggleMenu() {
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.menu-overlay');
        nav.classList.toggle('nav-open');
        overlay.style.display = nav.classList.contains('nav-open') ? 'block' : 'none';
      }
      function closeMenu() {
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.menu-overlay');
        nav.classList.remove('nav-open');
        overlay.style.display = 'none';
      }
      // Cerrar menú al hacer clic en un enlace
      document.addEventListener('DOMContentLoaded', function() {
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
          link.addEventListener('click', closeMenu);
        });
      });
    </script>
  `;
}

// Generar Footer HTML
function generateFooter(locale: Locale): string {
  const t = getTranslations(locale);

  return `
    <footer class="site-footer">
      <div class="container" style="width: 100%; max-width: 100%;">
        <div class="sec_footer">
          <div class="cont_footer_mt">
            <img
              src="https://mandalatickets.com/assets/img/logo_mt.png"
              alt="MandalaTickets"
              style="height: auto; width: 200px;"
            />
          </div>
          <div class="cont_footer_redes">
            <a 
              href="https://www.facebook.com/Mandalatickets?mibextid=LQQJ4d" 
              title="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              style="padding: 0px 5px"
            >
              <img
                src="https://mandalatickets.com/assets/img/redes/facebook.png"
                alt="Facebook"
                style="width: 35px; height: 35px;"
              />
            </a>
            <a 
              href="https://www.instagram.com/mandalatickets/?hl=es" 
              title="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              style="padding: 0px 5px"
            >
              <img
                src="https://mandalatickets.com/assets/img/redes/instagram.png"
                alt="Instagram"
                style="width: 35px; height: 35px;"
              />
            </a>
            <a 
              href="https://wa.me/5215649802193" 
              title="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              style="padding: 0px 5px"
            >
              <img
                src="https://mandalatickets.com/assets/img/redes/whatsapp_blanco.png"
                alt="WhatsApp"
                style="width: 35px; height: 35px;"
              />
            </a>
            <a 
              href="https://mandalatickets.com/info/contactanos/es" 
              title="${escapeHtml(t.footer.contact)}"
              target="_blank"
              rel="noopener noreferrer"
              style="padding: 0px 5px; margin-top: -6px"
            >
              <i class="icon-mail" style="color: #fff; font-weight: 500; font-size: 30px;">✉</i>
            </a>
          </div>
        </div>
        <div class="row footer_sec_in">
          <div class="col-md-4 footer_sec_cont">
            <h3 class="widget-title">${escapeHtml(t.footer.mandalatickets)}</h3>
            <a href="https://mandalatickets.com/info/privacidad/es" style="color: #fff; display: block; margin-bottom: 0.5rem;" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(t.footer.privacy)}
            </a>
            <a href="https://mandalatickets.com/info/terminos/es" style="color: #fff; display: block; margin-bottom: 0.5rem;" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(t.footer.terms)}
            </a>
            <a href="https://mandalatickets.com/info/faqs/es" style="color: #fff; display: block; margin-bottom: 0.5rem;" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(t.footer.faqs)}
            </a>
            <a href="https://mandalatickets.com/info/contactanos/es" style="color: #fff; display: block; margin-bottom: 0.5rem;" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(t.footer.contact)}
            </a>
          </div>
          <div class="col-md-4 footer_sec_cont">
            <h3 class="widget-title">${escapeHtml(t.footer.paymentMethods)}</h3>
            <img
              src="https://mandalatickets.com/assets/img/metodos_pago.png"
              alt="${escapeHtml(t.footer.paymentMethods)}"
              style="width: 210px; height: auto;"
            />
          </div>
          <div class="col-md-4 footer_sec_cont">
            <h3 class="widget-title">${escapeHtml(t.footer.associations)}</h3>
            <a 
              href="https://bonbonniere.mx/" 
              style="text-decoration: none; font-size: 16px; color: #fff; display: block; margin-bottom: 0.5rem" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Bonbonniere Tulum ®
            </a>
            <a 
              href="https://tehmplo.com/" 
              style="text-decoration: none; font-size: 16px; color: #fff; display: block; margin-bottom: 0.5rem" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Tehmplo Tulum ®
            </a>
            <a 
              href="https://mandalatickets.com/en/tulum/disco/Vagalume" 
              style="text-decoration: none; font-size: 16px; color: #fff; display: block; margin-bottom: 0.5rem" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Vagalume ®
            </a>
          </div>
        </div>
      </div>
      <div class="container" style="width: 100%; max-width: 100%;">
        <div class="row" style="margin-top: 1.5rem; padding-top: 0.5rem;">
          <div class="col-md-12" style="display: flex; justify-content: center;">
            <a 
              href="https://www.trustpilot.com/review/mandalatickets.com" 
              title="Trustpilot"
              style="width: 11%; min-width: 150px;"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://mandalatickets.com/assets/img/trustpilot.svg"
                alt="Trustpilot"
                style="width: 100%; height: auto;"
              />
            </a>
          </div>
        </div>
      </div>
      <div class="container" style="width: 100%; max-width: 100%;">
        <div class="row" style="margin-top: 1rem; padding-top: 0.5rem;">
          <div class="col-md-12">
            <div class="footer-copyright f_copy_web" style="margin-bottom: 1rem; font-size: 14px; width: 100%; padding-top: 0.5rem; padding-bottom: 0px; display: flex; justify-content: center; color: #fff;">
              ${escapeHtml(t.footer.copyright)}
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Generar PostCard HTML
function generatePostCard(post: typeof blogPosts[0], locale: Locale, featured: boolean = false): string {
  const category = getCategoryById(post.category);
  const content = getPostContent(post, locale);
  const cardClass = featured ? 'post-card featured-post' : 'post-card';
  
  // Obtener imagen
  const fallbackImageLists: Record<string, string[]> = {
    'cancun': [
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_02.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_03.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_04.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_05.jpg',
      '/assets/Pool Fotos/CUN/VAQUITA/MT_Vaquita Cancun_01.jpg',
      '/assets/Pool Fotos/CUN/VAQUITA/MT_Vaquita Cancun_02.jpg',
      '/assets/Pool Fotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_1.jpg',
      '/assets/Pool Fotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_2.jpg',
      '/assets/Pool Fotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_1_V01.jpg',
    ],
    'tulum': [
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      '/assets/Pool Fotos/TULUM/TEHMPLO/MT_Themplo_01.jpg',
      '/assets/Pool Fotos/TULUM/VAGALUME/MT_Vagalume_1.jpg',
      '/assets/Pool Fotos/TULUM/BAGATELLE/Pic 1.jpg',
    ],
    'playa-del-carmen': [
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_1.jpg',
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_2.jpg',
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_3.jpg',
      '/assets/Pool Fotos/PDC/VAQUITA/MT_VaquitaPDC_1.jpg',
      '/assets/Pool Fotos/PDC/SANTITO/MT_SANTITO_01.png',
    ],
    'los-cabos': [
      '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
      '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      '/assets/Pool Fotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U01.jpg',
    ],
    'puerto-vallarta': [
      '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_1.jpg',
      '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_2.jpg',
      '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_3.jpg',
      '/assets/Pool Fotos/VTA/VAQUITA/V1.jpg',
      '/assets/Pool Fotos/VTA/RAKATA/MT_Rakata_VTA_1.jpg',
    ],
    'general': [
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_02.jpg',
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_1.jpg',
    ],
  };
  
  const imageList = fallbackImageLists[post.category] || fallbackImageLists['general'];
  
  let rawImageUrl: string;
  if (post.image) {
    rawImageUrl = post.image;
  } else {
    const imageMapImage = getImageForPost(post.category, post.id, content.title, content.slug);
    if (imageMapImage) {
      rawImageUrl = imageMapImage;
    } else {
      const postIdNum = parseInt(post.id) || 1;
      const imageIndex = (postIdNum - 1) % imageList.length;
      rawImageUrl = imageList[imageIndex] || imageList[0];
    }
  }
  
  const encodeUrl = (url: string): string => {
    return url.split('/').map(segment => {
      if (segment.includes(' ')) {
        return encodeURIComponent(segment);
      }
      return segment;
    }).join('/');
  };
  
  const imageUrl = encodeUrl(rawImageUrl);
  const imageAlt = generateImageAltText(rawImageUrl, content.title, category?.name);
  const imageTitle = generateImageTitle(rawImageUrl, content.title, category?.name);
  const fullImageUrl = getAssetPath(imageUrl);

  return `
    <a href="${getPath(`/${locale}/posts/${content.slug}`)}">
      <div class="${cardClass}">
        <div class="post-image" style="position: relative; width: 100%; height: ${featured ? '300px' : '200px'}; overflow: hidden; background-color: #1a1a1a;">
          <img
            src="${fullImageUrl}"
            alt="${escapeHtml(imageAlt)}"
            title="${escapeHtml(imageTitle)}"
            loading="${featured ? 'eager' : 'lazy'}"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 10; min-width: 100%; min-height: 100%;"
            onerror="this.src='${getAssetPath('/assets/Pool%20Fotos/CUN/MANDALA/MT_Mandala%20Cancun_01.jpg')}'"
          />
        </div>
        <div class="post-content">
          ${category ? `
            <span class="post-category" style="background-color: ${category.color}">
              ${escapeHtml(category.name)}
            </span>
          ` : ''}
          <h2 class="post-title">${escapeHtml(content.title)}</h2>
          <p class="post-excerpt">${escapeHtml(content.excerpt)}</p>
          <div class="post-meta">
            <span>${new Date(post.date).toLocaleDateString(locale, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>
    </a>
  `;
}

// Generar CategoryCard HTML
function generateCategoryCard(category: typeof categories[0], locale: Locale): string {
  return `
    <a href="${getPath(`/${locale}/categorias/${category.id}`)}">
      <div class="category-card" style="border-top-color: ${category.color}">
        <h3>${escapeHtml(category.name)}</h3>
        <p>${escapeHtml(category.description)}</p>
      </div>
    </a>
  `;
}

// Generar página HTML completa
function generatePageHTML(content: {
  title: string;
  description: string;
  locale: Locale;
  url: string;
  body: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  category?: string;
  structuredData?: object;
}): string {
  const metadata = generateMetadata({
    title: content.title,
    description: content.description,
    locale: content.locale,
    url: content.url,
    image: content.image,
    type: content.type,
    publishedTime: content.publishedTime,
    author: content.author,
    category: content.category,
  });

  const structuredDataScript = content.structuredData
    ? `<script type="application/ld+json">${JSON.stringify(content.structuredData)}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="${content.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="${getAssetPath('/assets/img/favicon.png')}" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${getAssetPath('/css/globals.css')}" />
  ${metadata}
  ${structuredDataScript}
  ${generateAnalytics()}
</head>
<body>
  ${content.body}
</body>
</html>`;
}

// Generar página home
function generateHomePage(locale: Locale): void {
  const t = getTranslations(locale);
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 3);
  const recentPosts = blogPosts.slice(0, 6);

  const header = generateHeader(locale, `/${locale}`);
  const footer = generateFooter(locale);

  const body = `
    ${header}
    
    <section class="hero">
      <video 
        class="hero-video" 
        autoplay 
        loop 
        muted 
        playsinline
      >
        <source src="https://mandalatickets.com/assets/img/video/n_home.mp4" type="video/mp4" />
      </video>
      <div class="hero-overlay"></div>
      <div class="container">
        <h1>${escapeHtml(t.hero.title)}</h1>
        <p>${escapeHtml(t.hero.subtitle)}</p>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">${escapeHtml(t.sections.exploreCategories)}</h2>
        <div class="categories-grid">
          ${categories.map(cat => generateCategoryCard(cat, locale)).join('')}
        </div>
      </div>
    </section>

    <section class="posts-section">
      <div class="container">
        <h2 class="section-title">${escapeHtml(t.sections.featuredPosts)}</h2>
        <div class="posts-grid">
          ${featuredPosts.map(post => generatePostCard(post, locale, true)).join('')}
        </div>
      </div>
    </section>

    <section class="posts-section">
      <div class="container">
        <h2 class="section-title">${escapeHtml(t.sections.recentPosts)}</h2>
        <div class="posts-grid">
          ${recentPosts.map(post => generatePostCard(post, locale)).join('')}
        </div>
      </div>
    </section>

    ${footer}
  `;

  const html = generatePageHTML({
    title: t.metadata.title,
    description: t.metadata.description,
    locale,
    url: `${BASE_PATH}/${locale}`,
    body,
    type: 'website',
  });

  const outputPath = path.join(OUTPUT_DIR, locale, 'index.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Generated: ${outputPath}`);
}

// Generar página de categorías
function generateCategoriesPage(locale: Locale): void {
  const t = getTranslations(locale);
  const header = generateHeader(locale, `/${locale}/categorias`);
  const footer = generateFooter(locale);

  const body = `
    ${header}
    
    <section class="category-header">
      <div class="container">
        <h1>${escapeHtml(t.allCategories.title)}</h1>
        <p>${escapeHtml(t.allCategories.subtitle)}</p>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <div class="categories-grid">
          ${categories.map(cat => generateCategoryCard(cat, locale)).join('')}
        </div>
      </div>
    </section>

    ${footer}
  `;

  const html = generatePageHTML({
    title: `${t.allCategories.title} | ${t.metadata.siteName}`,
    description: t.allCategories.subtitle,
    locale,
    url: `${BASE_PATH}/${locale}/categorias`,
    body,
    type: 'website',
  });

  const outputPath = path.join(OUTPUT_DIR, locale, 'categorias', 'index.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Generated: ${outputPath}`);
}

// Generar página de categoría individual
function generateCategoryPage(locale: Locale, categoryId: string): void {
  if (!isValidCategoryId(categoryId)) {
    console.warn(`⚠ Invalid category ID: ${categoryId}`);
    return;
  }

  const category = getCategoryById(categoryId);
  if (!category) {
    console.warn(`⚠ Category not found: ${categoryId}`);
    return;
  }

  const t = getTranslations(locale);
  const categoryPosts = blogPosts.filter(post => post.category === categoryId);
  const header = generateHeader(locale, `/${locale}/categorias/${categoryId}`);
  const footer = generateFooter(locale);

  const body = `
    ${header}
    
    <section class="category-header" style="background: linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%);">
      <div class="container">
        <h1>${escapeHtml(category.name)}</h1>
        <p>${escapeHtml(category.description)}</p>
      </div>
    </section>

    <section class="posts-section">
      <div class="container">
        <h2 class="section-title">${escapeHtml(t.category.postsIn)} ${escapeHtml(category.name)}</h2>
        ${categoryPosts.length > 0 ? `
          <div class="posts-grid">
            ${categoryPosts.map(post => generatePostCard(post, locale)).join('')}
          </div>
        ` : `
          <p style="text-align: center; color: rgba(255, 255, 255, 0.8); padding: 2rem;">
            ${escapeHtml(t.category.noPosts)}
          </p>
        `}
      </div>
    </section>

    ${footer}
  `;

  const html = generatePageHTML({
    title: `${category.name} | ${t.metadata.siteName}`,
    description: `${t.category.postsIn} ${category.name}. ${category.description}`,
    locale,
    url: `${BASE_PATH}/${locale}/categorias/${categoryId}`,
    body,
    type: 'website',
  });

  const outputPath = path.join(OUTPUT_DIR, locale, 'categorias', categoryId, 'index.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Generated: ${outputPath}`);
}

// Generar página de todos los posts
function generateAllPostsPage(locale: Locale): void {
  const t = getTranslations(locale);
  const header = generateHeader(locale, `/${locale}/posts`);
  const footer = generateFooter(locale);

  const body = `
    ${header}
    
    <section class="category-header">
      <div class="container">
        <h1>${escapeHtml(t.allPosts.title)}</h1>
        <p>${escapeHtml(t.allPosts.subtitle.replace('{count}', blogPosts.length.toString()))}</p>
      </div>
    </section>

    <section class="posts-section">
      <div class="container">
        <div class="posts-grid">
          ${blogPosts.map(post => generatePostCard(post, locale)).join('')}
        </div>
      </div>
    </section>

    ${footer}
  `;

  const html = generatePageHTML({
    title: `${t.allPosts.title} | ${t.metadata.siteName}`,
    description: t.allPosts.subtitle.replace('{count}', blogPosts.length.toString()),
    locale,
    url: `${BASE_PATH}/${locale}/posts`,
    body,
    type: 'website',
  });

  const outputPath = path.join(OUTPUT_DIR, locale, 'posts', 'index.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Generated: ${outputPath}`);
}

// Generar página de post individual
function generatePostPage(locale: Locale, post: typeof blogPosts[0]): void {
  const t = getTranslations(locale);
  const content = getPostContent(post, locale);
  const category = getCategoryById(post.category);
  
  const postBody = content.body || generatePostContent(post, locale);
  
  let imageUrl = post.image || getImageForPost(post.category, post.id, content.title, content.slug);
  
  if (!imageUrl) {
    const fallbackImages: Record<string, string> = {
      'cancun': '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
      'tulum': '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      'playa-del-carmen': '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_1.jpg',
      'los-cabos': '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      'puerto-vallarta': '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_1.jpg',
      'general': '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
    };
    imageUrl = fallbackImages[post.category] || fallbackImages['general'];
  }
  
  let contentImages = getMultipleImagesForPost(post.category, post.id, 3, content.title, content.slug);
  if (contentImages.length === 0) {
    const fallbackImages: Record<string, string[]> = {
      'cancun': [
        '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
        '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_02.jpg',
        '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_03.jpg',
      ],
      'tulum': [
        '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
        '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
        '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      ],
      'playa-del-carmen': [
        '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_1.jpg',
        '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_2.jpg',
        '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_3.jpg',
      ],
      'los-cabos': [
        '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
        '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
        '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      ],
      'puerto-vallarta': [
        '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_1.jpg',
        '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_2.jpg',
        '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_3.jpg',
      ],
      'general': [
        '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
        '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_02.jpg',
        '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_03.jpg',
      ],
    };
    contentImages = fallbackImages[post.category] || fallbackImages['general'] || [imageUrl || ''];
  }
  
  const imageAlt = imageUrl 
    ? generateImageAltText(imageUrl, content.title, category?.name)
    : content.title;
  const imageTitle = imageUrl
    ? generateImageTitle(imageUrl, content.title, category?.name)
    : content.title;

  const baseUrl = 'https://www.mandalatickets.com';
  const postUrl = `${baseUrl}${BASE_PATH}/${locale}/posts/${content.slug}`;
  const fullImageUrl = imageUrl 
    ? imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${getAssetPath(imageUrl)}`
    : undefined;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.excerpt || '',
    image: fullImageUrl ? [fullImageUrl] : [],
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MandalaTickets',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${getAssetPath('/assets/img/logo.png')}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(category && {
      articleSection: category.name,
    }),
  };

  const header = generateHeader(locale, `/${locale}/posts/${content.slug}`);
  const footer = generateFooter(locale);

  const ctaText = t.post.buyTicketsNow;
  const ctaHref = 'https://mandalatickets.com';
  const ctaButton = `
    <a href="${ctaHref}" class="cta-button" target="_blank" rel="noopener noreferrer">
      ${escapeHtml(ctaText)}
    </a>
  `;

  const body = `
    ${header}
    
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
    
    <article class="post-article">
      <div class="post-header">
        <div class="container post-container">
          ${category ? `
            <a 
              href="${getPath(`/${locale}/categorias/${category.id}`)}"
              class="post-category-badge"
              style="background-color: ${category.color}"
            >
              ${escapeHtml(category.name)}
            </a>
          ` : ''}
          
          <h1 class="post-title-main">
            ${escapeHtml(content.title)}
          </h1>
          
          <div class="post-meta">
            <span>${new Date(post.date).toLocaleDateString(locale, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      <div class="post-featured-image">
        <img
          src="${getAssetPath(imageUrl!)}"
          alt="${escapeHtml(imageAlt)}"
          title="${escapeHtml(imageTitle)}"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
      </div>

      <div class="post-content-wrapper">
        <div class="container post-container">
          <div class="post-content">
            <p class="post-excerpt-large">
              ${escapeHtml(content.excerpt)}
            </p>
            
            <div class="post-cta-inline" style="margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, rgba(26, 105, 217, 0.1) 0%, rgba(101, 247, 238, 0.1) 100%); border-radius: 10px; text-align: center; border: 2px solid rgba(101, 247, 238, 0.3)">
              ${ctaButton}
              <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">
                ${locale === 'es' ? 'Asegura tu lugar en los mejores eventos' : 
                  locale === 'en' ? 'Secure your spot at the best events' :
                  locale === 'fr' ? 'Réservez votre place aux meilleurs événements' :
                  'Garanta seu lugar nos melhores eventos'}
              </p>
            </div>
            
            <div class="post-body">
              ${postBody}

              ${contentImages.length > 0 ? `
                ${contentImages[0] ? `
                  <div class="post-image-wrapper">
                    <img
                      src="${getAssetPath(contentImages[0])}"
                      alt="${escapeHtml(generateImageAltText(contentImages[0], content.title, category?.name))}"
                      class="post-image-medium"
                      style="width: 100%; height: auto;"
                      loading="lazy"
                    />
                    <p class="post-image-caption">${escapeHtml(t.postContent.imageCaption)} ${escapeHtml(category?.name || t.category.postsIn)}</p>
                  </div>
                ` : ''}

                ${contentImages[1] ? `
                  <div class="post-image-wrapper">
                    <img
                      src="${getAssetPath(contentImages[1])}"
                      alt="${escapeHtml(generateImageAltText(contentImages[1], content.title, category?.name))}"
                      class="post-image-small"
                      style="width: 100%; height: auto;"
                      loading="lazy"
                    />
                  </div>
                ` : ''}
              ` : ''}

              <div class="post-cta-box">
                <h3>${escapeHtml(t.post.readyToExperience)}</h3>
                ${ctaButton}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <div class="sticky-cta" style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(26, 105, 217, 0.95); padding: 1rem; text-align: center; z-index: 1000; display: none;">
      ${ctaButton}
    </div>
    <script>
      window.addEventListener('scroll', function() {
        const stickyCta = document.querySelector('.sticky-cta');
        if (window.scrollY > 500) {
          stickyCta.style.display = 'block';
        } else {
          stickyCta.style.display = 'none';
        }
      });
    </script>

    ${footer}
  `;

  const html = generatePageHTML({
    title: `${content.title} | ${t.metadata.siteName}`,
    description: content.excerpt || t.metadata.post.defaultDescription,
    locale,
    url: `${BASE_PATH}/${locale}/posts/${content.slug}`,
    body,
    image: imageUrl,
    type: 'article',
    publishedTime: post.date,
    author: post.author,
    category: category?.name,
    structuredData,
  });

  const outputPath = path.join(OUTPUT_DIR, locale, 'posts', content.slug, 'index.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Generated: ${outputPath}`);
}

// Copiar assets públicos
function copyPublicAssets(): void {
  console.log('📦 Copying public assets...');
  
  // Copiar CSS
  const cssSource = path.join(process.cwd(), 'app', 'globals.css');
  const cssDest = path.join(OUTPUT_DIR, 'css');
  fs.mkdirSync(cssDest, { recursive: true });
  fs.copyFileSync(cssSource, path.join(cssDest, 'globals.css'));
  console.log(`✓ Copied CSS to ${path.join(cssDest, 'globals.css')}`);

  // Copiar carpeta public completa
  function copyRecursive(src: string, dest: string): void {
    if (!fs.existsSync(src)) {
      return;
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      // Ignorar archivos ocultos y .DS_Store
      if (entry.name.startsWith('.') || entry.name === '.DS_Store') {
        continue;
      }
      
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      try {
        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      } catch (error) {
        console.warn(`⚠ Warning: Could not copy ${srcPath}: ${error}`);
      }
    }
  }

  if (fs.existsSync(PUBLIC_DIR)) {
    // Copiar el contenido de public/assets/ directamente a OUTPUT_DIR/assets/
    const publicAssetsDir = path.join(PUBLIC_DIR, 'assets');
    if (fs.existsSync(publicAssetsDir)) {
      copyRecursive(publicAssetsDir, path.join(OUTPUT_DIR, 'assets'));
      console.log(`✓ Copied public assets to ${path.join(OUTPUT_DIR, 'assets')}`);
    } else {
      // Si no existe public/assets/, copiar todo public/
      copyRecursive(PUBLIC_DIR, path.join(OUTPUT_DIR, 'assets'));
      console.log(`✓ Copied public directory to ${path.join(OUTPUT_DIR, 'assets')}`);
    }
  }
}

// Función principal
function main(): void {
  console.log('🚀 Starting static HTML generation...\n');

  // Limpiar directorio de salida
  if (fs.existsSync(DIST_ROOT)) {
    fs.rmSync(DIST_ROOT, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Copiar assets
  copyPublicAssets();

  // Generar páginas para cada locale
  for (const locale of locales) {
    console.log(`\n📄 Generating pages for locale: ${locale}`);
    
    // Home
    generateHomePage(locale);
    
    // Categorías
    generateCategoriesPage(locale);
    
    // Categorías individuales
    for (const category of categories) {
      generateCategoryPage(locale, category.id);
    }
    
    // Todos los posts
    generateAllPostsPage(locale);
    
    // Posts individuales
    for (const post of blogPosts) {
      generatePostPage(locale, post);
    }
  }

  // Generar redirect desde root a /blog/es
  const rootRedirect = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${BASE_PATH}/${defaultLocale}">
  <link rel="canonical" href="https://www.mandalatickets.com${BASE_PATH}/${defaultLocale}">
</head>
<body>
  <script>window.location.href = '${BASE_PATH}/${defaultLocale}';</script>
</body>
</html>`;
  
  // Generar redirect en la raíz de dist (no en dist/blog)
  fs.writeFileSync(path.join(DIST_ROOT, 'index.html'), rootRedirect, 'utf-8');
  console.log(`\n✓ Generated root redirect`);

  console.log('\n✅ Static HTML generation complete!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

main();

