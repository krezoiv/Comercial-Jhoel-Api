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
