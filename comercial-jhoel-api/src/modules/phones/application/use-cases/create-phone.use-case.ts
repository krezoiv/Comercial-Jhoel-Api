import { Inject, Injectable } from '@nestjs/common';
import { PHONE_REPOSITORY } from '../../domain/repositories/phone.repository';
import type { PhoneRepository } from '../../domain/repositories/phone.repository';
import { PhoneOperator } from '../../domain/entities/phone.entity';
import { ImeiAlreadyExistsError } from '../../domain/errors/imei-already-exists.error';
import { PhoneNumberAlreadyExistsError } from '../../domain/errors/phone-number-already-exists.error';
import { PhoneOutput, toPhoneOutput } from '../dtos/phone-output';

export interface CreatePhoneInput {
  operator: PhoneOperator;
  phoneNumber: string;
  imei: string;
  costPrice: number;
  publicPrice: number;
  purchaseDate: string;
  userId: string;
}

/**
 * Compra/ingreso — creates one new phone unit, `status = 'DISPONIBLE'`.
 * Plain insert (no stored function needed — a single-row insert with two
 * UNIQUE constraints has no atomicity concern beyond what Postgres already
 * gives it for free), same shape as `CreateSupplierUseCase`. The pre-checks
 * here give a clean, specific error; `TypeOrmPhoneRepository`'s own
 * `translateUniqueViolation` is the race-condition safety net, same split
 * every other create-with-uniqueness use case in this codebase already uses.
 */
@Injectable()
export class CreatePhoneUseCase {
  constructor(
    @Inject(PHONE_REPOSITORY)
    private readonly phoneRepository: PhoneRepository,
  ) {}

  async execute(input: CreatePhoneInput): Promise<PhoneOutput> {
    const imei = input.imei.trim();
    const phoneNumber = input.phoneNumber.trim();

    const existingImei = await this.phoneRepository.findByImei(imei);
    if (existingImei) {
      throw new ImeiAlreadyExistsError(imei);
    }

    const existingPhoneNumber =
      await this.phoneRepository.findAvailableByPhoneNumber(phoneNumber);
    if (existingPhoneNumber) {
      throw new PhoneNumberAlreadyExistsError(phoneNumber);
    }

    const phone = await this.phoneRepository.create({
      operator: input.operator,
      phoneNumber,
      imei,
      costPrice: input.costPrice,
      publicPrice: input.publicPrice,
      purchaseDate: input.purchaseDate,
      createdBy: input.userId,
    });
    return toPhoneOutput(phone);
  }
}
