export function humanizeHttpError(err: any): string {
  if (err?.status === 0) return 'No hay conexión con el servidor.';
  if (err?.error?.error) return err.error.error;
  if (err?.error?.detail) return err.error.detail;
  if (typeof err?.error === 'string') return err.error;
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
}
