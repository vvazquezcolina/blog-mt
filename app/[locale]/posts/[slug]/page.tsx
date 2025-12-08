import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostTracker from '@/components/PostTracker';
import CTAButton from '@/components/CTAButton';
import StickyCTA from '@/components/StickyCTA';
import SafeImage from '@/components/SafeImage';
import { blogPosts, getCategoryById, getPostContent, findPostBySlug } from '@/data/blogPosts';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/i18n';
import { locales } from '@/i18n/config';
import { generateImageAltText, generateImageTitle } from '@/utils/imageUtils';
import { generatePostContent } from '@/utils/contentGenerator';
import { getMandalaTicketsUrl } from '@/utils/urlUtils';
import type { Metadata } from 'next';

interface PostPageProps {
  params?: Promise<{
    locale: Locale;
    slug: string;
  }> | {
    locale: Locale;
    slug: string;
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  locales.forEach((locale) => {
    blogPosts.forEach((post) => {
      const content = getPostContent(post, locale);
      params.push({ locale, slug: content.slug });
    });
  });
  return params;
}

/**
 * Genera metadata SEO completa para páginas de posts individuales
 * Incluye: título, descripción, Open Graph, Twitter Cards, imágenes, fechas
 * Configura URLs alternativas para todos los idiomas (hreflang)
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  if (!params) {
    throw new Error('Params are required');
  }
  const resolvedParams = params instanceof Promise ? await params : params;
  if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
    throw new Error('Locale and slug parameters are required');
  }
  const locale = resolvedParams.locale || 'es';
  const t = getTranslations(locale);
  const post = findPostBySlug(resolvedParams.slug, locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';

  if (!post) {
    return {
      title: t.notFound.heading,
      description: t.notFound.message,
    };
  }

  const content = getPostContent(post, locale);
  const category = getCategoryById(post.category);
  const postUrl = `${baseUrl}/${locale}/posts/${content.slug}`;
  
  // Obtener la imagen del post para metadata
  // Asignar imagen determinística para metadata
  const categoryImageLists: Record<string, string[]> = {
    'cancun': ['/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg'],
    'tulum': ['/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg'],
    'playa-del-carmen': ['/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg'],
    'los-cabos': ['/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg'],
    'puerto-vallarta': ['/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg'],
    'general': ['/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg'],
  };
  const imageList = categoryImageLists[post.category] || categoryImageLists['general'];
  const postIdNum = parseInt(post.id) || 1;
  const imageIndex = (postIdNum - 1) % imageList.length;
  const imageUrl = post.image || imageList[imageIndex] || imageList[0];
  const imageAlt = imageUrl 
    ? generateImageAltText(imageUrl, content.title, category?.name)
    : content.title;
  
  // Construir URL completa de la imagen para Open Graph
  const fullImageUrl = imageUrl 
    ? imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${imageUrl}`
    : undefined;
  
  // Generate alternate links for all locales
  const alternates: { languages: Record<string, string> } = {
    languages: {}
  };

  locales.forEach((loc) => {
    const locContent = getPostContent(post, loc);
    alternates.languages[loc] = `${baseUrl}/${loc}/posts/${locContent.slug}`;
  });

  return {
    title: `${content.title} | ${t.metadata.siteName}`,
    description: content.excerpt || t.metadata.post.defaultDescription,
    alternates: {
      canonical: postUrl,
      languages: alternates.languages,
    },
    openGraph: {
      title: content.title,
      description: content.excerpt || t.metadata.post.defaultDescription,
      siteName: t.metadata.siteName,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale) as string[],
      type: 'article',
      url: postUrl,
      publishedTime: post.date,
      authors: [post.author],
      ...(category && {
        section: category.name,
      }),
      ...(fullImageUrl && {
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: imageAlt,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.excerpt || t.metadata.post.defaultDescription,
      ...(fullImageUrl && {
        images: [fullImageUrl],
      }),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  if (!params) {
    notFound();
  }
  const resolvedParams = params instanceof Promise ? await params : params;
  if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
    notFound();
  }
  const t = getTranslations(resolvedParams.locale);
  const post = findPostBySlug(resolvedParams.slug, resolvedParams.locale);
  
  if (!post) {
    notFound();
  }

  const content = getPostContent(post, resolvedParams.locale);
  const category = getCategoryById(post.category);
  
  // Si el slug actual no coincide con el slug del locale, redirigir al slug correcto
  // Esto asegura que cada idioma tenga su propio slug único y mejora el SEO
  if (content.slug !== resolvedParams.slug) {
    // Redirigir al slug correcto para este idioma (301 permanente para SEO)
    redirect(`/${resolvedParams.locale}/posts/${content.slug}`);
  }
  
  // Generar contenido completo del post
  const postBody = generatePostContent(post, resolvedParams.locale);
  
  // Función hash simple para mejor distribución
  const hashPostId = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Listas COMPLETAS de imágenes verificadas que realmente existen
  const categoryImageLists: Record<string, string[]> = {
    'cancun': [
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_04.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_05.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_06.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_07.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_08.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_09.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_10.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_11.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_12.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_13.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_14.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_15.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_16.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_17.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_18.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_19.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_20.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_21.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_22.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_23.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_24.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_25.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_26.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_27.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_28.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_29.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_30.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_31.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_32.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_33.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_34.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_35.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_36.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_37.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_38.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_39.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_40.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_41.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_42.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_43.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_44.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_45.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_46.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_47.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_48.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_49.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_50.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_01.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_02.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_03.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_04.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_05.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_1.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_2.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_3.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_4.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_5.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_2_V01.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_3_V01.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_4_V01.jpg',
    ],
    'tulum': [
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_04.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_05.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_06.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_07.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_08.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_09.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_10.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_11.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_12.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_13.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_14.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_15.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_16.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_17.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_18.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_19.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_20.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_01.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_02.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_03.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_04.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_05.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_06.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_07.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_08.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_09.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_10.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_11.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_12.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_13.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_14.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_15.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_16.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_17.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_18.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_19.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_20.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_21.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_22.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_23.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_24.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_25.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_26.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_27.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_28.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_29.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_30.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_31.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_32.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_33.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_34.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_35.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_36.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_37.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_38.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_39.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_40.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_41.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_42.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_43.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_44.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_45.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_46.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_47.jpg',
      '/assets/PoolFotos/TULUM/VAGALUME/MT_Vagalume_1.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_1.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_3.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_5.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_7.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_9.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_13.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_14.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_17.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_19.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_20.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_21.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_22.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_23.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_24.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_25.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_26.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_27.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_29.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_30.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_31.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_32.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_33.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_34.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_35.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_36.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_37.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_38.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_39.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_40.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_41.jpg',
    ],
    'playa-del-carmen': [
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_2.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_3.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_4.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_5.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_6.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_7.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_8.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_9.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_10.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_11.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_12.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_13.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_14.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_15.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_16.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_17.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_18.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_19.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_20.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_21.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_22.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_23.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_24.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_25.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_26.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_27.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_28.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_29.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_30.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_31.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_32.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_33.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_34.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_35.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_36.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_37.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_38.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_39.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_40.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_41.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_42.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_43.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_44.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_45.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_46.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_47.jpg',
      '/assets/PoolFotos/PDC/VAQUITA/MT_Vaquita_PDC_1.jpg',
      '/assets/PoolFotos/PDC/SANTITO/MT_SANTITO_01.png',
    ],
    'los-cabos': [
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_4_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_5_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_6_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_7_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_8_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_9_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_10_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_11_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_12_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_13_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_14_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_15_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_16_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_17_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_18_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_19_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_20_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_21_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_22_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_23_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_24_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_25_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_26_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_27_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_28_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_29_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_30_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_31_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_32_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_33_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_34_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_35_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_36_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_37_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_38_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_39_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_40_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_41_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_42_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_43_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_44_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_45_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_46_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_47_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_48_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_49_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_50_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_51_V01.jpg',
      '/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U01.jpg',
      '/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U02.jpg',
      '/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U03.jpg',
    ],
    'puerto-vallarta': [
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_2.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_3.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_4.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_5.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_6.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_7.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_8.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_9.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_10.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V1.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V2.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V3.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V4.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V5.jpg',
      '/assets/PoolFotos/VTA/RAKATA/MT_Rakata_VTA_1.jpg',
    ],
    'general': [
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_04.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_05.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_2.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
    ],
  };
  
  const imageList = categoryImageLists[post.category] || categoryImageLists['general'];
  const postIdNum = parseInt(post.id) || 1;
  // Usar hash para mejor distribución y evitar repeticiones
  const hashValue = hashPostId(post.id);
  const imageIndex = (postIdNum + hashValue) % imageList.length;
  const imageUrl = post.image || imageList[imageIndex] || imageList[0];
  
  // Imágenes para el contenido - usar diferentes índices con offset
  const contentImages = [
    imageList[(imageIndex + 3) % imageList.length] || imageList[0],
    imageList[(imageIndex + 6) % imageList.length] || imageList[1] || imageList[0],
  ];
  
  const imageAlt = imageUrl 
    ? generateImageAltText(imageUrl, content.title, category?.name)
    : content.title;
  const imageTitle = imageUrl
    ? generateImageTitle(imageUrl, content.title, category?.name)
    : content.title;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mandalatickets.com';
  const postUrl = `${baseUrl}/${resolvedParams.locale}/posts/${content.slug}`;
  const fullImageUrl = imageUrl 
    ? imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${imageUrl}`
    : undefined;

  // Structured data JSON-LD para SEO
  // Article schema para mejor indexación en motores de búsqueda
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
        url: `${baseUrl}/assets/img/logo.png`,
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

  // BreadcrumbList schema para navegación estructurada
  // Mejora la comprensión de la jerarquía del sitio por parte de los motores de búsqueda
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.nav.home,
        item: `${baseUrl}/${resolvedParams.locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.nav.categories,
        item: `${baseUrl}/${resolvedParams.locale}/categorias`,
      },
      ...(category ? [{
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${baseUrl}/${resolvedParams.locale}/categorias/${category.id}`,
      }] : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name: content.title,
        item: postUrl,
      },
    ],
  };

  // Generar URLs alternativas para el language switcher
  const alternateUrls: Record<Locale, string> = {} as Record<Locale, string>;
  locales.forEach((loc) => {
    const locContent = getPostContent(post, loc);
    alternateUrls[loc] = `/${loc}/posts/${locContent.slug}`;
  });

  return (
    <>
      <Header locale={resolvedParams.locale} alternateUrls={alternateUrls} />
      <PostTracker 
        postTitle={content.title}
        categoryName={category?.name || ''}
        locale={resolvedParams.locale}
      />
      
      {/* Structured Data JSON-LD para SEO */}
      {/* Article schema para mejor indexación del contenido */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* BreadcrumbList schema para navegación estructurada */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <article className="post-article">
        <div className="post-header">
          <div className="container post-container">
            {category && (
              <Link 
                href={`/${resolvedParams.locale}/categorias/${category.id}`}
                className="post-category-badge"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </Link>
            )}
            
            <h1 className="post-title-main">
              {content.title}
            </h1>
            
            <div className="post-meta">
              <span>{new Date(post.date).toLocaleDateString(resolvedParams.locale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        <div className="post-featured-image">
          <SafeImage
            src={imageUrl!}
            alt={imageAlt}
            title={imageTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="eager"
          />
        </div>

        <div className="post-content-wrapper">
          <div className="container post-container">
            <div className="post-content">
              <p className="post-excerpt-large">
                {content.excerpt}
              </p>
              
              {/* CTA después del excerpt - Más visible */}
              <div className="post-cta-inline" style={{ 
                margin: '2rem 0', 
                padding: '1.5rem', 
                background: 'linear-gradient(135deg, rgba(26, 105, 217, 0.1) 0%, rgba(101, 247, 238, 0.1) 100%)',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid rgba(101, 247, 238, 0.3)'
              }}>
                <CTAButton
                  href={getMandalaTicketsUrl(post.category, resolvedParams.locale)}
                  text={t.post.buyTicketsNow}
                  location="post_after_excerpt"
                  postTitle={content.title}
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  {resolvedParams.locale === 'es' ? 'Asegura tu lugar en los mejores eventos' : 
                   resolvedParams.locale === 'en' ? 'Secure your spot at the best events' :
                   resolvedParams.locale === 'fr' ? 'Réservez votre place aux meilleurs événements' :
                   'Garanta seu lugar nos melhores eventos'}
                </p>
              </div>
              
              <div className="post-body">
                {/* Renderizar contenido HTML del post */}
                <div dangerouslySetInnerHTML={{ __html: postBody }} />

                {/* Imágenes dentro del contenido */}
                {contentImages.length > 0 && (
                  <>
                    {/* Imagen mediana con caption */}
                    {contentImages[0] && (
                      <div className="post-image-wrapper">
                        <SafeImage
                          src={contentImages[0]}
                          alt={generateImageAltText(contentImages[0], content.title, category?.name)}
                          className="post-image-medium"
                          style={{ width: '100%', height: 'auto' }}
                          loading="lazy"
                        />
                        <p className="post-image-caption">
                          {(() => {
                            // Generar caption específico basado en el título del post
                            const titleLower = content.title.toLowerCase();
                            let specificCaption = '';
                            
                            if (titleLower.includes('evento') || titleLower.includes('event')) {
                              specificCaption = resolvedParams.locale === 'es' 
                                ? `Eventos exclusivos en ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Exclusive events in ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Événements exclusifs à ${category?.name || 'Cancún'}`
                                : `Eventos exclusivos em ${category?.name || 'Cancún'}`;
                            } else if (titleLower.includes('guía') || titleLower.includes('guide')) {
                              specificCaption = resolvedParams.locale === 'es'
                                ? `Guía completa de ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Complete guide to ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Guide complet de ${category?.name || 'Cancún'}`
                                : `Guia completa de ${category?.name || 'Cancún'}`;
                            } else if (titleLower.includes('vida nocturna') || titleLower.includes('nightlife')) {
                              specificCaption = resolvedParams.locale === 'es'
                                ? `Vida nocturna en ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Nightlife in ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Vie nocturne à ${category?.name || 'Cancún'}`
                                : `Vida noturna em ${category?.name || 'Cancún'}`;
                            } else if (titleLower.includes('beach club') || titleLower.includes('beach')) {
                              specificCaption = resolvedParams.locale === 'es'
                                ? `Beach clubs en ${category?.name || 'Cancún'}`
                                : resolvedParams.locale === 'en'
                                ? `Beach clubs in ${category?.name || 'Cancun'}`
                                : resolvedParams.locale === 'fr'
                                ? `Beach clubs à ${category?.name || 'Cancún'}`
                                : `Beach clubs em ${category?.name || 'Cancún'}`;
                            } else {
                              // Caption genérico mejorado
                              specificCaption = resolvedParams.locale === 'es'
                                ? `${content.title} - ${category?.name || 'MandalaTickets'}`
                                : resolvedParams.locale === 'en'
                                ? `${content.title} - ${category?.name || 'MandalaTickets'}`
                                : resolvedParams.locale === 'fr'
                                ? `${content.title} - ${category?.name || 'MandalaTickets'}`
                                : `${content.title} - ${category?.name || 'MandalaTickets'}`;
                            }
                            
                            return specificCaption;
                          })()}
                        </p>
                      </div>
                    )}

                    {/* Imagen pequeña */}
                    {contentImages[1] && (
                      <div className="post-image-wrapper">
                        <SafeImage
                          src={contentImages[1]}
                          alt={generateImageAltText(contentImages[1], content.title, category?.name)}
                          className="post-image-small"
                          style={{ width: '100%', height: 'auto' }}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="post-cta-box">
                  <h3>{t.post.readyToExperience}</h3>
                  <CTAButton
                    href={getMandalaTicketsUrl(post.category, resolvedParams.locale)}
                    text={t.post.buyTicketsNow}
                    location="post_end"
                    postTitle={content.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <StickyCTA locale={resolvedParams.locale} categoryId={post.category} postTitle={content.title} />
      <Footer locale={resolvedParams.locale} />
    </>
  );
}

