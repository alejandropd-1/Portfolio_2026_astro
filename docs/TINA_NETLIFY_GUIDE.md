# Guía de Configuración: TinaCMS + Netlify 🚀

Esta guía detalla los pasos necesarios para configurar TinaCMS con Netlify, incluyendo la resolución de problemas comunes que encontramos durante el desarrollo.

---

## 1. Configuración en Tina Cloud (app.tina.io)

1.  **Crear Proyecto**: Sincroniza tu repositorio de GitHub con Tina Cloud.
2.  **Obtener Credenciales**:
    *   **Client ID**: Lo encuentras en la pestaña *Overview*.
    *   **Content Token**: Crea uno en *Tokens* (asegúrate de que tenga permisos de lectura/escritura).
    *   **Search Token**: Si usas búsqueda, genera uno en la pestaña *Search*.

---

## 2. Configuración en Netlify

En el panel de tu sitio en Netlify, ve a **Site configuration** > **Environment variables** y agrega:

| Variable | Valor |
| :--- | :--- |
| `TINA_CLIENT_ID` | Tu Client ID de Tina Cloud |
| `TINA_TOKEN` | Tu Content Token de Tina Cloud |
| `TINA_SEARCH_TOKEN` | Tu Search Token (opcional) |

### Comando de Build
En **Build & deploy** > **Build settings**, asegúrate de que el comando sea:
`tinacms build && astro build`

---

## 3. Registro de Ramas (Importante) ⚠️

Si el build de Netlify falla con el error `"Branch 'main' is not on TinaCloud"`, es porque la rama no está autorizada en el panel de Tina.

**Solución**:
1. Ve a tu proyecto en [Tina Cloud](https://app.tina.io/).
2. Ve a la pestaña **Configuration**.
3. Busca la sección de **Branches**.
4. Agrega la rama `main` (o la que estés usando). Si ya aparece pero falla, intenta borrarla y volverla a agregar.

---

## 4. Configuración Local (`.env`)

Crea un archivo `.env` en la raíz del proyecto (este archivo está ignorado por Git):

```env
TINA_PUBLIC_CLIENT_ID=tu_client_id
TINA_TOKEN=tu_content_token
# Para desarrollo local usualmente no necesitas el ID/TOKEN si usas modo local,
# pero son necesarios para que el build de producción funcione localmente.
```

---

## 5. Gestión de Medios (Imágenes) 🖼️

Para evitar enlaces rotos tanto en desarrollo como en producción:

1.  **Directorio**: Guarda todas las imágenes en `public/assets/`.
2.  **Rutas en Tina**: Tina guardará las rutas como `assets/nombre.jpg`.
3.  **Uso en Código**: El proyecto tiene una capa de normalización en `ProjectDetailLayout.tsx` que añade automáticamente la `/` inicial.
    *   **Regla de oro**: Siempre intentar usar rutas absolutas (que empiecen con `/`) si editas manualmente los archivos MDX.

---

## 6. Solución de Problemas Comunes

### El Dashboard no muestra las imágenes localmente
Asegúrate de tener corriendo ambos servidores:
1.  Astro: `npm run dev` (Puerto 4321)
2.  Tina: `npx tinacms dev` (Puerto 4001)

El Dashboard personalizado (`PortfolioDashboard.tsx`) está configurado para cambiar automáticamente del puerto 4001 al 4321 para encontrar las imágenes.

### Build Error: "fs-extra not found"
Asegúrate de que `fs-extra` esté en `devDependencies` en tu `package.json`. Es requerido por las métricas de Tina durante el build.

---

*Última actualización: 2026-05-07*
