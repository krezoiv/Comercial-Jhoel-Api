/**
 * `Date.prototype.toLocaleString` with no `timeZone` formats using the
 * *server process's* local timezone, not Guatemala's — harmless when the
 * API happens to run on a Guatemala-local host, but this project's Docker
 * setup runs the container on UTC (see this repo's own CLAUDE.md note on
 * the same class of bug in the Recargas sales-summary card), so a printed
 * "Generado el"/"Fecha" timestamp would otherwise be silently off by the
 * container's UTC offset from `America/Guatemala` (currently 6 hours, no
 * DST). Pinning `timeZone` here makes every PDF correct regardless of what
 * timezone the underlying server/container happens to run in. Originally
 * lived only in `report-pdf.builder.ts`; extracted here so every document
 * PDF (Venta, Compra, Ticket, Cotización) shares the exact same fix rather
 * than re-deriving it.
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('es-GT', {
    timeZone: 'America/Guatemala',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * The one money format every document PDF in this app uses — matches the
 * frontend's own `formatCurrency` exactly (`Q 1,234.56`, comma thousands
 * separator, always two decimals) and mirrors `reports/application/utils/
 * report-format.util.ts`'s own `formatReportCurrency` (kept there
 * unchanged, since that module's own PDF exports already use it and
 * touching it is out of scope here) — duplicated as a tiny, pure one-liner
 * rather than reaching into Reportería's application layer from Sales/
 * Purchases/Tickets/Cotizaciones, which would be a cross-module dependency
 * this codebase never takes (modules only depend on each other's exported
 * domain interfaces, never another feature's application utils).
 */
export function formatCurrency(amount: number): string {
  return `Q ${amount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function drawDivider(doc: PDFKit.PDFDocument): void {
  const y = doc.y;
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .strokeColor('#e2e8f0')
    .lineWidth(1)
    .stroke();
  doc.y = y + 6;
}

export interface PdfCompanyLetterhead {
  businessName: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  taxId?: string | null;
  logoBase64?: string | null;
}

const LOGO_SIZE = 36;

/**
 * Shared letterhead block reused by every document PDF (Venta, Compra,
 * Ticket, Cotización) — logo (if configured) + business name + whichever of
 * address/phone/email/NIT are actually present. A missing/empty/corrupt
 * logo must never break PDF generation, same defensive try/catch already
 * proven in `report-pdf.builder.ts`'s own `drawHeader` for its file-based
 * logo — this version decodes a base64 string instead of reading a file,
 * since company branding is admin-configurable data, not a bundled asset.
 */
export function drawCompanyLetterhead(
  doc: PDFKit.PDFDocument,
  company: PdfCompanyLetterhead,
): void {
  const startX = doc.page.margins.left;
  const startY = doc.y;
  const usableWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  let hasLogo = false;
  if (company.logoBase64) {
    try {
      const logoBuffer = Buffer.from(company.logoBase64, 'base64');
      doc.image(logoBuffer, startX, startY, {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
      });
      hasLogo = true;
    } catch {
      // ignore — fall back to text-only letterhead
    }
  }

  const textX = hasLogo ? startX + LOGO_SIZE + 10 : startX;
  const textWidth = usableWidth - (hasLogo ? LOGO_SIZE + 10 : 0);

  doc
    .fontSize(14)
    .fillColor('#0f172a')
    .text(company.businessName, textX, startY, {
      width: textWidth,
      align: 'left',
    });

  doc.fontSize(9).fillColor('#64748b');
  const detailLines = [
    company.address,
    company.phone ? `Tel: ${company.phone}` : null,
    company.email,
    company.taxId ? `NIT: ${company.taxId}` : null,
  ].filter((line): line is string => !!line);

  for (const line of detailLines) {
    doc.text(line, textX, doc.y + 2, { width: textWidth, align: 'left' });
  }

  doc.y = Math.max(doc.y, startY + LOGO_SIZE);
  doc.x = startX;
}
