# The Compiled Soul - Portfolio 2026

Welcome to the documentation for **The Compiled Soul**, a personal portfolio migrated from Next.js 15 to **Astro v6**. This `README.md` acts as a single source of truth for developers and AI coding assistants to understand the architecture, tech stack, and design principles of the project.

## 🚀 Tech Stack

- **Framework:** [Astro v6](https://astro.build/) (Static Site Generation `output: "static"`)
- **UI Library:** [React 19](https://react.dev/) (Used exclusively for components with interactivity or animations via Astro Islands)
- **Styling:** SASS / SCSS Modules (Strictly **NO Tailwind CSS**)
- **Content:** MDX via Astro Content Layer (`src/content`)
- **Animations:** [Framer Motion](https://motion.dev/) (via `motion/react`)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
src/
├── assets/                  # Static assets (images, SVGs)
├── components/              # React and Astro components
│   ├── mdx/                 # Custom MDX components rendered via <Content />
│   └── ...                  # UI components (ClientAbout, Navigation, etc.)
├── content/                 # Content Collections (MDX)
│   ├── pages/               # Static pages content (e.g., about, resume)
│   └── projects/            # Dynamic project entries
├── helpers/                 # Utility functions
├── layouts/                 # Astro Layouts (Layout.astro, MainLayout.astro)
├── pages/                   # Astro Routing
│   ├── projects/            # Dynamic routes for projects ([slug].astro)
│   └── ...                  # Static routes (index, about, resume)
├── styles/                  # SASS Architecture
│   ├── abstracts/           # Variables, mixins, tokens (injected globally via astro.config.mjs)
│   ├── base/                # Resets, globals, and MDX base styles
│   ├── components/          # SASS Modules for UI components
│   └── pages/               # SASS Modules for specific pages
└── content.config.ts        # Astro Content Layer schemas (Zod)
```

## 🎨 Styling Architecture (SASS)

This project has a **strict SASS-only** policy. **Do not use or introduce Tailwind CSS.**

1. **SASS Modules:** Every React or Astro component must be styled using SASS modules (`_component-name.module.scss`).
2. **Global Abstracts:** Variables, tokens, breakpoints, and mixins reside in `src/styles/abstracts/`. These are automatically injected into every SCSS file via Vite (`astro.config.mjs`), so you do **not** need to use `@import` or `@use` for abstracts manually in your modules.
3. **Glassmorphism:** The core design aesthetic relies on a premium glassmorphism effect (using CSS `backdrop-filter`, semi-transparent backgrounds, and grain textures). This is managed centrally in `_mixins.scss` and should not be fragmented.

## 📝 Content Management (Astro Content Layer)

All textual data and articles are driven by the Astro Content Layer and authored in MDX.

- **Collections:** Defined in `src/content.config.ts` using Zod schemas.
- **Projects:** Added to `src/content/projects/`.
- **Pages:** General information added to `src/content/pages/`.
- **Rendering:** In Astro v6, entries are fetched via `getCollection()` or `getEntry()`, and rendered using the `render(entry)` API. Remember that the unique identifier property is now `entry.id`, not `entry.slug`.

### MDX Custom Components
Custom React components can be injected into MDX files. These are mapped in `.astro` layouts/pages and passed to the `<Content components={customComponents} />` component.

## ⚡ Interactivity and Astro Islands

- By default, Astro components (`.astro`) render as static HTML.
- React components (`.tsx`) that require client-side execution (e.g., Framer Motion animations, state management) must be hydrated using the `client:load` or `client:idle` directives when consumed inside an `.astro` file.
- **Framer Motion:** Used heavily for page transitions, scroll effects, and micro-interactions. Always import from `motion/react` (v12+). Ensure variants are strictly typed with `import type { Variants } from 'motion/react'`.

## 🛠️ Available Scripts

- `npm run dev` — Starts the Astro dev server at `localhost:4321`.
- `npm run build` — Builds the static site for production into the `dist/` directory.
- `npm run preview` — Previews the production build locally.
- `npx astro check` — Runs static TypeScript diagnostics across Astro and React files.

## 🤖 Instructions for AI Assistants

When assisting with this project, follow these guidelines:
1. **Maintain Context Hygiene:** Do not add dependencies without asking.
2. **Design Fidelity:** The design system is editorial, high-end, and relies heavily on typography (Inter) and subtle lighting/glass effects. Do not alter existing visual tokens unless explicitly requested.
3. **Routing:** Avoid importing `next/navigation` or any Next.js legacy libraries. For client-side route tracking, use `Astro.url.pathname` and pass it down as a prop to React components.
4. **Types:** Ensure all variables are strictly typed. Avoid `any`. If encountering module resolution errors, ensure you are not relying on Node.js APIs (`fs`, `path`) where Astro Content Collections should be used instead.
