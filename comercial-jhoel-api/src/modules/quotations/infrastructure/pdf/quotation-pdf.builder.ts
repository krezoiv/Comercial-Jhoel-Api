import PDFDocument from 'pdfkit';
import {
  drawCompanyLetterhead,
  drawDivider,
  formatCurrency,
  formatDateTime,
  PdfCompanyLetterhead,
} from '../../../../shared/infrastructure/pdf/pdf-helpers';

export interface QuotationPdfItem {
  productName: string;
  presentationName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface QuotationPdfOptions {
  company: PdfCompanyLetterhead;
  quotationNumber: string;
  quotationDate: Date;
  /** `yyyy-MM-dd` — a calendar date, formatted directly, never round-tripped through a JS `Date`. */
  expirationDate: string;
  clientName: string;
  items: QuotationPdfItem[];
  subtotal: number;
  discount: number;
  total: number;
  observations: string | null;
  commercialTerms: string | null;
}

const PAGE_MARGIN = 40;
const ROW_HEIGHT = 20;
const HEADER_ROW_HEIGHT = 22;
const COLUMNS = [
  { header: 'Cantidad', width: 55, align: 'right' as const },
  { header: 'Producto', width: 165, align: 'left' as const },
  { header: 'Presentación', width: 75, align: 'left' as const },
  { header: 'Precio', width: 70, align: 'right' as const },
  { header: 'Descuento', width: 65, align: 'right' as const },
  { header: 'Total', width: 65, align: 'right' as const },
];

/** `yyyy-MM-dd` -> `dd/mm/yyyy`, no `Date` round-trip — same reasoning `formatRechargeDate` already established for a plain `DATE` column. */
function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Reconstructs a Cotización proposal purely from already-persisted,
 * historicized data (`QuotationOutput` + company settings) — never re-runs
 * `create_quotation` or touches inventory, and never re-reads the product's
 * *current* price. Professional/commercial A4 layout — genuinely distinct
 * from Sale/Purchase's plain document style and Ticket's thermal-receipt
 * style, per the approved plan.
 */
export function buildQuotationPdf(
  options: QuotationPdfOptions,
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margin: PAGE_MARGIN,
    bufferPages: true,
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  drawCompanyLetterhead(doc, options.company);
  doc.moveDown(0.6);
  drawDivider(doc);

  drawDocumentInfo(doc, options);
  drawTable(doc, options.items);
  drawTotals(doc, options);
  drawNotes(doc, options);
  numberPages(doc);

  doc.end();
  return finished;
}

function drawDocumentInfo(
  doc: PDFKit.PDFDocument,
  options: QuotationPdfOptions,
): void {
  const startX = doc.page.margins.left;
  const usableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  doc.moveDown(0.6);
  doc
    .fontSize(18)
    .fillColor('#0f172a')
    .text('COTIZACIÓN', startX, doc.y, { width: usableWidth });

  doc.moveDown(0.3);
  doc.fontSize(9).fillColor('#334155');
  doc.text(`Número: ${options.quotationNumber}`, startX, doc.y, {
    width: usableWidth,
  });
  doc.text(
    `Fecha: ${formatDateTime(options.quotationDate)}`,
    startX,
    doc.y,
    { width: usableWidth },
  );
  doc.text(
    `Válida hasta: ${formatIsoDate(options.expirationDate)}`,
    startX,
    doc.y,
    { width: usableWidth },
  );

  doc.moveDown(0.4);
  doc
    .fontSize(10)
    .fillColor('#0f172a')
    .text('Cliente', startX, doc.y, { width: usableWidth });
  doc
    .fontSize(9)
    .fillColor('#334155')
    .text(options.clientName, startX, doc.y, { width: usableWidth });

  doc.moveDown(0.6);
  drawDivider(doc);
}

function drawTable(doc: PDFKit.PDFDocument, items: QuotationPdfItem[]): void {
  const startX = doc.page.margins.left;

  const drawTableHeader = (): void => {
    let x = startX;
    const y = doc.y;
    const totalWidth = COLUMNS.reduce((sum, c) => sum + c.width, 0);
    doc.rect(startX, y, totalWidth, HEADER_ROW_HEIGHT).fill('#1e3a5f');
    doc.fontSize(9).fillColor('#ffffff');
    for (const column of COLUMNS) {
      doc.text(column.header, x + 4, y + 6, {
        width: column.width - 8,
        align: column.align,
      });
      x += column.width;
    }
    doc.y = y + HEADER_ROW_HEIGHT;
    doc.fillColor('#0f172a');
  };

  const ensureSpace = (): void => {
    const bottom = doc.page.height - doc.page.margins.bottom;
    if (doc.y + ROW_HEIGHT > bottom) {
      doc.addPage();
      drawTableHeader();
    }
  };

  doc.moveDown(0.3);
  drawTableHeader();

  items.forEach((item, index) => {
    ensureSpace();
    const y = doc.y;
    const totalWidth = COLUMNS.reduce((sum, c) => sum + c.width, 0);
    if (index % 2 === 1) {
      doc.rect(startX, y, totalWidth, ROW_HEIGHT).fill('#f1f5f9');
      doc.fillColor('#0f172a');
    }
    const cells = [
      String(item.quantity),
      item.productName,
      item.presentationName,
      formatCurrency(item.unitPrice),
      formatCurrency(item.discount),
      formatCurrency(item.total),
    ];
    let x = startX;
    doc.fontSize(8.5).fillColor('#1e293b');
    cells.forEach((cell, columnIndex) => {
      const column = COLUMNS[columnIndex];
      doc.text(cell, x + 4, y + 5, {
        width: column.width - 8,
        align: column.align,
        lineBreak: false,
        ellipsis: true,
      });
      x += column.width;
    });
    doc.y = y + ROW_HEIGHT;
  });
}

function drawTotals(
  doc: PDFKit.PDFDocument,
  options: Pick<QuotationPdfOptions, 'subtotal' | 'discount' | 'total'>,
): void {
  const usableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const startX = doc.page.margins.left;

  doc.moveDown(0.6);
  doc.fontSize(10).fillColor('#334155');
  doc.text(`Subtotal: ${formatCurrency(options.subtotal)}`, startX, doc.y, {
    width: usableWidth,
    align: 'right',
  });
  doc.text(`Descuento: ${formatCurrency(options.discount)}`, startX, doc.y, {
    width: usableWidth,
    align: 'right',
  });
  doc.moveDown(0.2);
  doc
    .fontSize(13)
    .fillColor('#0f172a')
    .text(`Total: ${formatCurrency(options.total)}`, startX, doc.y, {
      width: usableWidth,
      align: 'right',
    });
}

function drawNotes(
  doc: PDFKit.PDFDocument,
  options: Pick<QuotationPdfOptions, 'observations' | 'commercialTerms'>,
): void {
  const startX = doc.page.margins.left;
  const usableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  if (options.observations) {
    doc.moveDown(0.6);
    doc
      .fontSize(9)
      .fillColor('#0f172a')
      .text('Observaciones', startX, doc.y, { width: usableWidth });
    doc
      .fontSize(9)
      .fillColor('#334155')
      .text(options.observations, startX, doc.y, { width: usableWidth });
  }

  if (options.commercialTerms) {
    doc.moveDown(0.4);
    doc
      .fontSize(9)
      .fillColor('#0f172a')
      .text('Condiciones comerciales', startX, doc.y, { width: usableWidth });
    doc
      .fontSize(9)
      .fillColor('#334155')
      .text(options.commercialTerms, startX, doc.y, { width: usableWidth });
  }

  doc.moveDown(0.8);
  doc
    .fontSize(9)
    .fillColor('#64748b')
    .text('Gracias por su preferencia.', startX, doc.y, {
      width: usableWidth,
      align: 'center',
    });
}

function numberPages(doc: PDFKit.PDFDocument): void {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // Same pdfkit gotcha `report-pdf.builder.ts` already documents: a
    // footer written inside the bottom margin otherwise silently spawns a
    // trailing blank page.
    const bottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc
      .fontSize(8)
      .fillColor('#94a3b8')
      .text(
        `Página ${i + 1} de ${range.count}`,
        doc.page.margins.left,
        doc.page.height - bottomMargin + 10,
        {
          align: 'center',
          width:
            doc.page.width - doc.page.margins.left - doc.page.margins.right,
        },
      );
    doc.page.margins.bottom = bottomMargin;
  }
}
