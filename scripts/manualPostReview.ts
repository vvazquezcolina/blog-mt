/**
 * Script para revisión manual de posts
 * Genera un reporte HTML interactivo para revisar post por post en todos los idiomas
 * Verifica: contenido coherente, sin repeticiones, sin información inventada
 */

import { blogPosts, getPostContent } from '../data/blogPosts';
import { generatePostContent } from '../utils/contentGenerator';
import * as fs from 'fs';
import * as path from 'path';

interface PostReview {
  id: string;
  title: string;
  category: string;
  content: {
    es: { title: string; excerpt: string; body: string };
    en: { title: string; excerpt: string; body: string };
    fr: { title: string; excerpt: string; body: string };
    pt: { title: string; excerpt: string; body: string };
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTextSnippets(content: string, maxLength: number = 200): string[] {
  const text = stripHtml(content);
  const sentences = text.split(/[.!?]\s+/);
  const snippets: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i].length > 50) {
      snippets.push(sentences[i].substring(0, maxLength));
    }
  }
  
  return snippets.slice(0, 10); // Máximo 10 snippets por post
}

function findSimilarContent(reviews: PostReview[]): Map<string, string[]> {
  const similarities = new Map<string, string[]>();
  
  for (let i = 0; i < reviews.length; i++) {
    const post1 = reviews[i];
    const snippets1 = extractTextSnippets(post1.content.es.body);
    
    for (let j = i + 1; j < reviews.length; j++) {
      const post2 = reviews[j];
      const snippets2 = extractTextSnippets(post2.content.es.body);
      
      // Buscar snippets similares
      const similarSnippets: string[] = [];
      snippets1.forEach(snippet1 => {
        snippets2.forEach(snippet2 => {
          // Comparar usando palabras clave
          const words1 = snippet1.toLowerCase().split(/\s+/).filter(w => w.length > 4);
          const words2 = snippet2.toLowerCase().split(/\s+/).filter(w => w.length > 4);
          
          const commonWords = words1.filter(w => words2.includes(w));
          if (commonWords.length >= 5) {
            // Si comparten 5+ palabras significativas, puede ser similar
            const similarity = commonWords.length / Math.max(words1.length, words2.length);
            if (similarity > 0.3) {
              similarSnippets.push(snippet1.substring(0, 150));
            }
          }
        });
      });
      
      if (similarSnippets.length > 0) {
        const key = `${post1.id}-${post2.id}`;
        similarities.set(key, similarSnippets);
      }
    }
  }
  
  return similarities;
}

