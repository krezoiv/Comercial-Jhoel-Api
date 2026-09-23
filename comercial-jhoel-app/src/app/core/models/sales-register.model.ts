/** Mirrors `SalesRegisterProductOutput` — one product's totals within one negocio, for one business day. */
export interface SalesRegisterProduct {
  productId: string;
  productName: string;
  sku: string | null;
  quantitySold: number;
  totalRevenue: number;
}

/** Mirrors `SalesRegisterBusinessOutput` — one negocio's totals for one business day, plus its own product breakdown. */
export interface SalesRegisterBusiness {
  businessId: string;
  businessName: string;
  totalAmount: number;
  salesCount: number;
  productsCount: number;
  topProduct: { productName: string; quantitySold: number } | null;
  /** Already sorted by `totalRevenue` descending. */
  products: SalesRegisterProduct[];
}

/** `GET /sales-register/summary`'s response shape — "Gestión de Caja de Ventas". */
export interface SalesRegisterSummary {
  /** `yyyy-MM-dd` */
  date: string;
  totalAmount: number;
  salesCount: number;
  productsCount: number;
  businessesActive: number;
  /** Already sorted by `totalAmount` descending. */
  businesses: SalesRegisterBusiness[];
}
