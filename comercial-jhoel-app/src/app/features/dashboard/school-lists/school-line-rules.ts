import { SchoolLineSource, roundMoney } from '../../../core/models';

/**
 * Rules of the editable lines of a school-list quotation, kept out of the
 * components so the editor and the "Cambiar producto" modal share one
 * implementation (and the unit tests exercise it directly). Everything here is
 * pure: functions receive the current lines and return a new array.
 *
 * These are client-side previews: the backend validates every line again when
 * the quotation is saved, and inventory only moves through that save
 * (`school_quotation_sync_inventory`, by difference) — changing a product in
 * the editor never touches stock by itself.
 */

/** One editable line of the quotation being built. */
export interface EditorLine {
  key: string;
  itemId: string | null;
  templateItemId: string | null;
  productId: string | null;
  productName: string;
  /** SKU of the inventory product (null for free-text lines). */
  sku: string | null;
  /** Real category of the inventory product (null for free-text lines). */
  categoryId: string | null;
  categoryName: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  observations: string;
  source: SchoolLineSource;
  /** Price the line came with (template, product or saved line); null for free-text lines. */
  referencePrice: number | null;
}

/** Inventory product chosen to replace a line (shape of the catalog result). */
export interface SwapProduct {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  publicPrice: number;
}

/** What the user confirmed in the "Cambiar producto" modal. */
export interface SwapRequest {
  product: SwapProduct;
  /** Units for the line (defaults to the original line's quantity). */
  quantity: number;
  /** Unit price (the product's price unless the role may override it). */
  unitPrice: number;
}

export const MAX_LINE_QUANTITY = 9999;

/** Line subtotal: quantity × price − discount, rounded to cents. */
export function lineSubtotal(line: Pick<EditorLine, 'quantity' | 'unitPrice' | 'discount'>): number {
  return roundMoney((line.quantity || 0) * (line.unitPrice || 0) - (line.discount || 0));
}

/** Client-side echo of the backend line rules; null when the line is valid. */
export function lineError(line: EditorLine): string | null {
  if (line.productName.trim().length < 2) {
    return 'Escriba el nombre del producto.';
  }
  if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_LINE_QUANTITY) {
    return 'La cantidad debe ser un entero entre 1 y 9,999.';
  }
  if (!(line.unitPrice >= 0) || roundMoney(line.unitPrice) !== line.unitPrice) {
    return 'Precio no válido.';
  }
  if (!(line.discount >= 0) || line.discount > line.quantity * line.unitPrice) {
    return 'El descuento no puede superar el subtotal.';
  }
  return null;
}

/**
 * Another line that already holds `productId` (the line being changed is
 * ignored). Used to warn before a swap would duplicate a product.
 *
 * @param lines current lines
 * @param productId product about to be placed
 * @param exceptKey key of the line being changed
 * @returns the existing line, or null when the product is not in the list yet
 */
export function findDuplicateLine(lines: readonly EditorLine[], productId: string, exceptKey: string): EditorLine | null {
  return lines.find((line) => line.key !== exceptKey && line.productId === productId) ?? null;
}

/**
 * Replaces the product of one line. The line keeps its key, position and
 * observation; it becomes an INVENTARIO line of the chosen product with the
 * confirmed quantity and price, and loses its link to the saved row/template
 * (it is a different product now). The discount resets because it belonged
 * to the previous price.
 *
 * @returns the new lines, or the same array if the key does not exist
 */
export function swapLineProduct(lines: readonly EditorLine[], key: string, request: SwapRequest): EditorLine[] {
  if (!lines.some((line) => line.key === key)) {
    return [...lines];
  }
  const { product } = request;
  return lines.map((line) =>
    line.key !== key
      ? line
      : {
          ...line,
          itemId: null,
          templateItemId: null,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          description: '',
          quantity: clampQuantity(request.quantity),
          unitPrice: roundMoney(request.unitPrice),
          discount: 0,
          source: 'INVENTARIO',
          referencePrice: product.publicPrice,
        },
  );
}

/**
 * Consolidation rule for a duplicate: the line being changed is removed and
 * its units are added to the line that already holds the product (which keeps
 * its own price, discount and observation). Quantity is capped at 9,999.
 *
 * @param sourceKey line being changed (removed)
 * @param targetKey line that already has the product (receives the units)
 * @param quantity units to add
 */
export function consolidateLines(
  lines: readonly EditorLine[],
  sourceKey: string,
  targetKey: string,
  quantity: number,
): EditorLine[] {
  if (sourceKey === targetKey || !lines.some((l) => l.key === targetKey)) {
    return [...lines];
  }
  return lines
    .filter((line) => line.key !== sourceKey)
    .map((line) => (line.key === targetKey ? { ...line, quantity: clampQuantity(line.quantity + quantity) } : line));
}

function clampQuantity(quantity: number): number {
  return Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.trunc(quantity || 0)));
}
