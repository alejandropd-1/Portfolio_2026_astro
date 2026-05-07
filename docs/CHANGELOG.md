# Historial de Modificaciones — The Compiled Soul Portfolio 2026

Este documento registra los cambios significativos realizados al proyecto en orden cronológico. Su propósito es servir de contexto para asistentes de IA que retomen el trabajo en cualquier punto.

> **Cómo leer este archivo:** Cada entrada describe _qué_ se cambió, _por qué_ se tomó esa decisión, y _qué archivos_ se modificaron. Lee de arriba hacia abajo para entender el estado actual del proyecto.

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
