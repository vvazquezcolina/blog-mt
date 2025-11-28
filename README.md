# Blog MandalaTickets

Blog oficial de MandalaTickets con contenido sobre eventos, fiestas y vida nocturna en los mejores destinos de México.

## Características

- 🏠 **Home del Blog**: Página principal con artículos destacados y categorías
- 📂 **Categorías**: 6 categorías organizadas por destinos (Cancún, Tulum, Playa del Carmen, Los Cabos, Puerto Vallarta, General)
- 📝 **100 Artículos**: Listado completo de entradas del blog
- 🌐 **Multiidioma**: Soporte para Español, Inglés, Francés y Portugués
- 🎨 **Diseño Moderno**: Interfaz atractiva y responsive
- ⚡ **Next.js 14**: Construido con las últimas tecnologías
- 🔍 **SEO Optimizado**: Metadata completa, structured data, y URLs SEO-friendly

## Categorías

1. **Cancún** - Todo sobre eventos, fiestas y vida nocturna en Cancún
2. **Tulum** - Guías, eventos y experiencias únicas en Tulum
3. **Playa del Carmen** - Descubre la escena nocturna y eventos en Playa del Carmen
4. **Los Cabos** - Eventos exclusivos y experiencias en Los Cabos
5. **Puerto Vallarta** - Beach clubs, fiestas y eventos en Puerto Vallarta
6. **General** - Contenido general sobre eventos y vida nocturna

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
/
├── app/
│   ├── [locale]/           # Rutas localizadas (es, en, fr, pt)
│   │   ├── page.tsx       # Home del blog
│   │   ├── categorias/    # Páginas de categorías
│   │   └── posts/         # Páginas de posts
│   ├── layout.tsx         # Layout raíz
│   └── globals.css        # Estilos globales
├── components/
│   ├── Header.tsx          # Componente de header
│   ├── Footer.tsx         # Componente de footer
│   ├── CategoryCard.tsx   # Tarjeta de categoría
│   ├── PostCard.tsx       # Tarjeta de post
│   └── LanguageSwitcher.tsx # Selector de idioma
├── data/
│   ├── blogPosts.ts       # Datos de posts y categorías
│   ├── blogPostTranslations.ts # Traducciones de posts
│   └── imageMap.json      # Mapeo de imágenes
├── i18n/
│   ├── config.ts          # Configuración de idiomas
│   ├── index.ts           # Helpers de traducción
│   └── translations/      # Archivos de traducción (es, en, fr, pt)
├── utils/
│   └── imageUtils.ts      # Utilidades para manejo de imágenes
└── middleware.ts          # Middleware de redirección de locales
```

## Build para Producción

```bash
npm run build
npm start
```

## Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_SITE_URL=https://blog.mandalatickets.com
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo en puerto 3000
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run generate-image-map` - Genera el mapeo de imágenes

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **React 18** - Biblioteca UI
- **i18n** - Sistema de internacionalización personalizado
- **CSS Modules** - Estilos modulares

## Características Técnicas

- ✅ Static Site Generation (SSG) - 442 páginas generadas estáticamente
- ✅ Multiidioma - Soporte para 4 idiomas (ES, EN, FR, PT)
- ✅ SEO Optimizado - Metadata, Open Graph, Twitter Cards, Structured Data
- ✅ Responsive Design - Diseño adaptativo para todos los dispositivos
- ✅ Optimización de Imágenes - Lazy loading y optimización automática

