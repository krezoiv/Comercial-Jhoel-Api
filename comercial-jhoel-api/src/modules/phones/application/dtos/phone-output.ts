import {
  Phone,
  PhoneOperator,
  PhoneStatus,
} from '../../domain/entities/phone.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface PhoneOutput {
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

export function toPhoneOutput(phone: Phone): PhoneOutput {
  return {
    id: phone.id,
    operator: phone.operator,
    phoneNumber: phone.phoneNumber,
    imei: phone.imei,
    costPrice: phone.costPrice,
    publicPrice: phone.publicPrice,
    status: phone.status,
    purchaseDate: phone.purchaseDate,
    createdAt: phone.createdAt,
    updatedAt: phone.updatedAt,
    createdBy: phone.createdBy,
    createdByUsername: phone.createdByUsername,
    updatedBy: phone.updatedBy,
    updatedByUsername: phone.updatedByUsername,
  };
}
