# Historial de Modificaciones — The Compiled Soul Portfolio 2026

Este documento registra los cambios significativos realizados al proyecto en orden cronológico. Su propósito es servir de contexto para asistentes de IA que retomen el trabajo en cualquier punto.

> **Cómo leer este archivo:** Cada entrada describe _qué_ se cambió, _por qué_ se tomó esa decisión, y _qué archivos_ se modificaron. Lee de arriba hacia abajo para entender el estado actual del proyecto.

---

## [2026-05-20] — Cursor de terminal parpadeante interactivo en el buscador de Resume

### Objetivo
Implementar un cursor parpadeante estilo terminal (un caret block verde neón) al inicio del buscador de la página Resume cuando está vacío, logrando que destaque de manera interactiva su capacidad de búsqueda, con una animación de desvanecimiento ("fade") sumamente fluida y soporte progresivo para el cursor nativo de escritura en navegadores modernos.

### Cambios realizados

#### `src/components/ClientResume.tsx`
- **Estructura HTML**: Envolvimos el `<input>` dentro de un contenedor relativo `div` con la clase `styles.resume__inputWrapper` y agregamos un `<span className={styles.resume__caret} />` condicional cuando `searchQuery === ''`.
- **Limpieza de TypeScript**: Añadimos tipado explícito a la constante `experiences` (`string`, `string[]`) para resolver 6 errores implícitos de tipo `any` preexistentes en TypeScript y lograr una compilación perfectamente limpia.

#### `src/styles/pages/_resume.module.scss`
- **`&__inputWrapper`**: Define el contexto de posicionamiento relativo para el cursor personalizado.
- **`&__caret`**: Cursor bloque retro de terminal de `8px` de ancho, color verde neón (`$clr-brand-primary`), opacidad inicial del `75%` y un resplandor sutil. Configurado con animación suave de respiración (`ease-in-out` de `1.4s`) y transición de opacidad de `0.2s` para entrada/salida.
- **Transición suave en focus**: La regla `&__input:focus ~ &__caret` remueve la animación y reduce la opacidad a `0` para que el cursor personalizado haga un fade-out suave al hacer foco, en lugar de ocultarse abruptamente.
- **`&__input`**: Agregado `caret-shape: block` para que el cursor nativo de escritura de los navegadores basados en Chromium (Chrome, Edge, Opera, etc.) también se renderice como un bloque sólido retro, haciendo juego perfecto.
- **`&::placeholder`**: Agregado `text-indent: 14px` para desplazar a la derecha únicamente el texto del placeholder cuando el buscador no tiene foco, garantizando que el cursor de `8px` parpadee libremente en ese espacio sin solapar las letras.
- **`@keyframes resume-caret-blink`**: Define el ciclo de respiración suave de la opacidad del cursor personalizado.

### Archivos modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `src/components/ClientResume.tsx` | MOD | Input wrapper, span del cursor dinámico y tipado explícito de `experiences` |
| `src/styles/pages/_resume.module.scss` | MOD | Estilos del wrapper, cursor, transición en focus, `caret-shape: block`, `text-indent` en placeholder y keyframes |

---

## [2026-05-12] — Imágenes responsive por contexto (portrait en desktop, landscape en mobile)

### Objetivo

Resolver el problema de que una sola imagen de proyecto se usaba tanto en las tarjetas del home (3:4 portrait) como en el hero del detail page (21:9 landscape), causando crops/estiramientos indeseados. Se implementó un sistema de dos imágenes por proyecto con switch automático según viewport.

###  Cambios

#### `tina/config.ts`
- Campo `image` renombrado a **"Cover Image (Landscape)"** — imagen apaisada para el hero del detail page.
- Nuevo campo **`imagePortrait`** (`type: "image"`) — **"Card Image (Portrait 3:4)"** — imagen vertical optimizada para las tarjetas del home.
- Ambos campos son opcionales. Si `imagePortrait` no se define, se hace fallback a `image` (comportamiento anterior).

#### `src/content.config.ts`
- Agregado `imagePortrait: z.string().optional()` al schema Zod de `projectsCollection` (línea 18).

#### `src/components/ClientHome.tsx`
- **Featured image** (línea ~179): reemplazado `<img>` por `<picture>` con `<source media="(max-width: 768px)" srcSet={image}>`. En mobile carga la landscape, en desktop la portrait.
- **Grid card images** (línea ~236): mismo patrón `<picture>` con media query.
- Fallback a `image` cuando `imagePortrait` no está definido.

#### `src/styles/pages/_home.module.scss`
- **Featured container** (`&__featuredImageContainer`): `aspect-ratio: 16 / 9` en mobile, `3 / 4` en desktop (`@include mq(md)`).
- **Grid card container** (`&ImageContainer`): mismo patrón — `16 / 9` en mobile, `3 / 4` en desktop.

### Comportamiento resultante

| Viewport | Imagen | Aspect ratio |
|----------|--------|--------------|
| Mobile (≤768px) | `image` (landscape) | 16:9 |
| Desktop (>768px) | `imagePortrait` (o fallback a `image`) | 3:4 |

El navegador carga solo la imagen que necesita gracias al elemento `<picture>` con `media` query — no hay doble request.

### Archivos modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `tina/config.ts` | MOD | Campo `imagePortrait` agregado, `image` renombrado |
| `src/content.config.ts` | MOD | `imagePortrait` en schema Zod |
| `src/components/ClientHome.tsx` | MOD | `<picture>` con media query en featured y grid cards |
| `src/styles/pages/_home.module.scss` | MOD | Aspect ratio responsive (16:9 mobile → 3:4 desktop) |

---

## [2026-05-12] — Sistema de fondo energy-grid con spotlights GPU y cursor interactivo

### Objetivo

Reemplazar el sistema de fondo animado anterior (`grid-reveal-bg` con `transform: translate` en pseudo-elementos de 200vw×200vh) por un sistema más eficiente y visualmente superior basado en `@property` CSS para animación de custom properties en el compositor GPU. Se añadió además un efecto interactivo de relleno de celdas de la grilla al mover el cursor.

### Cambios

#### `src/styles/abstracts/_mixins.scss`

- **Eliminados:** keyframes `drift-1` / `drift-2` y mixin `grid-reveal-bg`.
- **Agregados:**
  - `@property` declarations para `--eg-x1/y1`, `--eg-x2/y2`, `--eg-x3/y3`, `--eg-pulse` — registran los valores como `<percentage>` o `<number>`, habilitando interpolación directa en el compositor GPU sin pasar por el main thread.
  - Keyframes `eg-drift-1` (26s), `eg-drift-2` (34s), `eg-drift-3` (42s) y `eg-pulse` (5.8s) que animan únicamente las coordenadas `--eg-x/y` de cada spotlight.
  - Mixin `energy-grid-spot` — dibuja un grid coloreado a pantalla completa recortado por un `mask-image: radial-gradient` cuyo centro se desplaza vía las custom properties animadas. Soporta parámetros de color, radio, tamaño de grilla y opacidades de glow.
  - Mixin `energy-grid-bg` — wrapper del sistema. Configura el fondo y aplica los tres spotlights (primary, tertiary, secondary). Incluye regla de `mix-blend-mode: multiply` para `.light &` (tema claro) y soporte de `prefers-reduced-motion`.

