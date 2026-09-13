import ExcelJS from 'exceljs';

export interface ProductsExcelRow {
  name: string;
  sku: string | null;
  categoryName: string;
  businessName: string;
  unitOfMeasureAbbreviation: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  isActive: boolean;
}

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E3A5F' },
};

const MONEY_FORMAT = '"Q"#,##0.00';

/**
 * The exact, ordered header row `ImportProductsFromExcelUseCase` expects —
 * defined once here (the "products excel" schema's home) and imported by
 * that use case, so the parser and the template it hands out can never
 * silently drift apart. Deliberately mirrors the export's own column
 * naming/order above (Producto, SKU, Categoría, Negocio, Unidad, precios,
 * Stock) — a file exported from this same screen already looks like a
 * filled-in import template.
 *
 * The last 5 columns are for one **optional additional presentation**
 * (Caja, Paquete, ...) — the product's own base "Unidad" presentation
 * (factor 1) is still always auto-created regardless, exactly like a
 * manually-created product, and its own barcode is simply the SKU column
 * above (see `CreateProductUseCase`'s own doc comment — this happens
 * automatically, no separate column needed for it). Leave all 5 blank for
 * a row that only needs "Unidad"; fill in Tipo/Factor/Precio Costo/Precio
 * Público together to also create one more presentation for that product
 * — "Código de Barras Presentación" within that group is itself optional
 * (a Caja can be added without its own barcode, set later via "Editar").
 * This never supports more than one extra presentation per row — a
 * product needing several (Unidad + Caja + Paquete, say) still gets the
 * rest added afterward through the existing "Agregar presentación" UI.
 */
export const PRODUCTS_IMPORT_HEADERS = [
  'Producto',
  'SKU',
  'Categoría',
  'Negocio',
  'Unidad de Medida',
  'Precio Costo',
  'Precio Público',
  'Precio Mayorista',
  'Stock Inicial',
  'Tipo de Presentación',
  'Factor de Presentación',
  'Precio Costo Presentación',
  'Precio Público Presentación',
  'Código de Barras Presentación',
] as const;

/**
 * `exceljs` is this app's Excel equivalent of `pdfkit` — pure JS, no native
 * build step. Unlike the PDF export (capped at `EXPORT_ROW_LIMIT`, a printed
 * table has a practical page-count limit), a spreadsheet has no such
 * constraint, so the caller can hand this every matching row.
 */
