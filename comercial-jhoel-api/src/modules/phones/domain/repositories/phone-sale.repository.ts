import { PhoneSale } from '../entities/phone-sale.entity';

export const PHONE_SALE_REPOSITORY = Symbol('PHONE_SALE_REPOSITORY');

export interface RegisterPhoneSaleDpiImage {
  data: Buffer;
  mimeType: string;
  sizeBytes: number;
}

export interface RegisterPhoneSaleData {
  phoneId: string;
  clientId: string | null;
  clientDpi: string;
  salePrice: number;
  saleDate: string;
  dpiImage: RegisterPhoneSaleDpiImage | null;
  createdBy: string;
}

export interface DpiImage {
  data: Buffer;
  mimeType: string;
}

export interface PhoneSaleRepository {
  /** Invokes `register_phone_sale` — validates the phone/client server-side and inserts the sale (and its DPI image, if any) atomically. */
  create(data: RegisterPhoneSaleData): Promise<PhoneSale>;
  findById(id: string): Promise<PhoneSale | null>;
  findAll(): Promise<PhoneSale[]>;
  /** Invokes `void_phone_sale` — restores the phone to `DISPONIBLE`, atomically. */
  voidSale(id: string, voidedBy: string, reason: string): Promise<PhoneSale>;
  /** `null` if the sale has no image, or the image row is somehow missing (should never happen given the FK — defensive only). */
  getDpiImage(saleId: string): Promise<DpiImage | null>;
}