#### `src/styles/base/_globals.scss`

- Clase `.bg-grid-reveal` renombrada a `.bg-energy-grid` usando el nuevo mixin `energy-grid-bg()`.

#### `src/layouts/MainLayout.astro`

- HTML del fondo actualizado: `<div class="bg-energy-grid">` con 3 hijos `<div class="eg-spot eg-spot--{color}">`.
- **Script inline cursor grid-fill:** crea un `<canvas>` dinámicamente dentro del wrapper. En cada `mousemove` (throttleado con `requestAnimationFrame`) calcula las celdas de 48px cercanas al cursor dentro de un radio de ~77px y las pinta con `fillRect` alineado exactamente a la grilla. La opacidad de cada celda decae linealmente con la distancia al cursor (máx. 18%). Funciona solo en dispositivos `pointer: fine`. Cambia entre `mix-blend-mode: screen` (dark) y `multiply` (light) mediante `MutationObserver` en el `classList` de `<html>`.

### Decisiones técnicas

| Decisión | Razón |
|----------|-------|
| `@property` en lugar de `transform` | Las custom properties registradas se interpolan en el compositor sin repaints ni layout; los `transform` en capas de 200vw×200vh forzaban compositing layers costosas |
| Solo 3 `eg-spot` (sin `eg-sweep`, `eg-nodes`, `eg-glow`, `eg-beams`) | Balance entre efecto visual y rendimiento; los spotlights son la capa de mayor impacto con el menor costo |
| Canvas para el cursor | El efecto requiere celdas discretas alineadas a la grilla; no es posible replicarlo fielmente con `mask-image` circular en CSS |
| `mix-blend-mode: multiply` en light mode | `screen` es invisible sobre fondos claros (suma hacia blanco); `multiply` oscurece y hace la grilla visible sobre el fondo claro |

### Archivos modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `src/styles/abstracts/_mixins.scss` | MOD | Nuevo sistema `@property` + keyframes + mixins `energy-grid-spot` y `energy-grid-bg` |
| `src/styles/base/_globals.scss` | MOD | `.bg-grid-reveal` → `.bg-energy-grid` |
| `src/layouts/MainLayout.astro` | MOD | Nueva estructura HTML del fondo + script canvas cursor |

---

## [2026-05-12] — Refactor y mejora de grid-reveal-bg

### Objetivo
Optimizar la implementación técnica y el diseño visual de la animación de fondo principal (`grid-reveal-bg`) basándose en feedback de diseño.

### Cambios realizados

#### Refactorización HTML/CSS (`MainLayout.astro` y `_mixins.scss`)
- Se eliminaron los divs vacíos `.wireframe-grid` y `.wireframe-grid-2` en `MainLayout.astro` que ensuciaban el DOM.
- Las dos luces animadas (`drift-1` y `drift-2`) ahora se aplican de forma limpia utilizando pseudo-elementos (`&::before` y `&::after`) en el contenedor `.bg-grid-reveal`.

#### Ajustes de diseño "Calma"
- **Velocidad:** Las animaciones de las luces se ralentizaron sustancialmente (de 40s/50s a 90s/110s) con una curva de easing (`ease-in-out`) para lograr un movimiento mucho más tranquilo.
- **Difuminado:** Se modificó el `mask-image` de los pseudo-elementos. En lugar de partir de un 100% de opacidad en el centro, inician con un 50% de opacidad (`rgba(0,0,0,0.5)`) y se funden progresivamente en un radio más amplio, logrando que el centro de la luz se perciba mucho más suave y orgánico ("difuminado").

### Archivos modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `src/layouts/MainLayout.astro` | MOD | Eliminación de nodos innecesarios del DOM |
| `src/styles/abstracts/_mixins.scss` | MOD | Refactorización a pseudo-elementos, ajuste de timings y mask-image |

## [2026-05-11] — Fallow-02: limpieza de dependencias y archivos MDX rotos

### Objetivo

Segunda pasada de análisis estático con Fallow (dead-code, unused deps, duplicación). Se resolvieron los problemas que causaban fallos en el build de Netlify y se formalizó una dependencia transitiva que podía romper en CI.

### 🧹 Archivos eliminados

| Archivo | Motivo |
|---------|--------|
| `src/content/projects/FOlder-agrado.mdx` | Nombre con mayúsculas causaba case-mismatch silencioso (`p.id` es lowercase en Astro v6). El proyecto ya estaba archivado. |
| `src/content/projects/La-verdad-de-la-mila.mdx` | Proyecto huérfano sin imagen válida, causaba error de build en Netlify. |

### 📦 Cambios en `package.json`

| Paquete | Cambio | Motivo |
|---------|--------|--------|
| `react-dnd` | **Eliminado** de `dependencies` | Nunca fue importado en el código activo. La funcionalidad de drag-and-drop proyectada quedó descartada. |
| `react-dnd-html5-backend` | **Eliminado** de `dependencies` | Peer dep de `react-dnd`, también innecesario. |
| `gray-matter` | **Agregado** a `dependencies` | Era una dependencia transitiva usada explícitamente en 3 archivos (`index.astro`, `[...slug].astro`, `rss.xml.ts`). Sin listarlo en `package.json`, el build falla con package managers estrictos o en entornos CI sin hoisting. |

### 📊 Resultado del análisis Fallow completo

| Métrica | Valor |
|---------|-------|
| Health Score antes | 62/100 (C) |
| Health Score después | ~80/100 (B+) |
| Archivos muertos eliminados | 2 |
| Dependencias eliminadas | 2 (producción) |
| Duplicación de código | 0.0% |
| Dependencias circulares | 0 |

> **Nota sobre `tina/dashboard/`**: Fallow reportó `PortfolioDashboard.tsx` y `dashboardQuery.ts` como archivos muertos (fan_in: 0). Son **falsos positivos**: el Dashboard está registrado como Screen Plugin en `tina/config.ts` via import dinámico que Fallow no traza. No se eliminaron.

### Archivos modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `src/content/projects/FOlder-agrado.mdx` | ELIMINADO | Case-mismatch bug + proyecto archivado |
| `src/content/projects/La-verdad-de-la-mila.mdx` | ELIMINADO | Proyecto huérfano, rompía build de Netlify |
| `package.json` | MOD | Removidos `react-dnd` + `react-dnd-html5-backend`; agregado `gray-matter` |

---

## [2026-05-11] — Fix: Active Navigation State on Deployed Version

### Problema

La navegación activa (texto verde + subrayado animado) funcionaba correctamente en `localhost:4321/resume`, pero no en `aledesign.dev/resume/` (versión desplegada). El link RESUME permanecía en gris en producción.

### Causa raíz

El componente `Navigation.tsx` hacía una comparación **exacta** de strings:
```ts
const isActive = pathname === link.href;
```

- En localhost: `pathname = "/resume"` vs `link.href = "/resume"` ✅ Match
- En producción: `pathname = "/resume/"` vs `link.href = "/resume"` ❌ No match

Netlify añade trailing slashes automáticamente (`/resume/`), pero los hrefs estaban definidos sin ellos.

### Solución

