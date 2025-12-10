import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Script para retirar todas las referencias a /assets/blog-images/ del archivo blogPosts.ts
 * Estas son las imágenes que se pusieron incorrectamente ayer
 */

async function removeBlogImages() {
  const filePath = join(process.cwd(), 'data', 'blogPosts.ts');
  
  console.log('🧹 Retirando referencias a /assets/blog-images/...');
  console.log(`   Archivo: ${filePath}`);
  console.log('');
  
  // Leer el archivo
  let content = await readFile(filePath, 'utf-8');
  
  // Contar cuántas referencias hay antes
  const beforeCount = (content.match(/\/assets\/blog-images\//g) || []).length;
  console.log(`   Referencias encontradas: ${beforeCount}`);
  
  if (beforeCount === 0) {
    console.log('✅ No hay referencias a blog-images para eliminar');
    return;
  }
  
  // Patrón para encontrar bloques de imágenes con blog-images
  // Busca desde <div class="post-image-wrapper" hasta el cierre </div>
  const imageBlockPattern = /<div class="post-image-wrapper"[^>]*>[\s\S]*?<img[\s\S]*?src="\/assets\/blog-images\/[^"]*"[\s\S]*?\/>[\s\S]*?<\/div>/g;
  
  // Eliminar todos los bloques de imágenes con blog-images
  content = content.replace(imageBlockPattern, '');
  
  // También eliminar cualquier referencia suelta a blog-images (por si acaso)
  content = content.replace(/src="\/assets\/blog-images\/[^"]*"/g, '');
  
  // Limpiar líneas vacías múltiples (más de 2 seguidas)
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Contar cuántas referencias quedan después
  const afterCount = (content.match(/\/assets\/blog-images\//g) || []).length;
  const removedCount = beforeCount - afterCount;
  
  // Escribir el archivo actualizado
  await writeFile(filePath, content, 'utf-8');
  
  console.log(`✅ Referencias eliminadas: ${removedCount}`);
  console.log(`   Referencias restantes: ${afterCount}`);
  console.log(`   Archivo actualizado: ${filePath}`);
  
  if (afterCount > 0) {
    console.log('');
    console.log('⚠️  Aún quedan algunas referencias. Revisa manualmente.');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  removeBlogImages().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { removeBlogImages };










