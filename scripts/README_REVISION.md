# 📸 GUÍA DE REVISIÓN DE IMÁGENES

## ✅ Estado Actual (5 de Diciembre, 2024)

### Descargas Completadas
- **Nuevas imágenes descargadas hoy**: 79
- **Fallidas (quota agotada)**: 23
- **Total imágenes en sistema**: 1163

### 📄 Archivos para Revisión

#### 1. **RUTAS COMPLETAS** (Todas las imágenes)
📁 `scripts/RUTAS_COMPLETAS_REVISION.txt`
- Contiene las **1163 rutas** de todas las imágenes
- Formato: `/assets/blog-images/{postId}/{locale}/image-{n}.jpg`
- **USAR ESTE ARCHIVO PARA REVISIÓN COMPLETA**

#### 2. **NUEVAS IMÁGENES DE HOY** (Con URLs originales)
📁 `scripts/NUEVAS_IMAGENES_HOY.txt`
- Contiene las **79 nuevas imágenes** descargadas hoy
- Formato: `RUTA|URL_ORIGINAL|VENUE`
- Ejemplo: `1/es/image-1.jpg|https://...|Mandala Beach`

#### 3. **Lista Detallada** (Con tamaños)
📁 `scripts/IMAGENES_DESCARGADAS.txt`
- Lista completa con detalles: post, locale, número, tamaño en KB

#### 4. **Reporte JSON** (Con toda la información)
📁 `scripts/image-download-report.json`
- Reporte completo en JSON con URLs, venues, queries, etc.

---

## 🔍 Cómo Revisar las Imágenes

### Opción 1: Ver todas las rutas
```bash
cat scripts/RUTAS_COMPLETAS_REVISION.txt
```

### Opción 2: Ver solo las nuevas de hoy
```bash
cat scripts/NUEVAS_IMAGENES_HOY.txt
```

### Opción 3: Ver con URLs originales
```bash
cat scripts/NUEVAS_IMAGENES_HOY.txt | head -20
```

### Opción 4: Buscar por post
```bash
grep "^1/" scripts/RUTAS_COMPLETAS_REVISION.txt
```

---

## ⏭️ Para Continuar Mañana

### Estado Actual
- ✅ 79 imágenes descargadas exitosamente
- ❌ 23 imágenes pendientes (quota agotada)
- 📋 Estado guardado en: `scripts/ESTADO_PARA_MANANA.json`

### Continuar Descarga
```bash
npm run download-all-blog-images
```

El script automáticamente:
- ✅ Lee el estado previo
- ✅ Continúa desde donde se quedó
- ✅ Solo descarga las 23 imágenes pendientes
- ✅ Guarda el nuevo estado al finalizar

### Ver Progreso
```bash
# Ver log
tail -50 scripts/download-log.txt

# Ver cuántas imágenes hay
find public/assets/blog-images -name "*.jpg" | wc -l

# Ver estado
cat scripts/ESTADO_PARA_MANANA.json
```

---

## 📊 Filtros Aplicados

- ✅ **Fecha**: Desde 2022
- ✅ **Tamaño**: Large
- ✅ **Tipo**: Photo
- ✅ **Color**: Color
- ✅ **Formato**: JPG
- ✅ **Excluye**: Hoteles, resorts, competencia (Coco Bongo, Coco Beach, Señor Frog)

---

## 📁 Estructura de Archivos

```
scripts/
├── RUTAS_COMPLETAS_REVISION.txt    ← TODAS LAS RUTAS (1163)
├── NUEVAS_IMAGENES_HOY.txt         ← NUEVAS DE HOY CON URLs (79)
├── IMAGENES_DESCARGADAS.txt        ← Lista detallada
├── image-download-report.json       ← Reporte completo
├── ESTADO_PARA_MANANA.json         ← Estado para continuar
├── CONTINUAR_MANANA.md             ← Instrucciones
└── download-log.txt                ← Log de ejecución
```

---

## 🎯 Próximos Pasos

1. **Revisar imágenes**: Usar `RUTAS_COMPLETAS_REVISION.txt` o `NUEVAS_IMAGENES_HOY.txt`
2. **Aprobar/Rechazar**: Anotar qué imágenes están bien y cuáles no
3. **Continuar mañana**: Ejecutar `npm run download-all-blog-images` para las 23 pendientes


