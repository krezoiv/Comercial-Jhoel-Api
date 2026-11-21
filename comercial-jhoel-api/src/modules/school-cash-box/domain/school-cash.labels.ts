import {
  SCHOOL_PAYMENT_KIND_LABEL,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_STATUS_LABEL,
} from '../../school-lists/domain/school-list.labels';
import type {
  SchoolCashExitDestination,
  SchoolCashMovementType,
} from './repositories/school-cash-box.repository';

/** Spanish labels of the Caja de Listas printed on reports (the app keeps its own copy). */
export const SCHOOL_CASH_MOVEMENT_LABEL: Record<
  SchoolCashMovementType,
  string
> = {
  PAGO_EFECTIVO: 'Pago de lista en efectivo',
  PAGO_DEPOSITO: 'Pago de lista por depósito',
  PAGO_TRANSFERENCIA: 'Pago de lista por transferencia',
  PAGO_OTRO_MEDIO: 'Pago por otro medio',
  TRASLADO_BANCO: 'Traslado de banco a caja',
  SALIDA: 'Salida de caja',
  AJUSTE: 'Ajuste autorizado',
  DEVOLUCION: 'Devolución al cliente',
  REVERSION: 'Reversión de movimiento',
};

export const SCHOOL_CASH_EXIT_LABEL: Record<SchoolCashExitDestination, string> =
  {
    ENTREGA_ADMINISTRACION: 'Entrega a administración',
    DEPOSITO_BANCARIO: 'Depósito bancario',
    GASTO_AUTORIZADO: 'Gasto autorizado',
    OTRO: 'Otro',
  };

export const SCHOOL_CASH_RECEIPT_STATUS_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente de traslado',
  TRASLADO_PARCIAL: 'Traslado parcial',
  TRASLADADO: 'Trasladado',
  DEVUELTO: 'Devuelto al cliente',
  ANULADO: 'Anulado',
  ANTERIOR_A_LA_CAJA: 'Anterior a la caja',
};

const RECORD_STATUS_LABEL: Record<string, string> = {
  APLICADO: 'Aplicado',
  ANULADO: 'Anulado',
  REVERTIDO: 'Revertido',
  CUADRADO: 'Cuadrado',
  FALTANTE: 'Faltante',
  SOBRANTE: 'Sobrante',
};

/** Per report column: which dictionary turns a stored code into its label. */
export const SCHOOL_CASH_REPORT_LABELS: Record<
  string,
  Record<string, Record<string, string>>
> = {
  'recaudacion-lista': { status: SCHOOL_STATUS_LABEL },
  'saldos-clientes': { status: SCHOOL_STATUS_LABEL },
  'pagos-efectivo': {
    kind: SCHOOL_PAYMENT_KIND_LABEL,
    status: RECORD_STATUS_LABEL,
  },
  'pagos-bancarios': {
    method: SCHOOL_PAYMENT_METHOD_LABEL,
    transferStatus: SCHOOL_CASH_RECEIPT_STATUS_LABEL,
  },
  'pendiente-traslado': { transferStatus: SCHOOL_CASH_RECEIPT_STATUS_LABEL },
  traslados: { status: RECORD_STATUS_LABEL },
  arqueos: { status: RECORD_STATUS_LABEL },
  salidas: { destination: SCHOOL_CASH_EXIT_LABEL, status: RECORD_STATUS_LABEL },
  movimientos: { type: SCHOOL_CASH_MOVEMENT_LABEL },
  'cartera-clientes': {
    status: {
      SOLVENTE: 'Solvente',
      ABONANDO: 'Abonando',
      PENDIENTE: 'Pendiente',
      COTIZANDO: 'Solo cotizaciones',
      CANCELADO: 'Cancelado',
    },
  },
  'estado-listas': {
    stage: {
      COTIZACION: 'Cotización',
      ACEPTADA: 'Aceptada',
      EN_PREPARACION: 'En preparación',
      TERMINADA: 'Lista para entregar',
      ENTREGADA: 'Entregada',
      CANCELADA: 'Cancelada',
    },
    payment: {
      NO_APLICA: '—',
      PAGADA: 'Pagada',
      PARCIAL: 'Parcial',
      PENDIENTE: 'Pendiente',
    },
  },
};
