import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuditContextService } from './audit-context.service';
import { AuthService } from './auth.service';

export const auditUserGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const audit = inject(AuditContextService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    const user = auth.currentUser();
    if (!audit.hasUsuario() && user) {
      audit.select(user.id);
    }
    return true;
  }

  audit.clear();
  auth.clearSession();
  return router.createUrlTree(['/login']);
};
