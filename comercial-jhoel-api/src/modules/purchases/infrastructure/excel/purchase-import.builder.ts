import ExcelJS from 'exceljs';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E3A5F' },
};

/**
 * The exact, ordered header row `ImportPurchaseFromExcelUseCase` expects —
 * defined once here, imported by that use case, so the parser and the
 * template it hands out can never silently drift apart. Deliberately only
 * 4 columns (unlike Products' own 14-column import) — this feature has one
 * narrow purpose: register initial stock as a real purchase, reusing each
 * presentation's already-loaded price, never asking for anything else.
 *
 * One row per product+presentation — the SAME product can (and, for a
 * product bought in more than one presentation, should) appear across
 * several rows. E.g. "2 Cajas + 5 Unidades sueltas" of one product is two
 * rows, not one row with a pre-converted quantity — the conversion factor
 * is applied server-side, exactly like a normal purchase.
 */
export const PURCHASE_IMPORT_HEADERS = [
  'SKU',
  'Producto',
  'Presentación',
  'Cantidad',
] as const;

/**
 * Blank import template — `PURCHASE_IMPORT_HEADERS` as the header row, plus
 * two example rows showing the "one product, two presentation lines" case
 * this feature exists for. `ImportPurchaseFromExcelUseCase` reads columns
 * purely by position (1-4, matching this exact order), never by header text
 * matching beyond the one initial "does this look like our template" check.
 */
export async function buildPurchaseImportTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Comercial Jhoel';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Compra Inicial');

  sheet.columns = [
    { header: PURCHASE_IMPORT_HEADERS[0], key: 'sku', width: 18 },
    { header: PURCHASE_IMPORT_HEADERS[1], key: 'productName', width: 32 },
    { header: PURCHASE_IMPORT_HEADERS[2], key: 'presentationName', width: 18 },
    { header: PURCHASE_IMPORT_HEADERS[3], key: 'quantity', width: 12 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = HEADER_FILL;
  headerRow.alignment = { vertical: 'middle' };
  headerRow.height = 20;

  sheet.addRow({
    sku: 'LAP-001',
    productName: 'Lapicero BIC Negro',
    presentationName: 'Caja',
    quantity: 2,
  });
  sheet.addRow({
    sku: 'LAP-001',
    productName: 'Lapicero BIC Negro',
    presentationName: 'Unidad',
    quantity: 5,
  });

  sheet.getColumn('quantity').numFmt = '#,##0';
  sheet.getRow(2).font = { italic: true, color: { argb: 'FF6B7280' } };
  sheet.getRow(3).font = { italic: true, color: { argb: 'FF6B7280' } };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
