# Bugs resueltos — Acompañame (versión web)

**Fecha:** 4 de noviembre de 2026
**Ámbito:** Versión web (Expo Web + Vercel) — `https://dist-alpha-indol-22.vercel.app`
**Archivos tocados:** `src/components/Mapa.web.js`, `src/screens/Seguir.web.js` y nuevo `src/components/iconosMapa.web.js`
**Estado:** Corregido, verificado con navegador real y desplegado a producción.

---

## 🐛 Bug principal: pantalla blanca después de iniciar sesión y aceptar términos

### Síntoma
- Al entrar con correo y aceptar los Términos y Condiciones, la app se quedaba **completamente en blanco** (white screen).
- Solo ocurría en la **versión web desplegada**; la app nativa (APK) nunca se vio afectada.
- En la consola del navegador aparecía:

```
Uncaught TypeError: Cannot read properties of null (reading 'lat')
    at Object.project (leaflet)
    at n.update → n.onAdd → n._layerAdd → n.addLayer
```

### Pasos para reproducirlo
1. Abrir la app web en el navegador (móvil).
2. Iniciar sesión y aceptar los términos.
3. Al montar la pantalla de Inicio, el navegador pide el permiso de ubicación.
4. **Al conceder el permiso** → 💥 pantalla blanca.

*(Si se negaba el permiso, la app funcionaba. Por eso parecía intermitente.)*

### Causa raíz
En `Mapa.web.js` el marcador de "Tu ubicación" se pasaba así:

```jsx
// ❌ Antes
const userLoc = { latitude: ..., longitude: ... };   // objeto
<Marker position={userLoc}>
```

**Leaflet no acepta `{latitude, longitude}`**. Su función interna `toLatLng()` solo entiende:

| Formato | ¿Lo acepta? |
|---|---|
| `[lat, lng]` (array) | ✅ |
| `{ lat, lng }` (objeto) | ✅ |
| `{ latitude, longitude }` | ❌ → devuelve `null` |

Con `null` como coordenada, al añadir el marcador al mapa Leaflet ejecuta `Marker.update()` → `latLngToLayerPoint(null)` → `null.lat` → **TypeError**. Al ser un error no capturado, React desmonta **todo** el árbol de componentes → pantalla blanca total.

### Solución
```jsx
// ✅ Después
<Marker position={[userLoc.latitude, userLoc.longitude]} icon={ICONO_YO}>
```

---

## 🐛 Bugs secundarios encontrados (y corregidos) en la misma investigación

| # | Bug | Archivo | Causa | Solución |
|---|-----|---------|-------|----------|
| 2 | **Pines invisibles** en web (404: `marker-icon.png`, `marker-icon-2x.png`, `marker-shadow.png`) | `Mapa.web.js` | Los íconos default de Leaflet no se empaquetan con Expo Web; el CSS apunta a rutas que no existen | Íconos propios con `divIcon`: la foto del acompañante, 🏠 para la casa y punto azul para el usuario |
| 3 | **El mapa no mostraba ningún pin** (aunque no crasheara) | `Mapa.web.js` | Arrancaba en zoom 14 centrado en Puebla; los 5 acompañantes quedaban fuera de pantalla | Zoom 11 para vista de región; al llegar la ubicación, re-centrar al usuario con zoom 13 (componente `Recentrar` usando `useMap`) |
| 4 | **Tocar un pin no hacía nada** | `Mapa.web.js` | `onClick` no es API válida de react-leaflet v5 (se ignora en silencio) | Usar `eventHandlers={{ click: ... }}` → ahora abre el modal de perfil |
| 5 | **"Seguir en mapa" también crasheaba** (crash latente, nunca funcionó en web) | `Seguir.web.js` | 1) `center={region}` con `{latitude, longitude}` → mismo `null.lat` al montar. 2) `<Popup>` usado **sin importarlo** → `ReferenceError: Popup is not defined` | `center={[lat, lng]}` + importar `Popup` de `react-leaflet` |
| 6 | **Botón "←" de volver invisible** en Seguir | `Seguir.web.js` | `zIndex: 100`, pero los panes de Leaflet usan `z-index` de 400 a 1000 | `zIndex: 1000` (recibe clicks y se ve sobre el mapa) |
| 7 | **`flyTo` dentro del render** (anti-patrón de React) | `Seguir.web.js` | Efecto secundario ejecutado durante el render | Movido a `useEffect` |

