import { Phone, PhoneOperator } from '../entities/phone.entity';

export const PHONE_REPOSITORY = Symbol('PHONE_REPOSITORY');

export interface CreatePhoneData {
  operator: PhoneOperator;
  phoneNumber: string;
  imei: string;
  costPrice: number;
  publicPrice: number;
  purchaseDate: string;
  createdBy: string;
}

export interface PhoneRepository {
  findAll(): Promise<Phone[]>;
  findById(id: string): Promise<Phone | null>;
  /** IMEI is globally unique regardless of status — any existing row, voided history included, blocks a duplicate. */
  findByImei(imei: string): Promise<Phone | null>;
  /** Only a currently-`DISPONIBLE` phone blocks a duplicate number — see `UQ_phones_phone_number_available`'s own doc comment for why a sold unit's number can be reused. */
  findAvailableByPhoneNumber(phoneNumber: string): Promise<Phone | null>;
  create(data: CreatePhoneData): Promise<Phone>;
}