export async function buildProductsExcel(
  rows: ProductsExcelRow[],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Comercial Jhoel';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Inventario');

  sheet.columns = [
    { header: 'Producto', key: 'name', width: 32 },
    { header: 'SKU', key: 'sku', width: 16 },
    { header: 'Categoría', key: 'categoryName', width: 18 },
    { header: 'Negocio', key: 'businessName', width: 16 },
    { header: 'Unidad', key: 'unit', width: 10 },
    { header: 'Precio costo', key: 'costPrice', width: 14 },
    { header: 'Precio público', key: 'publicPrice', width: 14 },
    { header: 'Precio mayorista', key: 'wholesalePrice', width: 16 },
    { header: 'Stock', key: 'stock', width: 10 },
    { header: 'Estado', key: 'status', width: 12 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = HEADER_FILL;
  headerRow.alignment = { vertical: 'middle' };
  headerRow.height = 20;

  for (const row of rows) {
    sheet.addRow({
      name: row.name,
      sku: row.sku ?? '—',
      categoryName: row.categoryName,
      businessName: row.businessName,
      unit: row.unitOfMeasureAbbreviation,
      costPrice: row.costPrice,
      publicPrice: row.publicPrice,
      wholesalePrice: row.wholesalePrice,
      stock: row.stock,
      status: row.isActive ? 'Activo' : 'Inactivo',
    });
  }

  ['costPrice', 'publicPrice', 'wholesalePrice'].forEach((key) => {
    sheet.getColumn(key).numFmt = MONEY_FORMAT;
  });
  sheet.getColumn('stock').numFmt = '#,##0';

  // Alternating row shading — same visual convention as the PDF table.
  for (let i = 2; i <= rows.length + 1; i++) {
    if (i % 2 === 0) {
      sheet.getRow(i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF1F5F9' },
      };
    }
  }

  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Blank import template — `PRODUCTS_IMPORT_HEADERS` as the header row, plus
 * one filled-in example row so the expected format (numbers as plain
 * numbers, not text; empty SKU/Stock/presentation columns allowed) is
 * obvious without a separate instructions sheet. `ImportProductsFromExcelUseCase`
 * reads columns purely by position (1-14, matching this exact order), never
 * by header text matching beyond the one initial "does this look like our
 * template" check.
 */
export async function buildProductsImportTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Comercial Jhoel';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Productos');

  sheet.columns = [
    { header: PRODUCTS_IMPORT_HEADERS[0], key: 'name', width: 32 },
    { header: PRODUCTS_IMPORT_HEADERS[1], key: 'sku', width: 16 },
    { header: PRODUCTS_IMPORT_HEADERS[2], key: 'categoryName', width: 20 },
    { header: PRODUCTS_IMPORT_HEADERS[3], key: 'businessName', width: 18 },
    { header: PRODUCTS_IMPORT_HEADERS[4], key: 'unitName', width: 18 },
    { header: PRODUCTS_IMPORT_HEADERS[5], key: 'costPrice', width: 14 },
    { header: PRODUCTS_IMPORT_HEADERS[6], key: 'publicPrice', width: 14 },
    { header: PRODUCTS_IMPORT_HEADERS[7], key: 'wholesalePrice', width: 16 },
    { header: PRODUCTS_IMPORT_HEADERS[8], key: 'stock', width: 14 },
    { header: PRODUCTS_IMPORT_HEADERS[9], key: 'presentationTypeName', width: 20 },
    { header: PRODUCTS_IMPORT_HEADERS[10], key: 'presentationFactor', width: 20 },
    { header: PRODUCTS_IMPORT_HEADERS[11], key: 'presentationCostPrice', width: 22 },
    { header: PRODUCTS_IMPORT_HEADERS[12], key: 'presentationPublicPrice', width: 24 },
    { header: PRODUCTS_IMPORT_HEADERS[13], key: 'presentationBarcode', width: 24 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = HEADER_FILL;
  headerRow.alignment = { vertical: 'middle' };
  headerRow.height = 20;

  sheet.addRow({
    name: 'Lapicero BIC Negro',
    sku: '7501014511023',
    categoryName: 'Papelería Escolar',
    businessName: 'Librería',
    unitName: 'Unidad',
    costPrice: 0.84,
    publicPrice: 1.5,
    wholesalePrice: 1.25,
    stock: 100,
    // Optional — deja estas 5 celdas vacías si el producto solo se vende
    // por "Unidad". Aquí se muestra un ejemplo con una presentación
    // adicional: una "Caja" de 12 unidades con su propio precio y su
    // propio código de barras (distinto del SKU de arriba, que ya es el
    // código de la "Unidad"). El código de barras de la presentación
    // adicional es opcional — puedes dejarlo vacío y agregarlo después.
    presentationTypeName: 'Caja',
    presentationFactor: 12,
    presentationCostPrice: 9,
    presentationPublicPrice: 16,
    presentationBarcode: '7501014511030',
  });

  ['costPrice', 'publicPrice', 'wholesalePrice', 'presentationCostPrice', 'presentationPublicPrice'].forEach(
    (key) => {
      sheet.getColumn(key).numFmt = MONEY_FORMAT;
    },
  );
  sheet.getColumn('stock').numFmt = '#,##0';
  sheet.getColumn('presentationFactor').numFmt = '#,##0';

  sheet.getRow(2).font = { italic: true, color: { argb: 'FF6B7280' } };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
