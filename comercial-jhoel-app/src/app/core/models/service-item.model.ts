export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  /** Short tag shown as a pill on the card, e.g. "Más solicitado". */
  tag?: string;
  /** Ancla de la landing a la que lleva el CTA de la card (p. ej. `telefonos`). */
  fragment?: string;
  /** Texto del CTA de la card; por defecto "Conocer más". */
  ctaLabel?: string;
}
