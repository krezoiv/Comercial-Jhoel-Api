import { NewsSubscriberProps } from '../entities/news-subscriber.entity';

export const NEWS_SUBSCRIBER_REPOSITORY = Symbol('NEWS_SUBSCRIBER_REPOSITORY');

export type NewsSubscriberAuditAction =
  | 'SUBSCRIBED'
  | 'PREFERENCES_UPDATED'
  | 'UNSUBSCRIBED'
  | 'REACTIVATED'
  | 'ADMIN_ACTIVATED'
  | 'ADMIN_DEACTIVATED';

export interface NewsSubscriberTypeSummary {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}

/** Una fila de listado/detalle más sus categorías suscritas — el join vive siempre en el repositorio, nunca se reconstruye en la aplicación desde ids sueltos. */
export interface NewsSubscriberListItem extends NewsSubscriberProps {
  types: NewsSubscriberTypeSummary[];
}

export interface NewsSubscriberAuditEntry {
  id: string;
  action: NewsSubscriberAuditAction;
  previousTypeIds: string[] | null;
  newTypeIds: string[] | null;
  performedBy: string | null;
  performedByUsername: string | null;
  createdAt: Date;
}

export interface CreateNewsSubscriberData {
  whatsappNumber: string | null;
  name: string | null;
  consentAt: Date;
  typeIds: string[];
}

export interface RecordNewsSubscriberAuditData {
  subscriberId: string;
  action: NewsSubscriberAuditAction;
  previousTypeIds: string[] | null;
  newTypeIds: string[] | null;
  performedBy: string | null;
}

export interface NewsSubscriberRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<NewsSubscriberListItem[]>;
  findById(id: string): Promise<NewsSubscriberListItem | null>;
  /** Case-insensitive no aplica a un número — comparación directa, solo entre suscriptores activos (chequeo de "ya está suscrito" al recibir el formulario público). */
  findActiveByWhatsapp(whatsappNumber: string): Promise<NewsSubscriberListItem | null>;
  findByManageToken(token: string): Promise<NewsSubscriberListItem | null>;
  /** Inserta el suscriptor y sus categorías iniciales en una sola transacción. */
  createWithTypes(data: CreateNewsSubscriberData): Promise<NewsSubscriberListItem>;
  /** Reemplaza por completo las categorías suscritas (delete+insert transaccional) — nunca un merge parcial, la nueva selección siempre representa el estado completo deseado. */
  replaceTypes(subscriberId: string, typeIds: string[]): Promise<void>;
  /** Marca `consent_given = true` con la fecha dada — llamado cada vez que un visitante confirma la casilla de consentimiento (alta o re-suscripción). */
  setConsent(subscriberId: string, consentAt: Date): Promise<void>;
  setActive(subscriberId: string, isActive: boolean): Promise<void>;
  recordAudit(data: RecordNewsSubscriberAuditData): Promise<void>;
  findAuditLog(subscriberId: string): Promise<NewsSubscriberAuditEntry[]>;
}
