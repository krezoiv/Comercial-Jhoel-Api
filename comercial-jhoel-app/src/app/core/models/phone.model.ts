export type PhoneOperator = 'CLARO' | 'TIGO';
export type PhoneStatus = 'DISPONIBLE' | 'VENDIDO';

export const PHONE_OPERATOR_LABEL: Record<PhoneOperator, string> = {
  CLARO: 'Claro',
  TIGO: 'Tigo',
};

export const PHONE_STATUS_LABEL: Record<PhoneStatus, string> = {
  DISPONIBLE: 'Disponible',
  VENDIDO: 'Vendido',
};

/**
 * One individually-identified physical phone unit — mirrors the backend's
 * `PhoneResponseDto` exactly. `phoneNumber` is `null` while `DISPONIBLE` — a
 * bought phone has no active line yet, it's only assigned at the moment of
 * sale (activation). `model`/`simNumber` are captured at purchase time.
 */
export interface Phone {
  id: string;
  operator: PhoneOperator;
  model: string;
  phoneNumber: string | null;
  imei: string;
  simNumber: string;
  costPrice: number;
  publicPrice: number;
  status: PhoneStatus;
  /** `yyyy-MM-dd`. */
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** No `phoneNumber` here — see `Phone`'s own doc comment. */
export interface CreatePhoneInput {
  operator: PhoneOperator;
  model: string;
  imei: string;
  simNumber: string;
  costPrice: number;
  publicPrice: number;
  /** `yyyy-MM-dd`. */
  purchaseDate: string;
}

/**
 * Mirrors the backend's `PhoneSaleResponseDto` — `profit`/`phoneCostPrice`/
 * `salePrice` are server-computed (always the phone's `publicPrice` at the
 * moment of sale), never recomputed or supplied by the frontend.
 * `phoneNumber` is the number assigned/activated at THIS specific sale,
 * frozen in `phone_sales` — independent of the phone's current live number
 * (e.g. after this sale is voided, `phone.phoneNumber` goes back to `null`
 * but this historical record keeps showing what it was).
 */
export interface PhoneSale {
  id: string;
  phoneId: string;
  phoneOperator: PhoneOperator;
  phoneModel: string;
  phoneNumber: string;
  phoneImei: string;
  phoneSimNumber: string;
  phoneCostPrice: number;
  clientId: string | null;
  clientName: string | null;
  clientDpi: string;
  salePrice: number;
  profit: number;
  /** `yyyy-MM-dd`. */
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

/**
 * DPI photo (`dpiImage`) is optional — same real behavior as SIM sale,
 * confirmed with the user rather than assumed from the literal spec. Sent as
 * `multipart/form-data`, see `PhonesService.registerSale`. No `salePrice` —
 * the backend always computes it from the phone's own `publicPrice`, never
 * from a caller-supplied value. `phoneNumber` is the number being
 * activated for this sale.
 */
export interface RegisterPhoneSaleInput {
  phoneId: string;
  clientId: string | null;
  clientDpi: string;
  phoneNumber: string;
  /** `yyyy-MM-dd`. */
  saleDate: string;
  dpiImage: File | null;
}
