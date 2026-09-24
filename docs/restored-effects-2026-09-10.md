# Recuperación de efectos visuales

Implementación local sobre la rama activa, sin publicación.

## Resultado

- Fondo: grilla fija, visible únicamente bajo tres focos circulares con bordes transparentes, verde, cyan y naranja. Cada foco recorre su propia trayectoria durante 26, 34 o 42 segundos. Los colores se superponen donde coinciden. No hay pulsos de opacidad ni desplazamiento de las líneas.
- Implementación: cada capa tiene una máscara estática de líneas de 48 px. Por detrás se mueve un degradé radial acotado mediante `transform`. Es la misma intersección visual que una máscara circular móvil sobre una grilla fija, sin interpolar gradientes ni coordenadas de máscara por cuadro. No se fuerza `will-change`.
- Cards: degradés estáticos con los colores del tema, translucidez y grano. El aspecto esmerilado se construye sin filtros de fondo por card. El SVG repetible de 128 × 128 ocupa 388 bytes y no se anima; sustituye visualmente los dos PNG decorativos anteriores (738.533 bytes combinados).
- Navegación: un único `backdrop-filter: blur(8px) saturate(1.2)`, con base más opaca cuando el navegador no admite el filtro.
- Hover: selector de imagen destacada corregido y transición de desplazamiento de cards explícita. Movimiento decorativo y nuevos efectos hover desactivados con `prefers-reduced-motion: reduce`.

Sass genera el CSS durante la compilación; el ahorro viene de evitar repintados de máscaras y desenfoques grandes o apilados. La textura es una imagen SVG pequeña, no ruido generado exclusivamente con Sass.

## Validación local de la versión con focos

Chromium, servidor `npm run dev` con Node 24.7.0, viewport 1280 × 720, DPR 1:

- Cuatro segundos con focos activos: 0 eventos Paint y 0 RasterTask.
- Verificados tres recorridos distintos, matrices de transformación cambiantes en las luces, grilla sin transformaciones, degradés constantes y opacidad siempre en 1. Capturas separadas por cinco segundos muestran zonas reveladas diferentes sobre las mismas líneas.
- Scroll con CPU ralentizada 4×: 120 intervalos, percentil 95 de 16,8 ms y ninguno mayor de 50 ms. Se verificó desplazamiento real del foco y blur activo.
- Los tres focos reportan `animation-name: none` con movimiento reducido. Móvil de 390 px sin desbordamiento horizontal.
- Astro compiló las nueve páginas usando Tina local. El build completo de TinaCloud sigue sin validarse porque faltan `clientId` y `token`.

En la revisión previa de esta misma tarea también se comprobaron tema claro/oscuro, Cards/List, filtro Systems, menú móvil y rutas home, about, resume, archive y detalle around, sin errores de página. Esos resultados están en `restored-verification.log`; corresponden a la versión anterior del movimiento.

Las mediciones son muestras breves en Chromium local. No miden consumo de GPU, batería o temperatura ni prueban rendimiento en un teléfono físico. Los intervalos de requestAnimationFrame no son una medición directa de frames presentados por la GPU.

## Reproducción

Con `http://localhost:4322/` activo, usar Playwright CLI y ejecutar `run-code --filename output/playwright/check-grid-motion.js` y `run-code --filename output/playwright/check-effects-throttled.js`. Resultados actuales: `output/playwright/spotlights-verification.log` y `output/playwright/spotlights-throttled.log`. Capturas: `spotlights-a.png` y `spotlights-b.png`.

Referencias: [Aura](https://auragradients.vercel.app/?gradient=aurora-beams), el prompt Copper Patina aportado por Alejandro y la [guía de rendimiento de animaciones de Google](https://web.dev/articles/animations-guide).
