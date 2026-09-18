import {
  NewsSubscriberAuditEntry,
  NewsSubscriberListItem,
  NewsSubscriberTypeSummary,
} from '../../domain/repositories/news-subscriber.repository';
import { maskWhatsappNumber } from '../utils/mask-whatsapp-number';

/** Shape admin — número siempre enmascarado, nunca completo (punto 30 del pedido). */
export interface NewsSubscriberOutput {
  id: string;
  whatsappMasked: string;
  name: string | null;
  isActive: boolean;
  consentGiven: boolean;
  consentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  types: NewsSubscriberTypeSummary[];
}

export interface NewsSubscriberAuditEntryOutput {
  id: string;
  action: string;
  previousTypeIds: string[] | null;
  newTypeIds: string[] | null;
  performedBy: string | null;
  performedByUsername: string | null;
  createdAt: Date;
}

/**
 * Shape público — devuelto solo a quien ya posee el `manageToken` secreto
 * (el propio suscriptor). El número completo es seguro aquí: el token es
 * el mecanismo de autenticación, no el número (punto 19 del pedido).
 */
export interface SubscriptionOutput {
  whatsappNumber: string;
  name: string | null;
  manageToken: string;
  types: NewsSubscriberTypeSummary[];
}

export function toNewsSubscriberOutput(item: NewsSubscriberListItem): NewsSubscriberOutput {
  return {
    id: item.id,
    whatsappMasked: maskWhatsappNumber(item.whatsappNumber),
    name: item.name,
    isActive: item.isActive,
    consentGiven: item.consentGiven,
    consentAt: item.consentAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    types: item.types,
  };
}

export function toNewsSubscriberAuditEntryOutput(entry: NewsSubscriberAuditEntry): NewsSubscriberAuditEntryOutput {
  return { ...entry };
}

export function toSubscriptionOutput(item: NewsSubscriberListItem): SubscriptionOutput {
  return {
    whatsappNumber: item.whatsappNumber,
    name: item.name,
    manageToken: item.manageToken,
    types: item.types,
  };
}
