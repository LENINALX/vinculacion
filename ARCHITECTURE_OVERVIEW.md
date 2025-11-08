# Architecture Overview

## Árbol de `src/`
```
src/
├── index.js – punto de entrada CRA; crea la raíz y monta <App/>.
├── index.css – estilos globales más capas de Tailwind.
├── App.jsx / App.css – envuelve la app con `AuthProvider` y monta `Home`.
├── assets/ – recursos estáticos (ej. íconos SVG).
├── components/
│   ├── artworks/ – vistas y tarjetas de obras (grid, card, filtros).
│   ├── layout/ – `Header` y `Footer`.
│   ├── modals/ – modales reutilizados (auth, carga, pujas, pagos).
│   └── common/ – inputs y botones básicos.
├── config/
│   └── supabase.js – crea el cliente de Supabase y helpers de storage.
├── context/
│   └── AuthContext.jsx – estado global de autenticación/roles.
├── hooks/
│   ├── useArtworks.js – obtiene obras y filtros desde Supabase.
│   └── useAuth.js – helper para consumir el contexto de auth.
├── pages/
│   └── Home.jsx – página única que orquesta filtros, grids y modales.
└── services/
    ├── artworkService.js – CRUD y destacados de obras via Supabase.
    ├── bidService.js – operaciones relacionadas a pujas.
    └── authService.js – login/signup/reset apoyados en Supabase.
```

## Detalle por subcarpeta

### Entrada (`index.js`, `App.jsx`, `index.css`)
- **Responsabilidades**: Montar la app CRA, importar estilos globales (Tailwind + utilidades propias) y envolver toda la UI con `AuthProvider` antes de renderizar `Home`.
- **Dependencias internas**: Consume `AuthContext`, `Home`, `App.css/index.css`; no hay router explícito por lo que cualquier vista adicional debe declararse manualmente dentro de `Home`.
- **Componentes críticos**: `AuthProvider` controla el montaje de todo el árbol; cualquier error allí deja la app en blanco.
- **Puntos frágiles**: Mientras `AuthProvider` carga, se oculta toda la UI sin spinner; tampoco hay `ErrorBoundary`, por lo que fallos en `Home` derriban la app completa.
- **Refactor en pasos pequeños**: (1) Renderizar un loader global mientras `AuthProvider` resuelve el usuario. (2) Introducir `BrowserRouter` en `App` y mover `Home` a una ruta; esto se puede hacer sin tocar servicios.

### `assets/`
- **Responsabilidades**: Mantener recursos estáticos (actualmente sólo SVGs).
- **Dependencias internas**: Inexistentes; se consumen vía imports relativos.
- **Puntos frágiles**: No hay convención para nombres o formatos, lo que puede duplicar recursos a futuro.
- **Refactor**: Documentar naming y mover assets pesados a un CDN/Supabase storage compartido para evitar incremente del bundle.

### `components/artworks`
- **Responsabilidades**: Renderizar filtros (`ArtworkFilters`), tarjetas (`ArtworkCard`) y grids (`ArtworkGrid`).
- **Dependencias**: Dependen de `useAuth` para acciones admin, `getPublicImageUrl` para imágenes y props provenientes de `useArtworks`.
- **Componentes críticos**: `ArtworkCard` concentra acciones de puja/destacado/borrado; es el punto de entrada para todas las mutaciones visuales.
- **Puntos frágiles**: Se usa `toFixed` sobre campos opcionales, se confía en que `artwork.artist` siempre existe y los botones admin llaman servicios a través de props sin feedback visual ni manejo de errores locales.
- **Refactor**: (1) Crear un helper de formato (precio, fallback de artista) y usarlo en `ArtworkCard`. (2) Añadir estados de carga/éxito por tarjeta antes de mover lógica al grid o a un hook dedicado.

### `components/layout`
- **Responsabilidades**: `Header` maneja navegación, estado móvil y acciones de sesión; `Footer` cierra la página.
- **Dependencias**: `Header` usa `useAuth`, botones comunes y callbacks del contenedor para abrir modales.
- **Puntos frágiles**: Las anclas `<a href="#...">` dependen de IDs inexistentes, el menú móvil mantiene estado aunque cambie la ruta, y `signOut` se invoca sin confirmación ni manejo de error.
- **Refactor**: (1) Reemplazar anclas por `Link` una vez exista router. (2) Centralizar `signOut` feedback (toast) para evitar `alert`s dispersos.

### `components/modals`
- **Responsabilidades**: `Modal` provee la base visual; `AuthModal`, `UploadModal`, `BidModal`, `PaymentModal` y `BidModal` orquestan formularios específicos.
- **Dependencias**: Todos consumen `useAuth` y los servicios (`authService`, `artworkService`, `bidService`). `UploadModal` también usa `FileReader` y `supabase` a través de helpers.
- **Componentes críticos**: `UploadModal` y `PaymentModal` disparan escrituras en Supabase; `AuthModal` gestiona registro/login.
- **Puntos frágiles**: Formularios manuales sin validaciones reutilizables ni feedback consistente (muchos `alert`). No se cancelan lecturas `FileReader`, y los modales no bloquean scroll del body.
- **Refactor**: (1) Extraer un hook/util para manejo de formularios y estados de error compartidos. (2) Reemplazar `alert`/`confirm` por un sistema de toasts y mensajes dentro del modal.

### `components/common`
- **Responsabilidades**: Insumos básicos (`Input`, `Select`, `TextArea`) y `Button`.
- **Dependencias**: Se consumen en casi todos los formularios; `Input` acepta íconos de `lucide-react`.
- **Puntos frágiles**: No hay estados de error integrados ni soporte para ayudas/context; cada modal implementa su propio bloque de error.
- **Refactor**: Añadir props para `error`, `helperText` y estados de carga en `Button` para reducir repetición en formularios.

