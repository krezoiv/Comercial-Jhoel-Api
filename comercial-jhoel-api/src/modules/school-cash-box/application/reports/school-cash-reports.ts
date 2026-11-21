import type {
  ReportRecord,
  ReportValue,
} from '../../domain/repositories/school-cash-box.repository';

export type ReportColumnType = 'text' | 'money' | 'int' | 'date' | 'datetime';

export interface SchoolCashReportColumn {
  key: string;
  label: string;
  type: ReportColumnType;
  /** PDF width in points (landscape A4 table ≈ 760 pt). */
  width: number;
  /** Summed in the totals row and in the summary tiles. */
  total?: boolean;
  wrap?: boolean;
}

export interface SchoolCashReportDefinition {
  kind: string;
  title: string;
  description: string;
  /** Whether the date range filters the rows (otherwise it is a "today" snapshot). */
  usesRange: boolean;
  columns: SchoolCashReportColumn[];
}

const money = (
  key: string,
  label: string,
  width = 70,
  total = true,
): SchoolCashReportColumn => ({
  key,
  label,
  type: 'money',
  width,
  total,
});
const text = (
  key: string,
  label: string,
  width: number,
  wrap = false,
): SchoolCashReportColumn => ({
  key,
  label,
  type: 'text',
  width,
  wrap,
});
const at = (key = 'at', label = 'Fecha y hora'): SchoolCashReportColumn => ({
  key,
  label,
  type: 'datetime',
  width: 78,
});

/**
 * Reports of the Caja de Listas (section 17 of the request). Each one is a
 * plain table whose rows come from one SQL query of the repository; the same
 * rows feed the screen, the PDF (`buildReportPdf`) and the Excel workbook.
 */