Se normalizó la comparación en `Navigation.tsx` para strip trailing slashes antes de comparar (excepto en la raíz `/`):

```ts
const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
const normalizedHref = link.href === '/' ? '/' : link.href.replace(/\/$/, '');
const isActive = normalizedPathname === normalizedHref;
```

Actualizado en desktop (`.nav__links`, línea ~125) y mobile (`.mobile_overlay__nav`, línea ~224).

### Verificación

- ✅ `localhost:4321/resume` — link verde + subrayado
- ✅ `aledesign.dev/resume/` — link verde + subrayado (post-deploy)
- ✅ Todos los tabs (PROJECTS, RESUME, ABOUT, ARCHIVE) funcionan correctamente en mobile y desktop

### Archivos modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `src/components/Navigation.tsx` | MOD | Normalización de pathname para active state en deploy con trailing slashes |

---

## [2026-05-11] — Footer CMS + Visual Editing en Home y Proyectos

### Objetivo

Completar la cobertura de TinaCMS Visual Editing en todas las páginas del sitio, e implementar edición CMS para el footer via una nueva colección `global`.

### ✨ Visual Editing — Home (hero section)

Se aplicó el mismo patrón `useTina + tinaField` de las páginas estáticas a `ClientHome.tsx`, limitado al hero section para no afectar la lógica de filtros y layout que depende de estado React.

#### `src/pages/index.astro`
- Reemplaza `getEntry('pages', 'home')` por `client.queries.pages({ relativePath: 'home.mdx' })`.
- `exportMetadata` lee de `tinaProps.data.pages`.
- Pasa `query/variables/data` a `ClientHome`. Toda la lógica de proyectos (`getCollection`, `categoryMap`, `gray-matter`) sin cambios.

#### `src/components/ClientHome.tsx`
- Agrega `useTina` + cast a `PageHome`.
- `tinaField` en: `title` (h1), `mission` (KeyValue), `status`, `location`, `timezone` (tres KeyValues del sidebar).
- Props: `pageMeta` reemplazado por `query/variables/data`. `projects` y `exportData` sin cambios.

### ✨ Visual Editing — Proyectos individuales (enfoque híbrido)

Los proyectos usan MDX con componentes React custom (`mdx-grid`, `mdx-card`) que `TinaMarkdown` no puede renderizar. Se adoptó un enfoque híbrido: `useTina` para frontmatter reactivo, `children` (body MDX) intacto.

#### `tina/config.ts`
- `ui.router` agregado a la colección `projects`: mapea `relativePath` a `/projects/{path}`. Habilita el ícono de Visual Editing en el admin para cada proyecto. Soporta rutas planas y anidadas.
- Campos `timeline` (string) y `codeSnippet` (string, textarea) agregados al schema de projects.

#### `src/content.config.ts`
- `timeline` y `codeSnippet` agregados como `z.string().optional()` al schema Zod de projects.

#### `src/pages/projects/[...slug].astro`
- Agrega `client.queries.projects({ relativePath: \`${entry.id}.mdx\` })` junto a `getStaticPaths` existente.
- Pasa `query/variables/data` a `ProjectDetailLayout`. `getCollection`, `render`, `exportData`, `Content` sin cambios.

#### `src/components/ProjectDetailLayout.tsx`
- Agrega `useTina` + cast a `ProjectData`.
- `tinaField` en: `title`, `type`, `status`, `role`, `client`, `image`, `stack`, `timeline`, `codeSnippet`.
- `project` (prop original) se mantiene solo para breadcrumbs (`project.slug`).
- `children` (body MDX con componentes custom) sin tocar.

### ✨ Footer CMS — nueva colección `global`

#### `src/content/global/footer.mdx` — NUEVO
Seed inicial con `copyright` y `links[]` (GitHub, LinkedIn, Bluesky, YouTube).

#### `tina/config.ts`
- Nueva colección `global` con path `src/content/global`, sin `ui.router` (no es una página navegable).
- Campos: `copyright` (string), `links[]` (objetos con `name`, `url`, `icon`).
- `icon` es un dropdown con 14 opciones de redes sociales.

#### `src/content.config.ts`
- Nueva `globalCollection` con schema Zod para `copyright` y `links[]`.
- Exportada en `collections`.

#### `src/layouts/MainLayout.astro`
- `getEntry('global', 'footer')` → pasa `copyright` y `links` como props a `<Footer>`.
- Footer renderiza estáticamente — 0 JS adicional (sigue siendo `client:idle`).

#### `src/components/Footer.tsx`
- Acepta props `{ copyright, links }` con fallback hardcodeado.
- Íconos de redes sociales via `simple-icons@12` (v12 — v13+ eliminó LinkedIn por solicitud de la empresa).
- `BrandIcon` helper renderiza SVG desde el `path` de simple-icons.
- `ICON_MAP` con 14 entradas en lowercase: `github`, `linkedin`, `instagram`, `twitter` (mapea a `siX`), `facebook`, `youtube`, `tiktok`, `behance`, `dribbble`, `whatsapp`, `telegram`, `discord`, `bluesky`, `pinterest`.
- Cada link renderiza con flexbox: ícono SVG a la izquierda + texto.

#### `src/styles/components/_footer.module.scss`
- `.footer__link`: `display: flex`, `align-items: center`, `gap: $size-2`, `transition: color`.
- `.footer__linkIcon`: `flex-shrink: 0`, `opacity: 0.8`.

### Archivos modificados / creados

| Archivo | Tipo | Descripción |
|---|---|---|
| `src/pages/index.astro` | MOD | TinaCMS client para home, props query/variables/data |
| `src/components/ClientHome.tsx` | MOD | useTina + tinaField en hero (title, mission, status, location, timezone) |
| `tina/config.ts` | MOD | ui.router en projects; timeline/codeSnippet; colección global |
| `src/content.config.ts` | MOD | timeline, codeSnippet en projects; nueva globalCollection |
| `src/pages/projects/[...slug].astro` | MOD | client.queries.projects + props Tina |
| `src/components/ProjectDetailLayout.tsx` | MOD | useTina + tinaField en todos los campos del header/sidebar |
| `src/content/global/footer.mdx` | NUEVO | Seed de copyright y links del footer |
| `src/layouts/MainLayout.astro` | MOD | getEntry global/footer → props a Footer |
| `src/components/Footer.tsx` | MOD | Props dinámicas, simple-icons, BrandIcon, ICON_MAP |
| `src/styles/components/_footer.module.scss` | MOD | Estilos flexbox para links con ícono |

### Dependencias agregadas

| Paquete | Versión | Motivo |
|---|---|---|
| `simple-icons` | `^12.4.0` | Íconos SVG de redes sociales. v12 — v13+ eliminó LinkedIn. |

---

## [2026-05-11] — TinaCMS Visual Editing en About, Archive y Resume

### Objetivo

Implementar Visual Editing de TinaCMS en las tres páginas de contenido estático, permitiendo editar campos directamente sobre la página desde el admin panel sin necesidad de usar el formulario clásico.

### Arquitectura del cambio

El patrón es idéntico en las tres páginas:

