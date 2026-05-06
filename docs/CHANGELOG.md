# Historial de Modificaciones — The Compiled Soul Portfolio 2026

Este documento registra los cambios significativos realizados al proyecto en orden cronológico. Su propósito es servir de contexto para asistentes de IA que retomen el trabajo en cualquier punto.

> **Cómo leer este archivo:** Cada entrada describe _qué_ se cambió, _por qué_ se tomó esa decisión, y _qué archivos_ se modificaron. Lee de arriba hacia abajo para entender el estado actual del proyecto.

---

## [2026-05-06] — Integración de TinaCMS (Panel Clásico)

### Objetivo
Añadir un CMS headless con panel de edición visual para gestionar el contenido de proyectos y páginas sin necesidad de editar archivos MDX manualmente.

### Decisiones de arquitectura
- Se eligió el **panel clásico de TinaCMS** (sin Visual Editing) como primera etapa. La migración a Visual Editing queda pendiente para una fase posterior.
- TinaCMS opera en **local mode** durante el desarrollo, escribiendo directamente a los archivos `.mdx`. No requiere cuenta en la nube para trabajar localmente.
- El admin panel corre en `http://localhost:4321/admin/index.html`.

### Compatibilidad: Node.js
> ⚠️ **Crítico:** TinaCMS requiere `better-sqlite3`, que **falla al compilar en versiones de Node distintas a v22.12.0**. Siempre usar `nvm use 22.12.0` antes de correr `npm run dev`.

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
