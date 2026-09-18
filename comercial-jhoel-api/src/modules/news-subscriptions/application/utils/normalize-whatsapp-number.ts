/**
 * Normaliza un número de WhatsApp a solo dígitos (con `+` inicial opcional
 * preservado) — mismo criterio permisivo que `company_settings.whatsapp`/
 * `users.phone` en este proyecto (sin validación E.164 estricta, ya que
 * nada más en el código base la exige tampoco). Así "+502 1234-5678" y
 * "50212345678" se guardan de forma consistente y comparable.
 */
export function normalizeWhatsappNumber(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}
