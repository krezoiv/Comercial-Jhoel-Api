const GUATEMALA_COUNTRY_CODE = '502';
const GUATEMALA_LOCAL_NUMBER_LENGTH = 8;

/**
 * Convierte un `whatsapp_number` almacenado (ver `normalizeWhatsappNumber`
 * — solo dígitos, `+` inicial opcional, SIN código de país garantizado) al
 * formato que exige el campo `to` de WhatsApp Cloud API: únicamente
 * dígitos, con código de país, sin `+`.
 *
 * El formulario público solo exige 7-15 dígitos, así que un suscriptor
 * puede haber escrito un número local guatemalteco de 8 dígitos sin
 * anteponer "502" (ej. "54215549") — el envío a Meta fallaría
 * silenciosamente contra ese número tal cual. Como Comercial Jhoel es un
 * negocio guatemalteco, un número de exactamente 8 dígitos que no
 * empieza ya con "502" se asume local y se le antepone "502". Cualquier
 * otro largo (ya trae código de país, o es de otro país) se deja tal cual
 * — esta es una heurística deliberada para este negocio específico, no
 * una validación E.164 general.
 */
export function toWhatsappRecipient(whatsappNumber: string): string {
  const digits = whatsappNumber.replace(/\D/g, '');
  if (digits.length === GUATEMALA_LOCAL_NUMBER_LENGTH && !digits.startsWith(GUATEMALA_COUNTRY_CODE)) {
    return `${GUATEMALA_COUNTRY_CODE}${digits}`;
  }
  return digits;
}
