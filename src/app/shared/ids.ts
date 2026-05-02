/** Muestra un prefijo de UUID legible en tablas. */
export function shortId(id: string | null | undefined, len = 8): string {
  if (!id) return '—';
  return id.length > len ? `${id.slice(0, len)}…` : id;
}