1. El `.astro` reemplaza `getEntry`/`render` (Astro Content API) por `client.queries.pages({ relativePath })` (TinaCMS GraphQL client).
2. El componente React recibe `{ query, variables, data }` en lugar de `frontmatter`/`children`.
3. `useTina({ query, variables, data })` hace el dato reactivo — se sincroniza con el sidebar del admin cuando la página corre dentro del iframe de Visual Editing.
4. `tinaField(obj, 'campo')` anota elementos DOM con `data-tina-field`, conectando cada nodo al campo del CMS.
5. El body MDX (antes `children` renderizado por Astro) pasa a renderizarse con `<TinaMarkdown content={page.body} />` para ser editable inline.

> `tina/__generated__/` es gitignoreado y se genera al correr `npm run dev`. El import del cliente no existe en el repo — aparece tras el primer build.

### ✨ Cambios

#### `tina/config.ts`
- **`ui.router`** añadido a la colección `pages`: mapea cada documento a su URL (`home → /`, `about → /about`, etc.). Sin este campo el ícono de Visual Editing no aparece en el admin.
- **Template `about`**: campo `philosophies[]` añadido — lista de objetos con `icon`, `accent`, `title`, `description`. Permite editar los cards de "Core Philosophy" desde el CMS.
- **Template `resume`**: campo `education` cambiado de objeto único a **array** (`list: true`) para soportar múltiples entradas (títulos, cursos, capacitaciones).

#### `src/content.config.ts`
- Schema Zod de `education` cambiado de `z.object({...}).optional()` a `z.array(z.object({...})).optional()`.

#### `src/content/pages/about.mdx`
- Añadido el array `philosophies` con los tres cards hardcodeados como primer seed de datos.

#### `src/content/pages/resume.mdx`
- `education` convertido de objeto YAML a array YAML (con `-` por ítem). Datos originales preservados como primer ítem.

#### `src/pages/about.astro`
- Reemplaza `getEntry` + `render` por `client.queries.pages({ relativePath: 'about.mdx' })`.
- Pasa `query`, `variables`, `data` al componente. Elimina `<Content />` como children.

#### `src/components/ClientAbout.tsx`
- Props: `{ frontmatter, children }` → `{ query, variables, data }`.
- Hook `useTina` + cast a `PageAbout`.
- `data-tina-field` en `<h1>` (title) y el div del body.
- Array `philosophies` ahora viene de `page.philosophies` con fallback a `[]`. Los cards se renderizan con `.map()`, íconos mapeados por string (`ICON_MAP`), y `tinaField(item, 'title')` / `tinaField(item, 'description')` en cada card.

#### `src/pages/archive.astro`
- Mismo patrón: reemplaza `getEntry` por `client.queries.pages({ relativePath: 'archive.mdx' })`. Mantiene `getCollection('projects')` para la tabla.

#### `src/components/ClientArchive.tsx`
- Props: `{ projects, pageMeta }` → `{ projects, query, variables, data }`.
- `data-tina-field` en `<h1>` (title) y `<p>` (subtitle).

#### `src/pages/resume.astro`
- Mismo patrón. Mantiene `getCollection('projects')` para los jobs y la construcción de `exportData` (sin cambios en esa lógica).
- `exportMetadata` lee de `tinaProps.data.pages as any` en lugar de `page.data`.

#### `src/components/ClientResume.tsx`
- Props: `{ frontmatter, children, jobs, exportData }` → `{ jobs, query, variables, data, exportData }`.
- `useTina` + cast a `PageResume`.
- Hero: `data-tina-field` en `<h1>`, `location`, `email`, `status`, y el div del body con `<TinaMarkdown>`.
- Skills (sección 02): `tinaField(skillGroup, 'category')` en cada `<h4>`, y `tinaField(item, 'name')` / `tinaField(item, 'value')` en cada fila.
- Education (sección 03): `education` pasa a ser `Education[]`. Render con `.map()`, `tinaField(entry, 'degree')`, `tinaField(entry, 'institution')`, `tinaField(entry, 'year')`.
- `DEFAULT_EDUCATION` convertido a array.
- Experience (sección 01): sin cambios — sigue viniendo de `jobs` (colección `projects`).

### Archivos modificados

| Archivo | Tipo | Descripción |
|---|---|---|
| `tina/config.ts` | MOD | `ui.router` en pages, `philosophies[]` en about, `education` → array en resume |
| `src/content.config.ts` | MOD | `education` → `z.array(z.object(...))` |
| `src/content/pages/about.mdx` | MOD | Seed de `philosophies[]` |
| `src/content/pages/resume.mdx` | MOD | `education` convertido a array YAML |
| `src/pages/about.astro` | MOD | TinaCMS client, props query/variables/data |
| `src/components/ClientAbout.tsx` | MOD | useTina + tinaField + TinaMarkdown + philosophies dinámicas |
| `src/pages/archive.astro` | MOD | TinaCMS client |
| `src/components/ClientArchive.tsx` | MOD | useTina + tinaField en title/subtitle |
| `src/pages/resume.astro` | MOD | TinaCMS client, exportMetadata desde tinaProps |
| `src/components/ClientResume.tsx` | MOD | useTina + tinaField en hero/skills/education, education como array |

---

## [2026-05-10] — RSS Feed enriquecido con imágenes y metadatos extendidos

### Objetivo

Mejorar el feed RSS para que los lectores de feeds muestren imágenes de preview y ofrezcan un contenido estructurado más completo.

### ✨ Cambios

#### `src/pages/rss.xml.ts`

- **Namespaces agregados** al elemento `<rss>`:
  - `xmlns:dc` — Dublin Core, para `<dc:creator>` por item
  - `xmlns:content` — para `<content:encoded>` con HTML completo
  - `xmlns:atom` — para el self-link del feed (`<atom:link rel="self">`)
  - `xmlns:media` — Media RSS (Yahoo), para thumbnails de imagen

- **Por item** se añaden:
  - `<dc:creator>` — autoría por item
  - `<content:encoded>` — bloque HTML con imagen, descripción, rol, stack y link al proyecto
  - `<media:content>` + `<media:thumbnail>` — las etiquetas que los lectores de feeds usan para mostrar la imagen de preview en la lista. **Esta era la causa de que las imágenes no aparecieran en aplicaciones de RSS.**

- **En el canal** se añaden:
  - `<atom:link rel="self">` — self-reference estándar del feed
  - `<lastBuildDate>` — timestamp de última compilación
  - `<generator>` — identificación del generador

- El campo `image` del proyecto se convierte a URL absoluta usando `context.site` antes de incluirse en las etiquetas `media:*`.

---

## [2026-05-09] — Fix: worktrees de Claude indexados como gitlinks rompían el build de Netlify

### Problema

Netlify fallaba en la fase de "preparing repo" con:
```
fatal: No url found for submodule path '.claude/worktrees/cool-leavitt-b31bc6' in .gitmodules
```

Dos directorios dentro de `.claude/worktrees/` habían sido indexados por git como gitlinks (modo `160000`, equivalente a submódulos) antes de que la entrada `.claude/worktrees/` existiera en `.gitignore`. Netlify los interpretaba como submódulos sin URL válida.

### Fix

```bash
git rm --cached ".claude/worktrees/cool-leavitt-b31bc6"
git rm --cached ".claude/worktrees/lucid-elion-87bb7c"
```

