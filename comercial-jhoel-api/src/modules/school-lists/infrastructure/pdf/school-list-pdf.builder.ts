import PDFDocument from 'pdfkit';
import {
  drawCompanyLetterhead,
  drawDivider,
  formatCurrency,
  formatDateTime,
  PdfCompanyLetterhead,
} from '../../../../shared/infrastructure/pdf/pdf-helpers';

/** Letterhead plus the commercial contact lines printed in the footer. */
export interface SchoolListPdfCompany extends PdfCompanyLetterhead {
  whatsapp?: string | null;
  website?: string | null;
  businessHours?: string | null;
}

export interface SchoolQuotationPdfOptions {
  company: SchoolListPdfCompany;
  quotationNumber: string;
  quotationDate: string;
  deliveryDate: string | null;
  statusLabel: string;
  customerName: string;
  customerPhone: string;
  studentName: string | null;
  grade: string;
  items: {
    productName: string;
    description: string | null;
    observations: string | null;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  advance: number;
  paid: number;
  balance: number;
  observations: string | null;
}

export interface SchoolReceiptPdfOptions {
  company: SchoolListPdfCompany;
  title: string;
  receiptNumber: string;
  receivedAt: Date;
  quotationNumber: string;
  customerName: string;
  customerPhone: string;
  studentName: string | null;
  grade: string;
  kindLabel: string;
  methodLabel: string;
  bankName: string | null;
  reference: string | null;
  amount: number;
  quotationTotal: number;
  balanceAfter: number;
  receivedBy: string;
  observations: string | null;
  voided: { at: Date; by: string | null; reason: string | null } | null;
}

const BRAND = '#1e3a5f';
const INK = '#0f172a';
const MUTED = '#64748b';
const BODY = '#334155';
const ROW_HEIGHT = 18;
const COLUMNS = [
  { header: 'Cant.', width: 40, align: 'right' as const },
  { header: 'Producto', width: 235, align: 'left' as const },
  { header: 'Precio unit.', width: 80, align: 'right' as const },
  { header: 'Descuento', width: 70, align: 'right' as const },
  { header: 'Subtotal', width: 90, align: 'right' as const },
];

/** `yyyy-MM-dd` → `dd/mm/yyyy` without a `Date` round-trip. */
function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function render(
  options: { size: 'A4' | 'A5'; margin: number },
  draw: (doc: PDFKit.PDFDocument) => void,
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: options.size,
    margin: options.margin,
    bufferPages: true,
  });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
  draw(doc);
  doc.end();
  return finished;
}

function usableWidth(doc: PDFKit.PDFDocument): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

/** Two-column "label: value" block. */
function drawFacts(
  doc: PDFKit.PDFDocument,
  facts: [string, string][],
  columns = 2,
): void {
  const startX = doc.page.margins.left;
  const colWidth = usableWidth(doc) / columns;
  let rowY = doc.y;
  facts.forEach(([label, value], index) => {
    const col = index % columns;
    if (col === 0 && index > 0) {
      rowY = doc.y + 4;
    }
    const x = startX + col * colWidth;
    doc
      .fontSize(7.5)
      .fillColor(MUTED)
      .text(label.toUpperCase(), x, rowY, {
        width: colWidth - 8,
      });
    doc
      .fontSize(9.5)
      .fillColor(INK)
      .text(value, x, doc.y + 1, {
        width: colWidth - 8,
      });
  });
  doc.x = startX;
  doc.moveDown(0.6);
}

function drawCommercialFooter(
  doc: PDFKit.PDFDocument,
  company: SchoolListPdfCompany,
): void {
  const lines = [
    company.whatsapp ? `WhatsApp: ${company.whatsapp}` : null,
    company.businessHours ? `Horario: ${company.businessHours}` : null,
    company.website ?? null,
  ].filter((line): line is string => !!line);
  if (!lines.length) {
    return;
  }
  doc.moveDown(0.8);
  drawDivider(doc);
  doc
    .fontSize(8)
    .fillColor(MUTED)
    .text(lines.join('   ·   '), doc.page.margins.left, doc.y, {
      width: usableWidth(doc),
      align: 'center',
    });
}

function numberPages(doc: PDFKit.PDFDocument): void {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // A footer inside the bottom margin would otherwise spawn a blank page.
    const bottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc
      .fontSize(7.5)
      .fillColor('#94a3b8')
      .text(
        `Página ${i + 1} de ${range.count}`,
        doc.page.margins.left,
        doc.page.height - bottomMargin + 10,
        { align: 'center', width: usableWidth(doc) },
      );
    doc.page.margins.bottom = bottomMargin;
  }
}

