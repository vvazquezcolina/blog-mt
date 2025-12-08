import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

/**
 * Script para generar lista de todas las imágenes descargadas
 */

async function generateImageList() {
  const blogImagesPath = join(process.cwd(), 'public', 'assets', 'blog-images');
  const outputPath = join(process.cwd(), 'scripts', 'IMAGENES_DESCARGADAS.txt');
  
  if (!existsSync(blogImagesPath)) {
    console.log('No existe el directorio de imágenes');
    return;
  }
  
  const images: Array<{
    path: string;
    relativePath: string;
    size: number;
    postId: string;
    locale: string;
    imageNumber: string;
  }> = [];
  
  // Recorrer estructura: blog-images/{postId}/{locale}/image-{n}.jpg
  const postDirs = readdirSync(blogImagesPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  for (const postId of postDirs) {
    const postPath = join(blogImagesPath, postId);
    const localeDirs = readdirSync(postPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    
    for (const locale of localeDirs) {
      const localePath = join(postPath, locale);
      const files = readdirSync(localePath)
        .filter(f => f.startsWith('image-') && f.endsWith('.jpg'))
        .sort();
      
      for (const file of files) {
        const filePath = join(localePath, file);
        const stats = statSync(filePath);
        const imageNumber = file.replace('image-', '').replace('.jpg', '');
        const relativePath = `/assets/blog-images/${postId}/${locale}/${file}`;
        
        images.push({
          path: filePath,
          relativePath,
          size: stats.size,
          postId,
          locale,
          imageNumber,
        });
      }
    }
  }
  
  // Generar lista formateada
  let output = '='.repeat(80) + '\n';
  output += 'LISTA DE IMÁGENES DESCARGADAS PARA REVISIÓN\n';
  output += '='.repeat(80) + '\n\n';
  output += `Total de imágenes: ${images.length}\n\n`;
  
  // Agrupar por post
  const byPost: Record<string, typeof images> = {};
  for (const img of images) {
    if (!byPost[img.postId]) {
      byPost[img.postId] = [];
    }
    byPost[img.postId].push(img);
  }
  
  for (const [postId, postImages] of Object.entries(byPost).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))) {
    output += `\nPOST ${postId}:\n`;
    output += '-'.repeat(80) + '\n';
    
    for (const img of postImages.sort((a, b) => a.imageNumber.localeCompare(b.imageNumber))) {
      const sizeKB = (img.size / 1024).toFixed(2);
      output += `  ${img.relativePath}\n`;
      output += `    Locale: ${img.locale} | Imagen: ${img.imageNumber} | Tamaño: ${sizeKB} KB\n`;
    }
  }
  
  // Agregar URLs si hay reporte
  const reportPath = join(process.cwd(), 'scripts', 'image-download-report.json');
  if (existsSync(reportPath)) {
    try {
      const reportContent = await readFile(reportPath, 'utf-8');
      const report = JSON.parse(reportContent);
      
      output += '\n\n' + '='.repeat(80) + '\n';
      output += 'URLs ORIGINALES DE LAS IMÁGENES\n';
      output += '='.repeat(80) + '\n\n';
      
      for (const entry of report) {
        if (entry.success && entry.url) {
          const task = entry.task;
          output += `${task.postId}/${task.locale}/image-${task.imageNumber}.jpg\n`;
          output += `  URL: ${entry.url}\n`;
          output += `  Venue: ${task.venueName} | Destino: ${task.destination}\n\n`;
        }
      }
    } catch (e) {
      // Ignorar si no se puede leer el reporte
    }
  }
  
  await writeFile(outputPath, output, 'utf-8');
  console.log(`✅ Lista generada: ${outputPath}`);
  console.log(`   Total imágenes: ${images.length}`);
}

if (require.main === module) {
  generateImageList().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { generateImageList };