export const SCHOOL_CASH_REPORTS: SchoolCashReportDefinition[] = [
  {
    kind: 'recaudacion-diaria',
    title: 'Recaudación diaria',
    description:
      'Lo que los clientes pagaron cada día, por medio de pago (anulados excluidos).',
    usesRange: true,
    columns: [
      { key: 'day', label: 'Fecha', type: 'date', width: 80 },
      { key: 'payments', label: 'Pagos', type: 'int', width: 50, total: true },
      money('cash', 'Efectivo', 95),
      money('transfer', 'Transferencias', 95),
      money('deposit', 'Depósitos', 95),
      money('other', 'Otros medios', 95),
      money('refunds', 'Devoluciones', 95),
      money('net', 'Neto recaudado', 100),
    ],
  },
  {
    kind: 'recaudacion-cliente',
    title: 'Recaudación por cliente',
    description:
      'Pagos del período agrupados por cliente, con su saldo pendiente actual.',
    usesRange: true,
    columns: [
      text('customer', 'Cliente', 190, true),
      text('phone', 'Teléfono', 80),
      { key: 'lists', label: 'Listas', type: 'int', width: 50, total: true },
      { key: 'payments', label: 'Pagos', type: 'int', width: 50, total: true },
      money('collected', 'Recaudado en el período', 120),
      money('balance', 'Saldo pendiente actual', 120),
    ],
  },
  {
    kind: 'recaudacion-lista',
    title: 'Recaudación por lista escolar',
    description: 'Cada lista con pagos en el período: total, pagado y saldo.',
    usesRange: true,
    columns: [
      text('quotation', 'Lista', 70),
      { key: 'date', label: 'Fecha', type: 'date', width: 64 },
      text('customer', 'Cliente', 150, true),
      text('status', 'Estado', 80),
      money('total', 'Total', 75),
      money('collected', 'Recaudado período', 85),
      money('paid', 'Pagado total', 75),
      money('balance', 'Saldo', 75),
    ],
  },
  {
    kind: 'pagos-efectivo',
    title: 'Pagos en efectivo',
    description: 'Pagos en efectivo de listas: entraron a la Caja de Listas.',
    usesRange: true,
    columns: [
      at(),
      text('receipt', 'Recibo', 70),
      text('quotation', 'Lista', 70),
      text('customer', 'Cliente', 150, true),
      text('kind', 'Tipo', 60),
      money('amount', 'Monto', 75),
      text('status', 'Estado', 65),
      text('user', 'Usuario', 90),
    ],
  },
  {
    kind: 'pagos-bancarios',
    title: 'Pagos bancarios',
    description:
      'Pagos por transferencia o depósito y su estado de traslado a la Caja de Listas.',
    usesRange: true,
    columns: [
      at(),
      text('receipt', 'Recibo', 64),
      text('quotation', 'Lista', 64),
      text('customer', 'Cliente', 110, true),
      text('method', 'Medio', 70),
      text('bank', 'Banco', 90, true),
      text('reference', 'Referencia', 70),
      money('amount', 'Monto', 62),
      money('transferred', 'Trasladado', 62),
      money('pending', 'Pendiente', 62),
      text('transferStatus', 'Estado', 70),
    ],
  },
  {
    kind: 'traslados',
    title: 'Traslados bancarios a Caja de Listas',
    description:
      'Movimientos internos banco → Caja de Listas (no son nuevos pagos).',
    usesRange: true,
    columns: [
      at(),
      text('number', 'Traslado', 70),
      text('bank', 'Banco', 130, true),
      text('reference', 'Referencia', 90),
      { key: 'payments', label: 'Pagos', type: 'int', width: 50 },
      money('amount', 'Monto', 85),
      text('status', 'Estado', 70),
      text('user', 'Usuario', 100),
    ],
  },
  {
    kind: 'pendiente-traslado',
    title: 'Dinero pendiente de trasladar',
    description:
      'Pagos bancarios cuyo dinero sigue en el banco (estado a la fecha de generación).',
    usesRange: false,
    columns: [
      at('at', 'Fecha del pago'),
      text('receipt', 'Recibo', 64),
      text('quotation', 'Lista', 64),
      text('customer', 'Cliente', 130, true),
      text('bank', 'Banco', 110, true),
      text('reference', 'Referencia', 75),
      money('amount', 'Recibido', 70),
      money('pending', 'Pendiente', 70),
      text('transferStatus', 'Estado', 85),
    ],
  },
  {
    kind: 'arqueos',
    title: 'Arqueos y diferencias',
    description:
      'Conteos físicos contra el saldo del Kardex. Las diferencias nunca se ajustan solas.',
    usesRange: true,
    columns: [
      at(),
      text('number', 'Arqueo', 70),
      money('theoretical', 'Teórico', 85, false),
      money('counted', 'Contado', 85, false),
      money('difference', 'Diferencia', 85),
      text('status', 'Resultado', 75),
      text('user', 'Usuario', 95),
      text('observations', 'Observaciones', 160, true),
    ],
  },
  {
    kind: 'salidas',
    title: 'Salidas de efectivo',
    description: 'Salidas autorizadas de la Caja de Listas y su destino.',
    usesRange: true,
    columns: [
      at(),
      text('number', 'Salida', 64),
      text('destination', 'Destino', 100),
      text('bank', 'Banco', 90, true),
      text('recipient', 'Entregado a', 90, true),
      text('reason', 'Motivo', 150, true),
      money('amount', 'Monto', 70),
      text('status', 'Estado', 60),
    ],
  },
  {
    kind: 'saldos-clientes',
    title: 'Saldos pendientes de clientes',
    description:
      'Listas vendidas con saldo por cobrar (estado a la fecha de generación).',
    usesRange: false,
    columns: [
      text('quotation', 'Lista', 70),
      { key: 'date', label: 'Fecha', type: 'date', width: 64 },
      text('customer', 'Cliente', 170, true),
      text('phone', 'Teléfono', 75),
      text('status', 'Estado', 85),
      money('total', 'Total', 80),
      money('paid', 'Pagado', 80),
      money('balance', 'Saldo', 80),
    ],
  },
  {
    kind: 'cartera-clientes',
    title: 'Cartera por cliente',
    description:
      'Clientes (mismo teléfono) con lo comprado, lo abonado y su saldo pendiente actual.',
    usesRange: false,
    columns: [
      text('customer', 'Cliente', 150, true),
      text('phone', 'Teléfono', 70),
      text('students', 'Alumno(s)', 130, true),
      { key: 'lists', label: 'Listas', type: 'int', width: 44, total: true },
      money('purchased', 'Comprado', 75),
      money('paid', 'Abonado', 75),
      money('balance', 'Saldo', 75),
      { key: 'lastPayment', label: 'Último pago', type: 'datetime', width: 78 },
      text('status', 'Estado', 63),
    ],
  },
  {
    kind: 'estado-listas',
    title: 'Cotizado, aceptado y cobrado por lista',
    description:
      'Cada lista del período con su etapa y su estado de pago. Las cotizaciones (sin aceptar) solo suman en "Cotizado": nunca en lo aceptado, lo cobrado ni lo pendiente.',
    usesRange: true,
    columns: [
      text('quotation', 'Lista', 60),
      { key: 'date', label: 'Fecha', type: 'date', width: 58 },
      text('customer', 'Cliente', 120, true),
      text('stage', 'Etapa', 70),
      text('payment', 'Pago', 58),
      money('quoted', 'Cotizado', 66),
      money('sold', 'Aceptado', 66),
      money('paid', 'Cobrado', 64),
      money('balance', 'Pendiente', 64),
    ],
  },
  {
    kind: 'movimientos',
    title: 'Kardex de la Caja de Listas',
    description: 'Todos los movimientos con su saldo después de cada uno.',
    usesRange: true,
    columns: [
      at(),
      text('number', 'Mov.', 58),
      text('type', 'Tipo', 90),
      text('description', 'Descripción', 170, true),
      text('bank', 'Banco', 75, true),
      text('reference', 'Referencia', 60),
      money('cashIn', 'Entrada', 62),
      money('cashOut', 'Salida', 62),
      money('balance', 'Saldo', 62, false),
      text('user', 'Usuario', 63),
    ],
  },
];

