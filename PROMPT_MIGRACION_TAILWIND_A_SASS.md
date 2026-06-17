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
- Si el proyecto usa CSS Modules (`*.module.scss`), preservar ese alcance y aplicar la misma arquitectura de tokens/functions dentro de los modulos.
- Si el proyecto inyecta `abstracts` globalmente con `vite.css.preprocessorOptions.scss.additionalData`, mantener esa convencion y no agregar `@use` redundantes en cada modulo salvo que el repo ya lo haga.
- Opcional pero recomendado: Tina CMS para editar contenido y campos visuales desde dashboard/editor visual.
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
│   ├── _breakpoints.scss
│   └── _mixins.scss
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
└── main.scss
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
@forward "mixins";
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
- `src/styles/main.scss`

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
$font-sizes: (
  "small": (
    "100": 0.75rem,
    "200": 0.875rem,
    "300": 1rem,
    "400": 1.125rem,
    "500": 1.25rem,
    "600": 1.5rem,
    "700": 1.875rem,
    "800": 2.5rem,
    "900": 3rem,
  ),
  "large": (
    "100": 0.75rem,
    "200": 0.875rem,
    "300": 1rem,
    "400": 1.125rem,
    "500": 1.25rem,
    "600": 1.5rem,
    "700": 1.875rem,
    "800": 2.5rem,
    "900": 3rem,
  ),
) !default;
```

Luego exponer sólo variables numericas runtime:

```scss
$font-size-100: var(--fs-100);
$font-size-200: var(--fs-200);
$font-size-300: var(--fs-300);
// ...
```

Regla:
No crear aliases tipo `$font-size-xs`, `$font-size-base`, `$fs-xl` ni `fs(base)`. Usar la API numérica `fs("300")`, `fs("650")`, etc. Agregar nuevos pasos sólo si aparecen repetidos muchas veces y primero reportarlos.

FASE 3 - Tokens semanticos

Crear `src/styles/abstracts/_tokens.scss`.

Debe incluir tokens semanticos para:

- Body:
  - `$body-font-size`
  - `$body-font-family`
  - `$body-text-color`
  - `$body-background-color`
- Headings:
  - `$heading-font-family`
  - `$heading-1-font-size`
  - `$heading-2-font-size`
  - `$heading-3-font-size`
  - `$heading-4-font-size`
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
No crear aliases de compatibilidad como `$body-bg`, `$body-color`, `$h1-size`, `$h2-size`, `$font-size-xs` o `$clr-primary` salvo que haya consumidores existentes y se documenten como temporales.

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

Esta plantilla es autosuficiente: no dependas de un repositorio externo ni de un proyecto base local para copiar archivos. Implementar la siguiente logica como arquitectura canonica:

- `_colors.scss` define primitivas privadas con prefijo `$-clr-*`.
- Los colores no viven como una lista plana, sino en mapas `$light` y `$dark`.
- Cada theme agrupa familias semanticas (`neutral`, `primary`, `accent`, y las que requiera el proyecto) con shades numericos (`100`, `200`, `300`, etc.).
- `_tokens.scss` define `$active-theme` y los tokens que se pueden tocar desde un solo lugar.
- `_root.scss` recorre `$active-theme` con `@each` y genera CSS custom properties como `--primary-500`, `--neutral-100`, etc.
- `_typography.scss` define `$font-sizes` como mapa responsive por breakpoint (`small`, `large`) y con numeracion amplia (`100`, `200`, `300`, `650`, `900`, `1000`).
- Esa numeracion amplia permite insertar tamanos intermedios sin renombrar toda la escala. Ejemplo: si manana una fuente necesita un valor entre `100` y `200`, se agrega `150`.
- `_functions.scss` expone `clr($color, $shade)`, `fs($size)` y `size($size)` como API minima.
- Los mapas funcionales no son lo mismo que `utilities/`: mapas como `$radii`, `$shadows`, `$transitions`, `$containers`, `$font-families` y `$font-weights` alimentan funciones Sass; `utilities/` genera clases CSS reutilizables.
- Se eliminan aliases legacy cuando no tienen consumidores, pero se conservan mapas que alimentan funciones.
- Las variables directas siguen existiendo como base interna o alias de compatibilidad, pero los componentes deben consumir funciones o tokens semanticos.

Agregar en `_colors.scss`:

```scss
// Primitivos privados
$-clr-white: hsl(0 0% 100%);
$-clr-black: hsl(0 0% 0%);
$-clr-gray-100: hsl(0 0% 95%);
// ...
$-clr-primary-500: hsl(...);
$-clr-accent-500: hsl(...);

