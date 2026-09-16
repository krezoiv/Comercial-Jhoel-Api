import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PHONE_SALE_REPOSITORY } from '../../domain/repositories/phone-sale.repository';
import type { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { PhoneSaleNotFoundError } from '../../domain/errors/phone-sale-not-found.error';

export interface PhoneSaleDpiImage {
  data: Buffer;
  mimeType: string;
}

/**
 * The ONE place a phone sale's DPI photo bytes are ever read — always
 * behind `JwtAuthGuard` (see `PhoneSalesController`), never a public/static
 * URL. `NotFoundException` (not a generic 500) when the sale has no image
 * — expected here since the photo is optional, same as SIM's own
 * equivalent use case.
 */
@Injectable()
export class GetPhoneSaleDpiImageUseCase {
  constructor(
    @Inject(PHONE_SALE_REPOSITORY)
    private readonly phoneSaleRepository: PhoneSaleRepository,
  ) {}

  async execute(saleId: string): Promise<PhoneSaleDpiImage> {
    const sale = await this.phoneSaleRepository.findById(saleId);
    if (!sale) {
      throw new PhoneSaleNotFoundError(saleId);
    }
    const image = await this.phoneSaleRepository.getDpiImage(saleId);
    if (!image) {
      throw new NotFoundException(
        'Esta venta no tiene una imagen de DPI adjunta.',
      );
    }
    return image;
  }
}
