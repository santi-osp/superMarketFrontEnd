import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';
import { loginRedirectGuard } from './core/login-redirect.guard';

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
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/rol-list').then((m) => m.RolListComponent),
      },
      {
        path: 'empleados',
        loadComponent: () =>
          import('./features/empleados/empleado-list').then((m) => m.EmpleadoListComponent),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clientes/cliente-list').then((m) => m.ClienteListComponent),
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./features/proveedores/proveedor-list').then((m) => m.ProveedorListComponent),
      },
      {
        path: 'sucursales',
        loadComponent: () =>
          import('./features/sucursales/sucursal-list').then((m) => m.SucursalListComponent),
      },
      {
        path: 'tipos-producto',
        loadComponent: () =>
          import('./features/tipos-producto/tipo-producto-list').then(
            (m) => m.TipoProductoListComponent,
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/productos/producto-list').then((m) => m.ProductoListComponent),
      },
      {
        path: 'inventarios',
        loadComponent: () =>
          import('./features/inventarios/inventario-list').then((m) => m.InventarioListComponent),
      },
      {
        path: 'compras-proveedor',
        loadComponent: () =>
          import('./features/compras-proveedor/compra-proveedor-list').then(
            (m) => m.CompraProveedorListComponent,
          ),
      },
      {
        path: 'facturas',
        loadComponent: () =>
          import('./features/facturas/factura-list').then((m) => m.FacturaListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
