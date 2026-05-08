import { HttpErrorResponse } from '@angular/common/http';

export function httpErrorMessage(err: HttpErrorResponse): string {
  const detail = err.error?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
  if (detail && typeof detail === 'object') return JSON.stringify(detail);
  return err.message || 'Ocurri? un error inesperado';
}
