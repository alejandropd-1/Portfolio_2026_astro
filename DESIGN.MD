---
name: The Compiled Soul
colors:
  surface: "#020f1e"
  surface-dim: "#020f1e"
  surface-bright: "#172d45"
  surface-container-lowest: "#000000"
  surface-container-low: "#041425"
  surface-container: "#081b2c"
  surface-container-high: "#0d2134"
  surface-container-highest: "#12273c"
  on-surface: "#d9e7fc"
  on-surface-variant: "#9eacc0"
  inverse-surface: "#f8f9ff"
  inverse-on-surface: "#495667"
  outline: "#697789"
  outline-variant: "#3c495a"
  surface-tint: "#a3f185"
  primary: "#a3f185"
  on-primary: "#145b00"
  primary-container: "#68b24f"
  on-primary-container: "#052900"
  inverse-primary: "#266d11"
  secondary: "#fd9d1a"
  on-secondary: "#4c2b00"
  secondary-container: "#895100"
  on-secondary-container: "#fff6f1"
  tertiary: "#5ed8ff"
  on-tertiary: "#00485a"
  tertiary-container: "#4dc9f1"
  on-tertiary-container: "#003e4e"
  error: "#ff716c"
  on-error: "#490006"
  error-container: "#9f0519"
  on-error-container: "#ffa8a3"
  primary-fixed: "#a3f185"
  primary-fixed-dim: "#95e279"
  on-primary-fixed: "#0d4600"
  on-primary-fixed-variant: "#1e6608"
  secondary-fixed: "#ffc78e"
  secondary-fixed-dim: "#ffb462"
  on-secondary-fixed: "#4e2c00"
  on-secondary-fixed-variant: "#764500"
  tertiary-fixed: "#4dc9f1"
  tertiary-fixed-dim: "#39bce2"
  on-tertiary-fixed: "#002732"
  on-tertiary-fixed-variant: "#00485a"
  primary-dim: "#95e279"
  secondary-dim: "#ed9000"
  tertiary-dim: "#39bce2"
  error-dim: "#d7383b"
  background: "#020f1e"
  on-background: "#d9e7fc"
  surface-variant: "#12273c"
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 3.5rem
    fontWeight: "700"
    lineHeight: "1.1"
  headline-md:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: "600"
    lineHeight: "1.2"
  title-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: "500"
    lineHeight: "1.4"
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: "400"
    lineHeight: "1.6"
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: "500"
    lineHeight: "1.5"
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  scale-factor: "2"
  gutter: 2rem
  margin: 3rem
  section-gap: 8rem
---

# Design System Document: The Compiled Soul

## 1. Overview & Creative North Star

### Creative North Star: "The Compiled Soul"

This design system is built upon the tension between the cold, logical precision of a development environment and the raw, vibrant energy of human creativity. It moves away from the "template" aesthetic by treating the portfolio not as a website, but as a high-end digital editorial piece—a curated terminal where code syntax meets sophisticated layout.

**Visual Philosophy:**

- **Intentional Asymmetry:** Break the grid. Allow elements to overlap and bleed into margins to create a sense of movement.
- **Tonal Depth:** Instead of flat dark modes, we use "Atmospheric Depth," where surfaces feel like they are floating in a digital void, illuminated by the vibrant saturation of a navy-blue seed.
- **Editorial Typography:** We use dramatic scale shifts within the Inter typeface to create a high-contrast, premium experience.

---

## 2. Color Palette & SASS Variables

Our palette is anchored in a vibrant midnight foundation, punctuated by high-energy syntax highlights.

### Core Tokens

| Role                  | Token                    | Value     | SASS Variable         |
| :-------------------- | :----------------------- | :-------- | :-------------------- |
| **Base Background**   | `surface`                | `#0D131C` | `$color-bg-base`      |
| **Primary (Neon)**    | `primary`                | `#B0FF92` | `$color-primary`      |
| **Secondary (Flame)** | `secondary`              | `#FF9F1C` | `$color-secondary`    |
| **Tertiary (Cyan)**   | `tertiary`               | `#4CC9F0` | `$color-tertiary`     |
| **Surface Low**       | `surface_container_low`  | `#151B24` | `$color-surface-low`  |
| **Surface High**      | `surface_container_high` | `#232A33` | `$color-surface-high` |

### The "No-Line" Rule

**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning or container definition. Boundaries must be defined solely through:

