import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';
import { loginRedirectGuard } from './core/login-redirect.guard';
import { roleGuard } from './core/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [loginRedirectGuard],
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'facturas', pathMatch: 'full' },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'roles',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/roles/rol-list').then((m) => m.RolListComponent),
      },
      {
        path: 'empleados',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/empleados/empleado-list').then((m) => m.EmpleadoListComponent),
      },
      {
        path: 'clientes',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/clientes/cliente-list').then((m) => m.ClienteListComponent),
      },
      {
        path: 'proveedores',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/proveedores/proveedor-list').then((m) => m.ProveedorListComponent),
      },
      {
        path: 'sucursales',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/sucursales/sucursal-list').then((m) => m.SucursalListComponent),
      },
      {
        path: 'tipos-producto',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/tipos-producto/tipo-producto-list').then(
            (m) => m.TipoProductoListComponent,
          ),
      },
      {
        path: 'productos',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/productos/producto-list').then((m) => m.ProductoListComponent),
      },
      {
        path: 'inventarios',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/inventarios/inventario-list').then((m) => m.InventarioListComponent),
      },
      {
        path: 'compras-proveedor',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/compras-proveedor/compra-proveedor-list').then(
            (m) => m.CompraProveedorListComponent,
          ),
      },
      {
        path: 'facturas',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/facturas/factura-list').then((m) => m.FacturaListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