$light: (
  "neutral": (
    "000": $-clr-white,
    "100": $-clr-gray-100,
    "900": $-clr-gray-900,
    "1000": $-clr-black,
  ),
  "primary": (
    "100": $-clr-primary-100,
    "500": $-clr-primary-500,
    "900": $-clr-primary-900,
  ),
  "accent": (
    "100": $-clr-accent-100,
    "500": $-clr-accent-500,
    "900": $-clr-accent-900,
  ),
);

$dark: (
  "neutral": (
    "1000": $-clr-white,
    "900": $-clr-gray-100,
    "100": $-clr-gray-900,
    "000": $-clr-black,
  ),
  "primary": (
    "900": $-clr-primary-900,
    "500": $-clr-primary-500,
    "100": $-clr-primary-100,
  ),
  "accent": (
    "900": $-clr-accent-900,
    "500": $-clr-accent-500,
    "100": $-clr-accent-100,
  ),
);

// Contextual color tokens generados en runtime por _root.scss
$color-neutral-100: var(--neutral-100);
$color-primary-500: var(--primary-500);
$color-accent-500: var(--accent-500);
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
$-ff-sans: "Inter", system-ui, sans-serif;
$-ff-serif: "Playfair Display", Georgia, serif;
$-ff-mono: ui-monospace, monospace;

$font-family-base: $-ff-sans;
$font-family-accent: $-ff-serif;
$font-family-mono: $-ff-mono;

$font-sizes: (
  "small": (
    "100": 0.75rem,
    "200": 0.875rem,
    "300": 1rem,
    "400": 1.125rem,
    "500": 1.25rem,
    "600": 1.5rem,
    "650": 1.8rem,
    "700": 1.875rem,
    "800": 2.5rem,
    "900": 3rem,
  ),
  "large": (
    "100": 0.75rem,
    "200": 0.875rem,
    "300": 1rem,
    "400": 1.125rem,
    "500": 1.25rem,
    "600": 1.5rem,
    "650": 1.8rem,
    "700": 1.875rem,
    "800": 2.5rem,
    "900": 3rem,
  ),
) !default;

$font-size-100: var(--fs-100);
$font-size-200: var(--fs-200);
$font-size-300: var(--fs-300);
$font-size-650: var(--fs-650);
$font-size-900: var(--fs-900);

$font-families: (
  serif: $font-serif,
  sans: $font-sans,
  mono: $font-mono,
) !default;
```

Agregar en `_tokens.scss`:

```scss
$active-theme: $light;
$enable-media-query-dark-mode: false;

// Contextual tokens. This is the main file to edit when changing the system.
$color-text-default: $color-neutral-700;
$color-background-default: $color-neutral-100;
$color-text-interactive-default: $color-primary-600;
$color-text-interactive-hover: $color-primary-700;

$body-font-family: $font-family-base;
$body-font-size: $font-size-300;
$body-text-color: $color-text-default;
$body-background-color: $color-background-default;

$heading-font-family: $font-family-accent;
$heading-font-weight: 700;
$heading-line-height: 1.1;

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
@use "colors" as *;
@use "effects";
@use "sizes";
@use "tokens" as *;
@use "typography" as *;

@function _from-map($map, $key, $name) {
  @if map.has-key($map, $key) {
    @return map.get($map, $key);
  }

  @error "`#{$key}` no existe en $#{$name}.";
}

@function clr($color, $shade, $scheme: $active-theme) {
  $map: null;

  @if $scheme == "light" {
    $map: $light;
  } @else if $scheme == "dark" {
    $map: $dark;
  } @else if $scheme == $active-theme {
    $map: $active-theme;
  } @else {
    @error "unknown scheme";
  }

  @if map.has-key($map, $color, $shade) {
    @return map.get($map, $color, $shade);
  }

  @error "$active-theme does not have color `#{$color}` with shade `#{$shade}`.";
}

@function size($size) {
  @return _from-map(sizes.$sizes, $size, "sizes");
}

