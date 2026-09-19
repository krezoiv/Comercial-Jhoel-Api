import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { PushNotificationPayload, PushSendOutcome, PushSender, PushSubscriptionTarget } from '../../application/ports/push-sender.port';

const MAX_ERROR_MESSAGE_LENGTH = 500;

/**
 * Implementación real contra Web Push estándar (VAPID) vía la librería
 * `web-push` — sin proveedor externo (ni Firebase ni ningún BSP): el
 * propio navegador del suscriptor es el "proveedor", `web-push` solo
 * firma y cifra el mensaje según RFC 8291/8292.
 *
 * Traduce el payload genérico al sobre exacto que espera el Service
 * Worker de Angular (`SwPush`) — `{ notification: { title, body, icon,
 * data: { onActionClick: { default: { operation:
 * 'focusLastFocusedOrOpen', url } } } } }`. `focusLastFocusedOrOpen` es el
 * mecanismo NATIVO de Angular para enfocar una pestaña ya abierta de
 * comercialjhoel.com en vez de abrir una nueva — nunca lógica de click
 * propia en un service worker aparte.
 */
@Injectable()
export class WebPushSenderService implements PushSender, OnModuleInit {
  private readonly logger = new Logger(WebPushSenderService.name);
  private configured = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const publicKey = this.configService.get<string | null>('push.vapidPublicKey') ?? null;
    const privateKey = this.configService.get<string | null>('push.vapidPrivateKey') ?? null;
    const subject = this.configService.get<string>('push.vapidSubject') ?? 'mailto:libreria.jhoel@grupoki.com';

    if (!publicKey || !privateKey) {
      this.logger.warn('Web Push no configurado (faltan VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY) — los envíos quedarán en FAILED.');
      return;
    }
    webpush.setVapidDetails(subject, publicKey, privateKey);
    this.configured = true;
  }

  async send(target: PushSubscriptionTarget, payload: PushNotificationPayload): Promise<PushSendOutcome> {
    if (!this.configured) {
      return { result: 'failed', errorMessage: 'Web Push no configurado (faltan variables VAPID).' };
    }

    const body = JSON.stringify({
      notification: {
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
        data: {
          onActionClick: {
            default: { operation: 'focusLastFocusedOrOpen', url: payload.onActionClickUrl },
          },
        },
      },
    });

    try {
      await webpush.sendNotification(
        { endpoint: target.endpoint, keys: { p256dh: target.p256dh, auth: target.auth } },
        body,
      );
      return { result: 'sent' };
    } catch (error) {
      const statusCode = this.extractStatusCode(error);
      const errorMessage = this.extractErrorMessage(error);
      // 404/410 = el navegador/proveedor confirma que ese endpoint ya no
      // existe (desinstalación, permiso revocado, perfil borrado) — nunca
      // se debe reintentar, se marca inválido; cualquier otro código es un
      // fallo transitorio (red, 5xx del proveedor).
      if (statusCode === 404 || statusCode === 410) {
        this.logger.warn(`Push expirado (${statusCode}) para ${this.shortEndpoint(target.endpoint)}: ${errorMessage}`);
        return { result: 'expired', errorMessage: errorMessage.slice(0, MAX_ERROR_MESSAGE_LENGTH) };
      }
      this.logger.error(`Envío de push fallido para ${this.shortEndpoint(target.endpoint)}: ${errorMessage}`);
      return { result: 'failed', errorMessage: errorMessage.slice(0, MAX_ERROR_MESSAGE_LENGTH) };
    }
  }

  private extractStatusCode(error: unknown): number | null {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const value = (error as { statusCode: unknown }).statusCode;
      return typeof value === 'number' ? value : null;
    }
    return null;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Error desconocido al enviar la notificación push.';
  }

  /** Nunca se registra el endpoint completo en logs — es, en la práctica, un identificador único del dispositivo del visitante. */
  private shortEndpoint(endpoint: string): string {
    return `${endpoint.slice(0, 60)}…`;
  }
}
