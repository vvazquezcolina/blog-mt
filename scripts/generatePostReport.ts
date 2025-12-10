import * as fs from 'fs';
import * as path from 'path';
import { blogPosts, getPostContent, findPostBySlug } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import { analyzeAllPosts } from './analyzePostContent';
import { validateAllBacklinks } from './validateBacklinks';
import { detectGenericContentAll } from './detectGenericContent';
import { validateAllPostInfo } from './validatePostInfo';
import { validateAllTranslations } from './validateTranslations';

/**
 * Genera reporte detallado para un post específico
 */
export interface PostDetailReport {
  postId: string;
  category: string;
  locales: {
    [locale: string]: {
      title: string;
      slug: string;
      excerpt: string;
      contentPreview: string; // Primeros 500 caracteres
      venuesMentioned: Array<{ name: string; city: string; url: string }>;
      backlinks: Array<{ url: string; anchorText: string; context: string }>;
      issues: Array<{
        category: string;
        type: string;
        severity: string;
        message: string;
      }>;
      suggestions: string[];
    };
  };
  crossLocaleIssues: string[];
  overallScore: number;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Genera reporte detallado para un post
 */
export function generatePostDetailReport(postId: string): PostDetailReport | null {
  const post = blogPosts.find(p => p.id === postId);
  if (!post) {
    console.error(`Post ${postId} no encontrado`);
    return null;
  }
  
  // Obtener todos los análisis
  const analyses = analyzeAllPosts();
  const backlinkValidations = validateAllBacklinks();
  const genericDetections = detectGenericContentAll();
  const infoValidations = validateAllPostInfo();
  const translationValidations = validateAllTranslations();
  
  // Filtrar datos para este post
  const postAnalysis = analyses.find(a => a.postId === postId);
  const postBacklinks = backlinkValidations.filter(v => v.postId === postId);
  const postGeneric = genericDetections.filter(d => d.postId === postId);
  const postInfo = infoValidations.filter(v => v.postId === postId);
  const postTranslation = translationValidations.find(v => v.postId === postId);
  
  const locales: PostDetailReport['locales'] = {};
  const localesList: ('es' | 'en' | 'fr' | 'pt')[] = ['es', 'en', 'fr', 'pt'];
  
  for (const locale of localesList) {
    const content = getPostContent(post, locale);
    const postContent = generatePostContent(post, locale);
    
    // Obtener venues mencionados
    const analysisLocale = postAnalysis?.locales[locale];
    const venuesMentioned = (analysisLocale?.venuesMentioned || []).map(v => ({
      name: v.name,
      city: v.city,
      url: v.urls[locale] || '',
    }));
    
    // Obtener backlinks
    const backlinkValidation = postBacklinks.find(v => v.locale === locale);
    const backlinks = (backlinkValidation?.backlinksStatus || [])
      .filter(bs => bs.hasBacklink && bs.backlinkUrl)
      .map(bs => ({
        url: bs.backlinkUrl!,
        anchorText: bs.anchorText || '',
        context: bs.context || '',
      }));
    
    // Consolidar issues
    const issues: PostDetailReport['locales'][string]['issues'] = [];
    
    // Issues de backlinks
    const blValidation = postBacklinks.find(v => v.locale === locale);
    if (blValidation) {
      for (const issue of blValidation.issues) {
        issues.push({
          category: 'backlinks',
          type: issue.type,
          severity: issue.severity,
          message: issue.message,
        });
      }
    }
    
    // Issues de contenido genérico
    const genericDetection = postGeneric.find(d => d.locale === locale);
    if (genericDetection && genericDetection.isGeneric) {
      for (const issue of genericDetection.issues) {
        issues.push({
          category: 'generic_content',
          type: issue.type,
          severity: issue.severity,
          message: issue.message,
        });
      }
    }
    
    // Issues de información
    const infoValidation = postInfo.find(v => v.locale === locale);
    if (infoValidation) {
      for (const issue of infoValidation.issues) {
        issues.push({
          category: 'post_info',
          type: issue.type,
          severity: issue.severity,
          message: issue.message,
        });
      }
      for (const suspicious of infoValidation.suspiciousInfo) {
        issues.push({
          category: 'post_info',
          type: 'suspicious_info',
          severity: 'medium',
          message: suspicious.message,
        });
      }
    }
    
    // Sugerencias
    const suggestions: string[] = [];
    if (genericDetection) {
      suggestions.push(...genericDetection.suggestions);
    }
    if (blValidation && blValidation.score < 70) {
      suggestions.push('Agregar backlinks a venues mencionados');
    }
    if (infoValidation && infoValidation.score < 70) {
      suggestions.push('Revisar información factual del post');
    }
    
    locales[locale] = {
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt,
      contentPreview: postContent.substring(0, 500).replace(/<[^>]+>/g, ' ') + '...',
      venuesMentioned,
      backlinks,
      issues,
      suggestions,
    };
  }
  
  // Issues cross-locale
  const crossLocaleIssues: string[] = [];
  if (postTranslation) {
    for (const issue of postTranslation.issues) {
      crossLocaleIssues.push(issue.message);
    }
  }
  if (postAnalysis) {
    crossLocaleIssues.push(...postAnalysis.crossLocaleIssues);
  }
  
  // Calcular score general
  const scores: number[] = [];
  for (const locale of localesList) {
    const blVal = postBacklinks.find(v => v.locale === locale);
    const genDet = postGeneric.find(d => d.locale === locale);
    const infoVal = postInfo.find(v => v.locale === locale);
    
    if (blVal) scores.push(blVal.score);
    if (genDet) scores.push(100 - genDet.genericScore);
    if (infoVal) scores.push(infoVal.score);
  }
  if (postTranslation) {
    scores.push(postTranslation.consistencyScore);
  }
  
  const overallScore = scores.length > 0 
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
    : 0;
  
  // Determinar prioridad
  const totalIssues = Object.values(locales).reduce((sum, l) => sum + l.issues.length, 0) + crossLocaleIssues.length;
  let priority: 'high' | 'medium' | 'low' = 'low';
  if (totalIssues > 10 || overallScore < 50) {
    priority = 'high';
  } else if (totalIssues > 5 || overallScore < 70) {
    priority = 'medium';
  }
  
  return {
    postId,
    category: post.category,
    locales,
    crossLocaleIssues,
    overallScore,
    priority,
  };
}

/**
 * Genera reporte HTML para un post
 */
function generatePostHTMLReport(report: PostDetailReport): string {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Detallado - Post ${report.postId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { color: #1A69D9; margin-bottom: 10px; }
    .post-header {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      margin-bottom: 30px;
    }
    .post-header .meta {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge.category { background: #1A69D9; color: white; }
    .badge.priority-high { background: #ffebee; color: #c62828; }
    .badge.priority-medium { background: #fff3e0; color: #e65100; }
    .badge.priority-low { background: #e8f5e9; color: #2e7d32; }
    .score {
      font-size: 24px;
      font-weight: bold;
      color: #1A69D9;
    }
    .locale-section {
      margin-bottom: 40px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 20px;
    }
    .locale-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #1A69D9;
    }
    .locale-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .locale-slug {
      font-size: 12px;
      color: #666;
      font-family: monospace;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h3 {
      color: #1A69D9;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .venues-list, .backlinks-list {
      list-style: none;
    }
    .venues-list li, .backlinks-list li {
      background: #f8f9fa;
      padding: 10px;
      margin-bottom: 8px;
      border-radius: 4px;
      border-left: 3px solid #1A69D9;
    }
    .issues-list {
      list-style: none;
    }
    .issues-list li {
      background: #fff3e0;
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      border-left: 3px solid #f57c00;
    }
    .issues-list li.severity-high {
      background: #ffebee;
      border-left-color: #d32f2f;
    }
    .issues-list li.severity-low {
      background: #e8f5e9;
      border-left-color: #4caf50;
    }
    .suggestions-list {
      list-style: none;
    }
    .suggestions-list li {
      background: #e3f2fd;
      padding: 10px;
      margin-bottom: 8px;
      border-radius: 4px;
      border-left: 3px solid #1A69D9;
    }
    .content-preview {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.8;
      color: #555;
    }
    .cross-locale-issues {
      background: #fff3e0;
      padding: 20px;
      border-radius: 6px;
      margin-top: 30px;
      border-left: 4px solid #f57c00;
    }
    .cross-locale-issues h2 {
      color: #e65100;
      margin-bottom: 15px;
    }
    .cross-locale-issues ul {
      list-style: none;
    }
    .cross-locale-issues li {
      padding: 8px 0;
      border-bottom: 1px solid #ffe0b2;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reporte Detallado - Post ${report.postId}</h1>
    
    <div class="post-header">
      <div>
        <span class="badge category">${report.category}</span>
        <span class="badge priority-${report.priority}">Prioridad: ${report.priority}</span>
      </div>
      <div class="score">Score: ${report.overallScore.toFixed(1)}/100</div>
    </div>
    
    ${Object.entries(report.locales).map(([locale, data]) => `
      <div class="locale-section">
        <div class="locale-header">
          <div>
            <div class="locale-title">${data.title}</div>
            <div class="locale-slug">/${locale}/posts/${data.slug}</div>
          </div>
          <div>
            <span class="badge">${locale.toUpperCase()}</span>
          </div>
        </div>
        
        <div class="section">
          <h3>Excerpt</h3>
          <p>${data.excerpt}</p>
        </div>
        
        <div class="section">
          <h3>Vista Previa del Contenido</h3>
          <div class="content-preview">${data.contentPreview}</div>
        </div>
        
        <div class="section">
          <h3>Venues Mencionados (${data.venuesMentioned.length})</h3>
          ${data.venuesMentioned.length > 0 ? `
            <ul class="venues-list">
              ${data.venuesMentioned.map(v => `
                <li>
                  <strong>${v.name}</strong> - ${v.city}
                  ${v.url ? `<br><small><a href="${v.url}" target="_blank">${v.url}</a></small>` : ''}
                </li>
              `).join('')}
            </ul>
          ` : '<p>No se mencionan venues específicos</p>'}
        </div>
        
        <div class="section">
          <h3>Backlinks Encontrados (${data.backlinks.length})</h3>
          ${data.backlinks.length > 0 ? `
            <ul class="backlinks-list">
              ${data.backlinks.map(bl => `
                <li>
                  <strong>${bl.anchorText || 'Sin texto'}</strong><br>
                  <a href="${bl.url}" target="_blank">${bl.url}</a><br>
                  <small style="color: #666;">${bl.context.substring(0, 100)}...</small>
                </li>
              `).join('')}
            </ul>
          ` : '<p>No se encontraron backlinks</p>'}
        </div>
        
        <div class="section">
          <h3>Issues (${data.issues.length})</h3>
          ${data.issues.length > 0 ? `
            <ul class="issues-list">
              ${data.issues.map(issue => `
                <li class="severity-${issue.severity}">
                  <strong>[${issue.category}] ${issue.type}</strong> (${issue.severity})<br>
                  ${issue.message}
                </li>
              `).join('')}
            </ul>
          ` : '<p>No se encontraron issues</p>'}
        </div>
        
        <div class="section">
          <h3>Sugerencias (${data.suggestions.length})</h3>
          ${data.suggestions.length > 0 ? `
            <ul class="suggestions-list">
              ${data.suggestions.map(s => `<li>${s}</li>`).join('')}
            </ul>
          ` : '<p>No hay sugerencias</p>'}
        </div>
      </div>
    `).join('')}
    
    ${report.crossLocaleIssues.length > 0 ? `
      <div class="cross-locale-issues">
        <h2>Issues Cross-Locale (${report.crossLocaleIssues.length})</h2>
        <ul>
          ${report.crossLocaleIssues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  </div>
</body>
</html>`;
  
  return html;
}

/**
 * Genera reportes para todos los posts o uno específico
 */
function generateAllPostReports(postId?: string): void {
  if (postId) {
    const report = generatePostDetailReport(postId);
    if (report) {
      const html = generatePostHTMLReport(report);
      const htmlPath = path.join(__dirname, `postReport-${postId}.html`);
      fs.writeFileSync(htmlPath, html, 'utf-8');
      console.log(`Reporte generado: ${htmlPath}`);
    }
  } else {
    // Generar para todos los posts con issues
    console.log('Generando reportes para todos los posts...\n');
    const { generateConsolidatedReport } = require('./generateQAReport');
    const consolidatedReport = generateConsolidatedReport();
    const postsWithIssues = consolidatedReport.posts.filter(p => 
      p.issues.backlinks > 0 || p.issues.genericContent > 0 || p.issues.postInfo > 0 || p.issues.translations > 0
    );
    
    for (const post of postsWithIssues.slice(0, 20)) { // Limitar a los primeros 20
      const report = generatePostDetailReport(post.postId);
      if (report) {
        const html = generatePostHTMLReport(report);
        const htmlPath = path.join(__dirname, `postReport-${post.postId}.html`);
        fs.writeFileSync(htmlPath, html, 'utf-8');
      }
    }
    
    console.log(`\nGenerados ${postsWithIssues.length} reportes individuales`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const postId = process.argv[2];
  generateAllPostReports(postId);
}