### `config/`
- **Responsabilidades**: `supabase.js` crea el cliente y helpers de storage.
- **Dependencias**: Todos los servicios importan el cliente; `ArtworkCard` usa `getPublicImageUrl`.
- **Componentes críticos**: `supabase` singleton y `uploadImage`.
- **Puntos frágiles**: Se exponen credenciales reales como fallback (riesgo de seguridad) y no se valida la existencia de variables de entorno en build.
- **Refactor**: (1) Mover claves a `.env.local` y fallar rápido si faltan. (2) Exportar tipos/constantes compartidas (nombres de tablas, buckets) desde un único archivo para evitar strings mágicos.

### `context/`
- **Responsabilidades**: `AuthContext` encapsula estado de sesión, perfil y helpers (`signIn`, `signOut`, etc.).
- **Dependencias**: Usa `authService` y se consume en la mayoría de componentes.
- **Puntos frágiles**: `AuthProvider` bloquea el render hasta terminar `checkUser`; no hay retries ni distinción entre “no logueado” y “falló la carga”.
- **Refactor**: (1) Separar `loading`/`error` para mostrar mensajes amigables. (2) Extraer listeners y perfil en hooks dedicados para reducir tamaño del provider.

### `hooks/`
- **Responsabilidades**: `useArtworks` maneja fetch y filtros; `useAuth` expone el contexto.
- **Dependencias**: `useArtworks` llama `artworkService`; `useAuth` depende de `AuthContext`.
- **Puntos frágiles**: `useArtworks` recrea `loadArtworks` en cada cambio de filtros sin cancelar solicitudes, por lo que resultados antiguos pueden pisar a los nuevos.
- **Refactor**: (1) Incorporar `AbortController` o un flag para ignorar respuestas obsoletas. (2) Exponer `setFilters` y `resetFilters` tipados para no propagar objetos sueltos.

### `pages/`
- **Responsabilidades**: `Home` es el único contenedor; maneja hero, filtros, grids, destacados y todos los modales.
- **Dependencias**: Usa `useArtworks`, `useAuth`, los servicios (vía handlers) y la mayoría de componentes UI.
- **Componentes críticos**: `Home` actúa como router improvisado y orquesta `searchTerm`, `filters`, modales y permisos admin.
- **Puntos frágiles**: Mezcla lógica de negocio, UI y efectos (confirmaciones, alerts). No existe memoización de listas filtradas y cada input re-filtra arrays completos en el render, lo que escalará mal.
- **Refactor**: (1) Extraer la gestión de modales a un hook (`useModalManager`). (2) Mover filtros y featured a rutas/contexts independientes cuando se introduzca `react-router`.

### `services/`
- **Responsabilidades**: Encapsulan acceso a Supabase para obras, pujas, auth y pagos.
- **Dependencias**: Todos importan `supabase`; `artworkService` también usa `uploadImage`.
- **Componentes críticos**: `getArtworks`, `createArtwork`, `createBid`.
- **Puntos frágiles**: Se repite el patrón de `try/catch` devolviendo `{ data, error }`, pero la UI a veces espera excepciones. No existen tests ni tipos para garantizar que los campos devueltos existan.
- **Refactor**: (1) Crear un wrapper `callSupabase(fn)` que normalice respuestas y logging. (2) Separar DTOs de entrada/salida para cada servicio antes de añadir validaciones.

## Flujo de Inicio (CRA)
`react-scripts start` arranca el servidor de Create React App. Este inyecta `public/index.html`, carga `src/index.js`, crea la raíz con `ReactDOM.createRoot` y renderiza `<App />` dentro de `React.StrictMode`.

## Router
`react-router-dom` está declarado como dependencia, pero aún no se inicializa ningún `BrowserRouter`/`Routes`. Toda la navegación ocurre dentro de `Home` mediante estado local y modales, por lo que hoy no hay routing declarativo.

## Supabase
El cliente se crea en `src/config/supabase.js` usando `createClient` con variables `REACT_APP_SUPABASE_URL/ANON_KEY` (o valores por defecto). Desde ahí se exporta `supabase`, el nombre del bucket (`STORAGE_BUCKET`) y helpers para subir imágenes u obtener URLs públicas. Todos los servicios (auth, artworks, bids) importan este módulo.

## Comandos npm
- `npm start` – levanta el dev server de CRA con hot reload.
- `npm run build` – genera el bundle optimizado en `build/`.
- `npm test` – ejecuta Jest/React Testing Library preconfigurado por CRA.

## Riesgos y Próximos pasos
1. **Introducir routing real**: incorporar `BrowserRouter` y dividir `Home` en rutas (dashboard, detalle de obra) para evitar un contenedor monolítico y habilitar deep-linking.
2. **Proteger credenciales de Supabase**: mover los defaults del cliente a variables de entorno obligatorias y rotar las claves expuestas para eliminar riesgos de filtración.
3. **Centralizar feedback de errores**: reemplazar `alert`/`confirm` dispersos por un sistema de notificaciones y estados de carga reutilizables en botones/modales.
4. **Mejorar resiliencia de datos**: agregar cancelación de fetches en `useArtworks`, tipar respuestas de `services/` y cubrirlas con pruebas unitarias básicas.
5. **Modularizar formularios de modales**: extraer hooks y componentes de formulario para registro, subida y pujas, lo que permitirá validar campos y compartir reglas antes de añadir más flujos.
