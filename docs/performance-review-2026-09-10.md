# Revisión de rendimiento del portfolio — 2026-09-10

## Resultado

La animación continua de las tres máscaras CSS es el primer cuello de botella a resolver. Astro sigue siendo una base adecuada. No hay evidencia que justifique migrar el framework para resolver este problema.

Se revisó el checkout actual en `main` y se midió https://aledesign.dev/ con Chromium mediante Playwright/CDP. No se modificó el código de la web ni se publicó contenido. Las únicas escrituras son este informe, el borrador editorial de GitCron y los artefactos de diagnóstico.

## Stack instalado en el checkout

| Capa | Versión instalada |
| --- | --- |
| Astro | 6.3.5 |
| React | 19.2.6 |
| TinaCMS | 3.8.1 |
| Motion | 12.39.0 |
| Contenido | MDX + colecciones Astro + TinaCMS |
| Estilos | Sass / CSS Modules |

Las versiones provienen de `node_modules`, no de los rangos mínimos de package.json. El sitio público no expone necesariamente estas mismas versiones. Node local es 22.19.0; AGENTS.md pide Node 24 o superior, mientras package.json declara >=22. Es una inconsistencia de entorno, no una explicación del consumo del navegador visitante.

## Medición de la home publicada

Viewport 1280 × 720, DPR 1, página ya cargada, sin mover el mouse. Cuatro condiciones consecutivas de 4 segundos, con 800 ms de estabilización tras cada override CSS. Los overrides se eliminaron al terminar cada condición.

| Condición | Paint: cantidad de eventos | Tiempo acumulado de Paint | TaskDuration del hilo principal |
| --- | ---: | ---: | ---: |
| Original | 924 | 110,094 ms | 350,667 ms |
| Cuadrículas pausadas, glass activo | 0 | 0 ms | 3,597 ms |
| Sin backdrop-filter, cuadrículas activas | 948 | 95,736 ms | 314,605 ms |
| Cuadrículas pausadas y sin backdrop-filter | 0 | 0 ms | 1,618 ms |

En original hubo además 231 recálculos de estilo y 693 RasterTask; con cuadrículas pausadas, ambos bajaron a cero. ScriptDuration fue cero en las cuatro ventanas sin movimiento del mouse.

**Interpretación:** el fondo obliga a recalcular estilos y pintar continuamente. Pausarlo elimina ese trabajo en esta muestra. Quitar únicamente el backdrop no elimina la causa. Los eventos Paint no equivalen a cuadros por segundo: un cuadro puede producir varios eventos. TaskDuration no mide el consumo total de CPU/GPU ni temperatura. Es una comparación breve en un viewport, no un benchmark estadístico, Lighthouse ni una medición de batería. El peso del glass durante scroll y en otros dispositivos requiere medición adicional.

Reproducción: abrir una sesión con `npx.cmd --yes --package @playwright/cli playwright-cli -s=portfolio-audit open https://aledesign.dev` y ejecutar `run-code --filename output/playwright/profile-background.js` con la misma sesión. El script devuelve el inventario y las mediciones; también los deja en `window.__portfolioAudit` dentro de esa pestaña de prueba.

## Hallazgos del código

