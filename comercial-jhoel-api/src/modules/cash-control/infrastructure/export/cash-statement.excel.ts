import ExcelJS from 'exceljs';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E3A5F' },
};
const SUMMARY_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFE8EEF6' },
};
const MONEY_FORMAT = '"Q"#,##0.00;-"Q"#,##0.00';

/** One movement line of the exported statement (already in Guatemala time). */
export interface CashStatementExcelRow {
  at: Date;
  operationNumber: string;
  type: string;
  description: string;
  reference: string;
  user: string;
  entry: number | null;
  exit: number | null;
  balance: number;
  status: string;
}

export interface CashStatementExcelOptions {
  title: string;
  periodLabel: string;
  generatedAt: Date;
  generatedBy: string;
  /** Label / value pairs shown above the table (opening, entries, exits…). */
  summary: Array<{ label: string; value: number | string }>;
  openingBalance: number;
  rows: CashStatementExcelRow[];
  totalIn: number;
  totalOut: number;
  closingBalance: number;
  truncationNotice?: string;
}

/** An instant → its Guatemala wall-clock time (UTC−6, no DST) for Excel. */
function toGuatemalaTime(value: Date): Date {
  return new Date(value.getTime() - 6 * 60 * 60 * 1000);
}

/**
 * Excel version of the Estado de Cuenta de Efectivo: summary block, then the
 * chronological movements with entry / exit / running balance as real numbers
 * (so the file can be filtered and summed), opened by the opening balance and
 * closed by the totals and the theoretical balance.
 */
export async function buildCashStatementExcel(
  options: CashStatementExcelOptions,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Comercial Jhoel';
  workbook.created = options.generatedAt;
  const sheet = workbook.addWorksheet('Estado de cuenta');

  sheet.addRow([`Comercial Jhoel — ${options.title}`]).font = {
    bold: true,
    size: 14,
  };
  sheet.addRow([`Período: ${options.periodLabel}`]);
  sheet.addRow([
    `Generado por ${options.generatedBy} el ${toGuatemalaTime(options.generatedAt).toISOString().slice(0, 16).replace('T', ' ')}`,
  ]);
  sheet.addRow([]);
  for (const item of options.summary) {
    const row = sheet.addRow([item.label, item.value]);
    row.getCell(1).font = { bold: true };
    row.getCell(1).fill = SUMMARY_FILL;
    if (typeof item.value === 'number') {
      row.getCell(2).numFmt = MONEY_FORMAT;
    }
  }
  if (options.truncationNotice) {
    sheet.addRow([options.truncationNotice]).font = { italic: true };
  }
  sheet.addRow([]);

  const header = sheet.addRow([
    'Fecha y hora',
    'No. operación',
    'Tipo de operación',
    'Descripción / Beneficiario',
    'Referencia',
    'Usuario',
    'Entrada',
    'Salida',
    'Saldo',
    'Estado',
  ]);
  header.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  });
  sheet.views = [{ state: 'frozen', ySplit: header.number }];

  const opening = sheet.addRow([
    null,
    null,
    'Saldo inicial',
    null,
    null,
    null,
    null,
    null,
    options.openingBalance,
    null,
  ]);
  opening.font = { italic: true };
  opening.getCell(9).numFmt = MONEY_FORMAT;

  for (const line of options.rows) {
    const row = sheet.addRow([
      toGuatemalaTime(line.at),
      line.operationNumber,
      line.type,
      line.description,
      line.reference,
      line.user,
      line.entry,
      line.exit,
      line.balance,
      line.status,
    ]);
    row.getCell(1).numFmt = 'dd/mm/yyyy hh:mm';
    for (const index of [7, 8, 9]) {
      row.getCell(index).numFmt = MONEY_FORMAT;
    }
    if (line.entry) row.getCell(7).font = { color: { argb: 'FF15803D' } };
    if (line.exit) row.getCell(8).font = { color: { argb: 'FFB91C1C' } };
  }

  const totals = sheet.addRow([
    null,
    null,
    'Totales / saldo teórico',
    null,
    null,
    null,
    options.totalIn,
    options.totalOut,
    options.closingBalance,
    null,
  ]);
  totals.font = { bold: true };
  totals.eachCell((cell) => (cell.fill = SUMMARY_FILL));
  for (const index of [7, 8, 9]) {
    totals.getCell(index).numFmt = MONEY_FORMAT;
  }

  const widths = [18, 14, 26, 42, 22, 14, 14, 14, 15, 12];
  widths.forEach((width, index) => (sheet.getColumn(index + 1).width = width));

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
