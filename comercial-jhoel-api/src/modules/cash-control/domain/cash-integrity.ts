/**
 * Auditoría de efectivo — pure rules (owner request, 2026-11-21: "eliminar
 * descuadres y detectar desviaciones de efectivo").
 *
 * The audit only READS the official records (Kardex, its source operations,
 * counts, cuts, bank-day anchors) and reports verifiable facts: which
 * operation, which user, when, how much. It never fixes anything and never
 * asserts fraud: every finding is classified as an error de registro, error de
 * cálculo, movimiento duplicado, movimiento omitido, diferencia de arqueo,
 * inconsistencia histórica or causa no determinada.
 */

export type IntegrityClassification =
  | 'ERROR_REGISTRO'
  | 'ERROR_CALCULO'
  | 'MOVIMIENTO_DUPLICADO'
  | 'MOVIMIENTO_OMITIDO'
  | 'DIFERENCIA_ARQUEO'
  | 'INCONSISTENCIA_HISTORICA'
  | 'NO_DETERMINADA';

export const INTEGRITY_CLASSIFICATIONS: readonly IntegrityClassification[] = [
  'ERROR_REGISTRO',
  'ERROR_CALCULO',
  'MOVIMIENTO_DUPLICADO',
  'MOVIMIENTO_OMITIDO',
  'DIFERENCIA_ARQUEO',
  'INCONSISTENCIA_HISTORICA',
  'NO_DETERMINADA',
];

export type IntegritySeverity = 'ALTA' | 'MEDIA' | 'BAJA' | 'INFO';

export type IntegrityCheck =
  /** previous_balance ≠ the new_balance of the previous Kardex row. */
  | 'KARDEX_CHAIN'
  /** A type with a fixed direction registered the other way. */
  | 'SIGN_RULE'
  /** An annulment that does not mirror its original (or an original annulled without one). */
  | 'REVERSAL'
  /** A source operation that never reached the Kardex. */
  | 'SOURCE_MISSING'
  /** Kardex effect = −(expected effect). */
  | 'SOURCE_SIGN'
  /** Kardex effect with a different amount. */
  | 'SOURCE_AMOUNT'
  /** It moved Caja when, by its rules, it should not. */
  | 'SOURCE_UNEXPECTED'
  /** It should have moved Caja and it did not. */
  | 'SOURCE_NO_EFFECT'
  /** Two active Kardex movements for the same operation. */
  | 'DUPLICATE_REFERENCE'
  /** Same type, amount, description and user within minutes (to verify). */
  | 'POSSIBLE_DUPLICATE'
  /** A figure stored by another module ≠ what the Kardex says. */
  | 'SNAPSHOT'
  /** A count whose difference changed against the previous count. */
  | 'DIFFERENCE_CHANGE'
  /** The current bank day has no opening count. */
  | 'OPENING_MISSING'
  /** A CxC / Activos cargo still active although its Transaccionar operation is voided. */
  | 'LINKED_CHARGE_ACTIVE';

/** A Kardex sequence span (afterSequence, upToSequence] of one location: where to look. */
export interface IntegrityWindow {
  location: 'CAJA' | 'BODEGA';
  afterSequence: number;
  upToSequence: number;
}

export interface IntegrityResolution {
  id: string;
  cause: IntegrityClassification;
  explanation: string;
  adjustmentMovementId: string | null;
  username: string;
  createdAt: Date;
}

export interface IntegrityFinding {
  /** Stable key (check + subject), so the screen can track it. */
  key: string;
  check: IntegrityCheck;
  severity: IntegritySeverity;
  classification: IntegrityClassification;
  title: string;
  /** Verifiable facts in plain words — never an accusation. */
  detail: string;
  /** Signed effect on Caja involved (when it applies). */
  amount: number | null;
  occurredAt: Date | null;
  username: string | null;
  movementIds: string[];
  reference: { type: string; id: string; label: string } | null;
  /** Where to investigate in the Kardex. */
  window: IntegrityWindow | null;
  /** For count differences: the count and how it was resolved. */
  count: {
    source: 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';
    id: string;
    label: string;
    difference: number;
    resolution: IntegrityResolution | null;
  } | null;
  /** Other findings inside the same window (possible explanation, to verify). */
  relatedKeys: string[];
  /**
   * Operation-level reconciliation ("Movimiento esperado" vs "registrado"):
   * the signed Caja effect its rules give it and the net its Kardex rows hold.
   * Only for findings about one source operation; absent otherwise.
   */
  expected?: number | null;
  registered?: number | null;
}

