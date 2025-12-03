import { blogPosts, BlogPost, CategoryId } from '../data/blogPosts';
import * as fs from 'fs';
import * as path from 'path';

// Venues por categoría según VENUES_GUIDE.md
const venuesByCategory: Record<CategoryId, string[]> = {
  'cancun': [
    'Rakata Cancún', 'D\'Cave Cancún', 'La Vaquita Cancún', 'Mandala Cancún',
    'Mandala Beach Day', 'Mandala Beach Night', 'Señor Frog\'s Cancún', 'House Of Fiesta'
  ],
  'tulum': [
    'Tehmplo Tulum', 'Bonbonniere Tulum', 'Vagalume Tulum', 'Bagatelle Tulum'
  ],
  'playa-del-carmen': [
    'La Vaquita Playa del Carmen', 'Mandala Playa del Carmen', 'Santito Tun-Tun'
  ],
  'los-cabos': [
    'Mandala Los Cabos', 'La Vaquita Los Cabos'
  ],
  'puerto-vallarta': [
    'Chicabal Sunset Club', 'Señor Frog\'s Puerto Vallarta', 'La Vaquita Puerto Vallarta',
    'Mandala Puerto Vallarta', 'Rakata Puerto Vallarta', 'La Santa Puerto Vallarta'
  ],
  'general': []
};

interface AuditIssue {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  recommendation?: string;
}

interface PostAudit {
  postId: string;
  title: string;
  category: CategoryId;
  locale: 'es' | 'en' | 'fr' | 'pt';
  issues: AuditIssue[];
  metrics: {
    wordCount: number;
    hasBody: boolean;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    internalLinks: number;
    externalLinks: number;
    venueMentions: number;
    ctaCount: number;
    imageCount: number;
    excerptLength: number;
    titleLength: number;
    slugLength: number;
  };
  score: number; // 0-100
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text: string): number {
  const cleanText = stripHtml(text);
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}

function countHeadings(html: string, level: 1 | 2 | 3): number {
  const regex = new RegExp(`<h${level}[^>]*>`, 'gi');
  return (html.match(regex) || []).length;
}

function countLinks(html: string): { internal: number; external: number } {
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  const links: string[] = [];
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  
  const internal = links.filter(link => 
    link.includes('mandalatickets.com') || link.startsWith('/')
  ).length;
  
  const external = links.length - internal;
  
  return { internal, external };
}

function countVenueMentions(html: string, category: CategoryId): number {
  const venues = venuesByCategory[category];
  if (venues.length === 0) return 0;
  
  const text = stripHtml(html).toLowerCase();
  let count = 0;
  
  venues.forEach(venue => {
    const venueLower = venue.toLowerCase();
    // Buscar menciones del venue (puede estar parcialmente)
    if (text.includes(venueLower) || 
        venueLower.split(' ').some(word => text.includes(word.toLowerCase()))) {
      count++;
    }
  });
  
  return count;
}

function countCTAs(html: string): number {
  const ctaKeywords = [
    'comprar', 'reservar', 'adquirir', 'obtener', 'visita', 'descubre',
    'buy', 'reserve', 'get', 'visit', 'discover', 'book',
    'acheter', 'réserver', 'obtenir', 'visiter', 'découvrir',
    'comprar', 'reservar', 'adquirir', 'obter', 'visitar', 'descobrir'
  ];
  
  const text = stripHtml(html).toLowerCase();
  let count = 0;
  
  ctaKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      count++;
    }
  });
  
  return count;
}

function countImages(html: string): number {
  const imgRegex = /<img[^>]*>/gi;
  return (html.match(imgRegex) || []).length;
}

