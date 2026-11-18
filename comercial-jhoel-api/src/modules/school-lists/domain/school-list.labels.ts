import type {
  SchoolPaymentKind,
  SchoolPaymentMethod,
  SchoolQuotationStatus,
} from './repositories/school-list.repository';

/** Spanish labels printed on documents (the app keeps its own copy for the UI). */
export const SCHOOL_STATUS_LABEL: Record<SchoolQuotationStatus, string> = {
  BORRADOR: 'Borrador',
  ACEPTADA: 'Aceptada',
  COTIZADA: 'Cotizada',
  ANTICIPO_RECIBIDO: 'Anticipo recibido',
  PAGO_PARCIAL: 'Pago parcial',
  PAGADA: 'Pagada',
  EN_PREPARACION: 'En preparación',
  TERMINADA: 'Terminada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
};

export const SCHOOL_PAYMENT_METHOD_LABEL: Record<SchoolPaymentMethod, string> =
  {
    EFECTIVO: 'Efectivo',
    TRANSFERENCIA: 'Transferencia',
    DEPOSITO: 'Depósito bancario',
    TARJETA: 'Tarjeta',
    OTRO: 'Otro',
  };

export const SCHOOL_PAYMENT_KIND_LABEL: Record<SchoolPaymentKind, string> = {
  ANTICIPO: 'Anticipo',
  ABONO: 'Abono',
  DEVOLUCION: 'Devolución',
  ANULACION: 'Anulación',
};
