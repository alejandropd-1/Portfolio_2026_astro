# Contexto del Proyecto: The Compiled Soul — Portfolio 2026

> ⚠️ **Este archivo es un resumen de referencia rápida.** Para documentación completa y actualizada, leer:
> - [`README.md`](./README.md) — arquitectura completa, stack, scripts y reglas.
> - [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) — historial completo de cambios con contexto de decisiones.

---

## Stack actual (post-migración a Astro)

- **Framework**: Astro v6 (SSG estático)
- **UI**: React 19 (solo Astro Islands — componentes con estado/animaciones)
- **Contenido**: MDX via Astro Content Layer (`src/content/`)
- **CMS**: TinaCMS (panel clásico, local mode) — admin en `localhost:4321/admin`
- **Estilos**: SASS / SCSS Modules — **sin Tailwind CSS**
- **Animaciones**: Framer Motion (`motion/react`)
- **Iconos**: Lucide React

> **Node.js requerido: v22.12.0** (TinaCMS falla con otras versiones). Usar `nvm use 22.12.0` antes de `npm run dev`.

---

## Estructura clave de contenido

```text
src/content/
├── pages/
│   ├── about.mdx    # _template: about    — título, misión, bio
│   ├── archive.mdx  # _template: archive  — título y subtítulo de la página
│   └── resume.mdx   # _template: resume   — headline, skills, education, contacto
└── projects/
    └── *.mdx        # Un archivo por proyecto/trabajo
```

### Campos críticos del frontmatter de proyectos

```yaml
title: Nombre del Proyecto
showInResume: true     # ← aparece en página Resume
showInPortfolio: true  # ← aparece en Home y Archive
client: Empresa
role: Mi Rol
year: '2024'
stack: [Figma, React, SASS]
```

---

## CMS — Cómo editar contenido

```bash
nvm use 22.12.0
npm run dev
# Ir a: http://localhost:4321/admin/index.html
```

- **Pages → Multimedia Designer**: editar headline, skills, educación del Resume.
- **Pages → Project Archive**: editar título y subtítulo del Archive.
- **Projects → [nombre]**: editar cualquier proyecto.

---

## Sistema de Diseño — Principios a mantener

1. **No borders de 1px.** Usar `box-shadow` o el mixin `@include glass-surface`.
2. **Solo Inter.** Variar peso (Thin → Bold) y tamaño para jerarquía tipográfica.
3. **Glassmorphism global.** Toda superficie nueva debe usar `@include glass-surface`.
4. **Editorial sobre funcional.** El portfolio es una terminal de alta gama, no un sitio estándar.
5. **SASS Modules.** Cada componente tiene su `_nombre.module.scss`. No contaminar `globals.scss`.

---

## Reglas de oro para IA

| Situación | Acción |
|---|---|
| Agregar un proyecto nuevo | Crear MDX en `src/content/projects/` o usar el CMS |
| Editar skills del Resume | Editar `resume.mdx` o CMS → Pages → resume |
| Agregar campo al CMS | 1) Editar `tina/config.ts` 2) Espejear en `content.config.ts` (Zod) |
| Error de tipos en Astro | Verificar que `content.config.ts` tiene el campo |
| Error de TinaCMS al compilar | Verificar que Node es v22.12.0 |
| Todo MDX en `pages/` | Debe tener `_template: nombre` en frontmatter |

*Última actualización: 2026-05-06*