1. `src/styles/abstracts/_mixins.scss:161-246`: tres capas de tamaño completo, dos drop-shadow por capa, mezcla screen/multiply y gradientes radiales usados como máscaras. Se animan sus coordenadas y la intensidad mediante custom properties cada 26, 34 y 42 segundos; el pulso dura 5,8 segundos. Animar más despacio no reduce por sí solo la frecuencia de pintado. El comentario sobre GPU no demuestra composición sin repintado.
2. `src/styles/abstracts/_mixins.scss:40-101`: glass con blur de 28 px más un pseudo-elemento con otro backdrop blur de 25 px, textura y mezcla. Son varias operaciones por contenedor.
3. `src/layouts/MainLayout.astro:96-183`: canvas 2D para iluminar celdas cercanas al mouse. No es WebGL ni un bucle perpetuo: dibuja como máximo una vez por requestAnimationFrame solicitado por movimiento. Aun así, borra un bitmap de toda la pantalla y lee geometría/estilos. No contempla reduced motion en ese script.
4. `grain.png` y `banner-background.png`: la home descargó 280.128 y 458.405 bytes respectivamente, unos 739 KB combinados solo para esos recursos decorativos. Repetir una URL en cards no implica descargarla de nuevo por cada card, pero puede aumentar el trabajo de composición.
5. `src/pages/index.astro:58-66` y las otras páginas: se hidratan contenedores React completos. Motion se usa también para entradas simples; varias páginas usan useTina. Esto se puede reducir después del fondo. La presencia de archivos grandes de Tina en public/admin no demuestra que el visitante descargue el editor: no se observó un recurso /admin en el inventario de scripts de la home.
6. Imágenes de Home y detalle sin variantes por resolución, dimensiones HTML ni lazy loading explícito. El contenido dummy incluye imágenes externas de Picsum. Corregirlo al cargar capturas reales.

## Cambios aplicados

**Intención:** conservar la identidad de cuadrícula, color y profundidad sin actividad decorativa permanente.

**Especificación aplicada:** cuadrícula y luces estáticas, tres máscaras radiales fijas, sin `@property`, keyframes, drop-shadows ni canvas. Las transiciones de interacción existentes siguen usando opacity/transform. No se cambió a canvas o WebGL.

**Implementación:**

```scss
// Las coordenadas de las máscaras ahora son valores Sass fijos.
// El mixin no registra animaciones ni filtros de sombra.
```

El mixin `glass` ahora usa una sola base translúcida y un gradiente; se eliminaron sus dos pseudo-elementos, los dos `backdrop-filter` y las texturas PNG. También se retiró el canvas y el seguimiento de mouse. Navegación, menú de exportación, insignia del hero y halos del detalle dejaron de usar backdrop blur o blur de 140 px.

**Alternativa accesible:** el fondo ya es estático para cualquier preferencia de movimiento, y no hay seguimiento de mouse que pausar. La cuadrícula fija es una presentación completa por sí misma.

**Verificación realizada:** el build local generó 9 páginas con Node 24.7.0. En Playwright, la home final no creó canvas, no descargó `grain.png` ni `banner-background.png`, y las tres cuadrículas reportaron `animation: none` y `filter: none`. En cuatro segundos en reposo hubo 0 Paint, 0 RasterTask y 1,4 ms de TaskDuration, frente a 924 Paint y 350,7 ms de TaskDuration en la medición original. Se verificaron tema claro/oscuro, móvil de 390 px con reduced motion, Cards/List, filtros, menú móvil y rutas `/about`, `/resume`, `/archive` y `/projects/around`, todas con HTTP 200 y sin errores de página. El chequeo de tipos acotado sigue reportando 13 errores preexistentes en Tina, instrumentación de Google y `MainLayout`; no se corrigieron como parte de esta optimización.

## Contenido real

Alejandro confirmó que el contenido actual es dummy; no se trata como evidencia de su experiencia. La ficha de detalle además introduce valores de ejemplo cuando faltan datos (`DEPLOYED`, `Lead Designer`, `12 Weeks`, `Nexus Financial`) y muestra un badge Live Preview incondicional. Antes de cargar casos, deben eliminarse estos defaults y omitirse los campos sin información.

Se preparó `docs/cases/gitcron.draft.md` con información declarada por Alejandro y documentación del proyecto. Quedan las capturas y revisión editorial; el borrador no forma parte de las colecciones públicas ni del RSS.

## Referencias

- [Google: animaciones CSS de alto rendimiento](https://web.dev/articles/animations-guide): priorizar transform/opacity, perfilar propiedades que disparan paint y usar will-change con moderación.
- [Astro: arquitectura de islas](https://docs.astro.build/en/concepts/islands/): enviar JavaScript solo a las partes interactivas.