Las entradas fueron eliminadas del índice. El `.gitignore` ya tenía `/.claude/worktrees/` — no fue necesario modificarlo.

### Archivos modificados

| Archivo | Tipo | Descripción |
|---|---|---|
| _(git index)_ | MOD | Eliminados dos gitlinks huérfanos de `.claude/worktrees/` |

---

## [2026-05-09] — Scrollbar personalizado

### Objetivo

Reemplazar el scrollbar del navegador por defecto con uno que respete la estética editorial del sitio.

### ✨ Cambios

#### `src/styles/base/_globals.scss`

Se añadieron reglas de scrollbar usando las variables del design system:

- **Track**: `$clr-brand-surface-low` — nivel 1 de superficie, levemente distinto del fondo de página
- **Thumb en reposo**: `on-surface-rgb` al 25% de opacidad — discreto, no distrae
- **Thumb en hover**: `$clr-brand-primary` — verde neón (dark) / verde profundo (light)
- **Ancho**: `8px` — delgado pero funcional
- **Webkit**: reglas `::-webkit-scrollbar*` para Chrome, Edge y Safari
- **Firefox**: `scrollbar-width: thin` + `scrollbar-color` en el elemento `html`
- **Tema claro**: funciona automáticamente porque las CSS custom properties cambian con la clase `.light` en `<html>` — sin código adicional

---

## [2026-05-08] — Cleanup de archivos huérfanos y fix de `formatTitle`

### 🧹 Limpieza de código (fallow analysis)

Se ejecutó `fallow analyze` sobre el proyecto y se tomaron las siguientes acciones:

#### Archivos eliminados
- `src/content/config.ts` — archivo huérfano, no importado en ningún lugar. El schema activo vive en `src/content.config.ts`. La documentación que lo referenciaba fue actualizada.

#### Archivos modificados
- `src/content.config.ts` — se agregaron campos faltantes (`status`, `impact`, `categories`) que existían en el MDX pero no en el schema Zod.
- `src/lib/categories.ts` — se removedió `export` de `ProjectCategoryValue` (tipo interno, no usado externamente).

#### Documentación actualizada
- `README.md` — schema de projects actualizado con campos `status`, `impact`, `points`, `categories`
- `AGENTS.md` y `CLAUDE.md` — referencias corregidas de `src/content/config.ts` → `src/content.config.ts`
- `docs/CHANGELOG.md` — referencias históricas actualizadas

#### Dependencias verificadas (falsos positivos de fallow)
- `react-dnd` + `react-dnd-html5-backend` — se mantienen (planificados para drag-and-drop futuro en TinaCMS)
- `fs-extra` — se mantiene en devDependencies (requerido por `@tinacms/metrics`)

---

### 🐛 Fix: `formatTitle` generaba `<br>` de más

**Síntoma**: En la página About, el título `"Bridging \n // Logic & Soul"` renderizaba dos `<br>` entre "Logic" y "Soul", dejando una línea vacía de más.

**Causa raíz**: En `src/helpers/text-helpers.tsx`, cuando una línea era `" // Logic & Soul"` (el `//` al inicio), `parts = ["", " Logic & Soul"]`. El código rendereaba `<br /><span>Logic & Soul</span>`, pero además el índice de línea agregaba otro `<br />` final entre líneas.

**Fix aplicado** (`src/helpers/text-helpers.tsx`):
- Si `beforeText` está vacío (el `//` está al inicio de la línea), no se agrega `<br />` antes del span
- Se usa `trim()` en cada línea antes de procesarla, ignorando líneas vacías
- Se verifica `(beforeText || afterText)` antes de agregar `<br />` entre líneas

---

### Archivos modificados

| Archivo | Tipo | Descripción |
|---|---|---|
| `src/content/config.ts` | ELIMINADO | Schema huérfano, redundante con `content.config.ts` |
| `src/content.config.ts` | MOD | Campos `status`, `impact`, `categories` agregados |
| `src/lib/categories.ts` | MOD | `ProjectCategoryValue` ya no es exportado |
| `src/helpers/text-helpers.tsx` | MOD | Fix de `<br>` extra en `formatTitle` |
| `README.md` | MOD | Schema de projects actualizado, fecha de última act. |
| `AGENTS.md` | MOD | Referencias corregidas |
| `CLAUDE.md` | MOD | Referencias corregidas |
| `docs/CHANGELOG.md` | MOD | Referencias históricas actualizadas |

---

## [2026-05-08] — Layout Switcher, Filtros Funcionales y Vista Lista

### Objetivo

Agregar dos funcionalidades interactivas a la home: (1) un selector de vista Cards/Lista, y (2) filtros funcionales por categoría de trabajo, gestionables desde TinaCMS sin cambios de código.

---

### ✨ Funcionalidades añadidas

#### Layout Switcher (`# Layout`)
- Se añadió un nuevo bloque `SyntaxCard label="Layout"` en el sidebar de la home, con dos botones: **CARDS** (vista por defecto) y **LIST**.
- El estado `layout: 'cards' | 'list'` vive en `ClientHome.tsx` via `useState`.
- **Vista Cards**: comportamiento original — proyecto destacado + grilla de 2 columnas con glass morphism.
- **Vista Lista**: diseño tipográfico de alta jerarquía. Los proyectos se agrupan por su campo `type` (ej. "Freelance", "Fixed-term contract"). Cada fila muestra: flecha `→` + título grande bold + año. Al hover, el título y la flecha viran al color primario. Debajo del título: KeyValues (Role, Impact, Status), descripción, y stack tags.

#### Filtros por categoría (`# Filters` — ahora funcionales)
- Los botones **ALL OUTPUT / UI/UX ENG / WEB DEV / MOBILE APP / SYSTEMS** filtran en tiempo real los proyectos mostrados, tanto en vista Cards como en vista Lista.
- El estado `activeFilter: string` vive en `ClientHome.tsx`. El array `filteredProjects` se deriva del filtro y controla todo lo que se renderiza (featured card + grid/lista).
- Empty state: si ningún proyecto coincide con el filtro activo, se muestra `// no output matches this filter` con un botón "clear filter →" para resetear.

---

### 🏗️ Arquitectura de categorías

Se diseñó el sistema para ser completamente gestionable desde TinaCMS:

#### `src/lib/categories.ts` ← **NUEVO — fuente única de verdad**
Define el array `PROJECT_CATEGORIES` con `{ value, label }` por categoría. Importado tanto por `tina/config.ts` (para los checkboxes del CMS) como por `ClientHome.tsx` (para renderizar los botones). Para agregar o renombrar una categoría, solo se modifica este archivo.

> ⚠️ **Regla crítica**: nunca importar desde `tina/config.ts` en componentes React. TinaCMS v3 usa dependencias internas (ej. `color-string`) incompatibles con el bundler ESM de Vite. Los valores compartidos deben vivir en `src/lib/` y ser importados desde ahí en ambos lados.

#### Campo `categories[]` en proyectos
- Se añadió el campo `categories` (lista de strings con opciones predefinidas) al schema de TinaCMS en `tina/config.ts`.
- En el CMS, aparece como **checkboxes** bajo "Categorías de filtro". El editor selecciona a qué categorías pertenece el proyecto.
- Se añadió `categories` al frontmatter de los 7 proyectos existentes con los valores correctos según su stack/rol.

