# Guía de Medidas de Imágenes y Elementos Visuales
## Blog MandalaTickets

---

## 🎬 VIDEO HERO (Home)

**Ubicación:** Sección hero en la página principal

**Medidas:**
- **Ancho:** 100% del viewport (full width)
- **Alto:** Mínimo 70vh (70% de la altura del viewport)
- **Formato:** MP4
- **URL:** `https://mandalatickets.com/assets/img/video/n_home.mp4`
- **Aspect Ratio:** Se adapta al contenedor (object-fit: cover)
- **Nota:** El video debe tener buena calidad para verse bien en pantallas grandes

---

## 🖼️ LOGOS

### Logo Header (Navegación)
**Ubicación:** Header superior

**Medidas:**
- **Ancho:** 200px
- **Alto:** 50px
- **Archivo:** `/assets/img/logo_nuevo_azul.png`
- **Formato recomendado:** PNG con transparencia
- **Aspect Ratio:** 4:1

### Logo Footer
**Ubicación:** Footer

**Medidas:**
- **Ancho:** 200px
- **Alto:** 60px (auto, se ajusta proporcionalmente)
- **URL:** `https://mandalatickets.com/assets/img/logo_mt.png`
- **Formato recomendado:** PNG con transparencia
- **Aspect Ratio:** ~3.3:1

---

## 📱 ICONOS DE REDES SOCIALES

**Ubicación:** Footer

**Medidas:**
- **Ancho:** 35px
- **Alto:** 35px
- **Formato:** PNG con transparencia
- **Aspect Ratio:** 1:1 (cuadrado)

**Iconos necesarios:**
- Facebook: `https://mandalatickets.com/assets/img/redes/facebook.png`
- Instagram: `https://mandalatickets.com/assets/img/redes/instagram.png`
- WhatsApp: `https://mandalatickets.com/assets/img/redes/whatsapp_blanco.png`

---

## 💳 MÉTODOS DE PAGO

**Ubicación:** Footer

**Medidas:**
- **Ancho:** 210px
- **Alto:** 60px (auto, se ajusta proporcionalmente)
- **URL:** `https://mandalatickets.com/assets/img/metodos_pago.png`
- **Formato recomendado:** PNG con transparencia
- **Aspect Ratio:** ~3.5:1

---

## ⭐ TRUSTPILOT

**Ubicación:** Footer

**Medidas:**
- **Ancho:** 150px (mínimo), responsive hasta 11% del ancho
- **Alto:** 50px (auto, se ajusta proporcionalmente)
- **URL:** `https://mandalatickets.com/assets/img/trustpilot.svg`
- **Formato:** SVG (vectorial, se escala sin perder calidad)
- **Aspect Ratio:** 3:1

---

## 📝 POSTS - IMAGEN DESTACADA

**Ubicación:** Parte superior de cada post individual

**Medidas:**
- **Ancho:** 100% del contenedor (full width)
- **Alto máximo:** 600px
- **Aspect Ratio recomendado:** 16:9 o 21:9 para mejor visualización
- **Formato:** JPG o WebP (optimizado para web)
- **Resolución mínima:** 1920px de ancho para pantallas grandes
- **Peso recomendado:** < 500KB

**Ejemplo de medidas ideales:**
- Desktop: 1920 x 1080px (16:9)
- Tablet: 1200 x 675px
- Mobile: 800 x 450px

---

## 📸 IMÁGENES DENTRO DEL CONTENIDO DE POSTS

### Imagen Inline (Normal)
**Clase CSS:** `.post-image-inline`

**Medidas:**
- **Ancho máximo:** 100% del contenedor (900px máximo)
- **Alto:** Auto (proporcional)
- **Aspect Ratio:** Flexible, según contenido
- **Formato:** JPG, PNG o WebP
- **Resolución recomendada:** 1800px de ancho máximo

### Imagen Mediana
**Clase CSS:** `.post-image-medium`

**Medidas:**
- **Ancho máximo:** 700px
- **Alto:** Auto (proporcional)
- **Aspect Ratio:** Flexible
- **Resolución recomendada:** 1400px de ancho (2x para retina)