/**
 * Quotation of a school list, rebuilt only from the quotation's own saved
 * copy (lines, prices, payments) — never from the template or the current
 * product price. A4, ready to print or to share by WhatsApp.
 */
export function buildSchoolQuotationPdf(
  options: SchoolQuotationPdfOptions,
): Promise<Buffer> {
  return render({ size: 'A4', margin: 40 }, (doc) => {
    const startX = doc.page.margins.left;
    const width = usableWidth(doc);

    drawCompanyLetterhead(doc, options.company);
    doc.moveDown(0.6);
    drawDivider(doc);

    doc
      .fontSize(16)
      .fillColor(INK)
      .text('COTIZACIÓN · LISTA ESCOLAR', startX, doc.y + 4, { width });
    doc
      .fontSize(9)
      .fillColor(BODY)
      .text(
        `${options.quotationNumber}  ·  ${options.statusLabel}`,
        startX,
        doc.y + 2,
        { width },
      );
    doc.moveDown(0.6);

    drawFacts(doc, [
      ['Cliente / encargado', options.customerName],
      ['Teléfono', options.customerPhone],
      ['Estudiante', options.studentName ?? '—'],
      ['Grado', options.grade],
      ['Fecha de cotización', formatIsoDate(options.quotationDate)],
      [
        'Fecha de entrega',
        options.deliveryDate
          ? formatIsoDate(options.deliveryDate)
          : 'Por definir',
      ],
    ]);
    drawDivider(doc);

    // Table.
    const tableWidth = COLUMNS.reduce((sum, c) => sum + c.width, 0);
    const drawHeader = () => {
      const y = doc.y;
      doc.rect(startX, y, tableWidth, ROW_HEIGHT + 2).fill(BRAND);
      let x = startX;
      doc.fontSize(8.5).fillColor('#ffffff');
      for (const column of COLUMNS) {
        doc.text(column.header, x + 4, y + 5, {
          width: column.width - 8,
          align: column.align,
        });
        x += column.width;
      }
      doc.y = y + ROW_HEIGHT + 2;
    };
    doc.moveDown(0.3);
    drawHeader();
    options.items.forEach((item, index) => {
      const note = [item.description, item.observations]
        .filter(Boolean)
        .join(' · ');
      const height = note ? ROW_HEIGHT + 10 : ROW_HEIGHT;
      if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        drawHeader();
      }
      const y = doc.y;
      if (index % 2 === 1) {
        doc.rect(startX, y, tableWidth, height).fill('#f1f5f9');
      }
      const cells = [
        String(item.quantity),
        item.productName,
        formatCurrency(item.unitPrice),
        item.discount ? formatCurrency(item.discount) : '—',
        formatCurrency(item.subtotal),
      ];
      let x = startX;
      doc.fontSize(8.5).fillColor('#1e293b');
      cells.forEach((cell, col) => {
        const column = COLUMNS[col];
        doc.text(cell, x + 4, y + 5, {
          width: column.width - 8,
          align: column.align,
          lineBreak: false,
          ellipsis: true,
        });
        x += column.width;
      });
      if (note) {
        doc
          .fontSize(7)
          .fillColor(MUTED)
          .text(note, startX + COLUMNS[0].width + 4, y + 15, {
            width: COLUMNS[1].width - 8,
            lineBreak: false,
            ellipsis: true,
          });
      }
      doc.y = y + height;
    });

    // Totals card.
    doc.moveDown(0.8);
    const boxWidth = 230;
    const boxX = startX + width - boxWidth;
    const rows: [string, string, boolean?][] = [
      ['Subtotal', formatCurrency(options.subtotal)],
      ['Descuentos', formatCurrency(options.discount)],
      ['Total de la lista', formatCurrency(options.total), true],
      ['Anticipo recibido', formatCurrency(options.advance)],
      ['Total pagado', formatCurrency(options.paid)],
      ['Saldo pendiente', formatCurrency(options.balance), true],
    ];
    if (
      doc.y + rows.length * 16 + 12 >
      doc.page.height - doc.page.margins.bottom
    ) {
      doc.addPage();
    }
    const boxY = doc.y;
    doc
      .roundedRect(boxX, boxY, boxWidth, rows.length * 16 + 10, 6)
      .fill('#f8fafc');
    let rowY = boxY + 6;
    for (const [label, value, strong] of rows) {
      doc.fontSize(strong ? 10.5 : 9).fillColor(strong ? INK : BODY);
      doc.text(label, boxX + 10, rowY, { width: 120 });
      doc.text(value, boxX + 120, rowY, {
        width: boxWidth - 130,
        align: 'right',
      });
      rowY += 16;
    }
    doc.y = boxY + rows.length * 16 + 16;
    doc.x = startX;

    if (options.observations) {
      doc
        .fontSize(9)
        .fillColor(INK)
        .text('Observaciones', startX, doc.y, { width });
      doc
        .fontSize(9)
        .fillColor(BODY)
        .text(options.observations, startX, doc.y + 2, { width });
    }

    doc.moveDown(0.8);
    doc
      .fontSize(8)
      .fillColor(MUTED)
      .text(
        'Precios válidos para esta cotización. Los productos se entregan una vez cancelado el saldo total.',
        startX,
        doc.y,
        { width, align: 'center' },
      );
    drawCommercialFooter(doc, options.company);
    numberPages(doc);
  });
}

