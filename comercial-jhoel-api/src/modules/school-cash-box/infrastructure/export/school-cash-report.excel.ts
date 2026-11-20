import ExcelJS from 'exceljs';
import type { ReportRecord } from '../../domain/repositories/school-cash-box.repository';
import type { SchoolCashReportDefinition } from '../../application/reports/school-cash-reports';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E3A5F' },
};
const TOTAL_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFE8EEF6' },
};
const MONEY_FORMAT = '"Q"#,##0.00';

export interface SchoolCashExcelOptions {
  definition: SchoolCashReportDefinition;
  rows: ReportRecord[];
  totals: Record<string, number>;
  periodLabel: string;
  generatedAt: Date;
  generatedBy: string;
  cashBalance: number;
}

/** `yyyy-mm-dd` → a calendar date at UTC midnight (Excel shows it as-is). */
function toDay(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** An instant → its Guatemala wall-clock time (UTC−6, no DST) for Excel. */
function toGuatemalaTime(value: string): Date {
  return new Date(new Date(value).getTime() - 6 * 60 * 60 * 1000);
}

/**
 * Excel version of a Caja de Listas report: the same columns and rows as the
 * screen and the PDF, with real numbers/dates so the file can be filtered and
 * summed. Uses `exceljs`, already a dependency (Productos/Compras import).
 */
export async function buildSchoolCashReportExcel(
  options: SchoolCashExcelOptions,
): Promise<Buffer> {
  const { definition, rows, totals } = options;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Comercial Jhoel';
  workbook.created = options.generatedAt;
  const sheet = workbook.addWorksheet(definition.title.slice(0, 31), {
    views: [{ state: 'frozen', ySplit: 5 }],
  });

  sheet.addRow([`Caja de Listas Escolares — ${definition.title}`]).font = {
    bold: true,
    size: 14,
  };
  sheet.addRow([`Período: ${options.periodLabel}`]);
  sheet.addRow([
    `Generado por ${options.generatedBy} · Saldo actual en caja: Q${options.cashBalance.toFixed(2)}`,
  ]);
  sheet.addRow([]);

  const header = sheet.addRow(definition.columns.map((column) => column.label));
  header.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle' };
  });

  for (const record of rows) {
    const row = sheet.addRow(
      definition.columns.map((column) => {
        const value = record[column.key];
        if (value === null || value === undefined || value === '') {
          return column.type === 'money' ? 0 : null;
        }
        switch (column.type) {
          case 'money':
          case 'int':
            return Number(value);
          case 'date':
            return toDay(String(value));
          case 'datetime':
            return toGuatemalaTime(String(value));
          default:
            return String(value);
        }
      }),
    );
    definition.columns.forEach((column, index) => {
      const cell = row.getCell(index + 1);
      if (column.type === 'money') {
        cell.numFmt = MONEY_FORMAT;
      } else if (column.type === 'date') {
        cell.numFmt = 'dd/mm/yyyy';
      } else if (column.type === 'datetime') {
        cell.numFmt = 'dd/mm/yyyy hh:mm';
      }
    });
  }

  if (definition.columns.some((column) => column.total)) {
    const totalRow = sheet.addRow(
      definition.columns.map((column, index) =>
        index === 0
          ? 'Totales'
          : column.total
            ? (totals[column.key] ?? 0)
            : null,
      ),
    );
    totalRow.font = { bold: true };
    definition.columns.forEach((column, index) => {
      const cell = totalRow.getCell(index + 1);
      cell.fill = TOTAL_FILL;
      if (column.type === 'money') {
        cell.numFmt = MONEY_FORMAT;
      }
    });
  }

  definition.columns.forEach((column, index) => {
    sheet.getColumn(index + 1).width = Math.max(
      10,
      Math.round(column.width / 5.5),
    );
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
