export const WHATSAPP_SENDER = Symbol('WHATSAPP_SENDER');

export interface WhatsAppSendResult {
  success: boolean;
  /** El `messages[0].id` (wamid) que devuelve el proveedor — solo presente cuando `success` es `true`. */
  externalId?: string;
  /** Motivo del fallo, ya truncado a lo que cabe en `news_notifications.error_message` — solo presente cuando `success` es `false`. */
  errorMessage?: string;
}

/**
 * Puerto de envío de WhatsApp — la única forma en que el resto del módulo
 * habla con un proveedor real. Nunca lanza: cualquier fallo (credenciales
 * faltantes, red, plantilla no aprobada, número inválido) se devuelve como
 * `{ success: false, errorMessage }`, nunca como una excepción — así el
 * llamador (el use case que procesa la cola) siempre puede marcar la fila
 * como `FAILED` con un motivo legible sin un `try/catch` propio.
 */
export interface WhatsAppSender {
  /**
   * Envía `messageText` como el único parámetro de cuerpo ({{1}}) de la
   * plantilla configurada (`WHATSAPP_TEMPLATE_NAME`) — ver el doc comment
   * de `MetaCloudApiWhatsAppSender` para por qué se eligió una plantilla de
   * un solo parámetro en vez de varias variables estructuradas.
   */
  sendTemplateMessage(toWhatsappNumber: string, messageText: string): Promise<WhatsAppSendResult>;
}
