import { Inject, Injectable } from '@nestjs/common';
import { PHONE_SALE_REPOSITORY } from '../../domain/repositories/phone-sale.repository';
import type { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { PhoneSaleOutput, toPhoneSaleOutput } from '../dtos/phone-sale-output';

/** Historial de ventas — full list (never hides a voided sale, only excludes it from client-computed aggregates, same convention as every other void-capable listing in this codebase). */
@Injectable()
export class ListPhoneSalesUseCase {
  constructor(
    @Inject(PHONE_SALE_REPOSITORY)
    private readonly phoneSaleRepository: PhoneSaleRepository,
  ) {}

  async execute(): Promise<PhoneSaleOutput[]> {
    const sales = await this.phoneSaleRepository.findAll();
    return sales.map(toPhoneSaleOutput);
  }
}
