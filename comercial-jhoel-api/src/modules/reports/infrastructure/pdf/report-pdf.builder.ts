import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import {
  formatDateTime,
  drawDivider,
} from '../../../../shared/infrastructure/pdf/pdf-helpers';

const LOGO_PATH = path.join(__dirname, 'assets', 'logo.png');

export interface ReportPdfFilterLine {
  label: string;
  value: string;
}

export interface ReportPdfSummaryTile {
  label: string;
  value: string;
}

export interface ReportPdfColumn {
  header: string;
  width: number;
  align?: 'left' | 'right' | 'center';
}

export interface ReportPdfOptions {
  reportTitle: string;
  periodLabel: string;
  filters: ReportPdfFilterLine[];
  summary: ReportPdfSummaryTile[];
  columns: ReportPdfColumn[];
  rows: string[][];
  generatedAt: Date;
  /** Username of whoever triggered the export — shown in the letterhead so a printed report is traceable to its author. */
  generatedByUsername: string;
  /** Shown under the table when `rows` was capped before reaching the full filtered result set. */
  truncationNotice?: string;
}

const PAGE_MARGIN = 40;
const SYSTEM_NAME = 'Comercial Jhoel';
const ROW_HEIGHT = 20;
const HEADER_ROW_HEIGHT = 22;

/**
 * A single, generic builder shared by both the sales and purchases PDF
 * exports — the two reports differ only in title/columns/rows, never in
 * layout, so there's exactly one place that knows how to lay out a page,
 * paginate a table, or number pages.
 */
export function buildReportPdf(options: ReportPdfOptions): Promise<Buffer> {
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

  drawHeader(doc, options);
  drawFilters(doc, options.filters);
  drawSummary(doc, options.summary);
  drawTable(doc, options.columns, options.rows);

  if (options.truncationNotice) {
    doc
      .moveDown(0.5)
      .fontSize(8)
      .fillColor('#94a3b8')
      .text(options.truncationNotice, { align: 'left' });
  }

  numberPages(doc);

  doc.end();
  return finished;
}

function drawHeader(doc: PDFKit.PDFDocument, options: ReportPdfOptions): void {
  const startX = doc.page.margins.left;
  const startY = doc.y;
  const usableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const LOGO_SIZE = 36;
  const hasLogo = fs.existsSync(LOGO_PATH);
  const textX = hasLogo ? startX + LOGO_SIZE + 10 : startX;
  const textWidth = usableWidth - (hasLogo ? LOGO_SIZE + 10 : 0);

  if (hasLogo) {
    // A missing/corrupt logo asset should never break PDF generation — the letterhead text alone is still a usable report.
    try {
      doc.image(LOGO_PATH, startX, startY, {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
      });
    } catch {
      // ignore — fall back to text-only letterhead
    }
  }

  doc
    .fontSize(10)
    .fillColor('#64748b')
    .text(SYSTEM_NAME, textX, startY, { width: textWidth, align: 'left' });

  doc
    .fontSize(18)
    .fillColor('#0f172a')
    .text(options.reportTitle, textX, doc.y + 2, {
      width: textWidth,
      align: 'left',
    });

  doc.y = Math.max(doc.y, startY + LOGO_SIZE);
  doc.x = startX;

  doc
    .moveDown(0.3)
    .fontSize(10)
    .fillColor('#334155')
    .text(`Período: ${options.periodLabel}`, startX, doc.y, {
      width: usableWidth,
      align: 'left',
    });

  doc
    .fontSize(9)
    .fillColor('#94a3b8')
    .text(
      `Generado el ${formatDateTime(options.generatedAt)} por ${options.generatedByUsername}`,
      startX,
      doc.y,
      {
        width: usableWidth,
        align: 'left',
      },
    );

  doc.moveDown(0.8);
  drawDivider(doc);
}