const cents = (value: number): number => Math.round(value * 100);

function money(value: number): string {
  const sign = value < 0 ? '-' : '';
  return `${sign}Q${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** A source operation and what the Kardex registered for it. */
export interface SourceComparison {
  referenceType: string;
  referenceId: string;
  label: string;
  occurredAt: Date;
  username: string | null;
  /** Signed effect its own rules say it must have on Caja (0 = none). */
  expectedNet: number;
  /** Signed sum of its Kardex rows (IN +, OUT −, NONE 0; annulments included). */
  kardexNet: number;
  /** Kardex rows of any kind for it (0 = it never reached the Kardex). */
  rows: number;
  /** VIGENTE physical rows that are not annulments. */
  activeRows: number;
  /** Whether it must have at least one Kardex row (created while Control de Efectivo was active). */
  expectsRow: boolean;
  movementIds: string[];
  /** The rule used for `expectedNet`, explained ("Depósito: entra a Caja"). */
  rule: string;
}

/**
 * Compares a source operation with its Kardex rows. Returns `null` when they
 * agree. The order matters: a missing row first, then duplicates, then the
 * kind of mismatch.
 */
export function classifySource(
  s: SourceComparison,
): Omit<IntegrityFinding, 'relatedKeys' | 'window' | 'count'> | null {
  const base = {
    amount: s.kardexNet - s.expectedNet,
    occurredAt: s.occurredAt,
    username: s.username,
    movementIds: s.movementIds,
    reference: { type: s.referenceType, id: s.referenceId, label: s.label },
    expected: s.expectedNet,
    registered: s.kardexNet,
  };
  const key = (check: IntegrityCheck) =>
    `${check}:${s.referenceType}:${s.referenceId}`;
  if (s.rows === 0) {
    if (!s.expectsRow) return null;
    return {
      ...base,
      key: key('SOURCE_MISSING'),
      check: 'SOURCE_MISSING',
      severity: cents(s.expectedNet) === 0 ? 'BAJA' : 'ALTA',
      classification: 'MOVIMIENTO_OMITIDO',
      title: 'Operación sin movimiento en el Kardex',
      detail: `${s.label} no tiene ningún movimiento en el Kardex de Caja. ${s.rule}${cents(s.expectedNet) === 0 ? '' : `: debía mover ${money(s.expectedNet)}`}.`,
    };
  }
  if (s.activeRows > 1) {
    return {
      ...base,
      key: key('DUPLICATE_REFERENCE'),
      check: 'DUPLICATE_REFERENCE',
      severity: 'ALTA',
      classification: 'MOVIMIENTO_DUPLICADO',
      title: 'Movimiento duplicado de una misma operación',
      detail: `${s.label} tiene ${s.activeRows} movimientos vigentes en el Kardex; le corresponde uno. Efecto registrado ${money(s.kardexNet)}, esperado ${money(s.expectedNet)}.`,
    };
  }
  const expected = cents(s.expectedNet);
  const actual = cents(s.kardexNet);
  if (expected === actual) {
    return null;
  }
  if (expected !== 0 && actual === -expected) {
    return {
      ...base,
      key: key('SOURCE_SIGN'),
      check: 'SOURCE_SIGN',
      severity: 'ALTA',
      classification: 'ERROR_REGISTRO',
      title: 'Signo invertido',
      detail: `${s.label} se registró en sentido contrario: Kardex ${money(s.kardexNet)}, esperado ${money(s.expectedNet)}. ${s.rule}.`,
    };
  }
  if (expected === 0) {
    return {
      ...base,
      key: key('SOURCE_UNEXPECTED'),
      check: 'SOURCE_UNEXPECTED',
      severity: 'ALTA',
      classification: 'ERROR_REGISTRO',
      title: 'Afectó Caja sin corresponder',
      detail: `${s.label} movió ${money(s.kardexNet)} en Caja, pero según sus reglas no debía mover efectivo (${s.rule}). Si la configuración del tipo cambió después, es una inconsistencia histórica.`,
    };
  }
  if (actual === 0) {
    return {
      ...base,
      key: key('SOURCE_NO_EFFECT'),
      check: 'SOURCE_NO_EFFECT',
      severity: 'ALTA',
      classification: 'MOVIMIENTO_OMITIDO',
      title: 'No afectó Caja',
      detail: `${s.label} debía mover ${money(s.expectedNet)} en Caja y su efecto registrado es Q0.00. ${s.rule}. Si la configuración del tipo cambió después, es una inconsistencia histórica.`,
    };
  }
  return {
    ...base,
    key: key('SOURCE_AMOUNT'),
    check: 'SOURCE_AMOUNT',
    severity: 'ALTA',
    classification: 'ERROR_REGISTRO',
    title: 'Monto distinto',
    detail: `${s.label}: el Kardex registró ${money(s.kardexNet)} y la operación indica ${money(s.expectedNet)} (diferencia ${money(s.kardexNet - s.expectedNet)}).`,
  };
}

/** A CxC / Activos cargo still active although the Transaccionar operation it was born from is voided. */
export interface LinkedChargeOfVoidedOperation {
  recordType: 'ACCOUNT_RECEIVABLE' | 'ASSET';
  recordId: string;
  operationId: string;
  operationLabel: string;
  clientName: string | null;
  amount: number;
  /** Signed net its Kardex rows hold (what Caja still carries for it). */
  kardexNet: number;
  voidedAt: Date;
  voidedBy: string | null;
  movementIds: string[];
}

/**
 * Before 1760009300000, voiding a Transaccionar operation left the cargo it sent
 * to CxC / Activos active: Caja kept that cargo's movement without the
 * operation that justified it. Since then the void cascades; older cases stay
 * visible here until an admin voids the cargo with its reason.
 */
export function linkedChargeFinding(
  row: LinkedChargeOfVoidedOperation,
): Omit<IntegrityFinding, 'relatedKeys'> {
  const module = row.recordType === 'ASSET' ? 'Activos' : 'Cuentas por Cobrar';
  return {
    key: `LINKED_CHARGE_ACTIVE:${row.recordType}:${row.recordId}`,
    check: 'LINKED_CHARGE_ACTIVE',
    severity: cents(row.kardexNet) === 0 ? 'BAJA' : 'ALTA',
    classification: 'INCONSISTENCIA_HISTORICA',
    title: 'Operación anulada con su cargo vigente',
    detail:
      `${row.operationLabel} se anuló, pero el cargo de ${money(row.amount)} que envió a ${module}` +
      `${row.clientName ? ` (${row.clientName})` : ''} sigue vigente` +
      (cents(row.kardexNet) === 0
        ? '.'
        : `: Caja conserva su movimiento de ${money(row.kardexNet)} sin la operación que lo respaldaba.`) +
      ` Para regularizarlo, anule el cargo en ${module} indicando el motivo.`,
    amount: row.kardexNet,
    occurredAt: row.voidedAt,
    username: row.voidedBy,
    movementIds: row.movementIds,
    reference: {
      type: row.recordType,
      id: row.recordId,
      label: `Cargo de ${module} de ${money(row.amount)}`,
    },
    window: null,
    count: null,
    expected: 0,
    registered: row.kardexNet,
  };
}

/** A physical count on the timeline of its location. */
export interface TimelineCount {
  source: 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';
  id: string;
  label: string;
  countedAt: Date;
  /** Kardex sequence the count was compared against. */
  sequence: number;
  theoretical: number;
  counted: number;
  difference: number;
  username: string;
  isOpening: boolean;
  resolution: IntegrityResolution | null;
}

/**
 * "¿En qué momento comenzó la diferencia?": between two consecutive counts,
 * the change of their differences is the cash that appeared or went missing
 * in that stretch of the Kardex — movements (previous.sequence, count.sequence].
 * A difference that does not change was already there (carried over).
 */
export function differenceChanges(
  location: 'CAJA' | 'BODEGA',
  previous: TimelineCount | null,
  counts: TimelineCount[],
): Array<Omit<IntegrityFinding, 'relatedKeys'>> {
  const findings: Array<Omit<IntegrityFinding, 'relatedKeys'>> = [];
  let before = previous;
  for (const count of counts) {
    const delta = cents(count.difference) - cents(before?.difference ?? 0);
    if (delta !== 0) {
      const change = delta / 100;
      const since = before
        ? `desde ${before.label} (diferencia ${money(before.difference)})`
        : 'desde el inicio del registro';
      findings.push({
        key: `DIFFERENCE_CHANGE:${count.source}:${count.id}`,
        check: 'DIFFERENCE_CHANGE',
        severity: Math.abs(change) >= 100 ? 'ALTA' : 'MEDIA',
        classification: 'DIFERENCIA_ARQUEO',
        title:
          change < 0
            ? `Faltan ${money(-change)} desde el conteo anterior`
            : `Sobran ${money(change)} desde el conteo anterior`,
        detail:
          `${count.label} (${count.username}) contó ${money(count.counted)} contra un teórico de ${money(count.theoretical)}: ` +
          `diferencia ${money(count.difference)}. La diferencia cambió ${money(change)} ${since}; ` +
          'el cambio ocurrió en los movimientos entre ambos conteos.',
        amount: change,
        occurredAt: count.countedAt,
        username: count.username,
        movementIds: [],
        reference: null,
        window: {
          location,
          afterSequence: before ? before.sequence : 0,
          upToSequence: count.sequence,
        },
        count: {
          source: count.source,
          id: count.id,
          label: count.label,
          difference: count.difference,
          resolution: count.resolution,
        },
      });
    }
    before = count;
  }
  return findings;
}

/**
 * Links every count-difference finding with the other findings whose
 * movements fall inside its window: they are POSSIBLE explanations to verify,
 * never a conclusion.
 */
export function relateFindings(
  findings: Array<Omit<IntegrityFinding, 'relatedKeys'>>,
  sequenceOf: (movementId: string) => number | undefined,
): IntegrityFinding[] {
  return findings.map((finding) => {
    // Only Caja windows: every movement finding is about the Caja Kardex.
    if (
      finding.check !== 'DIFFERENCE_CHANGE' ||
      finding.window?.location !== 'CAJA'
    ) {
      return { ...finding, relatedKeys: [] };
    }
    const { afterSequence, upToSequence } = finding.window;
    const relatedKeys = findings
      .filter(
        (other) =>
          other.key !== finding.key && other.check !== 'DIFFERENCE_CHANGE',
      )
      .filter((other) =>
        other.movementIds.some((id) => {
          const sequence = sequenceOf(id);
          return (
            sequence !== undefined &&
            sequence > afterSequence &&
            sequence <= upToSequence
          );
        }),
      )
      .map((other) => other.key);
    return { ...finding, relatedKeys };
  });
}

const SEVERITY_ORDER: Record<IntegritySeverity, number> = {
  ALTA: 0,
  MEDIA: 1,
  BAJA: 2,
  INFO: 3,
};

/** Most severe first, then most recent. */
export function sortFindings(findings: IntegrityFinding[]): IntegrityFinding[] {
  return [...findings].sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      (b.occurredAt ? new Date(b.occurredAt).getTime() : 0) -
        (a.occurredAt ? new Date(a.occurredAt).getTime() : 0),
  );
}

export interface IntegritySummary {
  /** OK = nothing to review; REVISAR = only medium/low; ALERTA = at least one high finding. */
  status: 'OK' | 'REVISAR' | 'ALERTA';
  bySeverity: Record<IntegritySeverity, number>;
  byClassification: Partial<Record<IntegrityClassification, number>>;
  /** Count differences still without a documented resolution. */
  unresolvedDifferences: number;
}

export function summarize(findings: IntegrityFinding[]): IntegritySummary {
  const bySeverity: Record<IntegritySeverity, number> = {
    ALTA: 0,
    MEDIA: 0,
    BAJA: 0,
    INFO: 0,
  };
  const byClassification: Partial<Record<IntegrityClassification, number>> = {};
  let unresolved = 0;
  for (const finding of findings) {
    bySeverity[finding.severity] += 1;
    byClassification[finding.classification] =
      (byClassification[finding.classification] ?? 0) + 1;
    if (
      finding.count &&
      cents(finding.count.difference) !== 0 &&
      !finding.count.resolution
    ) {
      unresolved += 1;
    }
  }
  return {
    status:
      bySeverity.ALTA > 0
        ? 'ALERTA'
        : bySeverity.MEDIA + bySeverity.BAJA > 0
          ? 'REVISAR'
          : 'OK',
    bySeverity,
    byClassification,
    unresolvedDifferences: unresolved,
  };
}
