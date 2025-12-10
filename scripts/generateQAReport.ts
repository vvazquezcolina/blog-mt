import * as fs from 'fs';
import * as path from 'path';
import { analyzeAllPosts, type PostAnalysis } from './analyzePostContent';
import { validateAllBacklinks, type BacklinkValidation } from './validateBacklinks';
import { detectGenericContentAll, type GenericContentDetection } from './detectGenericContent';
import { validateAllPostInfo, type PostInfoValidation } from './validatePostInfo';
import { validateAllTranslations, type TranslationValidation } from './validateTranslations';

/**
 * Genera reporte consolidado HTML con todos los problemas encontrados
 */
export interface ConsolidatedReport {
  summary: {
    totalPosts: number;
    totalLocales: number;
    postsWithIssues: number;
    totalIssues: number;
    issuesByCategory: {
      backlinks: number;
      genericContent: number;
      postInfo: number;
      translations: number;
    };
  };
  posts: Array<{
    postId: string;
    category: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    issues: {
      backlinks: number;
      genericContent: number;
      postInfo: number;
      translations: number;
    };
    locales: string[];
  }>;
}

/**
 * Genera reporte consolidado
 */
export function generateConsolidatedReport(): ConsolidatedReport {
  console.log('Generando reporte consolidado...\n');
  console.log('1. Analizando posts...');
  const analyses = analyzeAllPosts();
  
  console.log('2. Validando backlinks...');
  const backlinkValidations = validateAllBacklinks();
  
  console.log('3. Detectando contenido genérico...');
  const genericDetections = detectGenericContentAll();
  
  console.log('4. Validando información...');
  const infoValidations = validateAllPostInfo();
  
  console.log('5. Validando traducciones...');
  const translationValidations = validateAllTranslations();
  
  // Consolidar datos
  const postMap = new Map<string, {
    postId: string;
    category: string;
    title: string;
    backlinkIssues: number;
    genericIssues: number;
    infoIssues: number;
    translationIssues: number;
    locales: Set<string>;
  }>();
  
  // Procesar backlink validations
  for (const validation of backlinkValidations) {
    const key = validation.postId;
    if (!postMap.has(key)) {
      postMap.set(key, {
        postId: validation.postId,
        category: validation.category,
        title: validation.title,
        backlinkIssues: 0,
        genericIssues: 0,
        infoIssues: 0,
        translationIssues: 0,
        locales: new Set(),
      });
    }
    const post = postMap.get(key)!;
    post.backlinkIssues += validation.issues.length;
    post.locales.add(validation.locale);
  }
  
  // Procesar generic detections
  for (const detection of genericDetections) {
    const key = detection.postId;
    if (!postMap.has(key)) {
      postMap.set(key, {
        postId: detection.postId,
        category: detection.category,
        title: detection.title,
        backlinkIssues: 0,
        genericIssues: 0,
        infoIssues: 0,
        translationIssues: 0,
        locales: new Set(),
      });
    }
    const post = postMap.get(key)!;
    if (detection.isGeneric) {
      post.genericIssues += detection.issues.length;
    }
    post.locales.add(detection.locale);
  }
  
  // Procesar info validations
  for (const validation of infoValidations) {
    const key = validation.postId;
    if (!postMap.has(key)) {
      postMap.set(key, {
        postId: validation.postId,
        category: validation.category,
        title: validation.title,
        backlinkIssues: 0,
        genericIssues: 0,
        infoIssues: 0,
        translationIssues: 0,
        locales: new Set(),
      });
    }
    const post = postMap.get(key)!;
    post.infoIssues += validation.issues.length + validation.suspiciousInfo.length;
    post.locales.add(validation.locale);
  }
  
  // Procesar translation validations
  for (const validation of translationValidations) {
    const key = validation.postId;
    if (!postMap.has(key)) {
      postMap.set(key, {
        postId: validation.postId,
        category: validation.category,
        title: validation.title,
        backlinkIssues: 0,
        genericIssues: 0,
        infoIssues: 0,
        translationIssues: 0,
        locales: new Set(),
      });
    }
    const post = postMap.get(key)!;
    post.translationIssues += validation.issues.length;
  }
  
  // Convertir a array y calcular prioridades
  const posts = Array.from(postMap.values()).map(post => {
    const totalIssues = post.backlinkIssues + post.genericIssues + post.infoIssues + post.translationIssues;
    let priority: 'high' | 'medium' | 'low' = 'low';
    
    if (totalIssues > 10 || post.backlinkIssues > 5 || post.genericIssues > 5) {
      priority = 'high';
    } else if (totalIssues > 5 || post.backlinkIssues > 2 || post.genericIssues > 2) {
      priority = 'medium';
    }
    
    return {
      postId: post.postId,
      category: post.category,
      title: post.title,
      priority,
      issues: {
        backlinks: post.backlinkIssues,
        genericContent: post.genericIssues,
        postInfo: post.infoIssues,
        translations: post.translationIssues,
      },
      locales: Array.from(post.locales),
    };
  });
  
  // Ordenar por prioridad y número de issues
  posts.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    const totalA = a.issues.backlinks + a.issues.genericContent + a.issues.postInfo + a.issues.translations;
    const totalB = b.issues.backlinks + b.issues.genericContent + b.issues.postInfo + b.issues.translations;
    return totalB - totalA;
  });
  
  const summary = {
    totalPosts: posts.length,
    totalLocales: posts.reduce((sum, p) => sum + p.locales.length, 0),
    postsWithIssues: posts.filter(p => 
      p.issues.backlinks > 0 || p.issues.genericContent > 0 || p.issues.postInfo > 0 || p.issues.translations > 0
    ).length,
    totalIssues: posts.reduce((sum, p) => 
      sum + p.issues.backlinks + p.issues.genericContent + p.issues.postInfo + p.issues.translations,
      0
    ),
    issuesByCategory: {
      backlinks: posts.reduce((sum, p) => sum + p.issues.backlinks, 0),
      genericContent: posts.reduce((sum, p) => sum + p.issues.genericContent, 0),
      postInfo: posts.reduce((sum, p) => sum + p.issues.postInfo, 0),
      translations: posts.reduce((sum, p) => sum + p.issues.translations, 0),
    },
  };
  
  return {
    summary,
    posts,
  };
}