function auditPost(post: BlogPost, locale: 'es' | 'en' | 'fr' | 'pt'): PostAudit {
  const content = post.content[locale];
  const issues: AuditIssue[] = [];
  
  if (!content) {
    return {
      postId: post.id,
      title: 'N/A',
      category: post.category,
      locale,
      issues: [{
        type: 'MISSING_CONTENT',
        severity: 'CRITICAL',
        message: `No existe contenido para el locale ${locale}`
      }],
      metrics: {
        wordCount: 0,
        hasBody: false,
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        internalLinks: 0,
        externalLinks: 0,
        venueMentions: 0,
        ctaCount: 0,
        imageCount: 0,
        excerptLength: 0,
        titleLength: 0,
        slugLength: 0
      },
      score: 0
    };
  }
  
  const body = content.body || '';
  const wordCount = countWords(body);
  const excerptWordCount = countWords(content.excerpt || '');
  
  // Métricas
  const metrics = {
    wordCount,
    hasBody: body.length > 0,
    h1Count: countHeadings(body, 1),
    h2Count: countHeadings(body, 2),
    h3Count: countHeadings(body, 3),
    internalLinks: countLinks(body).internal,
    externalLinks: countLinks(body).external,
    venueMentions: countVenueMentions(body, post.category),
    ctaCount: countCTAs(body),
    imageCount: countImages(body),
    excerptLength: content.excerpt?.length || 0,
    titleLength: content.title?.length || 0,
    slugLength: content.slug?.length || 0
  };
  
  // Auditorías
  
  // 1. Contenido vacío
  if (!body || body.trim().length === 0) {
    issues.push({
      type: 'EMPTY_CONTENT',
      severity: 'CRITICAL',
      message: 'El post no tiene contenido (body vacío)',
      recommendation: 'Agregar contenido de al menos 800-1200 palabras para SEO óptimo'
    });
  }
  
  // 2. Longitud mínima de contenido
  if (wordCount > 0 && wordCount < 320) {
    issues.push({
      type: 'SHORT_CONTENT',
      severity: 'HIGH',
      message: `El contenido tiene solo ${wordCount} palabras (mínimo recomendado: 320)`,
      recommendation: 'Ampliar el contenido a al menos 800-1200 palabras para mejor SEO'
    });
  }
  
  // 3. Longitud óptima de contenido
  if (wordCount > 0 && wordCount < 800) {
    issues.push({
      type: 'SUBOPTIMAL_LENGTH',
      severity: 'MEDIUM',
      message: `El contenido tiene ${wordCount} palabras (óptimo: 800-1200)`,
      recommendation: 'Considerar ampliar el contenido para mejor posicionamiento SEO'
    });
  }
  
  // 4. Título
  if (!content.title || content.title.trim().length === 0) {
    issues.push({
      type: 'MISSING_TITLE',
      severity: 'CRITICAL',
      message: 'El post no tiene título',
      recommendation: 'Agregar un título descriptivo y atractivo'
    });
  } else {
    if (content.title.length < 30) {
      issues.push({
        type: 'SHORT_TITLE',
        severity: 'MEDIUM',
        message: `El título tiene solo ${content.title.length} caracteres (recomendado: 30-65)`,
        recommendation: 'Ampliar el título para mejor SEO'
      });
    }
    if (content.title.length > 65) {
      issues.push({
        type: 'LONG_TITLE',
        severity: 'MEDIUM',
        message: `El título tiene ${content.title.length} caracteres (recomendado: 30-65)`,
        recommendation: 'Acortar el título para evitar truncamiento en resultados de búsqueda'
      });
    }
  }
  
  // 5. Excerpt (meta description)
  if (!content.excerpt || content.excerpt.trim().length === 0) {
    issues.push({
      type: 'MISSING_EXCERPT',
      severity: 'HIGH',
      message: 'El post no tiene excerpt (meta description)',
      recommendation: 'Agregar un excerpt de 70-155 caracteres para mejor CTR en búsquedas'
    });
  } else {
    if (content.excerpt.length < 70) {
      issues.push({
        type: 'SHORT_EXCERPT',
        severity: 'MEDIUM',
        message: `El excerpt tiene solo ${content.excerpt.length} caracteres (recomendado: 70-155)`,
        recommendation: 'Ampliar el excerpt para mejor descripción en resultados de búsqueda'
      });
    }
    if (content.excerpt.length > 155) {
      issues.push({
        type: 'LONG_EXCERPT',
        severity: 'MEDIUM',
        message: `El excerpt tiene ${content.excerpt.length} caracteres (recomendado: 70-155)`,
        recommendation: 'Acortar el excerpt para evitar truncamiento'
      });
    }
  }
  
  // 6. Slug
  if (!content.slug || content.slug.trim().length === 0) {
    issues.push({
      type: 'MISSING_SLUG',
      severity: 'CRITICAL',
      message: 'El post no tiene slug',
      recommendation: 'Agregar un slug SEO-friendly'
    });
  } else {
    // Verificar que el slug sea SEO-friendly
    if (content.slug.includes('_') || content.slug.includes('%')) {
      issues.push({
        type: 'BAD_SLUG_FORMAT',
        severity: 'MEDIUM',
        message: 'El slug contiene caracteres no recomendados (guiones bajos o porcentajes)',
        recommendation: 'Usar solo guiones medios (-) y letras minúsculas'
      });
    }
  }
  
  // 7. Estructura de headings
  if (metrics.h1Count === 0 && body.length > 0) {
    issues.push({
      type: 'NO_H1',
      severity: 'HIGH',
      message: 'El contenido no tiene H1',
      recommendation: 'Agregar un H1 con la palabra clave principal'
    });
  }
  if (metrics.h1Count > 1) {
    issues.push({
      type: 'MULTIPLE_H1',
      severity: 'HIGH',
      message: `El contenido tiene ${metrics.h1Count} H1 (debe tener solo 1)`,
      recommendation: 'Usar solo un H1 por página para mejor SEO'
    });
  }
  if (metrics.h2Count === 0 && wordCount > 300) {
    issues.push({
      type: 'NO_H2',
      severity: 'MEDIUM',
      message: 'El contenido largo no tiene H2 para estructura',
      recommendation: 'Agregar H2 para mejorar la estructura y legibilidad'
    });
  }
  
  // 8. Enlaces internos
  if (metrics.internalLinks === 0 && body.length > 0) {
    issues.push({
      type: 'NO_INTERNAL_LINKS',
      severity: 'MEDIUM',
      message: 'El contenido no tiene enlaces internos',
      recommendation: 'Agregar enlaces internos a otros posts o páginas del sitio'
    });
  }
  if (metrics.internalLinks < 2 && wordCount > 500) {
    issues.push({
      type: 'FEW_INTERNAL_LINKS',
      severity: 'LOW',
      message: `Solo ${metrics.internalLinks} enlace(s) interno(s) en contenido largo`,
      recommendation: 'Agregar más enlaces internos para mejor SEO y navegación'
    });
  }
  
  // 9. Menciones de venues (solo para categorías específicas)
  if (post.category !== 'general' && metrics.venueMentions === 0 && body.length > 0) {
    issues.push({
      type: 'NO_VENUE_MENTIONS',
      severity: 'MEDIUM',
      message: `No se mencionan venues de la categoría ${post.category}`,
      recommendation: `Mencionar al menos un venue de ${post.category} según VENUES_GUIDE.md`
    });
  }
  
  // 10. CTAs
  if (metrics.ctaCount === 0 && body.length > 0) {
    issues.push({
      type: 'NO_CTAS',
      severity: 'MEDIUM',
      message: 'El contenido no tiene llamadas a la acción',
      recommendation: 'Agregar CTAs para invitar a comprar boletos o visitar el sitio'
    });
  }
  
  // 11. Imágenes
  if (metrics.imageCount === 0 && wordCount > 500) {
    issues.push({
      type: 'NO_IMAGES',
      severity: 'LOW',
      message: 'El contenido largo no tiene imágenes',
      recommendation: 'Agregar imágenes relevantes con alt text para mejor engagement'
    });
  }
  
  // 12. Keyword en título
  if (content.title && body.length > 0) {
    const titleLower = content.title.toLowerCase();
    const bodyLower = stripHtml(body).toLowerCase();
    const titleWords = titleLower.split(/\s+/).filter(w => w.length > 3);
    const hasKeywordInBody = titleWords.some(word => bodyLower.includes(word));
    
    if (!hasKeywordInBody && titleWords.length > 0) {
      issues.push({
        type: 'KEYWORD_MISMATCH',
        severity: 'MEDIUM',
        message: 'Las palabras clave del título no aparecen en el contenido',
        recommendation: 'Asegurar que las palabras clave del título estén presentes en el contenido'
      });
    }
  }
  
  // Calcular score (0-100)
  let score = 100;
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'CRITICAL':
        score -= 20;
        break;
      case 'HIGH':
        score -= 10;
        break;
      case 'MEDIUM':
        score -= 5;
        break;
      case 'LOW':
        score -= 2;
        break;
    }
  });
  score = Math.max(0, score);
  
  return {
    postId: post.id,
    title: content.title || 'N/A',
    category: post.category,
    locale,
    issues,
    metrics,
    score
  };
}

