import { PhoneOperator } from '../../domain/entities/phone.entity';

export class PhoneSaleResponseDto {
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