export function findReport(
  kind: string,
): SchoolCashReportDefinition | undefined {
  return SCHOOL_CASH_REPORTS.find((report) => report.kind === kind);
}

export function reportTotals(
  definition: SchoolCashReportDefinition,
  rows: ReportRecord[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const column of definition.columns.filter((c) => c.total)) {
    const cents = rows.reduce(
      (sum, row) => sum + Math.round(Number(row[column.key] ?? 0) * 100),
      0,
    );
    totals[column.key] =
      column.type === 'money' ? cents / 100 : Math.round(cents / 100);
  }
  return totals;
}

const GT = 'America/Guatemala';

/** `Q 1,234.50` (negative: `-Q 1,234.50`). */
export function formatMoney(value: number): string {
  const formatted = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `-Q ${formatted}` : `Q ${formatted}`;
}

/** `yyyy-mm-dd` → `dd/mm/yyyy` without going through a Date (no time-zone shift). */
export function formatDay(value: string): string {
  const [y, m, d] = value.slice(0, 10).split('-');
  return d && m && y ? `${d}/${m}/${y}` : value;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('es-GT', {
    timeZone: GT,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatCell(
  column: SchoolCashReportColumn,
  value: ReportValue,
): string {
  if (value === null || value === undefined || value === '') {
    return column.type === 'money' ? formatMoney(0) : '—';
  }
  switch (column.type) {
    case 'money':
      return formatMoney(Number(value));
    case 'int':
      return String(Math.round(Number(value)));
    case 'date':
      return formatDay(String(value));
    case 'datetime':
      return formatDateTime(String(value));
    default:
      return String(value);
  }
}
