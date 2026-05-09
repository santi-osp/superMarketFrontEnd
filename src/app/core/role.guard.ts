import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { ROLE_PERMISSIONS } from './constants/role-constants';

/**
 * Guard que valida acceso a rutas según el rol del usuario
 * 
 * Uso en rutas:
 * ```typescript
 * {
 *   path: 'usuarios',
 *   canActivate: [roleGuard],
 *   loadComponent: () => import('./features/usuarios/usuario-list')
 *     .then((m) => m.UsuarioListComponent),
 * }
 * ```
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Validar que el usuario esté autenticado
  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // 2. Obtener usuario y rol
  const user = auth.currentUser();
  if (!user?.id_rol) {
    auth.clearSession();
    return router.createUrlTree(['/login']);
  }

  // 3. Obtener la ruta solicitada
  const requestedRoute = route.routeConfig?.path;
  if (!requestedRoute) {
    return router.createUrlTree(['/app']);
  }

  // 4. Obtener permisos del rol del usuario
  const userPermissions = ROLE_PERMISSIONS[user.id_rol] || [];

  // 5. Validar si el rol tiene acceso a la ruta
  if (userPermissions.includes(requestedRoute)) {
    return true;
  }

  // 6. Si no tiene permisos, redirigir a la página principal
  console.warn(`Usuario ${user.username} con rol ${user.id_rol} intentó acceder a ${requestedRoute}`);
  return router.createUrlTree(['/app']);
};