@function fs($font-size) {
  @return var(--fs-#{$font-size});
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
  color: clr("primary", "500");
  padding: size(4);
  font-family: ff(sans);
  font-size: fs("400");
  border-radius: radius(lg);
  box-shadow: shadow(md);
  transition: transition(base);
  margin-block: spacing(section);
  background: glass(bg);
}
```

Crear o actualizar `_root.scss` para generar variables runtime:

```scss
@use "../abstracts" as *;

:root {
  @each $color, $shade-map in $active-theme {
    @each $shade, $value in $shade-map {
      --#{$color}-#{$shade}: #{$value};
    }
  }

  @if ($enable-media-query-dark-mode) {
    @media (prefers-color-scheme: dark) {
      @each $color, $shade-map in $dark {
        @each $shade, $value in $shade-map {
          --#{$color}-#{$shade}: #{$value};
        }
      }
    }
  }

  @each $screen-size, $size-map in $font-sizes {
    @if $screen-size == "small" {
      @each $size-name, $size-value in $size-map {
        --fs-#{$size-name}: #{$size-value};
      }
    } @else {
      @include mq($screen-size) {
        @each $size-name, $size-value in $size-map {
          --fs-#{$size-name}: #{$size-value};
        }
      }
    }
  }
}
```

Las variables directas pueden existir como base interna del sistema, pero los componentes nuevos deben preferir funciones y tokens semanticos. No crear aliases tipograficos legacy como `fs(base)`, `fs(xs)` o `$font-size-xs`; usar siempre `fs("300")`, `fs("100")` y `$font-size-300`. No crear aliases de color legacy como `clr(primary)`, `clr(text-main)` o `$clr-primary`; usar familias y shades con `clr("primary", "500")`.

Regla de depuracion:

- Respetar la nomenclatura canonica definida en esta plantilla.
- Mover decisiones editables a `_tokens.scss`.
- Mantener `_sizes.scss`, `_typography.scss` y `_colors.scss` como primitivas/mapas.
- Conservar mapas funcionales que alimentan funciones (`$radii`, `$shadows`, `$transitions`, `$containers`, `$font-families`, `$font-weights`).
- Recordar que `utilities/` genera clases CSS y no reemplaza los mapas funcionales.
- Mantener `_breakpoints.scss` como mapa puro.
- Mantener mixins en `_mixins.scss`.
- No borrar aliases legacy hasta auditar que no tengan usos. Una vez migrados, eliminarlos y dejar la API numerica limpia.

FASE 4 - Breakpoints y mixin responsive

Crear `src/styles/abstracts/_breakpoints.scss`.

Usar breakpoints en `em`, equivalentes a Tailwind:

```scss
$breakpoints: (
  small: 40em,
  sm: 40em,
  medium: 48em,
  md: 48em,
  large: 64em,
  lg: 64em,
  xlarge: 80em,
  xl: 80em,
  xxlarge: 100em,
  xxxlarge: 120em,
) !default;
```

Crear `src/styles/abstracts/_mixins.scss` para el comportamiento responsive:

```scss
@use "sass:map";
@use "sass:math";
@use "sass:meta";
@use "breakpoints" as *;

@mixin mq($size) {
  @if map.has-key($breakpoints, $size) {
    $breakpoint: map.get($breakpoints, $size);

    @media screen and (min-width: $breakpoint) {
      @content;
    }
  } @else if meta.type-of($size) == number {
    @if math.is-unitless($size) {
      @error "when using a number with @mq() make sure to include a unit";
    } @else {
      @media screen and (min-width: $size) {
        @content;
      }
    }
  } @else {
    @error "the keyword #{$size} is not in the $breakpoints map";
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
  font-size: fs("300");

  @include mq(sm) {
    // tablet o mayor
    font-size: fs("400");
  }

  @include mq(lg) {
    // desktop o mayor
    font-size: fs("500");
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
    font-size: fs("650");

    @include mq(sm) {
      font-size: fs("900");
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
font-size: 1.125rem; // -> font-size: fs("400");
border-radius: 1rem; // -> border-radius: radius(lg);
```

Ejemplos incorrectos:

```scss
font-size: 1.15rem; // NO reemplazar por fs("400") si vale 1.125rem
font-size: 1.3rem; // NO reemplazar por fs("500") si vale 1.25rem
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
  font-size: fs("400");
}

// Despues
@include mq(sm) {
  font-size: fs("400");
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

FASE 8 - Tina CMS visual editing generico

Si el proyecto usa Tina CMS, o se quiere dejar preparado para edicion visual, aplicar esta fase despues de estabilizar SASS/BEM.

Objetivo:
Mover contenido hardcodeado de React/Astro a documentos editables, sin convertir Tina en un editor de SASS. Tina debe controlar datos, contenido, imagenes, orden, visibilidad y variantes visuales; SASS debe seguir definiendo el sistema visual.

Regla clave:

```txt
SASS define el sistema.
Tina define el contenido y las decisiones visuales editables.
```

Auditoria inicial:

1. Revisar `tina/config.ts`.
2. Revisar `src/content.config.ts`.
3. Identificar si ya existen colecciones Tina.
4. Identificar si hay `useTina`, `tinaField` o `data-tina-field`.
5. Identificar que contenido esta hardcodeado en componentes:
   - hero
   - navbar
   - cards
   - articulos/posts/proyectos/items repetibles
   - testimonios
   - contacto
   - footer
   - SEO
   - CTAs
6. Decidir que debe ser documento unico y que debe ser coleccion propia.

Patron recomendado:

- Usar una coleccion `pages` para paginas editables como `home.mdx`, `about.mdx`, `services.mdx`, etc.
- Usar colecciones propias para entidades que van a crecer o que necesitan categoria, filtros, orden o pagina de detalle:
  - `articles` / `posts`
  - `projects`
  - `services`
  - `items`
  - `team`
  - `testimonials`
- No guardar listas grandes y crecientes dentro de un unico `home.mdx` si se espera que crezcan, filtren o tengan detalle propio.

Ejemplo de estructura:

```txt
src/content/
├── pages/
│   └── home.mdx
├── articles/
│   ├── category-one/
│   │   └── article-one.mdx
│   └── category-two/
│       └── article-two.mdx
├── items/
│   ├── item-one.mdx
│   └── item-two.mdx
└── global/
    └── settings.mdx
```

Coleccion `pages` generica:

```ts
{
  name: "pages",
  label: "Pages",
  path: "src/content/pages",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      const name = document._sys.filename;
      if (name === "home") return "/";
      return undefined;
    },
  },
  fields: [
    {
      type: "string",
      name: "_template",
      label: "Template ID",
      ui: { component: "hidden" },
    },
    {
      type: "string",
      name: "title",
      label: "SEO Title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "SEO Description",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "hero",
      label: "Hero",
      fields: [
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
        { type: "image", name: "image", label: "Image" },
        { type: "string", name: "primaryCtaLabel", label: "Primary CTA Label" },
        { type: "string", name: "primaryCtaUrl", label: "Primary CTA URL" },
      ],
    },
  ],
}
```

Coleccion propia para articulos/posts con categorias:

```ts
{
  name: "articles",
  label: "Articles",
  path: "src/content/articles",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      const path = document._sys.relativePath.replace(/\.(mdx|md)$/, "");
      return `/articles/${path}`;
    },
  },
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { type: "string", name: "excerpt", label: "Excerpt", ui: { component: "textarea" } },
    { type: "datetime", name: "date", label: "Date" },
    { type: "string", name: "category", label: "Category", required: true },
    { type: "string", name: "tags", label: "Tags", list: true },
    { type: "image", name: "image", label: "Cover Image" },
    { type: "number", name: "order", label: "Order" },
    { type: "boolean", name: "featured", label: "Visible" },
    { type: "rich-text", name: "body", label: "Body", isBody: true },
  ],
}
```

Coleccion propia para items/proyectos/servicios repetibles:

```ts
{
  name: "items",
  label: "Items",
  path: "src/content/items",
  format: "mdx",
  fields: [
    { type: "string", name: "itemId", label: "Item ID", required: true },
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { type: "string", name: "category", label: "Category", options: ["A", "B", "C"] },
    { type: "string", name: "summary", label: "Summary", ui: { component: "textarea" } },
    { type: "image", name: "image", label: "Image" },
    { type: "number", name: "order", label: "Order" },
    { type: "boolean", name: "featured", label: "Visible" },
  ],
}
```

Notas:

- No usar `id` como field editorial si Tina/GraphQL ya lo usa como campo reservado. Preferir `itemId`, `postId`, `articleId`, `projectId`, `serviceId`, etc.
- Agregar `ui.itemProps` en listas de objetos para que el editor sea legible:

```ts
ui: {
  itemProps: (item) => ({ label: item?.title || "Item" }),
}
```

Actualizar `src/content.config.ts`:

```ts
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    hero: z.any().optional(),
  }),
});

const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().default(true),
  }),
});

export const collections = {
  pages: pagesCollection,
  articles: articlesCollection,
};
```

Patron de datos para Astro:

- Para build estatico robusto, construir datos iniciales con Astro Content Collections (`getCollection`) en vez de depender de que el servidor GraphQL local de Tina este levantado.
- Pasar igualmente `query`, `variables` y `data` al componente React para habilitar `useTina`.
- Evitar que `astro build` falle por `fetch failed` a `localhost:4001`.

Ejemplo:

```astro
---
import { getCollection } from "astro:content";
import { HOME_PAGE_QUERY } from "../lib/tinaHomeQuery";
import MainPage from "../components/MainPage";

const pages = await getCollection("pages");
const articleEntries = await getCollection("articles");

const home = pages.find((entry) => entry.id === "home");
const articles = articleEntries
  .map((entry) => ({
    ...entry.data,
    _sys: { relativePath: `${entry.id}.mdx` },
  }))
  .sort((a, b) => (a.order || 99) - (b.order || 99));

const variables = { relativePath: "home.mdx" };
const tinaData = {
  pages: home?.data,
  articlesConnection: {
    edges: articles.map((node) => ({ node })),
  },
};
---

<MainPage
  client:load
  query={HOME_PAGE_QUERY}
  variables={variables}
  data={tinaData}
/>
```

Patron en React:

```tsx
import { useTina, tinaField } from "tinacms/dist/react";

export default function MainPage({ query, variables, data }) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData.pages;
  const articles = tinaData.articlesConnection.edges.map((edge) => edge.node);

  return (
    <Hero data={page.hero} articles={articles} />
  );
}
```

Marcar campos para edicion visual:

```tsx
import { tinaField } from "tinacms/dist/react";

export function Hero({ data }) {
  return (
    <section className="hero">
      <p data-tina-field={tinaField(data, "eyebrow")}>
        {data.eyebrow}
      </p>
      <h1 data-tina-field={tinaField(data, "title")}>
        {data.title}
      </h1>
      <img
        src={data.image}
        alt={data.imageAlt || data.title}
        data-tina-field={tinaField(data, "image")}
      />
    </section>
  );
}
```

Para listas:

```tsx
{items.map((item) => (
  <article key={item.itemId || item._sys.relativePath}>
    <h3 data-tina-field={tinaField(item, "title")}>
      {item.title}
    </h3>
    <p data-tina-field={tinaField(item, "summary")}>
      {item.summary}
    </p>
  </article>
))}
```

Reglas de modelado:

- Textos visibles deben vivir en Tina si el cliente/editor podria querer cambiarlos.
- Imagenes visibles deben ser `image` fields.
- CTAs deben separar label y URL.
- Repetibles deben ser `object list` o coleccion propia segun crecimiento esperado.
- Variantes visuales deben ser strings con `options`, no texto libre, por ejemplo:

```ts
{ type: "string", name: "variant", label: "Variant", options: ["default", "featured", "compact"] }
```

- Las variantes visuales se mapean a clases BEM, `data-variant`, `data-theme` o CSS custom properties.
- No permitir que Tina escriba clases arbitrarias si no hay una razon clara.
- No mover comportamiento interactivo a Tina. Estados, filtros, formularios, sliders y animaciones siguen en React.
- Tina define contenido; React define comportamiento; SASS define sistema visual.

Build local con credenciales dummy:

Si el proyecto usa credenciales dummy o todavia no esta conectado a Tina Cloud, `tinacms build` puede fallar por validacion Cloud. Para verificar schema y build local:

```bash
pnpm exec tinacms build --skip-cloud-checks --content=local --skip-search-index
pnpm exec astro build
```

Si se quiere dejar el script local-friendly:

```json
{
  "scripts": {
    "dev": "tinacms dev -c \"astro dev\"",
    "build": "tinacms build --skip-cloud-checks --content=local --skip-search-index && astro build"
  }
}
```

Dashboard custom:

No hacerlo primero. Primero debe funcionar la edicion visual de la pagina. Luego se puede crear un dashboard custom como screen plugin:

- total de items
- items sin imagen
- items ocultos
- documentos incompletos
- accesos rapidos a editar documentos

Control de esta fase:

- [ ] Existe coleccion `pages` para documentos de pagina.
- [ ] Las entidades crecientes tienen coleccion propia.
- [ ] Astro build no depende de `localhost:4001`.
- [ ] React usa `useTina`.
- [ ] Los campos visuales usan `data-tina-field`.
- [ ] Tina build local pasa.
- [ ] Astro build pasa.

FASE 9 - Control de calidad

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
- [ ] Si se usa Tina, el contenido editable vive en colecciones/documentos CMS y no hardcodeado en React.
- [ ] Si se usa Tina, las entidades crecientes tienen coleccion propia.
- [ ] Si se usa Tina, los campos visuales usan `data-tina-field`.
- [ ] El build pasa.

Importante:
No optimizar ni redisenar durante esta migracion. Primero preservar, despues mejorar.
```