---

## 🗂️ Cambios por archivo

### `src/components/Mapa.web.js` (modificado)
- `position={userLoc}` → `position={[userLoc.latitude, userLoc.longitude]}` (arregla el crash).
- Íconos personalizados con `divIcon` para todos los pines (foto del acompañante / emoji / punto azul).
- `zoom` 11 (región) o 13 (ubicación del usuario) según el estado.
- Nuevo componente `Recentrar` que recentra el mapa cuando llega la ubicación (`MapContainer` solo usa `center` al montar).
- `onClick` → `eventHandlers={{ click }}` para que tocar un pin abra el perfil.

### `src/screens/Seguir.web.js` (modificado)
- `center` arreglado a array `[lat, lng]` (crash al abrir la pantalla).
- Import de `Popup` (crash por `ReferenceError`).
- Íconos con `divIcon` (antes invisibles por el mismo problema de assets).
- Se quitó código muerto: `<div>` y `<Image>` como hijos de `<Marker>` no se renderizan en react-leaflet.
- Botón "←" con `zIndex: 1000`.
- `Follower` (flyTo) movido a `useEffect`.

### `src/components/iconosMapa.web.js` (nuevo)
- Módulo compartido con los íconos de Leaflet para web: `iconoPin()` y `ICONO_YO`.
- En web, `require('imagen.png')` devuelve `{ uri, ... }`, así que se usa `foto.uri` para armar el HTML del pin.

---

## ✅ Verificación (navegador real, Edge headless + Playwright)

| Escenario | Resultado |
|---|---|
| Login → términos → Inicio **con** ubicación concedida | ✅ Sin crash · 7 pines · 5 fotos cargadas · pin → modal de perfil |
| Login → términos → Inicio **sin** ubicación | ✅ Sin crash · 6 pines · 5 fotos cargadas · pin → modal de perfil |
| Seguir en mapa → tocar "←" para volver | ✅ Ruta + 3 marcadores (🏠, foto, punto azul) · regresa a Inicio |
| Errores de consola | ✅ Cero errores (solo warnings normales de `useNativeDriver`) |
| Sitio en producción real `dist-alpha-indol-22.vercel.app` | ✅ Todo lo anterior funciona en vivo |

---

## 🚀 Despliegue realizado

- El `dist/` se reconstruyó con `npx expo export --platform web`.
- Se re-vinculó y desplegó el proyecto con Vercel CLI (equipo `ale-a6eb`, proyecto `dist`).
- **Dato importante:** `expo export` **limpia la carpeta `dist/`**, incluyendo el `.vercel` con el vínculo del proyecto. Si al desplegar pide vincular de nuevo, usar:

```bash
cd dist
npx vercel@latest link --yes --project dist --scope ale-a6eb
npx vercel@latest deploy --prod --yes
```

- **Truco de diagnóstico:** en la consola del navegador, el nombre del bundle (`index-XXXX.js`) indica qué versión está sirviendo producción. El viejo era `index-1029158b...` y el corregido es `index-62f72b...`. Si un "fix no funciona", lo primero es verificar que el bundle haya cambiado.

---

## 🛡️ Prevención / lecciones

1. **Leaflet**: nunca pasarle `{latitude, longitude}` — solo `[lat, lng]` o `{lat, lng}`. (react-native-maps SÍ usa `{latitude, longitude}`; es fácil confundirse al compartir lógica entre nativo y web.)
2. **Expo Web + Leaflet**: los íconos default de Leaflet no se empaquetan (404 seguro). Usar `divIcon` (ya centralizado en `iconosMapa.web.js`).
3. **react-leaflet v5**: los eventos van en `eventHandlers`, no como `onClick` directo.
4. **Pendiente del proyecto**: `expo lint` está roto (la config de ESLint pide el módulo `typescript` y no está instalado). Se soluciona con `npx expo install typescript`.
5. **Caché del navegador**: después de cada deploy, probar en incógnito o recarga forzada para no ver la versión vieja.
