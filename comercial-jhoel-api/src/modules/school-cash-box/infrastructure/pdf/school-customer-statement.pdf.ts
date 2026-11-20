import PDFDocument from 'pdfkit';
import {
  drawCompanyLetterhead,
  drawDivider,
  formatCurrency,
  formatDateTime,
  PdfCompanyLetterhead,
} from '../../../../shared/infrastructure/pdf/pdf-helpers';

export interface StatementCompany extends PdfCompanyLetterhead {
  whatsapp?: string | null;
  website?: string | null;
  businessHours?: string | null;
}

export interface StatementPdfOptions {
  company: StatementCompany;
  generatedAt: Date;
  generatedBy: string;
  customer: {
    name: string;
    phone: string;
    otherNames: string[];
    students: string[];
    grades: string[];
    since: string;
    statusLabel: string;
  };
  totals: {
    purchased: number;
    paid: number;
    balance: number;
    percentPaid: number;
  };
  lists: {
    number: string;
    student: string;
    grade: string;
    date: string;
    total: number;
    paid: number;
    balance: number;
    status: string;
  }[];
  payments: {
    at: string;
    list: string;
    receipt: string;
    type: string;
    method: string;
    amount: number;
    status: string;
  }[];
  ledger: {
    at: string;
    description: string;
    charge: number;
    credit: number;
    balance: number;
  }[];
  notes: string[];
}

interface Column {
  header: string;
  width: number;
  align?: 'left' | 'right';
}

const BRAND = '#047857';
const INK = '#0f172a';
const MUTED = '#64748b';
const ROW = 16;

function usable(doc: PDFKit.PDFDocument): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function ensureSpace(doc: PDFKit.PDFDocument, height: number): void {
  if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string): void {
  ensureSpace(doc, 40);
  doc.moveDown(0.6);
  doc
    .fontSize(10.5)
    .fillColor(BRAND)
    .text(title.toUpperCase(), doc.page.margins.left, doc.y, {
      characterSpacing: 0.5,
    });
  doc.moveDown(0.3);
}

/** Table that repeats its header on every new page; widths are relative (scaled to the page). */
function drawTable(
  doc: PDFKit.PDFDocument,
  columns: Column[],
  rows: string[][],
  emptyText: string,
): void {
  const left = doc.page.margins.left;
  const scale = usable(doc) / columns.reduce((sum, c) => sum + c.width, 0);
  const widths = columns.map((c) => c.width * scale);
  const header = () => {
    const y = doc.y;
    doc.rect(left, y, usable(doc), ROW).fill('#ecfdf5');
    let x = left;
    columns.forEach((column, i) => {
      doc
        .fontSize(7.5)
        .fillColor(BRAND)
        .text(column.header.toUpperCase(), x + 4, y + 5, {
          width: widths[i] - 8,
          align: column.align ?? 'left',
          lineBreak: false,
        });
      x += widths[i];
    });
    doc.y = y + ROW;
  };
  ensureSpace(doc, ROW * 2);
  header();
  if (!rows.length) {
    doc
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(emptyText, left + 4, doc.y + 4, { width: usable(doc) - 8 });
    doc.moveDown(0.5);
    return;
  }
  rows.forEach((row, index) => {
    const height = Math.max(
      ROW,
      ...row.map(
        (cell, i) =>
          doc.fontSize(8.5).heightOfString(cell, { width: widths[i] - 8 }) + 7,
      ),
    );
    if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      header();
    }
    const y = doc.y;
    if (index % 2 === 1) {
      doc.rect(left, y, usable(doc), height).fill('#f8fafc');
    }
    let x = left;
    row.forEach((cell, i) => {
      doc
        .fontSize(8.5)
        .fillColor(INK)
        .text(cell, x + 4, y + 4, {
          width: widths[i] - 8,
          align: columns[i].align ?? 'left',
        });
      x += widths[i];
    });
    doc.y = y + height;
  });
  doc.x = left;
}

function numberPages(doc: PDFKit.PDFDocument): void {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // A footer inside the bottom margin would otherwise spawn a blank page.
    const bottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc
      .fontSize(7.5)
      .fillColor('#94a3b8')
      .text(
        `Página ${i + 1} de ${range.count}`,
        doc.page.margins.left,
        doc.page.height - bottom + 12,
        {
          align: 'center',
          width: usable(doc),
        },
      );
    doc.page.margins.bottom = bottom;
  }
}

/**
 * "Estado de cuenta" of a school-list customer, ready to hand over: business
 * letterhead, customer and students, totals with the paid percentage, every
 * list, every payment and the chronological statement. Pure rendering — all
 * figures come already computed by the backend.
 */
