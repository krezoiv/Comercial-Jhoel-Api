/**
 * Enmascara todo menos los últimos 4 dígitos — nunca se expone el número
 * completo en ninguna respuesta admin (punto 30 del pedido: privacidad).
 * Ej. "50212345678" → "+502 **** 5678". `null` (suscriptor solo-push, sin
 * WhatsApp) se devuelve tal cual — nunca se inventa un número.
 */
export function maskWhatsappNumber(value: string | null): string | null {
  if (value === null) {
    return null;
  }
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 4) {
    return '*'.repeat(digits.length);
  }
  const last4 = digits.slice(-4);
  return `**** ${last4}`;
}
