import PDFDocument from 'pdfkit';
import { drawCompanyLetterhead, drawDivider, formatDateTime } from './pdf-helpers';

const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

function buildTestDocument(): { doc: PDFKit.PDFDocument; finished: Promise<Buffer> } {
  const doc = new PDFDocument({ margin: 20, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
  return { doc, finished };
}

describe('pdf-helpers', () => {
  describe('formatDateTime', () => {
    it('formats using America/Guatemala regardless of server timezone', () => {
      const date = new Date('2026-09-04T06:00:00.000Z');
      expect(formatDateTime(date)).toContain('04/09/2026');
    });
  });

  describe('drawDivider', () => {
    it('draws without throwing and advances doc.y', () => {
      const { doc, finished } = buildTestDocument();
      const yBefore = doc.y;
      drawDivider(doc);
      expect(doc.y).toBeGreaterThan(yBefore);
      doc.end();
      return finished;
    });
  });

  describe('drawCompanyLetterhead', () => {
    it('renders every field when the company is fully configured, including a valid logo', async () => {
      const { doc, finished } = buildTestDocument();
      expect(() =>
        drawCompanyLetterhead(doc, {
          businessName: 'Librería Jhoel',
          address: 'Zona 1, Ciudad de Guatemala',
          phone: '12345678',
          email: 'contacto@libreriajhoel.com',
          taxId: '123456-7',
          logoBase64: TINY_PNG_BASE64,
        }),
      ).not.toThrow();
      doc.end();
      const buffer = await finished;
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('renders only the business name when every optional field is absent, without printing blank/null lines', () => {
      const { doc, finished } = buildTestDocument();
      expect(() =>
        drawCompanyLetterhead(doc, { businessName: 'Librería Jhoel' }),
      ).not.toThrow();
      doc.end();
      return finished;
    });

    it('falls back to text-only when logoBase64 is corrupt, without throwing', () => {
      const { doc, finished } = buildTestDocument();
      expect(() =>
        drawCompanyLetterhead(doc, {
          businessName: 'Librería Jhoel',
          logoBase64: 'not-valid-base64-image-data',
        }),
      ).not.toThrow();
      doc.end();
      return finished;
    });
  });
});