function generateReport(audits: PostAudit[]): string {
  let report = '# AUDITORÍA DE MARKETING DIGITAL - BLOG MANDALATICKETS\n\n';
  report += `Fecha: ${new Date().toLocaleDateString('es-MX', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}\n\n`;
  
  report += `Total de posts auditados: ${audits.length}\n\n`;
  
  // Resumen ejecutivo
  const criticalIssues = audits.filter(a => 
    a.issues.some(i => i.severity === 'CRITICAL')
  ).length;
  const highIssues = audits.filter(a => 
    a.issues.some(i => i.severity === 'HIGH')
  ).length;
  const avgScore = audits.reduce((sum, a) => sum + a.score, 0) / audits.length;
  const postsWithContent = audits.filter(a => a.metrics.hasBody).length;
  const postsWithoutContent = audits.length - postsWithContent;
  
  report += '## RESUMEN EJECUTIVO\n\n';
  report += `- **Posts con problemas críticos**: ${criticalIssues} (${Math.round(criticalIssues * 100 / audits.length)}%)\n`;
  report += `- **Posts con problemas altos**: ${highIssues} (${Math.round(highIssues * 100 / audits.length)}%)\n`;
  report += `- **Score promedio**: ${avgScore.toFixed(1)}/100\n`;
  report += `- **Posts con contenido**: ${postsWithContent} (${Math.round(postsWithContent * 100 / audits.length)}%)\n`;
  report += `- **Posts sin contenido**: ${postsWithoutContent} (${Math.round(postsWithoutContent * 100 / audits.length)}%)\n\n`;
  
  // Distribución por categoría
  const byCategory: Record<CategoryId, PostAudit[]> = {
    'cancun': [],
    'tulum': [],
    'playa-del-carmen': [],
    'los-cabos': [],
    'puerto-vallarta': [],
    'general': []
  };
  
  audits.forEach(audit => {
    byCategory[audit.category].push(audit);
  });
  
  report += '## DISTRIBUCIÓN POR CATEGORÍA\n\n';
  Object.entries(byCategory).forEach(([category, categoryAudits]) => {
    if (categoryAudits.length === 0) return;
    const avgScore = categoryAudits.reduce((sum, a) => sum + a.score, 0) / categoryAudits.length;
    const withContent = categoryAudits.filter(a => a.metrics.hasBody).length;
    report += `### ${category.toUpperCase()}\n`;
    report += `- Total: ${categoryAudits.length} posts\n`;
    report += `- Con contenido: ${withContent}\n`;
    report += `- Score promedio: ${avgScore.toFixed(1)}/100\n\n`;
  });
  
  // Posts sin contenido
  const emptyPosts = audits.filter(a => !a.metrics.hasBody);
  if (emptyPosts.length > 0) {
    report += '## POSTS SIN CONTENIDO\n\n';
    emptyPosts.forEach(audit => {
      report += `### Post #${audit.postId}: ${audit.title}\n`;
      report += `- **Categoría**: ${audit.category}\n`;
      report += `- **Idioma**: ${audit.locale}\n`;
      report += `- **Score**: ${audit.score}/100\n`;
      report += `- **Problemas**: ${audit.issues.length}\n\n`;
    });
  }
  
  // Detalle completo por post
  report += '## DETALLE COMPLETO POR POST\n\n';
  audits.forEach(audit => {
    report += `### Post #${audit.postId}: ${audit.title}\n`;
    report += `- **Categoría**: ${audit.category}\n`;
    report += `- **Idioma**: ${audit.locale}\n`;
    report += `- **Score**: ${audit.score}/100 ${audit.score >= 80 ? '✅' : audit.score >= 60 ? '⚠️' : '❌'}\n`;
    report += `- **Palabras**: ${audit.metrics.wordCount}\n`;
    report += `- **H1**: ${audit.metrics.h1Count} | **H2**: ${audit.metrics.h2Count} | **H3**: ${audit.metrics.h3Count}\n`;
    report += `- **Enlaces internos**: ${audit.metrics.internalLinks} | **Externos**: ${audit.metrics.externalLinks}\n`;
    report += `- **Menciones de venues**: ${audit.metrics.venueMentions}\n`;
    report += `- **CTAs**: ${audit.metrics.ctaCount}\n`;
    report += `- **Imágenes**: ${audit.metrics.imageCount}\n`;
    report += `- **Problemas encontrados**: ${audit.issues.length}\n\n`;
    
    if (audit.issues.length > 0) {
      audit.issues.forEach((issue, idx) => {
        const severityEmoji = {
          'CRITICAL': '🔴',
          'HIGH': '🟠',
          'MEDIUM': '🟡',
          'LOW': '🔵'
        }[issue.severity];
        
        report += `#### ${severityEmoji} [${issue.severity}] ${issue.type}\n`;
        report += `- ${issue.message}\n`;
        if (issue.recommendation) {
          report += `- **Recomendación**: ${issue.recommendation}\n`;
        }
        report += '\n';
      });
    }
    
    report += '---\n\n';
  });
  
  // Recomendaciones generales
  report += '## RECOMENDACIONES GENERALES\n\n';
  report += '1. **Contenido mínimo**: Todos los posts deben tener al menos 800-1200 palabras para SEO óptimo\n';
  report += '2. **Estructura**: Usar H1 único, múltiples H2 y H3 para mejor organización\n';
  report += '3. **Enlaces internos**: Mínimo 2-3 enlaces internos por post para mejor SEO\n';
  report += '4. **Menciones de venues**: Posts de categorías específicas deben mencionar al menos un venue\n';
  report += '5. **CTAs**: Incluir llamadas a la acción para convertir visitantes\n';
  report += '6. **Imágenes**: Agregar imágenes relevantes con alt text descriptivo\n';
  report += '7. **Títulos y excerpts**: Optimizar para 30-65 caracteres (título) y 70-155 (excerpt)\n';
  report += '8. **Keywords**: Asegurar que las palabras clave del título aparezcan en el contenido\n';
  
  return report;
}

// Ejecutar auditoría
function main() {
  console.log('Iniciando auditoría de marketing digital...\n');
  
  const allAudits: PostAudit[] = [];
  
  // Auditar todos los posts en todos los idiomas
  blogPosts.forEach(post => {
    (['es', 'en', 'fr', 'pt'] as const).forEach(locale => {
      const audit = auditPost(post, locale);
      allAudits.push(audit);
    });
  });
  
  console.log(`Auditoría completada: ${allAudits.length} posts revisados\n`);
  
  // Generar reporte
  const report = generateReport(allAudits);
  
  // Guardar reporte
  const reportPath = path.join(__dirname, '..', 'AUDITORIA_MARKETING_DIGITAL.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  
  console.log(`Reporte guardado en: ${reportPath}`);
  console.log('\nResumen:');
  console.log(`- Total de posts: ${allAudits.length}`);
  console.log(`- Posts con contenido: ${allAudits.filter(a => a.metrics.hasBody).length}`);
  console.log(`- Posts sin contenido: ${allAudits.filter(a => !a.metrics.hasBody).length}`);
  console.log(`- Score promedio: ${(allAudits.reduce((sum, a) => sum + a.score, 0) / allAudits.length).toFixed(1)}/100`);
}

main();