### Imagen Pequeña
**Clase CSS:** `.post-image-small`

**Medidas:**
- **Ancho máximo:** 500px
- **Alto:** Auto (proporcional)
- **Aspect Ratio:** Flexible
- **Resolución recomendada:** 1000px de ancho (2x para retina)

### Imagen Full Width
**Clase CSS:** `.post-image-full`

**Medidas:**
- **Ancho:** 100vw (ancho completo del viewport)
- **Alto:** Auto (proporcional)
- **Aspect Ratio:** Flexible
- **Resolución recomendada:** 2560px de ancho para pantallas 4K

### Galería de Imágenes
**Clase CSS:** `.post-image-gallery`

**Medidas por imagen:**
- **Ancho:** Variable según grid (mínimo 300px por columna)
- **Alto fijo:** 300px
- **Aspect Ratio:** Se ajusta con object-fit: cover
- **Formato:** JPG o WebP
- **Resolución recomendada:** 600px de ancho mínimo por imagen

---

## 🎴 TARJETAS DE POSTS (Post Cards)

**Ubicación:** Grid de posts en home, categorías, etc.

**Medidas de imagen:**
- **Ancho:** 100% del contenedor
- **Alto fijo:** 200px
- **Aspect Ratio:** Se ajusta con object-fit (actualmente muestra emoji 🎉)
- **Formato recomendado:** JPG o WebP
- **Resolución recomendada:** 640px de ancho mínimo
- **Peso recomendado:** < 100KB por imagen

**Medidas de tarjeta completa:**
- **Ancho mínimo:** 320px (responsive)
- **Ancho máximo:** Variable según grid
- **Alto:** Variable según contenido

---

## 🏷️ CATEGORÍAS (Category Cards)

**Ubicación:** Grid de categorías en home

**Medidas de tarjeta:**
- **Ancho mínimo:** 300px (responsive)
- **Ancho máximo:** Variable según grid
- **Alto:** Variable según contenido
- **Padding:** 2rem
- **Border radius:** 12px

**Nota:** Actualmente no tienen imágenes, solo colores de fondo según categoría.

---

## 📐 CONTENEDORES Y ESPACIOS

### Contenedor Principal
- **Ancho máximo:** 1200px
- **Padding lateral:** 2rem (desktop), 1.5rem (mobile)

### Contenedor de Contenido de Post
- **Ancho máximo:** 900px
- **Centrado:** Sí

### Hero Section
- **Alto mínimo:** 70vh
- **Padding vertical:** 8rem (top), 4rem (bottom)

---

## 🎨 ESPECIFICACIONES TÉCNICAS GENERALES

### Formatos Recomendados
- **Fotografías:** WebP (con fallback JPG) o JPG optimizado
- **Logos e iconos:** PNG con transparencia o SVG
- **Ilustraciones:** SVG cuando sea posible
- **Videos:** MP4 (H.264)

### Optimización
- **Compresión:** Usar herramientas como TinyPNG, ImageOptim o Squoosh
- **Lazy Loading:** Implementado automáticamente con Next.js Image
- **Responsive Images:** Next.js genera automáticamente diferentes tamaños

### Peso Máximo Recomendado
- **Hero Video:** < 5MB
- **Imagen destacada post:** < 500KB
- **Imágenes en contenido:** < 300KB cada una
- **Logos:** < 50KB
- **Iconos:** < 20KB

---

## 📱 RESPONSIVE BREAKPOINTS

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

**Nota:** Todas las imágenes deben verse bien en todos los tamaños de pantalla.

---

## ✅ CHECKLIST PARA NUEVAS IMÁGENES

- [ ] Imagen optimizada y comprimida
- [ ] Formato correcto según tipo de contenido
- [ ] Medidas correctas según ubicación
- [ ] Alt text descriptivo para accesibilidad
- [ ] Peso adecuado (< límites recomendados)
- [ ] Versión retina/2x si es necesario
- [ ] Prueba en diferentes dispositivos

---

**Última actualización:** 2025-01-XX
**Versión del documento:** 1.0



