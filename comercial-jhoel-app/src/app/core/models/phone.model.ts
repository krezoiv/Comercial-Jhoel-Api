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

/** One individually-identified physical phone unit — mirrors the backend's `PhoneResponseDto` exactly. */
export interface Phone {
  id: string;
  operator: PhoneOperator;
  phoneNumber: string;
  imei: string;
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

export interface CreatePhoneInput {
  operator: PhoneOperator;
  phoneNumber: string;
  imei: string;
  costPrice: number;
  publicPrice: number;
  /** `yyyy-MM-dd`. */
  purchaseDate: string;
}

/** Mirrors the backend's `PhoneSaleResponseDto` — `profit`/`phoneCostPrice` are server-computed, never recomputed on the frontend. */
export interface PhoneSale {
  id: string;
  phoneId: string;
  phoneOperator: PhoneOperator;
  phoneNumber: string;
  phoneImei: string;
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

/** DPI photo (`dpiImage`) is optional — same real behavior as SIM sale, confirmed with the user rather than assumed from the literal spec. Sent as `multipart/form-data`, see `PhonesService.registerSale`. */
export interface RegisterPhoneSaleInput {
  phoneId: string;
  clientId: string | null;
  clientDpi: string;
  salePrice: number;
  /** `yyyy-MM-dd`. */
  saleDate: string;
  dpiImage: File | null;
}