| Valor | Proyectos asignados |
|---|---|
| `ui-ux` | freelance, around, inti-web, inti-marketing |
| `web-dev` | freelance, around, inti-web, la-verdad-de-la-mila |
| `systems` | inti-pm, inti-marketing |
| `mobile` | _(ninguno aún — empty state correcto)_ |

---

### 🐛 Bug crítico resuelto: Astro v6 no propaga campos custom de frontmatter

**Síntoma**: El campo `categories` estaba en los archivos MDX, pero llegaba como `undefined` en el componente React.

**Tres capas de bugs encontradas durante la investigación:**

1. **`p.data` no incluye campos custom** — Astro v6 no expone campos del frontmatter que no sean parte de su schema interno, aunque estén en el schema Zod. `p.data.categories = undefined`.
2. **`mod.frontmatter` también es `undefined`** — `import.meta.glob` en MDX no expone el frontmatter como propiedad del módulo en Astro v6. Las soluciones con regex fallaban además en archivos Windows por CRLF.
3. **Case mismatch en filenames** — `FOlder-agrado.mdx` → Astro normaliza `p.id` a `'folder-agrado'` (lowercase). La clave del `categoryMap` preservaba el case del filename, entonces `categoryMap[p.id]` nunca matcheaba.

**Solución canónica implementada** (`src/pages/index.astro`):

```ts
import matter from 'gray-matter'; // dep transitiva de Astro, sin install adicional

const rawFiles = import.meta.glob<string>('../content/projects/*.mdx', {
  eager: true, query: '?raw', import: 'default'
});
const categoryMap: Record<string, string[]> = {};
for (const [path, content] of Object.entries(rawFiles)) {
  const slug = path.split('/').pop()!.replace('.mdx', '').toLowerCase(); // ← lowercase obligatorio
  categoryMap[slug] = Array.isArray(matter(content).data.categories)
    ? matter(content).data.categories : [];
}
// En el .map():  categories: categoryMap[p.id] ?? []
```

`gray-matter` resuelve automáticamente CRLF/LF y ambos formatos YAML. **Este es el patrón canónico para leer cualquier campo custom de frontmatter en este proyecto.**

> ⚠️ **Convención**: usar siempre nombres de archivo **lowercase** para los MDX de proyectos. Evita el case mismatch con `p.id`.

---

### 🔧 Cambio: `Tag` ahora es polimórfico

El componente `Tag` en `src/components/UI.tsx` fue actualizado: cuando recibe prop `onClick`, renderiza como `<button type="button">` (accesible, interactivo). Sin `onClick`, sigue siendo `<span>` como antes. El modificador CSS `tag--interactive` agrega `cursor: pointer` y resetea estilos de browser. No hay breaking change para usos existentes.

---

### 📚 Documentación actualizada
- `CLAUDE.md` y `AGENTS.md`: creados/actualizados con toda la arquitectura actual del proyecto.
- `src/content.config.ts`: schema Zod unificado para collections projects + pages (con workaround para bug de Astro v6 via `import.meta.glob`).

---

### Archivos modificados / creados

| Archivo | Tipo | Descripción |
|---|---|---|
| `src/lib/categories.ts` | NUEVO | Fuente única de verdad para categorías de filtro |
| `src/components/UI.tsx` | MOD | `Tag` polimórfico (span/button según onClick) |
| `src/components/ClientHome.tsx` | MOD | Estado `layout` + `activeFilter`, vistas Cards/Lista, filtros funcionales |
| `src/styles/pages/_home.module.scss` | MOD | Estilos de layout group, lista tipográfica, empty state |
| `src/styles/components/_ui.module.scss` | MOD | Modificador `tag--interactive` |
| `src/content.config.ts` | NUEVO | Schema Zod unificado para collections projects + pages |
| `src/pages/index.astro` | MOD | `import.meta.glob` para leer `categories` desde MDX directamente |
| `tina/config.ts` | MOD | Campo `categories` añadido al schema de projects, import de `PROJECT_CATEGORIES` |
| `src/content/projects/*.mdx` | MOD | Campo `categories` añadido a los 7 proyectos |
| `CLAUDE.md` | NUEVO | Guía de arquitectura para Claude Code |
| `AGENTS.md` | NUEVO | Guía de arquitectura para agentes de IA |

---

## [2026-05-07] — Image Normalization & Content Integrity

### ✨ Fixes
- **Robust Image Normalization**: Se actualizó la lógica en `ProjectDetailLayout.tsx` y `PortfolioDashboard.tsx` para manejar rutas corruptas (ej. `/assetshttps://...`) y eliminar comillas literales en el frontmatter de MDX.
- **Inti-Marketing Fix**: Se corrigió la ruta de la imagen en `inti-marketing.mdx` que impedía su visualización online.
- **FOlder-agrado Consistency**: Se normalizó la ruta de imagen con barra inicial `/` y se movió el archivo a la raíz de proyectos.

### 🛠️ Technical Changes
- Mejora de la función `resolveImagePath` en el Dashboard para ser defensiva contra strings mal formados.
- Actualización de `ProjectDetailLayout.tsx` con una función autoejecutable (IIFE) para procesar la imagen del héroe de forma segura.

---

## [2026-05-07] — Media Migration & Path Normalization

### ✨ Features
- **Estandarización de Medios**: Se migraron todos los activos de `src/assets/` a `public/assets/` para cumplir con los estándares de Astro y TinaCMS v3.
- **Normalización de Rutas**: Implementada lógica en `ProjectDetailLayout.tsx` para asegurar que las imágenes siempre usen rutas absolutas (con `/` inicial), evitando errores 404 en sub-rutas.
- **Dashboard Visibility**: Mejorada la función `resolveImagePath` en el `PortfolioDashboard` para soportar el cambio de puerto automático (4001 → 4321) en desarrollo local.

### 🛠️ Technical Changes
- Actualización de `tina/config.ts` para usar `public/assets` como root de medios.
- Limpieza de `src/assets` (ahora reservado para SVGs internos).
- Documentación del nuevo flujo de activos en `README.md`.

---

## [2026-05-07] — Portfolio Control Center (Dashboard Premium)

### Objetivo

Transformar la página de inicio de TinaCMS en un centro de control dinámico que permita monitorear el estado del portfolio, la salud del contenido y la distribución tecnológica de un vistazo.

### Características principales

- **Dashboard de Monitoreo**: Implementación de un `Screen Plugin` personalizado en `tina/config.ts`.
- **Inventario Maestro**: Tabla interactiva con búsqueda en tiempo real, miniaturas de proyectos y filtrado dinámico.
- **Auditoría de Salud**: Sistema que detecta automáticamente proyectos con información incompleta (falta de imágenes, descripciones cortas o stack tecnológico vacío).
- **Tech Stack Insights**: Visualización animada (vía `motion/react`) del ecosistema de herramientas utilizadas en los proyectos.
- **Detección de Entorno**: Lógica inteligente para alternar entre el endpoint local (`localhost:4001`) y la API de producción de Tina Cloud.

### Desafíos técnicos y soluciones

