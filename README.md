# Blog MandalaTickets

Blog oficial de MandalaTickets con contenido sobre eventos, fiestas y vida nocturna en los mejores destinos de México.

## Características

- 🏠 **Home del Blog**: Página principal con artículos destacados y categorías
- 📂 **Categorías**: 6 categorías temáticas organizadas
- 📝 **100 Artículos**: Listado completo de posibles entradas del blog
- 🎨 **Diseño Moderno**: Interfaz atractiva y responsive
- ⚡ **Next.js 14**: Construido con las últimas tecnologías

## Categorías

1. **Eventos Destacados** - Cobertura de eventos populares
2. **Guías de Destinos** - Información sobre destinos turísticos
3. **Consejos para Asistentes** - Tips y recomendaciones
4. **Entrevistas con Artistas** - Conversaciones exclusivas
5. **Promociones y Ofertas** - Descuentos y paquetes especiales
6. **Noticias de la Industria** - Tendencias y actualizaciones

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:4000](http://localhost:4000) en tu navegador.

## Estructura del Proyecto

```
/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Home del blog
│   ├── categorias/         # Páginas de categorías
│   ├── posts/              # Páginas de posts
│   └── globals.css         # Estilos globales
├── components/
│   ├── Header.tsx          # Componente de header
│   ├── Footer.tsx          # Componente de footer
│   ├── CategoryCard.tsx    # Tarjeta de categoría
│   └── PostCard.tsx        # Tarjeta de post
└── data/
    └── blogPosts.ts        # Datos de posts y categorías
```

## Build para Producción

```bash
npm run build
npm start
```

## Tecnologías

- Next.js 14
- TypeScript
- React 18
- CSS Modules

