/** Muestra un prefijo de UUID legible en tablas. */
export function shortId(id: string | null | undefined, len = 8): string {
  if (!id) return '?';
  return id.length > len ? `${id.slice(0, len)}?` : id;
}

export function yesNo(value: boolean | null | undefined): string {
  return value ? 'S?' : 'No';
}

export function money(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '?';
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '?';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
