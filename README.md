# The Compiled Soul — Portfolio 2026

Welcome to the documentation for **The Compiled Soul**, a personal portfolio built with **Astro v6**. This `README.md` is the single source of truth for developers and AI coding assistants. It covers the architecture, tech stack, design principles, and CMS integration.

> 📋 **Historial de cambios:** Para entender qué se modificó, por qué, y en qué orden, leer [`docs/CHANGELOG.md`](./docs/CHANGELOG.md). Es especialmente útil para que una IA retome el trabajo desde un punto específico.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro v6.3](https://astro.build/) — SSG, `output: "static"` |
| UI Library | [React 19.2](https://react.dev/) — solo para componentes con interactividad (Astro Islands) |
| Styling | SASS / SCSS Modules — **sin Tailwind CSS** |
| Content | MDX via Astro Content Layer (`src/content/`) |
| CMS | [TinaCMS v3.7](https://tina.io/) — panel clásico, local mode en dev |
| Animations | [Framer Motion](https://motion.dev/) — `import` desde `motion/react` |
| Icons | [Lucide React](https://lucide.dev/) |

---

## 📂 Project Structure

```text
Portfolio_2026_astro/
├── docs/
│   └── CHANGELOG.md         # Historial completo de cambios (leer para contexto)
├── src/
│   ├── assets/              # Imágenes y SVGs estáticos
│   ├── components/          # Componentes React (.tsx) y Astro (.astro)
│   │   ├── mdx/             # Componentes custom para renderizar MDX (<Content />)
│   │   ├── ClientResume.tsx # UI del Resume (consume frontmatter + jobs prop)
│   │   ├── ClientArchive.tsx# UI del Archive (consume pageMeta prop)
│   │   └── ...
│   ├── content/             # Content Collections — fuente de verdad del contenido
│   │   ├── pages/           # MDX de páginas estáticas
│   │   │   ├── about.mdx    # _template: about
│   │   │   ├── archive.mdx  # _template: archive  ← título y subtítulo editables en CMS
│   │   │   └── resume.mdx   # _template: resume   ← skills, education, contacto en CMS
│   │   └── projects/        # MDX por cada proyecto/trabajo
│   ├── helpers/             # Utilidades (text-helpers, etc.)
│   ├── layouts/             # MainLayout.astro
│   ├── pages/               # Rutas de Astro
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── resume.astro
│   │   ├── archive.astro
│   │   └── projects/[...slug].astro # Rutas dinámicas con soporte para carpetas
│   └── styles/              # Arquitectura SASS
│       ├── abstracts/       # Variables, tokens, mixins (auto-injected via astro.config.mjs)
│       ├── base/            # Resets y estilos globales
│       ├── components/      # Módulos SCSS por componente
│       └── pages/           # Módulos SCSS por página
├── tina/
│   └── config.ts            # ← Configuración central de TinaCMS (colecciones + schemas)
├── src/content.config.ts    # Schemas Zod de Astro (debe espejear tina/config.ts)
├── .env                     # TINA_CLIENT_ID y TINA_TOKEN (no commitear)
└── package.json
```

---

## 🎨 Styling Architecture (SASS)

**Política estricta: solo SASS Modules. No introducir Tailwind CSS.**

1. **SASS Modules:** Cada componente React o Astro tiene su propio `_nombre.module.scss`.
2. **Global Abstracts:** Variables, tokens y mixins en `src/styles/abstracts/`. Se inyectan automáticamente via Vite — **no usar `@use` ni `@import` manual de abstracts** en los módulos.
3. **Glassmorphism:** El efecto base está en `_mixins.scss`. Usar `@include glass-surface` para cualquier nueva superficie.
4. **Tipografía:** Solo **Inter**. Variar peso (Thin → Bold) y tamaño para crear contraste.

---

## 📝 Content Management

### Flujo sin CMS (manual)

Editar directamente los archivos `.mdx` en `src/content/`. Al guardar, Astro HMR recarga el contenido automáticamente en desarrollo.

### Flujo con TinaCMS (recomendado)

```bash
# Node >=22 LTS recomendado (22.x o 24.x)
# nvm use 22  # o: nvm use 24

npm run dev
# Astro corre en:    http://localhost:4321
# Admin panel en:    http://localhost:4321/admin/index.html
```

El panel permite editar sin tocar el código. Los cambios se guardan directamente en los archivos `.mdx`.

---

## 🦙 TinaCMS — Referencia de Schema

El archivo central es **`tina/config.ts`**. Toda modificación al schema del CMS debe hacerse ahí **y** reflejarse en **`src/content.config.ts`** (schema Zod de Astro).

### Colección: `projects`

Ruta: `src/content/projects/*.mdx`

| Campo | Tipo | Notas |
|---|---|---|
| `title` | string | Nombre del proyecto |
| `year` | string | Ej: `"2024"` |
| `date` | datetime | Para ordenamiento `YYYY-MM-DD` |
| `type` | string | Ej: `"freelance"`, `"employment"` |
| `description` | string | Resumen corto |
| `stack` | string[] | Array de tecnologías |
| `role` | string | Rol en el proyecto |
| `client` | string | Empresa o cliente |
| `order` | number | Orden de aparición manual |
| `image` | image | Cover del proyecto |
| `showInResume` | boolean | Aparece en la página Resume |
| `showInPortfolio` | boolean | Aparece en Home y Archive |
| `_template` | string | Metadato técnico de TinaCMS |
| `body` | rich-text | Cuerpo MDX del proyecto |

### Colección: `pages` (con templates)

Cada archivo tiene su propio template. El campo `_template` en el frontmatter del MDX indica cuál usar.

#### Template `about` → `src/content/pages/about.mdx`

| Campo | Tipo |
|---|---|
| `title` | string |
| `mission` | string |
| `body` | rich-text |

#### Template `archive` → `src/content/pages/archive.mdx`

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | string | Título del encabezado de la página |
| `subtitle` | string | Subtítulo/descripción debajo del título |
| `body` | rich-text | Contenido adicional (opcional) |

#### Template `resume` → `src/content/pages/resume.mdx`

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | string | Job title / headline del CV |
| `location` | string | Ciudad |
| `email` | string | Email de contacto |
| `status` | string | Ej: `"Available for new opportunities"` |
| `skillGroups` | object[] | Array de grupos de habilidades (ver abajo) |
| `education` | object | Datos de educación (ver abajo) |
| `body` | rich-text | Bio corta |

**Estructura de `skillGroups[]`:**
```yaml
skillGroups:
  - category: DESIGN ARCHITECTURE
    items:
      - name: Design Systems
        value: '95%'
```

**Estructura de `education{}`:**
```yaml
education:
  degree: Bachelor of Fine Arts
  institution: California College of the Arts
  year: Class of 2015
```

### Regla importante: sincronizar schemas

Cuando se agrega un campo en `tina/config.ts`, **siempre** añadirlo también en `src/content.config.ts` (schema Zod). Si no, Astro tirará un error de tipos al hacer el build.

---

## ⚡ Interactivity — Astro Islands

- Los `.astro` son estáticos por defecto (0 JS).
- Los `.tsx` con estado, animaciones o efectos se hidratan con `client:load` en el `.astro` que los consume.
- **Framer Motion:** siempre importar desde `motion/react` (v12+). Tipar variantes con `import type { Variants } from 'motion/react'`.

---

## 🛠️ Scripts

```bash
npm run dev       # TinaCMS + Astro dev server (Node >=22 LTS)
npm run build     # Build de producción en dist/
npm run preview   # Preview del build
npx astro check   # TypeScript diagnostics
```

> **Nota:** `fs-extra` es una dependencia directa requerida por `@tinacms/metrics`. Está en `devDependencies`. Sin ella el dev server falla con `ERR_MODULE_NOT_FOUND`.

---

## 🤖 Instrucciones para Asistentes IA

### Antes de empezar
1. **Leer [`docs/CHANGELOG.md`](./docs/CHANGELOG.md)** para entender el estado actual y los cambios recientes.
2. **Verificar Node:** `node -v` debe retornar `v22.12.0`. Si no, correr `nvm use 22.12.0`.

### Reglas técnicas obligatorias

| Regla | Detalle |
|---|---|
| No Tailwind | El proyecto usa exclusivamente SASS Modules |
| No `border: 1px solid` | Usar `box-shadow` difusos o el mixin `glass-surface` |
| No Next.js imports | Nunca usar `next/navigation` u otras APIs de Next |
| ID en vez de slug | En Astro v6, usar `entry.id` (no `entry.slug`) |
| Schema sync | Cambios en `tina/config.ts` → reflejar en `content.config.ts` |
| Nested Projects | Usar `[...slug].astro` para soportar subcarpetas en proyectos |
| Template field | Todo MDX en `pages/` necesita `_template: nombre_template` en el frontmatter |

### Flujo para agregar un nuevo proyecto

1. Crear `src/content/projects/nombre-proyecto.mdx`.
2. Completar el frontmatter con todos los campos requeridos (especialmente `showInResume` y `showInPortfolio`).
3. Alternativamente, usar el panel de TinaCMS en `localhost:4321/admin` → Projects → Create New.

### Flujo para modificar el Resume

- **Experiencia laboral:** Editar el MDX del proyecto correspondiente y asegurarse que `showInResume: true`.
- **Skills y Education:** Editar `src/content/pages/resume.mdx` directamente o via CMS → Pages → Multimedia Designer.
- **Contacto (título, location, email, status):** Mismo archivo `resume.mdx`.

### Flujo para modificar el Archive

- El título y subtítulo se editan en `src/content/pages/archive.mdx` o via CMS → Pages → Project Archive.
- Los proyectos listados se controlan con `showInPortfolio: true` en cada proyecto.

### Diseño: principios a mantener

- **Estética editorial.** No introducir estilos genéricos o "básicos". El portfolio es una terminal de alta gama.
- **Glassmorphism:** `@include glass-surface` para toda nueva superficie.
- **Tipografía Inter:** No cambiar la familia tipográfica. Variar peso y tamaño para crear jerarquía.
- **DESIGN.MD:** Leer periódicamente para asegurar que los roles semánticos de los colores (`primary`, `tertiary`, `surface-container`) se respeten.

---

*Última actualización: 2026-05-07*
