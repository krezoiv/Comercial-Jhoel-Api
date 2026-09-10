import PDFDocument from 'pdfkit';
import {
  drawCompanyLetterhead,
  drawDivider,
  formatCurrency,
  formatDateTime,
  PdfCompanyLetterhead,
} from '../../../../shared/infrastructure/pdf/pdf-helpers';

export interface SalePdfItem {
  productName: string;
  presentationName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalePdfOptions {
  company: PdfCompanyLetterhead;
  saleNumber: string;
  saleDate: Date;
  username: string;
  clientName: string | null;
  items: SalePdfItem[];
  total: number;
  invoiceNumber: string | null;
  isVoided: boolean;
  voidReason: string | null;
}

const PAGE_MARGIN = 40;
const ROW_HEIGHT = 20;
const HEADER_ROW_HEIGHT = 22;
const COLUMNS = [
  { header: 'Cantidad', width: 60, align: 'right' as const },
  { header: 'Producto', width: 210, align: 'left' as const },
  { header: 'Presentación', width: 90, align: 'left' as const },
  { header: 'Precio unitario', width: 90, align: 'right' as const },
  { header: 'Total', width: 65, align: 'right' as const },
];

/**
 * Reconstructs a Venta receipt purely from already-persisted data (`SaleOutput`
 * + the company settings singleton) — never re-runs `confirm_open_sale` or
 * touches inventory. Normal A4 document layout, distinct from Tickets'
 * compact thermal layout and Cotizaciones' commercial layout (three
 * genuinely different documents, per the approved plan).
 */
export function buildSalePdf(options: SalePdfOptions): Promise<Buffer> {
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
  drawTotals(doc, options.total);
  numberPages(doc);

  doc.end();
  return finished;
}

function drawDocumentInfo(
  doc: PDFKit.PDFDocument,
  options: SalePdfOptions,
): void {
  const startX = doc.page.margins.left;
  const usableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  doc.moveDown(0.6);
  doc
    .fontSize(16)
    .fillColor('#0f172a')
    .text('VENTA', startX, doc.y, { width: usableWidth });

  if (options.isVoided) {
    doc.moveDown(0.2);
    doc
      .fontSize(12)
      .fillColor('#dc2626')
      .text('ANULADA', startX, doc.y, { width: usableWidth });
    if (options.voidReason) {
      doc
        .fontSize(9)
        .fillColor('#334155')
        .text(`Motivo de anulación: ${options.voidReason}`, startX, doc.y, {
          width: usableWidth,
        });
    }
  }

  doc.moveDown(0.3);
  doc.fontSize(9).fillColor('#334155');
  doc.text(`Número: ${options.saleNumber}`, startX, doc.y, {
    width: usableWidth,
  });
  if (options.invoiceNumber) {
    doc.text(`Número de factura: ${options.invoiceNumber}`, startX, doc.y, {
      width: usableWidth,
    });
  }
  doc.text(
    `Fecha: ${formatDateTime(options.saleDate)}`,
    startX,
    doc.y,
    { width: usableWidth },
  );
  doc.text(`Usuario: ${options.username}`, startX, doc.y, {
    width: usableWidth,
  });

  if (options.clientName) {
    doc.moveDown(0.4);
    doc
      .fontSize(10)
      .fillColor('#0f172a')
      .text('Cliente', startX, doc.y, { width: usableWidth });
    doc
      .fontSize(9)
      .fillColor('#334155')
      .text(options.clientName, startX, doc.y, { width: usableWidth });
  }

  doc.moveDown(0.6);
  drawDivider(doc);
}

function drawTable(doc: PDFKit.PDFDocument, items: SalePdfItem[]): void {
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

function drawTotals(doc: PDFKit.PDFDocument, total: number): void {
  const usableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const startX = doc.page.margins.left;

  doc.moveDown(0.8);
  doc
    .fontSize(13)
    .fillColor('#0f172a')
    .text(`Total: ${formatCurrency(total)}`, startX, doc.y, {
      width: usableWidth,
      align: 'right',
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
