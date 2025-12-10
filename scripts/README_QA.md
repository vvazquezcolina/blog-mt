# Scripts de QA y Revisión de Contenido

Este directorio contiene scripts para realizar QA exhaustivo y revisión de contenido del blog MandalaTickets.

## Scripts Disponibles

### Scripts de Análisis

1. **analyzePostContent.ts** - Análisis inicial de todos los posts
   - Detecta venues mencionados
   - Extrae backlinks presentes
   - Genera mapeo inicial de issues
   - Genera: `postAnalysis.json`, `analysisSummary.json`

2. **validateBacklinks.ts** - Validación de backlinks
   - Verifica que cada venue mencionado tenga su backlink correcto
   - Valida URLs según VENUES_GUIDE.md
   - Genera: `backlinkValidation.json`, `backlinkValidationSummary.json`

3. **detectGenericContent.ts** - Detección de contenido genérico
   - Detecta frases genéricas repetitivas
   - Verifica especificidad del contenido
   - Genera: `genericContentDetection.json`, `genericContentSummary.json`

4. **validatePostInfo.ts** - Validación de información factual
   - Verifica horarios, ubicaciones, tipos de música
   - Detecta información potencialmente falsa
   - Genera: `postInfoValidation.json`, `postInfoValidationSummary.json`

5. **validateTranslations.ts** - Validación de consistencia entre traducciones
   - Verifica que los mismos venues estén en todos los idiomas
   - Valida consistencia de backlinks
   - Genera: `translationValidation.json`, `translationValidationSummary.json`

### Scripts de Reportes

6. **generateQAReport.ts** - Genera reporte consolidado
   - Consolida todos los análisis
   - Genera reporte HTML y JSON
   - Prioriza posts con más problemas
   - Genera: `qaReport.html`, `qaReport.json`

7. **generatePostReport.ts** - Genera reporte detallado por post
   - Reporte individual para cada post
   - Muestra issues por idioma
   - Genera: `postReport-{postId}.html`

### Scripts de Corrección

8. **fixBacklinks.ts** - Análisis de fixes de backlinks
   - Genera sugerencias de corrección
   - Identifica backlinks faltantes/incorrectos
   - Genera: `backlinkFixes.json`, `backlinkFixes.html`, `backlinkFixesSuggestions.txt`

### Script Maestro

9. **runFullQA.ts** - Ejecuta todos los análisis
   - Ejecuta todos los scripts en secuencia
   - Genera todos los reportes
   - Muestra resumen final

## Uso

### Ejecutar QA completo

```bash
npm run qa:full
```

### Ejecutar análisis individual

```bash
# Análisis inicial
npm run qa:analyze

# Validar backlinks
npm run qa:backlinks

# Detectar contenido genérico
npm run qa:generic

# Validar información
npm run qa:info

# Validar traducciones
npm run qa:translations

# Analizar fixes de backlinks
npm run qa:fixes

# Generar reporte consolidado
npm run qa:report

# Generar reporte de un post específico
npm run qa:post -- 1
```

## Archivos Generados

Todos los reportes se generan en el directorio `scripts/`:

### Reportes JSON
- `postAnalysis.json` - Análisis completo de posts
- `backlinkValidation.json` - Validación de backlinks
- `genericContentDetection.json` - Detección de contenido genérico
- `postInfoValidation.json` - Validación de información
- `translationValidation.json` - Validación de traducciones
- `backlinkFixes.json` - Sugerencias de fixes
- `qaReport.json` - Reporte consolidado

### Reportes HTML
- `qaReport.html` - Reporte consolidado visual
- `backlinkFixes.html` - Sugerencias de fixes visuales
- `postReport-{id}.html` - Reporte individual por post

### Resúmenes JSON
- `analysisSummary.json`
- `backlinkValidationSummary.json`
- `genericContentSummary.json`
- `postInfoValidationSummary.json`
- `translationValidationSummary.json`
- `backlinkFixesSummary.json`

## Checklist de Validación

Cada post se valida contra:

### Backlinks
- [ ] Si menciona un venue específico, debe tener backlink a ese venue
- [ ] El backlink debe usar la URL correcta según VENUES_GUIDE.md
- [ ] El anchor text debe ser relevante
- [ ] Debe haber al menos 1-2 backlinks relevantes por post

### Contenido
- [ ] No es texto genérico (menciona venues, lugares, detalles específicos)
- [ ] Información factual es correcta (horarios, ubicaciones, tipos de música)
- [ ] No contiene información inventada o falsa
- [ ] Es relevante para el título y categoría del post
- [ ] Longitud adecuada (1000-1500 palabras)

### Traducciones
- [ ] Mismos venues mencionados en todos los idiomas
- [ ] Mismos backlinks en todos los idiomas
- [ ] Traducción natural, no literal
- [ ] Consistencia en terminología

## Venues Documentados

Los scripts utilizan `VENUES_GUIDE.md` como referencia para:
- URLs de MandalaTickets por venue e idioma
- Anchor texts sugeridos para SEO
- Información sobre tipos de música y ubicaciones

## Notas

- Los scripts no modifican automáticamente el código
- Las sugerencias de fixes deben ser revisadas y aplicadas manualmente
- Los reportes HTML son interactivos y fáciles de revisar
- Se recomienda ejecutar `qa:full` antes de hacer cambios importantes



