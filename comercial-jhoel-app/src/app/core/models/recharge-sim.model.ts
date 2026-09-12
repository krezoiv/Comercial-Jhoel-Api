/** SIM Claro / SIM Tigo — physical, stock-tracked products administered exclusively from Recargas Electrónicas. Fully separate from `RechargeType` (electronic balance) — never mix the two. */
export interface SimType {
  id: string;
  name: string;
  costPrice: number;
  publicPrice: number;
  isActive: boolean;
}

/**
 * One SIM type's stock row for a given day. `purchasedQuantity`/`soldQuantity`
 * (and their totals) are real, backend-computed sums of that day's
 * movements — informational, never derivable from `previousStock`/
 * `currentStock` alone, since a purchase and a sale on the same day both
 * move `currentStock` in opposite directions.
 */
export interface SimDailyStock {
  id: string;
  simTypeId: string;
  simTypeName: string;
  date: string;
  previousStock: number;
  purchasedQuantity: number;
  purchasedTotal: number;
  soldQuantity: number;
  soldTotal: number;
  currentStock: number;
  createdByUsername: string;
  updatedByUsername: string | null;
}

export interface RegisterSimPurchaseInput {
  simTypeId: string;
  quantity: number;
  /** `yyyy-MM-dd` — the operation-date picker's current value, not necessarily today. */
  operationDate: string;
}

export interface RegisterSimSaleInput {
  simTypeId: string;
  quantity: number;
  operationDate: string;
}

/**
 * "Venta de SIM con registro de identidad" — deliberately separate from the
 * by-quantity `RegisterSimSaleInput` above (still fully in use, no DPI
 * capture): always exactly one physical SIM, with an optional client link
 * and an optional DPI photo. See `RechargeSimsService.registerSaleRegistration`
 * for why this travels as `FormData`, not JSON.
 */
export interface RegisterSimSaleRegistrationInput {
  simTypeId: string;
  simNumber: string;
  sku: string;
  clientDpi: string;
  clientId: string | null;
  salePrice: number;
  operationDate: string;
  dpiImage: File | null;
}

export interface ListSimSaleRegistrationsFilters {
  startDate?: string;
  endDate?: string;
  simTypeId?: string;
  isVoided?: boolean;
  page?: number;
  limit?: number;
}

/** One physical SIM sold with identity capture — void-only, same "anular con motivo, nunca editar/borrar" rule as Compras/Ventas/Depósitos. `hasDpiImage` only says whether a photo exists; the bytes themselves are only ever fetched via `RechargeSimsService.getDpiImageUrl()`, never embedded here. */
export interface SimSaleRegistration {
  id: string;
  rechargeSimSaleId: string;
  simTypeId: string;
  simTypeName: string;
  simNumber: string;
  sku: string;
  clientDpi: string;
  clientId: string | null;
  clientName: string | null;
  salePrice: number;
  saleDate: string;
  hasDpiImage: boolean;
  isVoided: boolean;
  voidedAt: string | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
}

export interface PaginatedSimSaleRegistrations {
  items: SimSaleRegistration[];
  total: number;
  page: number;
  limit: number;
}