/**
 * Genera reporte HTML
 */
function generateHTMLReport(report: ConsolidatedReport): string {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte QA - Blog MandalaTickets</title>
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
    h1 {
      color: #1A69D9;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #1A65F5;
    }
    .summary-card h3 {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .summary-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #1A69D9;
    }
    .issues-breakdown {
      margin-bottom: 30px;
    }
    .issues-breakdown h2 {
      margin-bottom: 15px;
      color: #333;
    }
    .issues-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }
    .issue-type {
      background: #fff;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    .issue-type .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    .issue-type .count {
      font-size: 24px;
      font-weight: bold;
      color: #d32f2f;
    }
    .posts-section {
      margin-top: 40px;
    }
    .posts-section h2 {
      margin-bottom: 20px;
      color: #333;
    }
    .priority-filter {
      margin-bottom: 20px;
    }
    .priority-filter button {
      padding: 8px 16px;
      margin-right: 10px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    .priority-filter button.active {
      background: #1A69D9;
      color: white;
      border-color: #1A69D9;
    }
    .post-card {
      background: #f8f9fa;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 6px;
      border-left: 4px solid #ccc;
    }
    .post-card.priority-high {
      border-left-color: #d32f2f;
    }
    .post-card.priority-medium {
      border-left-color: #f57c00;
    }
    .post-card.priority-low {
      border-left-color: #388e3c;
    }
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
    }
    .post-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      flex: 1;
    }
    .post-meta {
      font-size: 12px;
      color: #666;
      margin-left: 20px;
    }
    .post-id {
      display: inline-block;
      background: #e0e0e0;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      margin-right: 10px;
    }
    .post-category {
      display: inline-block;
      background: #1A69D9;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      margin-right: 10px;
    }
    .priority-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .priority-badge.high {
      background: #ffebee;
      color: #c62828;
    }
    .priority-badge.medium {
      background: #fff3e0;
      color: #e65100;
    }
    .priority-badge.low {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .post-issues {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      margin-top: 15px;
    }
    .issue-item {
      background: white;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }
    .issue-item .label {
      font-size: 11px;
      color: #666;
      margin-bottom: 5px;
    }
    .issue-item .count {
      font-size: 18px;
      font-weight: bold;
      color: #d32f2f;
    }
    .issue-item .count.zero {
      color: #4caf50;
    }
    .locales {
      margin-top: 10px;
      font-size: 12px;
      color: #666;
    }
    .locales span {
      display: inline-block;
      background: #e3f2fd;
      padding: 2px 6px;
      border-radius: 3px;
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reporte QA - Blog MandalaTickets</h1>
    <p class="subtitle">Generado el ${new Date().toLocaleString('es-MX')}</p>
    
    <div class="summary">
      <div class="summary-card">
        <h3>Total Posts</h3>
        <div class="value">${report.summary.totalPosts}</div>
      </div>
      <div class="summary-card">
        <h3>Posts con Issues</h3>
        <div class="value">${report.summary.postsWithIssues}</div>
      </div>
      <div class="summary-card">
        <h3>Total Issues</h3>
        <div class="value">${report.summary.totalIssues}</div>
      </div>
      <div class="summary-card">
        <h3>Total Locales</h3>
        <div class="value">${report.summary.totalLocales}</div>
      </div>
    </div>
    
    <div class="issues-breakdown">
      <h2>Desglose de Issues por Categoría</h2>
      <div class="issues-grid">
        <div class="issue-type">
          <div class="label">Backlinks</div>
          <div class="count">${report.summary.issuesByCategory.backlinks}</div>
        </div>
        <div class="issue-type">
          <div class="label">Contenido Genérico</div>
          <div class="count">${report.summary.issuesByCategory.genericContent}</div>
        </div>
        <div class="issue-type">
          <div class="label">Información</div>
          <div class="count">${report.summary.issuesByCategory.postInfo}</div>
        </div>
        <div class="issue-type">
          <div class="label">Traducciones</div>
          <div class="count">${report.summary.issuesByCategory.translations}</div>
        </div>
      </div>
    </div>
    
    <div class="posts-section">
      <h2>Posts con Issues (${report.posts.filter(p => 
        p.issues.backlinks > 0 || p.issues.genericContent > 0 || p.issues.postInfo > 0 || p.issues.translations > 0
      ).length})</h2>
      
      ${report.posts
        .filter(p => p.issues.backlinks > 0 || p.issues.genericContent > 0 || p.issues.postInfo > 0 || p.issues.translations > 0)
        .map(post => `
        <div class="post-card priority-${post.priority}">
          <div class="post-header">
            <div>
              <span class="post-id">Post ${post.postId}</span>
              <span class="post-category">${post.category}</span>
              <span class="priority-badge ${post.priority}">${post.priority}</span>
            </div>
            <div class="post-meta">
              ${post.locales.map(locale => `<span>${locale.toUpperCase()}</span>`).join(' ')}
            </div>
          </div>
          <div class="post-title">${post.title}</div>
          <div class="post-issues">
            <div class="issue-item">
              <div class="label">Backlinks</div>
              <div class="count ${post.issues.backlinks === 0 ? 'zero' : ''}">${post.issues.backlinks}</div>
            </div>
            <div class="issue-item">
              <div class="label">Genérico</div>
              <div class="count ${post.issues.genericContent === 0 ? 'zero' : ''}">${post.issues.genericContent}</div>
            </div>
            <div class="issue-item">
              <div class="label">Información</div>
              <div class="count ${post.issues.postInfo === 0 ? 'zero' : ''}">${post.issues.postInfo}</div>
            </div>
            <div class="issue-item">
              <div class="label">Traducciones</div>
              <div class="count ${post.issues.translations === 0 ? 'zero' : ''}">${post.issues.translations}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
  
  return html;
}

/**
 * Guarda reporte consolidado
 */
function saveConsolidatedReport(): void {
  const report = generateConsolidatedReport();
  
  // Guardar JSON
  const jsonPath = path.join(__dirname, 'qaReport.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\nReporte JSON guardado en: ${jsonPath}`);
  
  // Guardar HTML
  const html = generateHTMLReport(report);
  const htmlPath = path.join(__dirname, 'qaReport.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`Reporte HTML guardado en: ${htmlPath}`);
  
  // Mostrar resumen en consola
  console.log('\n=== RESUMEN DEL REPORTE QA ===');
  console.log(`Total posts: ${report.summary.totalPosts}`);
  console.log(`Posts con issues: ${report.summary.postsWithIssues}`);
  console.log(`Total issues: ${report.summary.totalIssues}`);
  console.log('\nIssues por categoría:');
  console.log(`  Backlinks: ${report.summary.issuesByCategory.backlinks}`);
  console.log(`  Contenido Genérico: ${report.summary.issuesByCategory.genericContent}`);
  console.log(`  Información: ${report.summary.issuesByCategory.postInfo}`);
  console.log(`  Traducciones: ${report.summary.issuesByCategory.translations}`);
  console.log(`\nPosts con prioridad alta: ${report.posts.filter(p => p.priority === 'high').length}`);
  console.log(`Posts con prioridad media: ${report.posts.filter(p => p.priority === 'medium').length}`);
  console.log(`Posts con prioridad baja: ${report.posts.filter(p => p.priority === 'low').length}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('Generando reporte QA consolidado...\n');
  saveConsolidatedReport();
  console.log('\nReporte generado exitosamente!');
}



