import { PhoneOperator, PhoneStatus } from '../../domain/entities/phone.entity';

export class PhoneResponseDto {
  id: string;
  operator: PhoneOperator;
  phoneNumber: string;
  imei: string;
  costPrice: number;
  publicPrice: number;
  status: PhoneStatus;
  purchaseDate: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
