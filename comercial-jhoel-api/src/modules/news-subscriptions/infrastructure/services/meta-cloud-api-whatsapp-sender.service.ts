import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsAppSendResult, WhatsAppSender } from '../../application/ports/whatsapp-sender.port';
import { toWhatsappRecipient } from '../../application/utils/to-whatsapp-recipient';

const MAX_ERROR_MESSAGE_LENGTH = 500;

interface MetaSendMessageResponse {
  messages?: { id: string }[];
  error?: { message?: string; code?: number };
}

/**
 * Implementación real contra WhatsApp Cloud API (Meta) — ver el doc comment
 * de `WhatsAppSender` para el contrato (nunca lanza).
 *
 * Envía SIEMPRE una plantilla con un único parámetro de cuerpo ({{1}}) =
 * el mensaje completo ya armado por `buildNewsWhatsappMessage` — evita
 * depender de varias variables de plantilla estructuradas, así la
 * plantilla que hay que crear y esperar aprobada en Meta es mínima (el
 * cuerpo es literalmente "{{1}}"). El nombre/idioma de esa plantilla
 * vienen de `WHATSAPP_TEMPLATE_NAME`/`WHATSAPP_TEMPLATE_LANGUAGE`.
 *
 * Sin credenciales configuradas (`WHATSAPP_PHONE_NUMBER_ID`/
 * `WHATSAPP_ACCESS_TOKEN`/`WHATSAPP_TEMPLATE_NAME`), devuelve `success:
 * false` de inmediato sin intentar la llamada — así el despliegue no se
 * rompe mientras la integración todavía no está conectada del lado de
 * Meta.
 */
@Injectable()
export class MetaCloudApiWhatsAppSender implements WhatsAppSender {
  private readonly logger = new Logger(MetaCloudApiWhatsAppSender.name);

  constructor(private readonly configService: ConfigService) {}

  async sendTemplateMessage(toWhatsappNumber: string, messageText: string): Promise<WhatsAppSendResult> {
    const phoneNumberId = this.configService.get<string | null>('whatsapp.phoneNumberId');
    const accessToken = this.configService.get<string | null>('whatsapp.accessToken');
    const templateName = this.configService.get<string | null>('whatsapp.templateName');
    const templateLanguage = this.configService.get<string>('whatsapp.templateLanguage');
    const apiVersion = this.configService.get<string>('whatsapp.apiVersion');

    if (!phoneNumberId || !accessToken || !templateName) {
      return {
        success: false,
        errorMessage: 'WhatsApp Cloud API no configurado (faltan WHATSAPP_PHONE_NUMBER_ID/ACCESS_TOKEN/TEMPLATE_NAME).',
      };
    }

    const recipient = toWhatsappRecipient(toWhatsappNumber);

    try {
      const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipient,
          type: 'template',
          template: {
            name: templateName,
            language: { code: templateLanguage },
            components: [{ type: 'body', parameters: [{ type: 'text', text: messageText }] }],
          },
        }),
      });

      const body = (await response.json().catch(() => null)) as MetaSendMessageResponse | null;

      if (!response.ok || !body || body.error) {
        const errorMessage = body?.error?.message ?? `HTTP ${response.status} sin cuerpo de error legible.`;
        this.logger.warn(`Envío de WhatsApp fallido a ${recipient}: ${errorMessage}`);
        return { success: false, errorMessage: errorMessage.slice(0, MAX_ERROR_MESSAGE_LENGTH) };
      }

      return { success: true, externalId: body.messages?.[0]?.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al llamar a WhatsApp Cloud API.';
      this.logger.error(`Excepción al enviar WhatsApp a ${recipient}: ${errorMessage}`);
      return { success: false, errorMessage: errorMessage.slice(0, MAX_ERROR_MESSAGE_LENGTH) };
    }
  }
}
