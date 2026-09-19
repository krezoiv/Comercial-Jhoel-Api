import { PushNotificationPayload } from '../ports/push-sender.port';

export interface NewsPushPayloadInput {
  title: string;
  excerpt: string;
  url: string;
  iconUrl?: string;
}

const EXCERPT_LENGTH = 160;

/**
 * Arma el payload que el navegador muestra — nunca contenido inventado,
 * siempre el título/resumen reales de la noticia recién publicada (mismo
 * criterio ya documentado en la extinta `buildNewsWhatsappMessage`).
 */
export function buildNewsPushPayload(input: NewsPushPayloadInput): PushNotificationPayload {
  const excerpt = input.excerpt.length > EXCERPT_LENGTH ? `${input.excerpt.slice(0, EXCERPT_LENGTH).trimEnd()}…` : input.excerpt;

  return {
    title: 'Comercial Jhoel',
    body: `📰 Nueva noticia disponible\n\n${input.title}\n\n${excerpt}`,
    icon: input.iconUrl,
    onActionClickUrl: input.url,
  };
}