function drawFilters(
  doc: PDFKit.PDFDocument,
  filters: ReportPdfFilterLine[],
): void {
  doc.moveDown(0.6);
  doc
    .fontSize(11)
    .fillColor('#0f172a')
    .text('Filtros aplicados', { underline: false });
  doc.moveDown(0.2);

  if (filters.length === 0) {
    doc
      .fontSize(9)
      .fillColor('#64748b')
      .text('Ninguno — se incluyen todos los registros.');
  } else {
    doc.fontSize(9).fillColor('#334155');
    for (const filter of filters) {
      doc.text(`•  ${filter.label}: ${filter.value}`);
    }
  }

  doc.moveDown(0.6);
  drawDivider(doc);
}

function drawSummary(
  doc: PDFKit.PDFDocument,
  summary: ReportPdfSummaryTile[],
): void {
  doc.moveDown(0.6);
  doc.fontSize(11).fillColor('#0f172a').text('Resumen');
  doc.moveDown(0.3);

  const usableWidth = doc.page.width - PAGE_MARGIN * 2;
  const columnWidth = usableWidth / Math.max(summary.length, 1);
  const startX = doc.page.margins.left;
  const startY = doc.y;

  summary.forEach((tile, index) => {
    const x = startX + index * columnWidth;
    doc
      .fontSize(8)
      .fillColor('#64748b')
      .text(tile.label, x, startY, { width: columnWidth - 8 });
    doc
      .fontSize(13)
      .fillColor('#0f172a')
      .text(tile.value, x, startY + 12, { width: columnWidth - 8 });
  });

  doc.y = startY + 36;
  doc.moveDown(0.6);
  drawDivider(doc);
}

function drawTable(
  doc: PDFKit.PDFDocument,
  columns: ReportPdfColumn[],
  rows: string[][],
): void {
  doc.moveDown(0.6);

  const startX = doc.page.margins.left;

  const drawTableHeader = (): void => {
    let x = startX;
    const y = doc.y;
    doc.fontSize(9).fillColor('#ffffff');
    doc
      .rect(
        startX,
        y,
        columns.reduce((sum, c) => sum + c.width, 0),
        HEADER_ROW_HEIGHT,
      )
      .fill('#1e3a5f');
    doc.fillColor('#ffffff');
    for (const column of columns) {
      doc.text(column.header, x + 4, y + 6, {
        width: column.width - 8,
        align: column.align ?? 'left',
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

  drawTableHeader();

  if (rows.length === 0) {
    doc
      .fontSize(9)
      .fillColor('#64748b')
      .text(
        'No se encontraron registros con los filtros seleccionados.',
        startX,
        doc.y + 8,
      );
    return;
  }

  rows.forEach((row, rowIndex) => {
    ensureSpace();
    const y = doc.y;
    if (rowIndex % 2 === 1) {
      doc
        .rect(
          startX,
          y,
          columns.reduce((sum, c) => sum + c.width, 0),
          ROW_HEIGHT,
        )
        .fill('#f1f5f9');
      doc.fillColor('#0f172a');
    }
    let x = startX;
    doc.fontSize(8.5).fillColor('#1e293b');
    row.forEach((cell, columnIndex) => {
      const column = columns[columnIndex];
      doc.text(cell, x + 4, y + 5, {
        width: column.width - 8,
        align: column.align ?? 'left',
        lineBreak: false,
        ellipsis: true,
      });
      x += column.width;
    });
    doc.y = y + ROW_HEIGHT;
  });
}

function numberPages(doc: PDFKit.PDFDocument): void {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // pdfkit auto-inserts a fresh page for any `.text()` write whose y falls
    // past `page.height - page.margins.bottom` — even with an explicit
    // position — so a footer sitting *in* the bottom margin (by design)
    // would otherwise silently spawn a trailing blank page per document.
    // Zeroing the bottom margin just for this one write disables that
    // check; nothing else is drawn on the page afterward, so there's
    // nothing to restore it for.
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
