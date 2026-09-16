import { Inject, Injectable } from '@nestjs/common';
import { PHONE_SALE_REPOSITORY } from '../../domain/repositories/phone-sale.repository';
import type { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { PhoneSaleOutput, toPhoneSaleOutput } from '../dtos/phone-sale-output';

export interface VoidPhoneSaleInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/** Anular — never a physical delete/edit. `void_phone_sale` restores the phone to `DISPONIBLE` atomically (see the migration's own doc comment). Admin-only, enforced at the controller (`@Roles`), same policy as every other void action in this codebase. */
@Injectable()
export class VoidPhoneSaleUseCase {
  constructor(
    @Inject(PHONE_SALE_REPOSITORY)
    private readonly phoneSaleRepository: PhoneSaleRepository,
  ) {}

  async execute(input: VoidPhoneSaleInput): Promise<PhoneSaleOutput> {
    const sale = await this.phoneSaleRepository.voidSale(
      input.id,
      input.voidedBy,
      input.reason,
    );
    return toPhoneSaleOutput(sale);
  }
}
