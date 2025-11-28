# Migración a HTML Estático

Este proyecto ha sido migrado de Next.js a HTML estático para ser desplegado en una subcarpeta del dominio principal (`www.mandalatickets.com/blog`).

## Cambios Realizados

### 1. Script de Generación de HTML Estático
- **Archivo**: `scripts/generateStaticHTML.ts`
- **Función**: Convierte todos los componentes React y páginas Next.js a HTML estático
- Genera todas las páginas para todos los idiomas (es, en, fr, pt)
- Ajusta todas las rutas para funcionar con el prefijo `/blog`

### 2. Configuración de Build
- **package.json**: El comando `npm run build` ahora genera HTML estático
- **vercel.json**: Configurado para servir archivos estáticos desde la carpeta `dist`
- **Output**: Todos los archivos se generan en la carpeta `dist/`

### 3. Estructura de Archivos Generados
```
dist/
├── index.html (redirect a /blog/es)
├── css/
│   └── globals.css
├── assets/
│   └── [todos los assets de public/]
├── es/
│   ├── index.html
│   ├── categorias/
│   │   ├── index.html
│   │   └── [categoryId]/
│   │       └── index.html
│   └── posts/
│       ├── index.html
│       └── [slug]/
│           └── index.html
├── en/
│   └── [misma estructura]
├── fr/
│   └── [misma estructura]
└── pt/
    └── [misma estructura]
```

## Cómo Usar

### Generar HTML Estático
```bash
npm run build
```

Esto generará todos los archivos HTML estáticos en la carpeta `dist/`.

### Desarrollo Local (Next.js)
Si necesitas trabajar en el proyecto original con Next.js:
```bash
npm run build:next  # Build de Next.js
npm run dev         # Desarrollo con Next.js
```

### Despliegue en Vercel
El proyecto está configurado para desplegarse automáticamente en Vercel:
1. Vercel detectará automáticamente la carpeta `dist/` como output
2. Las rutas se servirán con el prefijo `/blog`
3. El redirect desde `/` a `/blog/es` está configurado

## Características Mantenidas

✅ **Multiidioma**: Todos los idiomas (es, en, fr, pt) funcionan correctamente
✅ **SEO**: Metadata, Open Graph, Twitter Cards, Structured Data
✅ **Analytics**: Google Analytics y Facebook Pixel integrados
✅ **Responsive**: Diseño adaptativo mantenido
✅ **Rutas**: Todas las rutas funcionan con el prefijo `/blog`

## Rutas Importantes

- Home: `/blog/es`, `/blog/en`, `/blog/fr`, `/blog/pt`
- Categorías: `/blog/[locale]/categorias`
- Categoría individual: `/blog/[locale]/categorias/[categoryId]`
- Todos los posts: `/blog/[locale]/posts`
- Post individual: `/blog/[locale]/posts/[slug]`

## Notas Técnicas

1. **Prefijo `/blog`**: Todas las rutas internas y assets usan el prefijo `/blog`
2. **Assets**: Los assets se copian a `dist/assets/` y se referencian con `/blog/assets/...`
3. **CSS**: El CSS se copia a `dist/css/` y se referencia como `/blog/css/globals.css`
4. **JavaScript**: El JavaScript necesario para el menú hamburguesa y sticky CTA está embebido en cada página

## Troubleshooting

### Si el build falla:
1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Verifica que los archivos de datos existan: `data/blogPosts.ts`, `i18n/translations/*.json`
3. Revisa los logs del build para identificar errores específicos

### Si las rutas no funcionan en producción:
1. Verifica que `vercel.json` esté configurado correctamente
2. Asegúrate de que el prefijo `/blog` esté en todas las rutas
3. Verifica que los assets se estén sirviendo correctamente

## Próximos Pasos

1. **Probar en Vercel**: Desplegar y verificar que todo funcione correctamente
2. **Verificar SEO**: Asegurarse de que todas las meta tags y structured data funcionen
3. **Optimización**: Considerar minificar HTML/CSS/JS si es necesario
4. **CDN**: Los assets pueden servirse desde un CDN para mejor rendimiento

