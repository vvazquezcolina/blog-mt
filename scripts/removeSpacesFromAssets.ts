import * as fs from 'fs';
import * as path from 'path';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'PoolFotos');

// Mapeo de nombres antiguos a nuevos (sin espacios)
const FOLDER_RENAMES: Record<string, string> = {
  'Pool Fotos': 'PoolFotos',
  'MB DAY': 'MB_DAY',
  'MB NIGHT': 'MB_NIGHT',
  'SEÑOR FROGS': 'SENIOR_FROGS',
};

// Función para renombrar archivos y carpetas recursivamente
function renameRecursive(dir: string): void {
  if (!fs.existsSync(dir)) {
    console.log(`⚠ Directory not found: ${dir}`);
    return;
  }

  // Primero procesar carpetas (de abajo hacia arriba para evitar problemas)
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const directories: fs.Dirent[] = [];
  const files: fs.Dirent[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      directories.push(entry);
    } else {
      files.push(entry);
    }
  }

  // Procesar subdirectorios primero (recursivo)
  for (const entry of directories) {
    const oldPath = path.join(dir, entry.name);
    renameRecursive(oldPath);
  }

  // Renombrar carpetas
  for (const entry of directories) {
    const oldPath = path.join(dir, entry.name);
    let newName = entry.name;

    // Aplicar renombres específicos primero
    if (FOLDER_RENAMES[entry.name]) {
      newName = FOLDER_RENAMES[entry.name];
    } else if (entry.name.includes(' ')) {
      // Reemplazar espacios con guiones bajos
      newName = entry.name.replace(/\s+/g, '_');
    }

    if (newName !== entry.name) {
      const newPath = path.join(dir, newName);
      if (fs.existsSync(newPath)) {
        console.log(`⚠ Skipping (exists): ${entry.name} -> ${newName}`);
      } else {
        console.log(`📁 Renaming folder: ${entry.name} -> ${newName}`);
        fs.renameSync(oldPath, newPath);
      }
    }
  }

  // Renombrar archivos
  for (const entry of files) {
    const oldPath = path.join(dir, entry.name);
    let newName = entry.name;

    // Reemplazar espacios con guiones bajos en nombres de archivos
    if (entry.name.includes(' ')) {
      newName = entry.name.replace(/\s+/g, '_');
      const newPath = path.join(dir, newName);
      if (fs.existsSync(newPath)) {
        console.log(`⚠ Skipping (exists): ${entry.name} -> ${newName}`);
      } else {
        console.log(`📄 Renaming file: ${entry.name} -> ${newName}`);
        fs.renameSync(oldPath, newPath);
      }
    }
  }
}

// Función para actualizar referencias en archivos de código
function updateCodeReferences(): void {
  console.log('\n🔄 Updating code references...');

  const filesToUpdate = [
    'scripts/generateStaticHTML.ts',
    'scripts/generateImageMap.ts',
    'components/PostCard.tsx',
    'app/[locale]/posts/[slug]/page.tsx',
    'data/imageMap.json',
  ];

  const replacements: Array<{ pattern: RegExp; replacement: string }> = [
    // Carpetas - orden importante (más específico primero)
    { pattern: /Pool Fotos/g, replacement: 'PoolFotos' },
    { pattern: /MB DAY/g, replacement: 'MB_DAY' },
    { pattern: /MB NIGHT/g, replacement: 'MB_NIGHT' },
    { pattern: /SEÑOR FROGS/g, replacement: 'SENIOR_FROGS' },
    // Archivos - patrones comunes (reemplazar espacios con guiones bajos)
    { pattern: /MT_Mandala Cancun/g, replacement: 'MT_Mandala_Cancun' },
    { pattern: /MT_Vaquita Cancun/g, replacement: 'MT_Vaquita_Cancun' },
    { pattern: /MT_Mandala PDC/g, replacement: 'MT_Mandala_PDC' },
    { pattern: /MT_Mandala Vta/g, replacement: 'MT_Mandala_Vta' },
    { pattern: /MT_VaquitaPDC/g, replacement: 'MT_Vaquita_PDC' },
    { pattern: /MT_Señor Frogs/g, replacement: 'MT_Senior_Frogs' },
    // Reemplazar cualquier espacio restante en nombres de archivos dentro de rutas
    { pattern: /\/assets\/PoolFotos\/([^"']*?)\s+([^"']*?)\.(jpg|png|jpeg)/g, replacement: (match, p1, p2, ext) => {
      return `/assets/PoolFotos/${p1}${p2.replace(/\s+/g, '_')}.${ext}`;
    }},
  ];

  for (const filePath of filesToUpdate) {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠ File not found: ${filePath}`);
      continue;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    const originalContent = content;

    for (const { pattern, replacement } of replacements) {
      if (typeof replacement === 'function') {
        content = content.replace(pattern, replacement as any);
      } else {
        content = content.replace(pattern, replacement);
      }
    }

    // Reemplazo genérico para cualquier espacio restante en rutas de PoolFotos
    content = content.replace(/\/assets\/PoolFotos\/([^"']*?)\s+([^"']*?)/g, (match) => {
      return match.replace(/\s+/g, '_');
    });

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`✓ Updated: ${filePath}`);
    }
  }
}

// Función principal
function main(): void {
  console.log('🚀 Starting to remove spaces from assets...\n');

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  // Renombrar archivos y carpetas
  console.log('📦 Renaming files and folders...\n');
  renameRecursive(ASSETS_DIR);

  // Actualizar referencias en código
  updateCodeReferences();

  console.log('\n✅ Done! All spaces have been removed from asset names.');
  console.log('⚠️  Please review the changes and test before committing.');
}

main();

