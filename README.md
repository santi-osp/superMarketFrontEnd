# SuperMarket FrontEnd

Aplicacion web de administracion para SuperMarket, construida con **Angular 20**, **Angular Material** y consumo de API REST protegida con **JWT**.

El frontend cubre login, rutas protegidas, CRUD de entidades principales, tablas paginadas, modales de creacion/edicion, detalle de facturas y despliegue a GitHub Pages.

---

## Stack

- Angular 20 con standalone components.
- Angular Material + SCSS.
- `HttpClient` con interceptor JWT.
- Estado local con `signal` y `computed`.
- Conexion directa a FastAPI (sin proxy).
- Build y test con Angular CLI.

---

## Requisitos

- Node.js 20+.
- npm 10+.
- Backend FastAPI levantado en `http://localhost:8000`.

Verificar versiones:

```bash
node -v
npm -v
```

---

## Instalacion

Desde `superMarketFrontEnd`:

```bash
npm install
```

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

## Configuracion de API

Archivos de entorno:

- `src/environments/environment.ts`
- `src/environments/environment.dev.ts`
- `src/environments/environment.qa.ts`
- `src/environments/environment.prod.ts`

En desarrollo se usa:

```ts
apiUrl: 'http://localhost:8000';
```

Si el backend cambia de puerto, actualizar el valor de `apiUrl` en los archivos de entorno.

---

## Autenticacion

Flujo actual:

1. Login con `POST /auth/login`.
2. Consulta de usuario con `GET /auth/me`.
3. Token y usuario se guardan en `localStorage`.
4. `authInterceptor` agrega:

```http
Authorization: Bearer <token>
```

Guards actuales:

- `loginRedirectGuard`: evita volver a `/login` con sesion activa.
- `auditUserGuard`: protege `/app` si no hay sesion valida.

Pendiente importante:

- Agregar permisos por rol en frontend y backend. Hoy el guard valida sesion, no permisos por modulo.

---

## Rutas

Rutas principales:

- `/login`
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

Pendientes propuestos:

- `/app/dashboard`
- `/app/perfil`

---

## Funcionalidad actual

Implementado:

- Login JWT.
- Rutas protegidas.
- Sidebar responsive con boton de colapsar/expandir y logout visible.
- Tablas con paginacion frontend.
- Badges para estados, IDs, conteos y tipos de dato.
- Modales de creacion/edicion para entidades principales.
- Loading, errores y estados vacios en vistas clave.
- CRUD o consultas representativas de usuarios, roles, empleados, clientes, proveedores, sucursales, tipos de producto, productos, inventarios, compras y facturas.
- Detalle de factura en modal.
- Detalle de factura muestra nombre de producto usando `ProductoService` cuando el producto esta disponible.
- Botones de accion con paleta visual consistente.
- Login redisenado con panel visual y mejor jerarquia.
- Scrollbars personalizados.
- GitHub Actions para publicar GitHub Pages.
- `.gitignore` actualizado para evitar subir logs.

---

## Facturas

La pantalla de facturas incluye:

- Crear factura.
- Editar factura.
- Anular factura.
- Ver detalles.
- Cabecera de factura.
- Estado.
- Total.
- Metodo de pago.
- Lineas de detalle.
- Nombre de producto en detalle cuando existe en el listado de productos.

Limitacion actual:

- Si la factura referencia un producto que no viene en `ProductoService.list()`, el modal muestra fallback con ID corto.

---

## Paginacion

Estado actual:

- Paginacion frontend-only con `MatPaginator`.
- Listados cargan datos con limites altos, por ejemplo `limit=500` en flujos grandes.
- Backend usa `skip`/`limit`, pero no devuelve metadata de total.

Pendiente recomendado:

- Backend debe devolver `{ items, total, page, page_size, total_pages }`.
- Frontend debe pedir pagina al backend cuando cambie `MatPaginator`.
- Despues de crear, editar, eliminar o anular se debe recargar y ajustar pagina actual para evitar paginas vacias.

---

## Despliegue GitHub Pages

Workflow:

```text
.github/workflows/github-pages.yml
```

Dispara en:

- push a rama `PROD`
- `workflow_dispatch`

Variable opcional de repositorio:

```text
API_URL
```

Si no se define, usa:

```text
http://localhost:8000
```

Nota: para produccion real, `API_URL` debe apuntar a backend desplegado y con CORS permitido para la URL de GitHub Pages.

---

## Pendientes principales

1. **Permisos por rol**
   - Crear `PermissionService`.
   - Crear guard por rol/modulo.
   - Filtrar sidebar por permisos.
   - Ocultar botones de crear/editar/eliminar/anular segun rol.
   - Reforzar permisos en backend; ocultar en frontend no basta como seguridad.

2. **Panel de perfil**
   - Crear `/app/perfil`.
   - Mostrar usuario autenticado, rol y estado.
   - Permitir configuraciones basicas de cuenta.
   - Agregar cambio de contrasena solo si backend expone endpoint compatible.

3. **Dashboard de estadisticas**
   - Crear `/app/dashboard`.
   - Redirigir `/app` al dashboard.
   - Mostrar totales de productos, clientes, facturas, compras e inventarios.
   - Mostrar facturas anuladas/activas y stock bajo usando datos reales.

4. **Paginacion backend-driven**
   - Dejar de depender de `limit=500`.
   - Usar metadata real desde backend.
   - Mantener filtros, reload y acciones sin paginas vacias.

5. **Toolbar uniforme**
   - Agregar `Recargar` a todas las listas CRUD.
   - Mantener mismo orden, color y comportamiento.

6. **Confirmaciones reutilizables**
   - Reemplazar `window.confirm` por dialogo Material reutilizable.

7. **Limpieza legacy**
   - Auditar `CategoriaService` y modelos antiguos.
   - Eliminar solo lo confirmado como no usado.

8. **README de entrega**
   - Agregar enlace a video demo.
   - Agregar credenciales de prueba.
   - Agregar matriz final de roles/permisos.

---

## Checklist contra enunciado

- [x] Frontend consume API REST.
- [x] Login JWT.
- [x] Token enviado por interceptor.
- [x] Rutas protegidas por sesion.
- [x] CORS documentado para desarrollo.
- [x] CRUD o consultas de varias entidades.
- [x] Modales create/edit.
- [x] Detalle de facturas.
- [x] Paginacion funcional frontend-only.
- [x] README con instalacion, ejecucion y API base.
- [x] Pipeline GitHub Pages.
- [ ] Permisos por rol.
- [ ] Dashboard de estadisticas.
- [ ] Panel de perfil.
- [ ] Paginacion backend-driven con total real.
- [ ] Enlace a video demo.

---

## Validacion usada

Comando principal:

```bash
npm run build
```

Resultado esperado:

```text
Application bundle generation complete.
```

---

## Troubleshooting

### Error CORS

- Confirmar backend en `http://localhost:8000`.
- Verificar que el backend permita el origen del frontend en `CORS_ALLOW_ORIGINS`.

### Error 401

- Cerrar sesion.
- Limpiar `localStorage`.
- Volver a iniciar sesion.

### No carga GitHub Pages

- Verificar que el workflow corra desde rama `PROD`.
- Verificar Pages habilitado en GitHub.
- Verificar `API_URL` si el backend no esta en localhost.

### Backend en otro puerto

- Cambiar los archivos de entorno (`environment.*.ts`) o la variable `API_URL` en GitHub.
