import PDFDocument from 'pdfkit';
import {
  drawCompanyLetterhead,
  drawDivider,
  formatCurrency,
  formatDateTime,
  PdfCompanyLetterhead,
} from '../../../../shared/infrastructure/pdf/pdf-helpers';

export interface TicketPdfItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  observation?: string | null;
}

export interface TicketPdfOptions {
  company: PdfCompanyLetterhead;
  ticketNumber: string;
  createdAt: Date;
  username: string;
  clientName: string | null;
  items: TicketPdfItem[];
  total: number;
}

// ~80mm thermal paper width — a common real thermal-printer size.
const PAGE_WIDTH = 226;
const PAGE_MARGIN = 10;
// Fixed section heights (letterhead + document info block + totals/footer)
// plus a per-item allowance — pdfkit's page height is set once at creation
// (the PDF's MediaBox can't be shrunk to fit afterward), so a receipt's
// height is estimated up front from its own item count rather than using
// one large fixed page and leaving a blank tail, or relying on pdfkit's
// normal multi-page pagination, which isn't a fit for a single receipt.
const FIXED_SECTIONS_HEIGHT = 260;
const ITEM_ROW_HEIGHT = 34;
// Extra vertical space reserved per item that carries an observation line —
// added on top of ITEM_ROW_HEIGHT only for those items, since the page
// height must be estimated up front (pdfkit can't grow a page after the
// fact for this custom-sized document).
const OBSERVATION_ROW_HEIGHT = 14;

/**
 * Reconstructs a Ticket receipt purely from already-persisted data
 * (`TicketOutput` + company settings) — never re-runs `create_ticket` or
 * touches inventory. Compact, stacked single-column layout for an 80mm
 * thermal printer — genuinely different from Sale/Purchase's A4 table
 * layout and Cotización's professional layout, per the approved plan.
 */
export function buildTicketPdf(options: TicketPdfOptions): Promise<Buffer> {
  const observationCount = options.items.filter(
    (item) => item.observation,
  ).length;
  const pageHeight =
    FIXED_SECTIONS_HEIGHT +
    options.items.length * ITEM_ROW_HEIGHT +
    observationCount * OBSERVATION_ROW_HEIGHT;
  const doc = new PDFDocument({
    size: [PAGE_WIDTH, pageHeight],
    margin: PAGE_MARGIN,
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  const usableWidth = PAGE_WIDTH - PAGE_MARGIN * 2;

  drawCompanyLetterhead(doc, options.company);
  doc.moveDown(0.4);
  drawDivider(doc);

  doc.moveDown(0.3);
  doc
    .fontSize(12)
    .fillColor('#0f172a')
    .text('TICKET', PAGE_MARGIN, doc.y, { width: usableWidth, align: 'center' });

  doc.moveDown(0.3);
  doc.fontSize(8).fillColor('#334155');
  doc.text(`Número: ${options.ticketNumber}`, PAGE_MARGIN, doc.y, {
    width: usableWidth,
  });
  doc.text(`Fecha: ${formatDateTime(options.createdAt)}`, PAGE_MARGIN, doc.y, {
    width: usableWidth,
  });
  doc.text(`Usuario: ${options.username}`, PAGE_MARGIN, doc.y, {
    width: usableWidth,
  });
  if (options.clientName) {
    doc.text(`Cliente: ${options.clientName}`, PAGE_MARGIN, doc.y, {
      width: usableWidth,
    });
  }

  doc.moveDown(0.4);
  drawDivider(doc);
  doc.moveDown(0.3);

  doc.fontSize(8);
  for (const item of options.items) {
    doc
      .fillColor('#1e293b')
      .text(`${item.quantity} x ${item.productName}`, PAGE_MARGIN, doc.y, {
        width: usableWidth,
      });
    doc
      .fillColor('#334155')
      .text(
        `${formatCurrency(item.unitPrice)} = ${formatCurrency(item.total)}`,
        PAGE_MARGIN,
        doc.y,
        { width: usableWidth, align: 'right' },
      );
    if (item.observation) {
      doc
        .fontSize(7)
        .fillColor('#64748b')
        .text(`Obs: ${item.observation}`, PAGE_MARGIN, doc.y, {
          width: usableWidth,
        })
        .fontSize(8);
    }
    doc.moveDown(0.2);
  }

  doc.moveDown(0.2);
  drawDivider(doc);
  doc.moveDown(0.3);

  doc
    .fontSize(12)
    .fillColor('#0f172a')
    .text(`TOTAL: ${formatCurrency(options.total)}`, PAGE_MARGIN, doc.y, {
      width: usableWidth,
      align: 'right',
    });

  doc.moveDown(0.6);
  doc
    .fontSize(8)
    .fillColor('#64748b')
    .text('Gracias por su compra', PAGE_MARGIN, doc.y, {
      width: usableWidth,
      align: 'center',
    });

  doc.end();
  return finished;
}