1.  **Background Color Shifts:** Placing a `surface_container_low` card atop a `surface` background.
2.  **Tonal Transitions:** Using subtle gradients to suggest an edge rather than drawing one.
3.  **Negative Space:** Using the expanded Spacing Scale (Factor 2) to define the start of a new concept through significant white space.

### Glass & Gradient Implementation

To move beyond a "standard" dark mode, use semi-transparent surface colors with a `backdrop-blur: 12px`.

- **Signature Gradient:** For primary CTAs or hero focal points, use a linear gradient from `$color-primary` to a deeper green variant at a 135-degree angle. This provides a "soul" and depth that flat hex codes cannot achieve.

---

## 3. Typography Scale

This system utilizes a single-font strategy using **Inter** to achieve a unified, modern aesthetic that feels both human and technical.

| Level           | Font Family | Size     | Case   | Use Case                         |
| :-------------- | :---------- | :------- | :----- | :------------------------------- |
| **Display LG**  | Inter       | 3.5rem   | Normal | Hero Headlines / Name            |
| **Headline MD** | Inter       | 1.75rem  | Normal | Section Headers                  |
| **Title MD**    | Inter       | 1.125rem | Normal | Sub-headings / Key identifiers   |
| **Body LG**     | Inter       | 1rem     | Normal | Standard text / Key-value values |
| **Label MD**    | Inter       | 0.75rem  | Normal | Code syntax / Metadata / Tags    |

**Editorial Note:** When using "Experience" sections, mimic a code editor. Use `$color-secondary` for "Keys" (e.g., `Place =`) and `$color-on-surface` for "Values" (e.g., `Homeoffice;`).

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** and **Vibrant Saturated Blurs** rather than traditional structural lines.

### The Layering Principle

Depth is achieved by "stacking" container tiers. An inner card should never use the same color as its parent section.

- **Level 0 (Floor):** `$color-bg-base`
- **Level 1 (Section):** `$color-surface-low`
- **Level 2 (Card/Element):** `$color-surface-high`

### Ambient Shadows & Ghost Borders

- **Floating Elements:** Shadows must be extra-diffused. Use `rgba(0, 0, 0, 0.4)` with a blur of `40px` and a spread of `-10px`. This mimics natural light rather than a harsh drop-shadow.
- **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline_variant` token at **15% opacity**. A 100% opaque border is considered a design failure within this system.

---

## 5. Components

### Syntax Cards (Experience Items)

- **Background:** `$color-surface-low` with a 0.25rem (`Soft`) roundedness.
- **Formatting:** Content must follow the key-value pair aesthetic.
- **Interaction:** On hover, the "Ghost Border" should transition from 15% opacity to 40% opacity in `$color-tertiary`.

### Primary Buttons

- **Shape:** Pill-shaped (`full` roundedness).
- **Style:** Gradient fill (using `$color-primary`).
- **Typography:** `label-md` bold, all caps for an "executable" feel.
- **Shadow:** Small glow effect using `$color-primary` at 20% opacity.

### Navigation & Social Chips

- **Style:** Glassmorphism. `background: rgba(13, 19, 28, 0.5)`, `backdrop-filter: blur(12px)`.
- **Icons:** Use `$color-tertiary` for icons to maintain the terminal-cyan highlight.

### Selection Tags (Tags/Skills)

- **Background:** None.
- **Border:** Ghost Border (15% `$color-primary`).
- **Text:** `$color-primary`, `label-sm`.
- **Constraint:** No background fill unless the chip is "active."

---

## 6. Do's and Don'ts

### Do:

- **Embrace White Space:** Give typography room to breathe. With the spacing scale increased to 2, high-end editorial design relies on significant gaps between elements.
- **Use Code Syntax Color Logic:** Be consistent. If `Place` is orange once, it must be orange everywhere.
- **Layer with Intent:** Ensure that the most important information is on the "highest" (brightest) surface container.

### Don't:

- **Don't use Divider Lines:** Never use a horizontal rule `<hr>` or a 1px border to separate experience items. Use vertical padding (e.g., `8rem`) or a subtle background shift.
- **Don't use Pure Grey:** All neutrals must be tinted with the base navy (`#0D1B2A`). Pure `#888888` greys will feel "cheap" and disconnected from the brand's vibrant depth.
- **Don't Over-Round:** Keep structural corner radii tight (`0.25rem`). Circular buttons are fine, but containers should feel architectural and precise, not "bubbly."

---

## 7. Roundedness & Spacing Scale (SASS Mapping)

- **Roundedness:** 0.25rem (Base / Soft)
- **Spacing Scale:** Multiplier 2 (Generous/Spacious)