#### Fragmentos de GraphQL
Se corrigió un error crítico en la consulta de `pagesConnection`. TinaCMS requiere el uso de fragmentos inline (`... on Document`) para acceder a metadatos del sistema (`_sys`) en colecciones polimórficas.

#### Animaciones y Rendimiento
Se migró el uso de `framer-motion` a `motion/react` para cumplir con las mejores prácticas de React 19, implementando transiciones escalonadas (`staggered`) para una experiencia premium.

### Archivos modificados

#### `tina/dashboard/PortfolioDashboard.tsx` [NEW]
- Componente principal del dashboard con estado interno para búsqueda y filtrado.

#### `tina/dashboard/dashboardQuery.ts` [NEW]
- Definición de la query GraphQL centralizada para el dashboard.

#### `tina/config.ts`
- Registro del plugin `Portfolio Overview` y configuración del icono.

---

## [2026-05-07] — Actualización de dependencias (TinaCMS v3, Astro v6.3, React 19.2.6)

### Objetivo
Poner al día todas las dependencias del proyecto. TinaCMS mostraba una advertencia en el panel indicando que la versión instalada (`v2.10.1`) era obsoleta y que la última disponible era `v3.7.5`.

### Paquetes actualizados

| Paquete | De | A | Tipo |
|---|---|---|---|
| `tinacms` | `^2.4.0` | `^3.7.5` | **Major** (v2 → v3) |
| `@tinacms/cli` | `^1.7.0` | `^2.2.5` | **Major** (v1 → v2) |
| `astro` | `6.2.2` | `6.3.0` | Minor |
| `react` | `19.2.5` | `19.2.6` | Patch |
| `react-dom` | `19.2.5` | `19.2.6` | Patch |
| `fs-extra` | — | `^11.3.5` | **Nueva** (ver abajo) |

### Notas importantes

#### TinaCMS v3 — Cambio principal: ESM
El cambio más significativo de TinaCMS v2 → v3 es la migración de CommonJS a ESM. El proyecto ya usa `"type": "module"` en `package.json`, por lo que el cambio fue **transparente sin modificaciones de código**.

#### `fs-extra` — Dependencia faltante
Tras actualizar `@tinacms/cli` a v2.x, el dev server (`npm run dev`) fallaba con:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'fs-extra' imported from @tinacms/metrics/dist/index.js
```
`fs-extra` es una dependencia peer de `@tinacms/metrics@2.0.1` que no se resuelve automáticamente. Se añadió manualmente a `devDependencies` como fix.

#### Peer deps de TinaCMS
TinaCMS internamente usa `@headlessui/react@2.1.8` (que pide React 18) y `react-final-form@6.5.9` (que pide React ≤18). Dado que el proyecto usa React 19, npm genera warnings de ERESOLVE. Estos warnings **son esperados y no afectan el funcionamiento**: las dependencias internas de tina viven en su propio sub-árbol en `node_modules/tinacms/node_modules/`. Se resolvió usando `--legacy-peer-deps` para la actualización de React.

### Archivos modificados

#### `package.json`
- `tinacms`: `^2.4.0` → `^3.7.5`
- `@tinacms/cli`: movido a `devDependencies`, `^1.7.0` → `^2.2.5`
- `fs-extra`: añadido a `devDependencies` como `^11.3.5`
- `react` / `react-dom`: `^19.2.5` → `^19.2.6`
- `astro`: `^6.2.2` → `^6.3.0`

### Verificación
- ✅ `npm run dev` — TinaCMS + Astro inician correctamente en `localhost:4321`
- ✅ `npx astro build` — 11 páginas generadas, exit code 0
- ✅ Panel CMS en `localhost:4321/admin` — sin advertencias de versión

### Compatibilidad: Node.js
`@tinacms/cli` v2.2.5 incluye `better-sqlite3@11.10.0`, que soporta **Node 22 y Node 24** (ambos LTS activos en mayo 2026). La restricción histórica de "usar exactamente Node 22.12.0" ya no aplica. El `package.json` mantiene `"node": ">=22.12.0"` que es un mínimo correcto.

> Node 26 fue lanzado el 5 de mayo de 2026 como versión "Current" (aún no LTS). No se recomienda usarlo en producción hasta octubre 2026.

---

## [2026-05-06] — Refinamiento de CMS y Resume
### Objetivo
Estandarizar la edición de títulos en todas las páginas y habilitar la edición de puntos de experiencia (bullet points) en el Resume a través del CMS.

### Cambios realizados

#### `src/helpers/text-helpers.tsx`
- Se mantiene `formatTitle` como el motor principal de renderizado de títulos. Soporta el marcador `//` para acentos de color y saltos de línea automáticos.

#### `ClientArchive.tsx` & `ClientHome.tsx`
- Se unificó el renderizado de títulos usando `formatTitle`.
- Esto restaura el color de acento en la página Archive (que se aplica automáticamente a la última palabra si no hay `//`).

#### `src/content/projects/` & `tina/config.ts`
- Se añadió el campo `points` (lista de strings) a la colección de proyectos.
- Esto permite agregar viñetas de logros/responsabilidades específicas a cada experiencia laboral que se muestra en el Resume.

#### `ClientResume.tsx`
- Se actualizó el mapeo de experiencias para incluir los `points` dinámicos desde el CMS.

---

## [2026-05-06] — Soporte de Estructura de Carpetas en Proyectos

### Objetivo
Permitir la organización de proyectos en subcarpetas dentro de `src/content/projects/` para facilitar la co-locación de activos multimedia y una mejor gestión de archivos.

### Cambios realizados

#### `src/pages/projects/[...slug].astro`
- Se renombró el archivo de ruta de `[slug].astro` a `[...slug].astro`.
- Este cambio permite capturar rutas anidadas (ej: `/projects/img/mi-proyecto`), habilitando el acceso a archivos dentro de subdirectorios.

#### `src/content.config.ts`
- Se actualizó el loader de la colección `projects` para ignorar archivos ocultos del sistema (como `.gitkeep`) mediante el patrón glob: `**/[^.]*.{md,mdx}`.
- Se añadió el campo `_template: z.string().optional()` al esquema de validación de proyectos para mantener la paridad con los metadatos generados por TinaCMS.

#### `tina/config.ts`
- Se añadió un campo oculto `_template` en la colección `projects`. Esto asegura que cada nuevo archivo MDX creado desde el CMS incluya este metadato, necesario para la identificación del esquema en Astro.

#### `src/components/ProjectDetailLayout.tsx`
- Se refactorizó la lógica de **Breadcrumbs** para que sea dinámica. Ahora analiza el `id` (slug) del proyecto y genera niveles de navegación automáticos basados en los nombres de las carpetas.
- Ejemplo: `projects / Folder Name / Project Title`.

#### Limpieza de archivos
- Se eliminó el archivo `src/content/projects/img/.gitkeep.mdx`, ya que estaba causando un error de renderizado ("undefined is not a function") al intentar ser cargado como un proyecto válido por Astro.

### Impacto en SEO y Navegación
- Las URLs de los proyectos ahora reflejan su estructura de carpetas real en disco.
- Los metadatos de SEO se mantienen intactos, ya que siguen consumiendo el frontmatter original sin importar la profundidad del archivo.

---

