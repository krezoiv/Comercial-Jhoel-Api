import { Phone, PhoneOperator } from '../entities/phone.entity';

export const PHONE_REPOSITORY = Symbol('PHONE_REPOSITORY');

export interface CreatePhoneData {
  operator: PhoneOperator;
  model: string;
  imei: string;
  simNumber: string;
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
  /** SIM is globally unique regardless of status, same reasoning as `findByImei` — a physical SIM should never repeat. */
  findBySimNumber(simNumber: string): Promise<Phone | null>;
  create(data: CreatePhoneData): Promise<Phone>;
}
