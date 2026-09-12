import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import type { RechargeSimSaleRegistrationRepository } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import { SimSaleRegistrationNotFoundError } from '../../domain/errors/sim-sale-registration-not-found.error';

export interface RechargeSimSaleRegistrationDpiImage {
  data: Buffer;
  mimeType: string;
}

/**
 * The ONE place the DPI photo's bytes are ever read — always behind
 * `JwtAuthGuard` (see `RechargeSimsController`), never a public/static URL.
 * `NotFoundException` (not a generic 500) when the registration has no
 * image, so the frontend can show "sin imagen" instead of a broken `<img>`.
 */
@Injectable()
export class GetRechargeSimSaleRegistrationDpiImageUseCase {
  constructor(
    @Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RechargeSimSaleRegistrationRepository,
  ) {}

  async execute(registrationId: string): Promise<RechargeSimSaleRegistrationDpiImage> {
    const registration = await this.registrationRepository.findById(registrationId);
    if (!registration) {
      throw new SimSaleRegistrationNotFoundError(registrationId);
    }
    const image = await this.registrationRepository.getDpiImage(registrationId);
    if (!image) {
      throw new NotFoundException('Este registro de venta de SIM no tiene una imagen de DPI.');
    }
    return image;
  }
}
