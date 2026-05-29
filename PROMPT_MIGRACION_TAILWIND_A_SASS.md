# Prompt Plantilla: Migracion de Tailwind a SASS Tokenizado

Usa este prompt cuando Google AI Studio u otra IA genere un proyecto usando Tailwind por defecto y quieras refactorizarlo a una arquitectura SASS modular, tokenizada y mobile-first.

```md
Quiero refactorizar este proyecto de Tailwind a SASS.

Objetivo:
Migrar el sistema visual actual a una arquitectura SASS modular, con BEM, tokens de diseno, mixins responsive y sin cambiar el resultado visual existente.

Reglas generales:
- No agregar nuevas clases Tailwind.
- No eliminar estilos visuales sin justificarlo.
- No cambiar el diseno durante la migracion.
- Trabajar por fases.
- Mostrar auditoria y plan antes de modificar.
- Ejecutar build o verificacion equivalente despues de cada fase importante.
- Si no existe un token exacto para un valor, dejar el valor hardcodeado y reportarlo.
- No usar tokens aproximados salvo que yo lo apruebe explicitamente.
- Pensar siempre mobile-first: los estilos base son mobile y los media queries/mixins son overrides para pantallas mayores.

Stack esperado:
- Proyecto frontend generado inicialmente con Tailwind.
- Refactor objetivo: SASS / SCSS.
- Componentes con clases BEM.
- Si el proyecto usa CSS Modules (`*.module.scss`), preservar ese alcance y aplicar la misma arquitectura de tokens/functions dentro de los módulos.
- Si el proyecto inyecta `abstracts` globalmente con `vite.css.preprocessorOptions.scss.additionalData`, mantener esa convención y no agregar `@use` redundantes en cada módulo salvo que el repo ya lo haga.
- Estilos globales organizados en `src/styles/`.

Arquitectura SASS objetivo:

```txt
src/styles/
├── abstracts/
│   ├── _index.scss
│   ├── _colors.scss
│   ├── _fonts.scss
│   ├── _typography.scss
│   ├── _sizes.scss
│   ├── _tokens.scss
│   ├── _functions.scss
│   ├── _effects.scss
│   └── _breakpoints.scss
├── base/
│   ├── _reset.scss
│   ├── _root.scss
│   ├── _general.scss
│   └── _global.scss
├── layout/
│   ├── _index.scss
│   └── _*.scss
├── utilities/
│   ├── _index.scss
│   └── _*.scss
├── components/
│   └── _*.scss
├── pages/
│   └── _*.scss
└── globals.scss
```

Todos los archivos de componentes deben usar:

```scss
@use "../abstracts" as *;
```

Si un archivo esta dentro de `pages/`, ajustar la ruta segun corresponda:

```scss
@use "../abstracts" as *;
```

El archivo `src/styles/abstracts/_index.scss` debe centralizar los forwards:

```scss
@forward "fonts";
@forward "colors";
@forward "typography";
@forward "sizes";
@forward "tokens";
@forward "functions";
@forward "effects";
@forward "breakpoints";
```

FASE 0 - Diagnostico inicial

Antes de modificar:

1. Auditar estructura del proyecto.
2. Identificar framework, bundler y punto de entrada de estilos.
3. Identificar donde se importan los estilos globales.
4. Identificar componentes principales.
5. Identificar si ya existen archivos SCSS.
6. Reportar:
   - estructura actual
   - archivos de estilos existentes
   - uso de Tailwind
   - convenciones actuales de nombres
   - riesgos de migracion

No modificar archivos en esta fase.

FASE 1 - Crear arquitectura SASS base

Crear la estructura:

- `src/styles/abstracts/`
- `src/styles/base/`
- `src/styles/layout/`
- `src/styles/utilities/`
- `src/styles/components/`
- `src/styles/pages/` si corresponde
- `src/styles/globals.scss`

Crear o adaptar:

- `_colors.scss`
- `_fonts.scss`
- `_typography.scss`
- `_sizes.scss`
- `_tokens.scss`
- `_functions.scss`
- `_effects.scss`
- `_breakpoints.scss`
- `_index.scss`
- `_reset.scss`
- `_root.scss`
- `_general.scss`
- `_global.scss`

No migrar componentes todavia si la estructura no esta validada.

FASE 2 - Tokens primitivos

Crear escala de tamanos en `src/styles/abstracts/_sizes.scss`.

Escala sugerida:

```scss
$size-0-5: 0.125rem;
$size-1: 0.25rem;
$size-1-5: 0.375rem;
$size-2: 0.5rem;
$size-2-5: 0.625rem;
$size-3: 0.75rem;
$size-3-5: 0.875rem;
$size-4: 1rem;
$size-4-5: 1.125rem;
$size-5: 1.25rem;
$size-6: 1.5rem;
$size-8: 2rem;
$size-9: 2.25rem;
$size-10: 2.5rem;
$size-11: 2.75rem;
$size-12: 3rem;
$size-14: 3.5rem;
$size-16: 4rem;
$size-18: 4.5rem;
$size-20: 5rem;
$size-24: 6rem;
$size-28: 7rem;
$size-32: 8rem;
```

Crear escala tipografica en `src/styles/abstracts/_typography.scss`.

Escala sugerida:

```scss
$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-2-5xl: 1.8rem;
$font-size-3xl: 1.875rem;
$font-size-4xl: 2.5rem;
$font-size-5xl: 3rem;
$font-size-6xl: 3.8rem;
```

Regla:
No inventar escalas enormes. Agregar nuevos pasos solo si aparecen repetidos muchas veces y primero reportarlos.

FASE 3 - Tokens semanticos

Crear `src/styles/abstracts/_tokens.scss`.

Debe incluir tokens semanticos para:

- Body:
  - `$body-font-size`
  - `$body-font-family`
  - `$body-color`
  - `$body-bg`
- Headings:
  - `$heading-font-family`
  - `$h1-size`
  - `$h2-size`
  - `$h3-size`
  - `$h4-size`
- Spacing:
  - `$spacing-section`
  - `$spacing-component`
  - `$spacing-element`
- Radius:
  - `$radius-sm`
  - `$radius-md`
  - `$radius-lg`
  - `$radius-xl`
  - `$radius-pill`
- Shadows:
  - `$shadow-sm`
  - `$shadow-md`
  - `$shadow-lg`
  - `$shadow-gold`
- Transitions:
  - `$transition-fast`
  - `$transition-base`
  - `$transition-slow`
- Layout:
  - `$container-max`
  - `$container-narrow`
  - `$container-pad`
  - `$navbar-height`

Regla:
Los tokens semanticos deben referenciar primitivos de `_sizes.scss`, `_typography.scss`, `_colors.scss` o `_fonts.scss` cuando sea posible.

Ejemplo:

```scss
$radius-sm: $size-1;
$radius-md: $size-2;
$radius-lg: $size-4;
$radius-xl: $size-6;
$radius-pill: 9999px;

