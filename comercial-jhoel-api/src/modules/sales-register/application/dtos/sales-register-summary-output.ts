export interface SalesRegisterProductOutput {
  productId: string;
  productName: string;
  sku: string | null;
  quantitySold: number;
  totalRevenue: number;
}

export interface SalesRegisterBusinessOutput {
  businessId: string;
  businessName: string;
  totalAmount: number;
  salesCount: number;
  productsCount: number;
  /** `null` when the business had no lines that day — never a fabricated "N/A" row upstream. */
  topProduct: { productName: string; quantitySold: number } | null;
  /** Already sorted by `totalRevenue` descending. */
  products: SalesRegisterProductOutput[];
}

export interface SalesRegisterSummaryOutput {
  /** `yyyy-MM-dd`, business day (`America/Guatemala`) this summary covers. */
  date: string;
  /** Straight from `sales` — never a sum over `businesses[].totalAmount` (both are guaranteed equal by construction, see the consistency test, but this is the authoritative source). */
  totalAmount: number;
  /** Distinct confirmed, non-voided sales — a sale spanning two businesses is still counted once here, unlike each business's own `salesCount`. */
  salesCount: number;
  /** Sum of every line's quantity across every business — a line always belongs to exactly one business, so this never double-counts. */
  productsCount: number;
  /** How many distinct businesses had at least one sale this day. */
  businessesActive: number;
  /** Already sorted by `totalAmount` descending. */
  businesses: SalesRegisterBusinessOutput[];
}