export function buildCustomerStatementPdf(
  options: StatementPdfOptions,
): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(chunks))),
  );
  const left = doc.page.margins.left;

  drawCompanyLetterhead(doc, options.company);
  doc.moveDown(0.6);
  doc
    .fontSize(15)
    .fillColor(INK)
    .text('Estado de cuenta — Listas Escolares', left, doc.y);
  doc
    .fontSize(8.5)
    .fillColor(MUTED)
    .text(
      `Generado el ${formatDateTime(options.generatedAt)} por ${options.generatedBy}`,
      left,
      doc.y + 2,
    );
  doc.moveDown(0.4);
  drawDivider(doc);

  // Customer facts in two columns.
  const c = options.customer;
  const facts: [string, string][] = [
    [
      'Cliente / encargado',
      c.name +
        (c.otherNames.length ? ` (también: ${c.otherNames.join(', ')})` : ''),
    ],
    ['Teléfono', c.phone],
    ['Alumno(s)', c.students.length ? c.students.join(', ') : '—'],
    ['Grado(s)', c.grades.join(', ') || '—'],
    ['Cliente desde', c.since],
    ['Estado de cuenta', c.statusLabel],
  ];
  const colWidth = usable(doc) / 2;
  for (let i = 0; i < facts.length; i += 2) {
    const y = doc.y;
    let bottom = y;
    facts.slice(i, i + 2).forEach(([label, value], col) => {
      const x = left + col * colWidth;
      doc
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(label.toUpperCase(), x, y, { width: colWidth - 10 });
      doc
        .fontSize(10)
        .fillColor(INK)
        .text(value, x, doc.y + 1, { width: colWidth - 10 });
      bottom = Math.max(bottom, doc.y);
    });
    doc.y = bottom + 5;
  }

  // Totals boxes + paid percentage bar.
  doc.moveDown(0.3);
  const boxes: [string, string, string][] = [
    ['Total comprado', formatCurrency(options.totals.purchased), INK],
    ['Total abonado', formatCurrency(options.totals.paid), '#15803d'],
    [
      'Saldo pendiente',
      formatCurrency(options.totals.balance),
      options.totals.balance > 0 ? '#c2410c' : '#15803d',
    ],
  ];
  const boxWidth = (usable(doc) - 16) / 3;
  const boxY = doc.y;
  boxes.forEach(([label, value, color], i) => {
    const x = left + i * (boxWidth + 8);
    doc.roundedRect(x, boxY, boxWidth, 44, 6).fill('#f1f5f9');
    doc
      .fontSize(7.5)
      .fillColor(MUTED)
      .text(label.toUpperCase(), x + 10, boxY + 8, { width: boxWidth - 20 });
    doc
      .fontSize(14)
      .fillColor(color)
      .text(value, x + 10, boxY + 20, { width: boxWidth - 20 });
  });
  doc.y = boxY + 52;
  const percent = Math.max(0, Math.min(100, options.totals.percentPaid));
  doc.roundedRect(left, doc.y, usable(doc), 7, 3.5).fill('#e2e8f0');
  if (percent > 0) {
    doc
      .roundedRect(left, doc.y, (usable(doc) * percent) / 100, 7, 3.5)
      .fill('#16a34a');
  }
  doc
    .fontSize(8)
    .fillColor(MUTED)
    .text(`Pagado: ${percent.toFixed(1)} %`, left, doc.y + 10);

  sectionTitle(doc, 'Listas escolares');
  drawTable(
    doc,
    [
      { header: 'Lista', width: 62 },
      { header: 'Alumno', width: 100 },
      { header: 'Grado', width: 72 },
      { header: 'Fecha', width: 56 },
      { header: 'Total', width: 62, align: 'right' },
      { header: 'Abonado', width: 62, align: 'right' },
      { header: 'Saldo', width: 62, align: 'right' },
      { header: 'Estado', width: 70 },
    ],
    options.lists.map((l) => [
      l.number,
      l.student,
      l.grade,
      l.date,
      formatCurrency(l.total),
      formatCurrency(l.paid),
      formatCurrency(l.balance),
      l.status,
    ]),
    'El cliente no tiene listas.',
  );

  sectionTitle(doc, 'Historial de pagos');
  drawTable(
    doc,
    [
      { header: 'Fecha', width: 70 },
      { header: 'Lista', width: 58 },
      { header: 'Recibo', width: 62 },
      { header: 'Tipo', width: 70 },
      { header: 'Método', width: 100 },
      { header: 'Monto', width: 64, align: 'right' },
      { header: 'Estado', width: 56 },
    ],
    options.payments.map((p) => [
      p.at,
      p.list,
      p.receipt,
      p.type,
      p.method,
      formatCurrency(p.amount),
      p.status,
    ]),
    'Sin pagos registrados.',
  );

  sectionTitle(doc, 'Estado de cuenta cronológico');
  drawTable(
    doc,
    [
      { header: 'Fecha', width: 70 },
      { header: 'Descripción', width: 220 },
      { header: 'Cargo', width: 70, align: 'right' },
      { header: 'Abono', width: 70, align: 'right' },
      { header: 'Saldo', width: 76, align: 'right' },
    ],
    options.ledger.map((r) => [
      r.at,
      r.description,
      r.charge ? formatCurrency(r.charge) : '—',
      r.credit ? formatCurrency(r.credit) : '—',
      formatCurrency(r.balance),
    ]),
    'Sin movimientos.',
  );

  if (options.notes.length) {
    sectionTitle(doc, 'Observaciones');
    options.notes.forEach((note) =>
      doc
        .fontSize(8.5)
        .fillColor(MUTED)
        .text(`• ${note}`, left, doc.y, { width: usable(doc) }),
    );
  }

  const contact = [
    options.company.whatsapp ? `WhatsApp: ${options.company.whatsapp}` : null,
    options.company.businessHours
      ? `Horario: ${options.company.businessHours}`
      : null,
    options.company.website ?? null,
  ].filter((line): line is string => !!line);
  if (contact.length) {
    ensureSpace(doc, 30);
    doc.moveDown(0.8);
    drawDivider(doc);
    doc
      .fontSize(8)
      .fillColor(MUTED)
      .text(contact.join('   ·   '), left, doc.y, {
        width: usable(doc),
        align: 'center',
      });
  }

  numberPages(doc);
  doc.end();
  return finished;
}