$container-max: 80rem;
$container-narrow: 60rem;
```

FASE 3.5 - Mapas y functions como API del sistema

Despues de crear variables primitivas y tokens semanticos, agregar mapas en los archivos fuente correspondientes. La idea es que cada escala pueda modificarse desde un lugar y que los componentes consuman funciones en vez de variables sueltas.

Agregar en `_colors.scss`:

```scss
$colors: (
  primary: $clr-primary,
  primary-light: $clr-primary-light,
  primary-dark: $clr-primary-dark,
  teal: $clr-teal,
  teal-light: $clr-teal-light,
  teal-dark: $clr-teal-dark,
  bg-primary: $clr-bg-primary,
  bg-secondary: $clr-bg-secondary,
  bg-dark: $clr-bg-dark,
  text-main: $clr-text-main,
  text-muted: $clr-text-muted,
) !default;
```

Agregar en `_sizes.scss`:

```scss
$sizes: (
  "0-5": $size-0-5,
  1: $size-1,
  "1-5": $size-1-5,
  2: $size-2,
  "2-5": $size-2-5,
  3: $size-3,
  "3-5": $size-3-5,
  4: $size-4,
  "4-5": $size-4-5,
  5: $size-5,
  6: $size-6,
  8: $size-8,
  10: $size-10,
  12: $size-12,
  16: $size-16,
  20: $size-20,
  24: $size-24,
  28: $size-28,
  32: $size-32,
) !default;
```

Agregar en `_typography.scss`:

```scss
$font-families: (
  serif: $font-serif,
  sans: $font-sans,
  mono: $font-mono,
) !default;

$font-sizes: (
  xs: $font-size-xs,
  sm: $font-size-sm,
  base: $font-size-base,
  lg: $font-size-lg,
  xl: $font-size-xl,
  "2xl": $font-size-2xl,
  "3xl": $font-size-3xl,
  "4xl": $font-size-4xl,
  "5xl": $font-size-5xl,
  "6xl": $font-size-6xl,
) !default;
```

Agregar en `_tokens.scss`:

```scss
$radii: (
  sm: $radius-sm,
  md: $radius-md,
  lg: $radius-lg,
  xl: $radius-xl,
  pill: $radius-pill,
) !default;

$shadows: (
  sm: $shadow-sm,
  md: $shadow-md,
  lg: $shadow-lg,
  gold: $shadow-gold,
) !default;

$transitions: (
  fast: $transition-fast,
  base: $transition-base,
  slow: $transition-slow,
) !default;

