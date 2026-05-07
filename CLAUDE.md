# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `projects/` — MDX files with frontmatter fields: `title`, `year`, `date`, `type`, `description`, `stack[]`, `role`, `client`, `order`, `image`, `showInResume`, `showInPortfolio`, `points[]`
- `pages/` — MDX files for `home`, `about`, `archive`, `resume` — each with different frontmatter schemas (defined per-template in `tina/config.ts`)

**TinaCMS** (`tina/config.ts`): Defines all content schemas and a custom `PortfolioDashboard` screen plugin. The generated types live in `tina/__generated__/` — do not edit those files directly.

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
- `<Tag>` — ghost-border pill for skills/stack tags, `active` variant fills the bg
- `<KeyValue k v>` — renders `key = "value";` syntax pairs (orange key, white value)