/** Receipt of a single anticipo/abono/devolución (A5), marked when voided. */
export function buildSchoolReceiptPdf(
  options: SchoolReceiptPdfOptions,
): Promise<Buffer> {
  return render({ size: 'A5', margin: 32 }, (doc) => {
    const startX = doc.page.margins.left;
    const width = usableWidth(doc);

    drawCompanyLetterhead(doc, options.company);
    doc.moveDown(0.5);
    drawDivider(doc);
    doc
      .fontSize(13)
      .fillColor(INK)
      .text(options.title, startX, doc.y + 2, { width });
    doc
      .fontSize(8.5)
      .fillColor(BODY)
      .text(
        `${options.receiptNumber}  ·  ${formatDateTime(options.receivedAt)}`,
        startX,
        doc.y + 2,
        { width },
      );
    doc.moveDown(0.6);

    // Amount.
    const y = doc.y;
    doc
      .roundedRect(startX, y, width, 46, 6)
      .fill(options.voided ? '#fef2f2' : '#f0fdf4');
    doc
      .fontSize(8)
      .fillColor(MUTED)
      .text(options.kindLabel.toUpperCase(), startX + 12, y + 8, {
        width: width - 24,
      });
    doc
      .fontSize(18)
      .fillColor(options.voided ? '#b91c1c' : '#15803d')
      .text(formatCurrency(options.amount), startX + 12, y + 20, {
        width: width - 24,
      });
    doc.y = y + 56;
    doc.x = startX;

    drawFacts(doc, [
      ['Cotización', options.quotationNumber],
      ['Grado', options.grade],
      ['Cliente / encargado', options.customerName],
      ['Teléfono', options.customerPhone],
      ['Estudiante', options.studentName ?? '—'],
      [
        'Método de pago',
        options.bankName
          ? `${options.methodLabel} · ${options.bankName}`
          : options.methodLabel,
      ],
      ['Referencia', options.reference ?? '—'],
      ['Recibió', options.receivedBy],
      ['Total de la cotización', formatCurrency(options.quotationTotal)],
      [
        'Saldo después de este movimiento',
        formatCurrency(options.balanceAfter),
      ],
    ]);

    if (options.observations) {
      doc
        .fontSize(8)
        .fillColor(MUTED)
        .text('OBSERVACIONES', startX, doc.y, { width });
      doc
        .fontSize(9)
        .fillColor(BODY)
        .text(options.observations, startX, doc.y + 1, { width });
      doc.moveDown(0.5);
    }

    if (options.voided) {
      doc.moveDown(0.3);
      doc
        .fontSize(10)
        .fillColor('#b91c1c')
        .text(
          `ANULADO el ${formatDateTime(options.voided.at)}${options.voided.by ? ` por ${options.voided.by}` : ''}` +
            (options.voided.reason ? ` — ${options.voided.reason}` : ''),
          startX,
          doc.y,
          { width, align: 'center' },
        );
    }

    doc.moveDown(1.6);
    const lineY = doc.y;
    doc
      .moveTo(startX + width / 2 - 90, lineY)
      .lineTo(startX + width / 2 + 90, lineY)
      .strokeColor('#cbd5e1')
      .stroke();
    doc
      .fontSize(8)
      .fillColor(MUTED)
      .text('Firma y sello', startX, lineY + 4, { width, align: 'center' });
    drawCommercialFooter(doc, options.company);
  });
}