$containers: (
  max: $container-max,
  narrow: $container-narrow,
  pad: $container-pad,
) !default;

$spacings: (
  section: $spacing-section,
  component: $spacing-component,
  element: $spacing-element,
) !default;
```

Agregar en `_effects.scss`:

```scss
$glass: (
  bg: $glass-bg,
  bg-dark: $glass-bg-dark,
  border: $glass-border,
  blur: $glass-blur,
) !default;
```

Crear `src/styles/abstracts/_functions.scss` como API de lectura:

```scss
@use "sass:map";
@use "colors";
@use "effects";
@use "sizes";
@use "tokens";
@use "typography";

@function _from-map($map, $key, $name) {
  @if map.has-key($map, $key) {
    @return map.get($map, $key);
  }

  @error "`#{$key}` no existe en $#{$name}.";
}

@function clr($color) {
  @return _from-map(colors.$colors, $color, "colors");
}

@function size($size) {
  @return _from-map(sizes.$sizes, $size, "sizes");
}

@function fs($font-size) {
  @return _from-map(typography.$font-sizes, $font-size, "font-sizes");
}

@function ff($font-family) {
  @return _from-map(typography.$font-families, $font-family, "font-families");
}

@function radius($radius) {
  @return _from-map(tokens.$radii, $radius, "radii");
}

@function shadow($shadow) {
  @return _from-map(tokens.$shadows, $shadow, "shadows");
}

@function transition($transition) {
  @return _from-map(tokens.$transitions, $transition, "transitions");
}

@function container($container) {
  @return _from-map(tokens.$containers, $container, "containers");
}

@function spacing($spacing) {
  @return _from-map(tokens.$spacings, $spacing, "spacings");
}

@function glass($token) {
  @return _from-map(effects.$glass, $token, "glass");
}
```

Regla de consumo preferida en componentes:

```scss
.card {
  color: clr(primary);
  padding: size(4);
  font-family: ff(sans);
  font-size: fs(lg);
  border-radius: radius(lg);
  box-shadow: shadow(md);
  transition: transition(base);
  margin-block: spacing(section);
  background: glass(bg);
}
```

Las variables directas pueden existir como base interna del sistema, pero los componentes nuevos deben preferir funciones.

FASE 4 - Breakpoints y mixin responsive

Crear `src/styles/abstracts/_breakpoints.scss`.

Usar breakpoints en `em`, equivalentes a Tailwind:

```scss
@use "sass:map";
@use "sass:math";
@use "sass:meta";

$breakpoints: (
  sm: 40em,
  md: 48em,
  lg: 64em,
) !default;

