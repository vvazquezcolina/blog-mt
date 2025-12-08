# Resumen de Imágenes Descargadas

## Estado Actual

El script `download-all-blog-images.ts` está descargando imágenes para todos los posts con los siguientes filtros:

### Filtros Aplicados:
- ✅ **Fecha**: Solo imágenes desde 2022 en adelante
- ✅ **Tamaño**: Large (imágenes grandes)
- ✅ **Tipo**: Photo (solo fotos, no clipart)
- ✅ **Color**: Color (solo imágenes a color)
- ✅ **Formato**: JPG
- ✅ **Exclusión de hoteles**: -hotel -resort -booking -expedia
- ✅ **Exclusión de competencia**: -"Coco Bongo" -"Coco Beach" -"Señor Frog"
- ✅ **Filtrado adicional**: Excluye URLs de hoteles conocidos y verifica relevancia

### Venues Soportados:
- Mandala Beach / Mandala Beach Day / Mandala Beach Night
- D'Cave
- La Vaquita
- House Of Fiesta (HOF)
- Rakata

## Ejecutar el Script

```bash
npm run download-all-blog-images
```

El script:
1. Analiza todos los 100 posts
2. Identifica venues mencionados en cada post
3. Genera queries de búsqueda específicas para cada venue
4. Descarga imágenes con los filtros aplicados
5. Guarda las imágenes en: `public/assets/blog-images/{postId}/{locale}/image-{number}.jpg`
6. Genera un reporte en: `scripts/image-download-report.json`

## Nota sobre Quota

La API de Google Custom Search tiene una quota de 100 búsquedas por día. Si el script se detiene por quota, espera hasta el siguiente día (medianoche PST) para continuar.

## Verificar Progreso

```bash
# Ver cuántas imágenes se han descargado
find public/assets/blog-images -name "*.jpg" | wc -l

# Ver el reporte
cat scripts/image-download-report.json | jq '.[] | select(.success == true) | .task.postId + "/" + .task.locale + "/image-" + .task.imageNumber + ".jpg"'
```


