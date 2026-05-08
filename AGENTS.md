# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Commands

```bash
npm run dev        # Start TinaCMS + Astro dev server (always use this, not astro dev alone)
npm run build      # Build TinaCMS then Astro for production
npm run preview    # Preview the production build
npx astro check    # TypeScript/Astro type checking
```

Node ≥ 24 is required. TinaCMS requires `TINA_CLIENT_ID` and `TINA_TOKEN` env vars to connect to the cloud CMS; without them the local dev server still runs but CMS features are limited.

## Architecture

This is an **Astro + React + TinaCMS** portfolio site. The key pattern throughout: Astro pages do all data-fetching at build time, then pass data down as props to React client components.

```
src/pages/index.astro          → fetches projects → <ClientHome client:load />
src/pages/about.astro          → fetches page entry → <ClientAbout client:load />
src/pages/projects/[...slug].astro  → dynamic project detail pages
```

**Content layer** (`src/content/`): Two TinaCMS collections:
- `projects/` — MDX files. Astro schema in `src/content/config.ts`. Key frontmatter fields: `title`, `year`, `date`, `type`, `description`, `stack[]`, `role`, `client`, `order`, `image`, `showInResume`, `showInPortfolio`, `points[]`, `categories[]`.
- `pages/` — MDX files for `home`, `about`, `archive`, `resume` — each with different frontmatter schemas (defined per-template in `tina/config.ts`).

**Astro content schema** (`src/content/config.ts`): Defines the Zod schema for the `projects` collection. Note: Astro v6's content layer does not forward custom frontmatter fields via `p.data` even when defined in the schema. Custom fields (e.g. `categories`) are read directly in `src/pages/index.astro` via `import.meta.glob` on the MDX files and merged manually into the project objects.

**TinaCMS** (`tina/config.ts`): Defines CMS UI schemas and a custom `PortfolioDashboard` screen plugin. The generated types live in `tina/__generated__/` — do not edit those files directly. **Never import from `tina/config.ts` in React client components** — it pulls in TinaCMS internals incompatible with Vite's ESM bundling (the `color-string` issue). Instead, put shared constants in `src/lib/` and import from there in both places.

**Filter categories** (`src/lib/categories.ts`): Single source of truth for the sidebar filter options (`PROJECT_CATEGORIES`). Imported by both `tina/config.ts` (to populate CMS checkboxes) and `ClientHome.tsx` (to render filter buttons). Add/rename categories here only.

**Styling**: SCSS with a design system at `src/styles/abstracts/`. All abstracts are auto-forwarded globally via Vite's `additionalData` in `astro.config.mjs`, so any `.scss` file can use `$clr-brand-primary`, `$font-sans`, breakpoint mixins, etc. without an explicit `@use`. CSS Modules (`.module.scss`) are used for component-scoped styles.

**Path alias**: `@/` maps to `src/` in both TypeScript and Vite.

## Design System ("The Compiled Soul")

The visual identity is a dark editorial/terminal aesthetic. Key constraints to respect:

- **No-line rule**: Never use `1px solid` borders for sectioning. Boundaries are defined by background color shifts, subtle gradients, or negative space only. The `ghost-border` pattern (15% opacity on `$clr-brand-tertiary`) is the only permitted container edge.
- **Color roles**: `$clr-brand-primary` = neon green (accents/CTAs), `$clr-brand-secondary` = flame orange (keys in key-value pairs), `$clr-brand-tertiary` = cyan (icons, highlights).
- **Surface layering**: Level 0 = `$clr-brand-surface` (page bg), Level 1 = `surface-container-low`, Level 2 = `surface-container-high` (cards). Never use the same surface color for a container and its parent.
- **Typography**: Inter only (no secondary fonts for headings). Roboto Mono for code/metadata. Navigation link labels and CTA text use uppercase.
- **CSS vars for colors**: Color SCSS variables (`$clr-brand-*`) are references to CSS custom properties (`--clr-brand-*`), enabling the light/dark theme toggle via a `.light` class on `<html>`.

## UI Components

Shared primitives live in `src/components/UI.tsx`:
- `<SyntaxCard>` — the standard card container with optional `#label` header
- `<Tag>` — polymorphic: renders as `<span>` by default, as `<button>` when `onClick` is passed. `active` variant fills the bg with primary color.
- `<KeyValue k v>` — renders `key = "value";` syntax pairs (orange key, white value)

## Title formatting convention

Project and page titles use `//` as a marker for the accent-colored word: `"Compiled // Visions."` renders with "Visions." in `$clr-brand-primary`. Use `formatTitle()` from `src/helpers/text-helpers.tsx` in JSX, and `cleanTitle()` for `alt` attributes or plain text contexts (it strips the `//` marker).

## Home page interactive features

`ClientHome.tsx` manages two independent UI states:
- **Layout** (`'cards' | 'list'`): toggles between the glass-card grid and a Josh Comeau–style typographic list grouped by project `type`.
- **Filter** (`'all' | <category value>`): filters `projects[]` by `p.categories.includes(activeFilter)` before rendering either view. The `filteredProjects` array drives both the featured card (`filteredProjects[0]`) and the grid/list.

The sidebar's `# Filters` and `# Layout` blocks are rendered inside `home__sidebar` which applies a global `SyntaxCard` override (transparent bg, no padding) — do not add other `SyntaxCard` children outside `home__sidebar` without checking that override.