@mixin mq($breakpoint) {
  @if map.has-key($breakpoints, $breakpoint) {
    @media (min-width: map.get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else if meta.type-of($breakpoint) == "number" and not math.is-unitless($breakpoint) {
    @media (min-width: $breakpoint) {
      @content;
    }
  } @else {
    @error "Breakpoint `#{$breakpoint}` no existe en $breakpoints.";
  }
}
```

Equivalencias:

- `sm: 40em` equivale aproximadamente a `640px`
- `md: 48em` equivale aproximadamente a `768px`
- `lg: 64em` equivale aproximadamente a `1024px`

Regla mobile-first:

```scss
.element {
  // mobile base
  font-size: $font-size-base;

  @include mq(sm) {
    // tablet o mayor
    font-size: $font-size-lg;
  }

  @include mq(lg) {
    // desktop o mayor
    font-size: $font-size-xl;
  }
}
```

No escribir al reves. La base siempre es mobile.

FASE 5 - Migracion de componentes a BEM + SCSS

Para cada componente:

1. Leer el componente.
2. Identificar clases Tailwind.
3. Crear una clase BEM principal.
4. Crear archivo SCSS correspondiente en `src/styles/components/`.
5. Reemplazar clases Tailwind por clases BEM.
6. Migrar estilos visuales a SCSS.
7. Usar tokens cuando haya equivalencia exacta.
8. Mantener hardcodeados los valores sin token exacto.
9. Verificar build.

Ejemplo:

```tsx
<section className="hero">
  <div className="hero__content">
    <h1 className="hero__title">Titulo</h1>
  </div>
</section>
```

```scss
@use "../abstracts" as *;

.hero {
  display: grid;
  gap: size(8);

  @include mq(lg) {
    grid-template-columns: repeat(12, 1fr);
  }

  &__content {
    @include mq(lg) {
      grid-column: span 7;
    }
  }

  &__title {
    font-family: ff(serif);
    font-size: fs("2-5xl");

    @include mq(sm) {
      font-size: fs("5xl");
    }
  }
}
```

FASE 6 - Tokenizacion de valores hardcodeados

Auditar primero. No modificar sin reportar.

Buscar en `src/styles/components/`, `src/styles/pages/` y `src/styles/base/`:

- `font-size` con rem/px directos
- `padding` y `margin` con rem/px directos
- `gap`
- `width` y `height`
- `top`, `right`, `bottom`, `left`
- `border-radius`
- `transition` y `animation`
- `box-shadow`
- `max-width`
- `scroll-margin`

Reporte obligatorio por archivo:

- valor encontrado
- propiedad
- selector aproximado
- token exacto disponible
- si queda hardcodeado

Reglas de reemplazo:

- Reemplazar SOLO valores con token exacto.
- Si no existe token exacto, dejar hardcodeado.
- No usar tokens aproximados para font-size, spacing, radius, transition ni offsets.
- Para `border-radius`, preferir `radius(*)` si existe valor exacto semantico.
- Para spacing primitivo, usar `size(*)`.
- Para spacing semantico, usar `spacing(section/component/element)`.
- Para font-size, usar `fs(*)`.
- Para colores, usar `clr(*)`.
- Para familias tipograficas, usar `ff(*)`.
- Para shadows, usar `shadow(*)`.
- Para transitions, usar `transition(*)`.
- Para efectos glass, usar `glass(*)`.
- Para layout, usar `container(*)` si coincide exacto.
- No tokenizar `letter-spacing` salvo instruccion explicita.
- No tokenizar `aspect-ratio`.
- No tokenizar `font-size` de `9px`, `10px`, `11px`.
- Mantener `border-radius: 50%` hardcodeado.
- No crear tokens nuevos sin confirmacion.

Ejemplos correctos:

```scss
padding: 1rem; // -> padding: size(4);
gap: 0.75rem; // -> gap: size(3);
font-size: 1.125rem; // -> font-size: fs(lg);
border-radius: 1rem; // -> border-radius: radius(lg);
```

Ejemplos incorrectos:

```scss
font-size: 1.15rem; // NO reemplazar por fs(lg) si vale 1.125rem
font-size: 1.3rem; // NO reemplazar por fs(xl) si vale 1.25rem
transition: 300ms ease; // NO reemplazar por transition(base) si vale 250ms
border-radius: 0.75rem; // NO usar radius(md) si vale 0.5rem
```

FASE 7 - Reemplazo de media queries hardcodeadas

Auditar:

```scss
@media (min-width: 640px)
@media (min-width: 768px)
@media (min-width: 1024px)
```

Reemplazar por:

```scss
@include mq(sm)
@include mq(md)
@include mq(lg)
```

Ejemplos:

```scss
// Antes
@media (min-width: 640px) {
  font-size: fs(lg);
}

// Despues
@include mq(sm) {
  font-size: fs(lg);
}
```

```scss
// Antes
@media (min-width: 1024px) {
  grid-template-columns: repeat(12, 1fr);
}

// Despues
@include mq(lg) {
  grid-template-columns: repeat(12, 1fr);
}
```

Reglas:

- No cambiar el contenido interno de la media query.
- No reordenar estilos.
- No modificar valores visuales.
- Hacerlo archivo por archivo.
- Verificar build.
- Reportar cuantas media queries fueron reemplazadas.

FASE 8 - Control de calidad

Ejecutar:

```bash
pnpm run build
```

Si el build completo depende de servicios externos o CMS y falla por una razon ajena a SASS, ejecutar una verificacion equivalente, por ejemplo:

```bash
pnpm exec astro build
```

Tambien verificar:

```bash
rg -n "@media \(min-width: (640|768|1024)px\)" src/styles
rg -n "@include mq\((sm|md|lg)\)" src/styles
```

Reporte final:

- archivos creados
- archivos modificados
- tokens agregados
- valores que quedaron hardcodeados intencionalmente
- media queries reemplazadas
- resultado del build
- riesgos pendientes

Checklist final:

- [ ] No quedan nuevas clases Tailwind.
- [ ] Los componentes usan BEM.
- [ ] Los estilos estan en SCSS.
- [ ] Los componentes importan abstracts con `@use`.
- [ ] `_index.scss` exporta todos los abstracts.
- [ ] Los tokens semanticos referencian primitivos.
- [ ] Las escalas tienen mapas centrales.
- [ ] `_functions.scss` expone `clr`, `size`, `fs`, `ff`, `radius`, `shadow`, `transition`, `container`, `spacing` y `glass`.
- [ ] Los componentes consumen funciones cuando existe token exacto.
- [ ] La tokenizacion no cambio valores visuales.
- [ ] Los breakpoints usan `mq(sm/md/lg)`.
- [ ] La arquitectura responsive es mobile-first.
- [ ] El build pasa.

Importante:
No optimizar ni redisenar durante esta migracion. Primero preservar, despues mejorar.
```
