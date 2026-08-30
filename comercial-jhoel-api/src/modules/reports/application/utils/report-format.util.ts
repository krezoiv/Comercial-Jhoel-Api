export function formatReportDate(date: Date): string {
  return date.toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * The one money format every PDF export in this module uses (Ventas,
 * Compras, Recargas, Heladería, Activos y Cuentas por Cobrar) — matches the
 * frontend's own `formatCurrency` exactly (`Q 1,234.56`, comma thousands
 * separator, always two decimals), which `` `Q ${amount.toFixed(2)}` ``
 * did not: it printed `Q 1234.56` for any amount past a thousand, silently
 * diverging from what the screen the PDF is meant to mirror already showed.
 */
export function formatReportCurrency(amount: number): string {
  return `Q ${amount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** `1500` → `"1,500"` — thousands-separated, no decimals, for integer quantities (cantidades, registros) in a PDF table/summary. */
export function formatReportQuantity(value: number): string {
  return value.toLocaleString('es-GT', { maximumFractionDigits: 0 });
}

export function formatReportPeriodLabel(
  startDate?: Date,
  endDate?: Date,
): string {
  if (!startDate && !endDate) {
    return 'Todas las fechas';
  }
  if (startDate && endDate) {
    return `${formatReportDate(startDate)} - ${formatReportDate(endDate)}`;
  }
  if (startDate) {
    return `Desde ${formatReportDate(startDate)}`;
  }
  return `Hasta ${formatReportDate(endDate as Date)}`;
}