function generateHTMLReport(reviews: PostReview[], similarities: Map<string, string[]>): string {
  let html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Revisión Manual de Posts - Blog MandalaTickets</title>
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
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1A69D9;
      margin-bottom: 10px;
      border-bottom: 3px solid #1A69D9;
      padding-bottom: 10px;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #1A65F5;
    }
    .stat-card h3 {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .stat-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #1A69D9;
    }
    .navigation {
      position: sticky;
      top: 0;
      background: white;
      padding: 15px;
      border: 2px solid #1A69D9;
      border-radius: 8px;
      margin-bottom: 30px;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .nav-controls {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }
    .nav-controls button {
      padding: 10px 20px;
      background: #1A69D9;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }
    .nav-controls button:hover {
      background: #1557b8;
    }
    .nav-controls button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .current-post-info {
      flex: 1;
      font-weight: bold;
      color: #333;
    }
    .post-selector {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    .post-review {
      margin-bottom: 40px;
      padding: 25px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
    }
    .post-review.hidden {
      display: none;
    }
    .post-header {
      background: linear-gradient(135deg, #1A69D9 0%, #66F7EE 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -25px -25px 20px -25px;
    }
    .post-header h2 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .post-meta {
      display: flex;
      gap: 20px;
      font-size: 14px;
      opacity: 0.9;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      background: rgba(255,255,255,0.3);
    }
    .language-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .tab {
      padding: 12px 24px;
      background: #f8f9fa;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #666;
      transition: all 0.3s;
    }
    .tab:hover {
      background: #e9ecef;
    }
    .tab.active {
      background: white;
      color: #1A69D9;
      border-bottom-color: #1A69D9;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .content-section {
      margin-bottom: 25px;
    }
    .content-section h3 {
      color: #1A69D9;
      margin-bottom: 15px;
      font-size: 18px;
      border-left: 4px solid #1A69D9;
      padding-left: 10px;
    }
    .excerpt-box {
      background: #f8f9fa;
      padding: 15px;
      border-left: 4px solid #66F7EE;
      border-radius: 4px;
      font-style: italic;
      margin-bottom: 20px;
    }
    .content-preview {
      background: white;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      max-height: 600px;
      overflow-y: auto;
      line-height: 1.8;
    }
    .content-preview h2, .content-preview h3 {
      margin-top: 20px;
      margin-bottom: 15px;
      color: #1A69D9;
    }
    .content-preview p {
      margin-bottom: 15px;
    }
    .content-preview ul {
      margin-left: 20px;
      margin-bottom: 15px;
    }
    .similarity-warning {
      background: #fff3cd;
      border: 2px solid #ffc107;
      padding: 15px;
      border-radius: 6px;
      margin-top: 20px;
    }
    .similarity-warning h4 {
      color: #856404;
      margin-bottom: 10px;
    }
    .review-notes {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    .review-notes textarea {
      width: 100%;
      min-height: 100px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
    }
    .checklist {
      margin-top: 15px;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      padding: 10px;
      background: white;
      border-radius: 4px;
    }
    .checklist-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .checklist-item label {
      cursor: pointer;
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Revisión Manual de Posts</h1>
    <p class="subtitle">Revisa post por post en todos los idiomas. Verifica contenido coherente, sin repeticiones y sin información inventada.</p>
    
    <div class="stats">
      <div class="stat-card">
        <h3>Total de Posts</h3>
        <div class="value">${reviews.length}</div>
      </div>
      <div class="stat-card">
        <h3>Similitudes Detectadas</h3>
        <div class="value">${similarities.size}</div>
      </div>
      <div class="stat-card">
        <h3>Idiomas por Post</h3>
        <div class="value">4</div>
      </div>
    </div>

    <div class="navigation">
      <div class="nav-controls">
        <button id="prevBtn" onclick="navigatePost(-1)">← Anterior</button>
        <button id="nextBtn" onclick="navigatePost(1)">Siguiente →</button>
        <div class="current-post-info">
          Post <span id="currentPostNum">1</span> de ${reviews.length}
        </div>
        <select class="post-selector" id="postSelector" onchange="goToPost(parseInt(this.value))">
          ${reviews.map((r, i) => `<option value="${i}">Post ${r.id}: ${r.title.substring(0, 60)}...</option>`).join('')}
        </select>
      </div>
    </div>

    ${reviews.map((review, index) => `
      <div class="post-review" id="post-${index}" data-index="${index}" ${index === 0 ? '' : 'style="display: none;"'}>
        <div class="post-header">
          <h2>Post ${review.id}: ${review.title}</h2>
          <div class="post-meta">
            <span class="badge">Categoría: ${review.category}</span>
          </div>
        </div>

        <div class="language-tabs">
          <button class="tab active" onclick="switchTab(${index}, 'es')">🇪🇸 Español</button>
          <button class="tab" onclick="switchTab(${index}, 'en')">🇬🇧 English</button>
          <button class="tab" onclick="switchTab(${index}, 'fr')">🇫🇷 Français</button>
          <button class="tab" onclick="switchTab(${index}, 'pt')">🇵🇹 Português</button>
        </div>

        ${(['es', 'en', 'fr', 'pt'] as const).map((lang, langIndex) => `
          <div class="tab-content ${langIndex === 0 ? 'active' : ''}" id="content-${index}-${lang}">
            <div class="content-section">
              <h3>Título</h3>
              <div class="excerpt-box">${review.content[lang].title}</div>
            </div>
            
            <div class="content-section">
              <h3>Excerpt</h3>
              <div class="excerpt-box">${review.content[lang].excerpt}</div>
            </div>
            
            <div class="content-section">
              <h3>Contenido Completo</h3>
              <div class="content-preview">
                ${review.content[lang].body}
              </div>
            </div>
          </div>
        `).join('')}

        ${Array.from(similarities.entries())
          .filter(([key]) => key.startsWith(`${review.id}-`) || key.endsWith(`-${review.id}`))
          .map(([key, snippets]) => `
            <div class="similarity-warning">
              <h4>⚠️ Contenido Similar Detectado</h4>
              <p>Este post tiene contenido similar con otro post (ID: ${key.replace(`${review.id}-`, '').replace(`-${review.id}`, '')})</p>
              <p><strong>Snippets similares:</strong></p>
              <ul>
                ${snippets.slice(0, 3).map(s => `<li>${s}...</li>`).join('')}
              </ul>
            </div>
          `).join('')}

        <div class="review-notes">
          <h3>Notas de Revisión</h3>
          <textarea id="notes-${index}" placeholder="Anota aquí cualquier problema encontrado: contenido repetido, información incorrecta, traducciones incoherentes, etc."></textarea>
          
          <div class="checklist">
            <div class="checklist-item">
              <input type="checkbox" id="check-${index}-coherent">
              <label for="check-${index}-coherent">✓ Contenido coherente y tiene sentido</label>
            </div>
            <div class="checklist-item">
              <input type="checkbox" id="check-${index}-no-repeat">
              <label for="check-${index}-no-repeat">✓ No hay contenido repetido con otros posts</label>
            </div>
            <div class="checklist-item">
              <input type="checkbox" id="check-${index}-no-fake">
              <label for="check-${index}-no-fake">✓ No hay información inventada/incorrecta</label>
            </div>
            <div class="checklist-item">
              <input type="checkbox" id="check-${index}-translations">
              <label for="check-${index}-translations">✓ Traducciones correctas en todos los idiomas</label>
            </div>
            <div class="checklist-item">
              <input type="checkbox" id="check-${index}-reviewed">
              <label for="check-${index}-reviewed">✓ Revisado completamente</label>
            </div>
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  <script>
    let currentPostIndex = 0;
    const totalPosts = ${reviews.length};

    function navigatePost(direction) {
      const newIndex = currentPostIndex + direction;
      if (newIndex >= 0 && newIndex < totalPosts) {
        goToPost(newIndex);
      }
    }

    function goToPost(index) {
      // Ocultar post actual
      document.getElementById(\`post-\${currentPostIndex}\`).style.display = 'none';
      
      // Mostrar nuevo post
      currentPostIndex = index;
      document.getElementById(\`post-\${currentPostIndex}\`).style.display = 'block';
      
      // Actualizar navegación
      document.getElementById('currentPostNum').textContent = currentPostIndex + 1;
      document.getElementById('postSelector').value = currentPostIndex;
      
      // Resetear tabs al español
      switchTab(currentPostIndex, 'es');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function switchTab(postIndex, lang) {
      const langs = ['es', 'en', 'fr', 'pt'];
      const postEl = document.getElementById(\`post-\${postIndex}\`);
      
      // Actualizar tabs
      postEl.querySelectorAll('.tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === langs.indexOf(lang));
      });
      
      // Actualizar contenido
      langs.forEach(l => {
        const content = document.getElementById(\`content-\${postIndex}-\${l}\`);
        if (content) {
          content.classList.toggle('active', l === lang);
        }
      });
    }

    // Guardar notas automáticamente en localStorage
    document.querySelectorAll('textarea[id^="notes-"]').forEach(textarea => {
      const key = \`notes-\${textarea.id}\`;
      textarea.value = localStorage.getItem(key) || '';
      textarea.addEventListener('input', () => {
        localStorage.setItem(key, textarea.value);
      });
    });

    // Guardar checkboxes en localStorage
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      const key = \`check-\${checkbox.id}\`;
      checkbox.checked = localStorage.getItem(key) === 'true';
      checkbox.addEventListener('change', () => {
        localStorage.setItem(key, checkbox.checked);
      });
    });

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && !e.shiftKey && !e.ctrlKey) {
        navigatePost(-1);
      } else if (e.key === 'ArrowRight' && !e.shiftKey && !e.ctrlKey) {
        navigatePost(1);
      }
    });

    // Inicializar
    updateNavButtons();
    function updateNavButtons() {
      document.getElementById('prevBtn').disabled = currentPostIndex === 0;
      document.getElementById('nextBtn').disabled = currentPostIndex === totalPosts - 1;
    }
    
    // Actualizar botones cuando cambia el post
    const originalGoToPost = goToPost;
    goToPost = function(index) {
      originalGoToPost(index);
      updateNavButtons();
    };
  </script>
</body>
</html>`;

  return html;
}

function main() {
  console.log('📝 Generando revisión manual de posts...\n');

  const reviews: PostReview[] = [];

  // Procesar cada post
  for (const post of blogPosts) {
    console.log(`Procesando post ${post.id}...`);

    const contentEs = getPostContent(post, 'es');
    const contentEn = getPostContent(post, 'en');
    const contentFr = getPostContent(post, 'fr');
    const contentPt = getPostContent(post, 'pt');

    let bodyEs = '';
    let bodyEn = '';
    let bodyFr = '';
    let bodyPt = '';
    
    try {
      bodyEs = generatePostContent(post, 'es');
    } catch (error) {
      console.warn(`⚠️  Error generando contenido ES para post ${post.id}:`, error);
      bodyEs = `<p>Error al generar contenido: ${error instanceof Error ? error.message : 'Error desconocido'}</p>`;
    }
    
    try {
      bodyEn = generatePostContent(post, 'en');
    } catch (error) {
      console.warn(`⚠️  Error generando contenido EN para post ${post.id}:`, error);
      bodyEn = `<p>Error generating content: ${error instanceof Error ? error.message : 'Unknown error'}</p>`;
    }
    
    try {
      bodyFr = generatePostContent(post, 'fr');
    } catch (error) {
      console.warn(`⚠️  Error generando contenido FR para post ${post.id}:`, error);
      bodyFr = `<p>Erreur lors de la génération du contenu: ${error instanceof Error ? error.message : 'Erreur inconnue'}</p>`;
    }
    
    try {
      bodyPt = generatePostContent(post, 'pt');
    } catch (error) {
      console.warn(`⚠️  Error generando contenido PT para post ${post.id}:`, error);
      bodyPt = `<p>Erro ao gerar conteúdo: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>`;
    }

    reviews.push({
      id: post.id,
      title: contentEs.title,
      category: post.category,
      content: {
        es: {
          title: contentEs.title,
          excerpt: contentEs.excerpt,
          body: bodyEs,
        },
        en: {
          title: contentEn.title,
          excerpt: contentEn.excerpt,
          body: bodyEn,
        },
        fr: {
          title: contentFr.title,
          excerpt: contentFr.excerpt,
          body: bodyFr,
        },
        pt: {
          title: contentPt.title,
          excerpt: contentPt.excerpt,
          body: bodyPt,
        },
      },
    });
  }

  console.log(`\n✅ Procesados ${reviews.length} posts`);
  console.log('🔍 Buscando contenido similar...');

  // Detectar contenido similar
  const similarities = findSimilarContent(reviews);

  console.log(`⚠️  Encontradas ${similarities.size} similitudes potenciales`);

  // Generar reporte HTML
  console.log('\n📄 Generando reporte HTML...');
  const html = generateHTMLReport(reviews, similarities);

  const outputPath = path.join(process.cwd(), 'scripts', 'manualPostReview.html');
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`\n✅ Reporte generado: ${outputPath}`);
  console.log('\n💡 Instrucciones:');
  console.log('   1. Abre el archivo manualPostReview.html en tu navegador');
  console.log('   2. Revisa cada post en todos los idiomas');
  console.log('   3. Usa las flechas o los botones para navegar entre posts');
  console.log('   4. Cambia entre idiomas usando las pestañas');
  console.log('   5. Anota cualquier problema en el área de notas');
  console.log('   6. Marca los checkboxes cuando completes cada verificación');
  console.log('   7. Los datos se guardan automáticamente en localStorage');
  console.log('\n⌨️  Atajos de teclado:');
  console.log('   ← → : Navegar entre posts');
}

main();
