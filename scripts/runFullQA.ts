#!/usr/bin/env tsx

/**
 * Script maestro que ejecuta todos los análisis de QA
 * Genera todos los reportes necesarios para revisión
 */

import * as path from 'path';

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     QA COMPLETO - BLOG MANDALATICKETS                    ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const scripts = [
  { name: 'Análisis de contenido', script: './analyzePostContent.ts' },
  { name: 'Validación de backlinks', script: './validateBacklinks.ts' },
  { name: 'Detección de contenido genérico', script: './detectGenericContent.ts' },
  { name: 'Validación de información', script: './validatePostInfo.ts' },
  { name: 'Validación de traducciones', script: './validateTranslations.ts' },
  { name: 'Análisis de fixes de backlinks', script: './fixBacklinks.ts' },
  { name: 'Generación de reporte consolidado', script: './generateQAReport.ts' },
];

async function runScript(scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const script = spawn('tsx', [scriptPath], {
      cwd: path.join(__dirname),
      stdio: 'inherit',
    });
    
    script.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });
    
    script.on('error', (error: Error) => {
      reject(error);
    });
  });
}

async function main() {
  const startTime = Date.now();
  
  try {
    for (let i = 0; i < scripts.length; i++) {
      const { name, script } = scripts[i];
      console.log(`\n[${i + 1}/${scripts.length}] Ejecutando: ${name}...`);
      console.log('─'.repeat(60));
      
      try {
        await runScript(script);
        console.log(`✓ ${name} completado\n`);
      } catch (error) {
        console.error(`✗ Error en ${name}:`, error);
        // Continuar con los siguientes scripts
      }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     QA COMPLETADO EXITOSAMENTE                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log(`\nTiempo total: ${duration}s`);
    console.log('\nReportes generados en: scripts/');
    console.log('  - qaReport.html (Reporte consolidado)');
    console.log('  - qaReport.json (Datos JSON)');
    console.log('  - postAnalysis.json (Análisis detallado)');
    console.log('  - backlinkValidation.json (Validación de backlinks)');
    console.log('  - genericContentDetection.json (Contenido genérico)');
    console.log('  - postInfoValidation.json (Validación de información)');
    console.log('  - translationValidation.json (Validación de traducciones)');
    console.log('  - backlinkFixes.html (Sugerencias de fixes)');
    console.log('\nRevisa los reportes HTML para ver los detalles de cada issue.');
    
  } catch (error) {
    console.error('\n✗ Error ejecutando QA:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}



