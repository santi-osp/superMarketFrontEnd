# SuperMarket FrontEnd

Aplicacion web de administracion para SuperMarket, construida con Angular 20 y Angular Material. El cliente consume una API REST con JWT, incluye login, rutas protegidas y CRUD de entidades principales.

## Video

[![Ver video demo](https://img.youtube.com/vi/pUAs-isHxbI/hqdefault.jpg)](https://youtu.be/pUAs-isHxbI)

## Repositorio backend

https://github.com/mengrau/CarRentingBackEnd.git

## Tabla de contenido

- Stack
- Alcance funcional
- Estructura del proyecto
- Requisitos
- Instalacion
- Configuracion de API
- Ejecucion local
- Autenticacion y seguridad
- CORS
- Scripts
- Build y despliegue
- Troubleshooting

---

## Stack

- Angular 20 con standalone components.
- Angular Material + SCSS.
- HttpClient con interceptor JWT.
- Estado local con signal y computed.
- Conexion directa a FastAPI (sin proxy).
- Build y test con Angular CLI.

---

## Alcance funcional

- Login JWT y cierre de sesion.
- Rutas protegidas para la zona /app.
- Listas CRUD y modales de creacion/edicion para varias entidades.
- Facturas con detalle y anulado.
- Inventarios y compras a proveedor.
- Sidebar con navegacion por modulo.

---

## Estructura del proyecto

```text
src/
  app/
    core/              # Auth, guards, interceptors, servicios base
    features/          # Modulos funcionales (clientes, productos, etc.)
    models/            # Modelos de dominio y tipos de API
    shared/            # UI compartida
  environments/        # URLs de API por entorno
```

---

## Requisitos

- Node.js 20+
- npm 10+
- Backend FastAPI disponible en http://localhost:8000

Verificar versiones:

```bash
node -v
npm -v
```

---

## Instalacion

Desde superMarketFrontEnd:

```bash
npm install
```

---

## Configuracion de API

Archivos de entorno:

- src/environments/environment.ts
- src/environments/environment.dev.ts
- src/environments/environment.qa.ts
- src/environments/environment.prod.ts

En local se usa:

```ts
apiUrl: 'http://localhost:8000';
```

Si el backend cambia de puerto o dominio, actualizar apiUrl en los archivos de entorno.

---

## Ejecucion local

```bash
npm start
```

La app queda en:

```text
http://localhost:4200
```

Backend esperado:

```bash
cd ../superMarketBackEnd
python -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

---

## Autenticacion y seguridad

Flujo actual:

1. Login con POST /auth/login
2. Consulta de usuario con GET /auth/me
3. Token JWT en localStorage
4. Id y rol del usuario en localStorage para permisos
5. Authorization: Bearer <token> en cada request protegida

Guards:

- loginRedirectGuard: evita volver a /login con sesion activa
- auditUserGuard: protege /app si no hay sesion valida
- roleGuard: valida acceso por rol segun la ruta

Claves locales usadas:

- auth_access_token
- auth_expires_at
- auth_user (id y rol)
- pos_audit_usuario_id

---

## CORS

El frontend consume la API de forma directa. El backend debe permitir el origen del front con CORS_ALLOW_ORIGINS. Ejemplo para local:

```text
http://localhost:4200
```

Si se despliega en GitHub Pages, agregar el origen https://santi-osp.github.io al backend.

---

## Scripts

```bash
npm start
npm run start:dev
npm run start:qa
npm run start:prod
npm run build
npm run build:dev
npm run build:qa
npm run build:prod
npm test
```

Salida de build:

```text
dist/web
```

---

## Build y despliegue

Build local:

```bash
npm run build:prod
```

GitHub Pages:

- Workflow: .github/workflows/github-pages.yml
- Dispara con push a rama PROD o workflow_dispatch
- Variable opcional: API_URL (si no existe usa http://localhost:8000)

Para produccion real, API_URL debe apuntar a un backend HTTPS publico y con CORS permitido.

---

## Troubleshooting

### Error CORS

- Confirmar backend en http://localhost:8000
- Verificar que el backend permita el origen del front en CORS_ALLOW_ORIGINS

### Error 401

- Cerrar sesion
- Limpiar localStorage
- Volver a iniciar sesion

### No carga GitHub Pages

- Verificar workflow en rama PROD
- Verificar Pages habilitado en GitHub
- Verificar API_URL si el backend no esta en localhost

### Backend en otro puerto

- Actualizar apiUrl en los archivos environment.\*.ts o API_URL en GitHub
