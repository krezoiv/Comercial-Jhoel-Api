/**
 * Auditoría de efectivo, arqueo de apertura y resolución de diferencias
 * (API `/cash-control/integrity`, `/cash-control/counts/opening`, 2026-11-21).
 * Every check runs in the backend over the official records; these types
 * only mirror its output. Nothing here corrects anything.
 */

export type IntegrityClassification =
  | 'ERROR_REGISTRO'
  | 'ERROR_CALCULO'
  | 'MOVIMIENTO_DUPLICADO'
  | 'MOVIMIENTO_OMITIDO'
  | 'DIFERENCIA_ARQUEO'
  | 'INCONSISTENCIA_HISTORICA'
  | 'NO_DETERMINADA';

export type IntegritySeverity = 'ALTA' | 'MEDIA' | 'BAJA' | 'INFO';
export type IntegrityCountSource = 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';

export interface IntegrityResolution {
  id: string;
  cause: IntegrityClassification;
  explanation: string;
  adjustmentMovementId: string | null;
  username: string;
  createdAt: string;
}

export interface IntegrityWindow {
  location: 'CAJA' | 'BODEGA';
  afterSequence: number;
  upToSequence: number;
}

export interface IntegrityFinding {
  key: string;
  check: string;
  severity: IntegritySeverity;
  classification: IntegrityClassification;
  title: string;
  detail: string;
  amount: number | null;
  occurredAt: string | null;
  username: string | null;
  movementIds: string[];
  reference: { type: string; id: string; label: string } | null;
  window: IntegrityWindow | null;
  count: {
    source: IntegrityCountSource;
    id: string;
    label: string;
    difference: number;
    resolution: IntegrityResolution | null;
  } | null;
  relatedKeys: string[];
}

export interface IntegrityTimelineCount {
  source: IntegrityCountSource;
  id: string;
  label: string;
  countedAt: string;
  sequence: number;
  theoretical: number;
  counted: number;
  difference: number;
  username: string;
  isOpening: boolean;
  resolution: IntegrityResolution | null;
}

/** Arqueo de apertura of a bank day, reconciled with the previous day's official closing. */
export interface OpeningStatus {
  dayOpeningId: string;
  businessDate: string;
  previousCloseBalance: number;
  currentTheoretical: number;
  movementsSinceOpening: number;
  lastCountBefore: { label: string; countedAt: string; counted: number; difference: number } | null;
  opening: {
    countId: string;
    number: number;
    countedAt: string;
    counted: number;
    theoretical: number;
    difference: number;
    reason: string | null;
    responsible: string | null;
    username: string;
    movementsSinceOpening: number;
  } | null;
}

export interface CashIntegrityReport {
  period: {
    kind: 'BANK_DAY' | 'RANGE';
    businessDate: string | null;
    dateFrom: string;
    dateTo: string;
    windowStart: string;
    windowEnd: string | null;
    isCurrent: boolean;
    afterSequence: number;
    upToSequence: number | null;
  };
  summary: {
    status: 'OK' | 'REVISAR' | 'ALERTA';
    bySeverity: Record<IntegritySeverity, number>;
    byClassification: Partial<Record<IntegrityClassification, number>>;
    unresolvedDifferences: number;
  };
  opening: OpeningStatus | null;
  timeline: {
    caja: IntegrityTimelineCount[];
    bodega: IntegrityTimelineCount[];
    previousCaja: IntegrityTimelineCount | null;
    previousBodega: IntegrityTimelineCount | null;
  };
  findings: IntegrityFinding[];
  checkedAt: string;
}

export interface RegisterOpeningCountInput {
  details: { denomination: number; quantity: number }[];
  observations?: string;
  reason?: string;
  responsible?: string;
  clientRequestId: string;
}

export interface ResolveDifferenceInput {
  source: IntegrityCountSource;
  countId: string;
  cause: IntegrityClassification;
  explanation: string;
  withAdjustment?: boolean;
  clientRequestId: string;
}

export const INTEGRITY_CLASSIFICATION_LABEL: Record<IntegrityClassification, string> = {
  ERROR_REGISTRO: 'Error de registro',
  ERROR_CALCULO: 'Error de cálculo',
  MOVIMIENTO_DUPLICADO: 'Movimiento duplicado',
  MOVIMIENTO_OMITIDO: 'Movimiento omitido',
  DIFERENCIA_ARQUEO: 'Diferencia de arqueo',
  INCONSISTENCIA_HISTORICA: 'Inconsistencia histórica',
  NO_DETERMINADA: 'Causa no determinada',
};

export const INTEGRITY_SEVERITY_LABEL: Record<IntegritySeverity, string> = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
  INFO: 'Info',
};

export const INTEGRITY_STATUS_LABEL: Record<CashIntegrityReport['summary']['status'], string> = {
  OK: 'Sin hallazgos',
  REVISAR: 'Revisar',
  ALERTA: 'Alerta',
};
