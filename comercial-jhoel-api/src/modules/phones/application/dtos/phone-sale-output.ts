import { PhoneOperator } from '../../domain/entities/phone.entity';
import { PhoneSale } from '../../domain/entities/phone-sale.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. `profit` is derived (`salePrice - phoneCostPrice`), never stored, per the plan's explicit "never modify costPrice on sale" rule. */
export interface PhoneSaleOutput {
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
  saleDate: string;
  hasDpiImage: boolean;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
}

export function toPhoneSaleOutput(sale: PhoneSale): PhoneSaleOutput {
  return {
    id: sale.id,
    phoneId: sale.phoneId,
    phoneOperator: sale.phoneOperator,
    phoneModel: sale.phoneModel,
    phoneNumber: sale.phoneNumber,
    phoneImei: sale.phoneImei,
    phoneSimNumber: sale.phoneSimNumber,
    phoneCostPrice: sale.phoneCostPrice,
    clientId: sale.clientId,
    clientName: sale.clientName,
    clientDpi: sale.clientDpi,
    salePrice: sale.salePrice,
    profit: sale.salePrice - sale.phoneCostPrice,
    saleDate: sale.saleDate,
    hasDpiImage: sale.hasDpiImage,
    isVoided: sale.isVoided,
    voidedAt: sale.voidedAt,
    voidedBy: sale.voidedBy,
    voidedByUsername: sale.voidedByUsername,
    voidReason: sale.voidReason,
    createdBy: sale.createdBy,
    createdByUsername: sale.createdByUsername,
    createdAt: sale.createdAt,
  };
}
