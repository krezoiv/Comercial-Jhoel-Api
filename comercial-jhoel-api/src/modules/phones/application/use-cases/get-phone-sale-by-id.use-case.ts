import { Inject, Injectable } from '@nestjs/common';
import { PHONE_SALE_REPOSITORY } from '../../domain/repositories/phone-sale.repository';
import type { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { PhoneSaleNotFoundError } from '../../domain/errors/phone-sale-not-found.error';
import { PhoneSaleOutput, toPhoneSaleOutput } from '../dtos/phone-sale-output';

@Injectable()
export class GetPhoneSaleByIdUseCase {
  constructor(
    @Inject(PHONE_SALE_REPOSITORY)
    private readonly phoneSaleRepository: PhoneSaleRepository,
  ) {}

  async execute(id: string): Promise<PhoneSaleOutput> {
    const sale = await this.phoneSaleRepository.findById(id);
    if (!sale) {
      throw new PhoneSaleNotFoundError(id);
    }
    return toPhoneSaleOutput(sale);
  }
}