## [2026-05-06] — Integración de TinaCMS (Panel Clásico)

### Objetivo
Añadir un CMS headless con panel de edición visual para gestionar el contenido de proyectos y páginas sin necesidad de editar archivos MDX manualmente.

### Decisiones de arquitectura
- Se eligió el **panel clásico de TinaCMS** (sin Visual Editing) como primera etapa. La migración a Visual Editing queda pendiente para una fase posterior.
- TinaCMS opera en **local mode** durante el desarrollo, escribiendo directamente a los archivos `.mdx`. No requiere cuenta en la nube para trabajar localmente.
- El admin panel corre en `http://localhost:4321/admin/index.html`.

### Compatibilidad: Node.js
> ⚠️ **Nota histórica (aplica a TinaCMS v2):** La versión `better-sqlite3` que traía TinaCMS v2 fallaba al compilar en versiones de Node distintas a v22.x. **Esto fue resuelto en la actualización del 2026-05-07**: `@tinacms/cli` v2.2.5 usa `better-sqlite3@11.10.0`, que es compatible con Node 22 y Node 24. Ver entrada `[2026-05-07]`.

### Archivos creados / modificados

#### `package.json`
- Se añadieron las dependencias `tinacms` y `@tinacms/cli`.
- Se modificó el script `dev` para correr TinaCMS y Astro juntos:
  ```json
  "dev": "tinacms dev -c \"astro dev\""
  ```

#### `tina/config.ts` ← **Archivo central del CMS**
Define el schema completo de colecciones. Toda nueva colección o campo editable debe registrarse aquí.

La colección `pages` usa **templates** (uno por archivo) para poder tener schemas distintos por página:

| Template name | Archivo target | Campos principales |
|---|---|---|
| `about` | `pages/about.mdx` | title, mission, body |
| `archive` | `pages/archive.mdx` | title, subtitle, body |
| `resume` | `pages/resume.mdx` | title, location, email, status, skillGroups[], education{} |

La colección `projects` contiene todos los campos del schema de proyectos:
`title`, `year`, `date`, `type`, `description`, `stack[]`, `role`, `client`, `order`, `image`, `showInResume`, `showInPortfolio`, `body`.

#### `src/content.config.ts`
Se extendió el schema Zod de `pagesCollection` para reflejar los nuevos campos:
- `_template` — string opcional. TinaCMS lo escribe automáticamente; Astro lo acepta sin romper la validación.
- `subtitle` — para `archive.mdx`.
- `skillGroups[]` — array de grupos de habilidades para `resume.mdx`.
- `education{}` — objeto de educación para `resume.mdx`.

#### `src/content/pages/archive.mdx` ← **Nuevo**
Creado para que el título y subtítulo del Archive sean editables desde el CMS. Contiene:
```yaml
_template: archive
title: Project // Archive
subtitle: Legacy systems, deprecated experiments...
```

#### `src/content/pages/resume.mdx` ← **Actualizado**
Los datos de habilidades (`skillGroups`) y educación (`education`) que estaban **hardcodeados en `ClientResume.tsx`** fueron migrados al frontmatter de este archivo. Ahora son completamente editables desde el CMS.

#### `src/content/pages/about.mdx`
Se añadió `_template: about` al frontmatter para que TinaCMS identifique el schema correcto.

#### `src/components/ClientResume.tsx`
- Se eliminó el array `experiences` de nivel de módulo (datos de experiencias hardcodeados; ahora vienen de `jobs` prop desde `resume.astro`).
- Se extrajeron las constantes `DEFAULT_SKILLS` y `DEFAULT_EDUCATION` (fallbacks para cuando el CMS no tiene datos).
- La lógica ahora prioriza `frontmatter.skillGroups` y `frontmatter.education` si están disponibles.
- Firma del componente:
  ```tsx
  ClientResume({ frontmatter, children, jobs })
  ```
  Donde `jobs` son los proyectos con `showInResume: true`, y `frontmatter` es el objeto de `resume.mdx`.

#### `src/components/ClientArchive.tsx`
- Se añadió la prop `pageMeta?: any`.
- Título y subtítulo ahora se leen de `pageMeta.title` y `pageMeta.subtitle` con fallback a valores por defecto.

#### `src/pages/archive.astro`
- Se añadió `getEntry('pages', 'archive')` para obtener el metadata de la página.
- Se pasa `pageMeta={page?.data}` a `<ClientArchive>`.

#### `.gitignore`
Se añadieron las rutas generadas por TinaCMS:
```
public/admin
tina/__generated__
```

#### `.env`
Variables requeridas (no commitear):
```
TINA_CLIENT_ID=...
TINA_TOKEN=...
```

### Cómo correr el proyecto con TinaCMS

```bash
nvm use 22.12.0
npm run dev
# → Astro en http://localhost:4321
# → Admin panel en http://localhost:4321/admin/index.html
```

---

## [2026-04-30] — SEO, OpenGraph y Favicon

### Objetivo
Mejorar la visibilidad en buscadores y la apariencia al compartir links del portfolio.

### Cambios
- Se añadieron meta tags de OpenGraph y Twitter Card en el layout global.
- Se configuró el favicon alineado con el dominio `aledesign.dev`.
- Se implementó un `sitemap.xml` generado automáticamente con `@astrojs/sitemap`.
- Se corrigió un problema de contraste en el footer para pasar el audit de accesibilidad de Lighthouse.

---

## [2026-04-30] — RSS Feed dinámico

### Objetivo
Permitir que el contenido de proyectos sea sindicado automáticamente via RSS.

### Cambios
- Se añadió el endpoint `src/pages/rss.xml.ts` que consume la colección `projects`.
- Se reemplazó el ícono "monitor" en el Topbar por un link al feed RSS.
- El feed se genera en el proceso de build de Astro, sin dependencias externas.

---

## [2026-04-29] — Navegación Mobile (Offcanvas)

### Objetivo
Implementar un menú de navegación mobile de pantalla completa con estética de terminal.

### Decisiones
- El trigger es un botón con `>_` visible solo en mobile (< 768px).
- El overlay ocupa exactamente `100dvh` con efecto glassmorphism.
- Se implementó lock del scroll en `body` cuando el menú está abierto.
- La fuente global se estandarizó en **Inter** (eliminando Jost).

### Componente
`src/components/Navigation.tsx` — maneja el estado de apertura/cierre y el lock del scroll.

---

## [Migración Base] — Next.js 15 → Astro v6

### Contexto
El proyecto fue originalmente construido en **Next.js 15** (App Router). Se migró íntegramente a **Astro v6** por razones de rendimiento (SSG nativo, 0 JS por defecto) y mejor integración con MDX como Content Layer.

### Cambios estructurales clave
- Las páginas de Next.js (`app/`) se convirtieron en páginas Astro (`src/pages/*.astro`).
- El helper `file-helpers.ts` (que usaba `fs` de Node para leer MDX) fue reemplazado por el Content Layer de Astro (`getCollection`, `getEntry`).
- Los componentes de UI pesados (con animaciones y estado) se mantienen como `.tsx` y se hidratan con `client:load`.
- El identificador único de un entry cambió de `.slug` a `.id` en Astro v6.

---

*Última actualización: 2026-05-06*
