# SuperMarket FrontEnd

Aplicación web de SuperMarket construida con **Angular 20** y **Angular Material**.

Este frontend consume la API del backend para gestionar:

- Usuarios
- Roles
- Empleados
- Clientes
- Proveedores
- Sucursales
- Tipos de producto
- Productos
- Inventarios
- Compras a proveedor
- Facturas

---

## 1) Stack técnico

- **Framework:** Angular 20 (standalone components)
- **UI:** Angular Material + SCSS
- **HTTP:** `HttpClient` con interceptor de autenticación JWT
- **Estado liviano local:** `signal` / `computed` de Angular
- **Build/Test:** Angular CLI + Karma/Jasmine

---

## 2) Requisitos

- **Node.js** 20+ (recomendado LTS)
- **npm** 10+

Verifica versiones:

```bash
node -v
npm -v
```

---

## 3) Instalación

Desde la carpeta `superMarketFrontEnd`:

```bash
npm install
```

---

## 4) Ejecución local

### Desarrollo

```bash
npm start
```

La app abre en: `http://localhost:4200`

### Modo QA

```bash
npm run start:qa
```

### Modo producción (serve local)

```bash
npm run start:prod
```

---

## 5) Build

```bash
npm run build
```

También disponibles:

```bash
npm run build:dev
npm run build:qa
npm run build:prod
```

Salida del build:

```text
dist/web
```

---

## 6) Pruebas

```bash
npm test
```

---

## 7) Configuración de entornos

Archivos en `src/environments`:

- `environment.ts` (base)
- `environment.dev.ts`
- `environment.qa.ts`
- `environment.prod.ts`

### API URL

- En **dev/qa** se usa `apiUrl: '/api'` con proxy local.
- En **prod** está configurado `apiUrl: 'http://localhost:8000'` (ajústalo según tu despliegue real).

---

## 8) Proxy local (evitar CORS en desarrollo)

Archivo: `proxy.conf.json`

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

Esto permite que llamadas a `/api/...` desde Angular se redirijan a `http://localhost:8000/...`.

---

## 9) Autenticación y seguridad de rutas

### Login

- Endpoint consumido: `POST /auth/login`
- Luego consulta: `GET /auth/me`
- `AuthService` guarda token y usuario en `localStorage`.

### Interceptor

`authInterceptor` agrega header:

```http
Authorization: Bearer <token>
```

para requests autenticados (excepto login).

### Guards

- `loginRedirectGuard`: si ya hay sesión, redirige `/login` -> `/app`.
- `auditUserGuard`: protege `/app`; si no hay sesión válida, redirige a `/login`.

---

## 10) Estructura del proyecto

```text
src/
  app/
    core/                 # auth, guards, interceptor, servicios
    features/             # módulos funcionales (listas y diálogos)
    models/               # contratos de API (api.models.ts)
    shared/               # utilidades compartidas (ids, http-error)
    app.routes.ts         # ruteo principal
    app.config.ts         # providers globales
  environments/           # configuración por entorno
```

---

## 11) Módulos/Features y rutas

Las rutas viven bajo `/app` y cargan componentes lazy:

- `/app/usuarios`
- `/app/roles`
- `/app/empleados`
- `/app/clientes`
- `/app/proveedores`
- `/app/sucursales`
- `/app/tipos-producto`
- `/app/productos`
- `/app/inventarios`
- `/app/compras-proveedor`
- `/app/facturas`

Además:

- `/login`

---

## 12) Patrón de implementación de features

Cada feature sigue un patrón homogéneo:

- `*-list.ts/html/scss`: tabla, paginación, recarga, acciones
- `*-dialog.ts/html`: create/edit
- servicio en `core/services/*`
- manejo de errores centralizado con `httpErrorMessage(...)`

Este patrón facilita mantenimiento, onboarding y consistencia visual/funcional.

---

## 13) Consideraciones de integración con backend

1. Levanta backend en `http://localhost:8000`.
2. Asegura endpoints de auth y CRUD disponibles.
3. Si cambias host/puerto de backend:
   - ajusta `proxy.conf.json` (dev)
   - ajusta `environment.prod.ts` (prod)

---

## 14) Troubleshooting

### a) Error CORS en desarrollo

- Verifica que ejecutes con `npm start` (usa proxy).
- Revisa `proxy.conf.json` y backend activo en `:8000`.

### b) 401 / sesión inválida

- Cierra sesión y vuelve a autenticarte.
- Limpia localStorage si es necesario.

### c) VS Code muestra errores “fantasma”

1. `Ctrl + Shift + P` -> **TypeScript: Restart TS Server**
2. `Ctrl + Shift + P` -> **Developer: Reload Window**

### d) Build falla

Ejecuta:

```bash
npm run build
```

y revisa el primer error de TypeScript/Angular reportado.

---

## 15) Scripts disponibles

```json
{
  "start": "ng serve",
  "start:dev": "ng serve --configuration development",
  "start:qa": "ng serve --configuration qa",
  "start:prod": "ng serve --configuration production",
  "build": "ng build",
  "build:dev": "ng build --configuration development",
  "build:qa": "ng build --configuration qa",
  "build:prod": "ng build --configuration production",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

---

## 16) Estado actual del frontend

El frontend está organizado por features y compila correctamente en el estado actual del proyecto.

Comando de verificación:

```bash
npm run build
```
