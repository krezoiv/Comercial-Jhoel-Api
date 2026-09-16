import { Inject, Injectable } from '@nestjs/common';
import { PHONE_SALE_REPOSITORY } from '../../domain/repositories/phone-sale.repository';
import type { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { InvalidPhoneSaleClientError } from '../../domain/errors/invalid-phone-sale-client.error';
import {
  assertValidDpiImage,
  UploadedDpiImage,
} from '../utils/assert-valid-dpi-image';
import { PhoneSaleOutput, toPhoneSaleOutput } from '../dtos/phone-sale-output';

export interface RegisterPhoneSaleInput {
  phoneId: string;
  clientId: string | null;
  clientDpi: string;
  /** The línea being activated — never a price. `register_phone_sale` always computes `salePrice` itself from `phones.public_price`. */
  phoneNumber: string;
  saleDate: string;
  userId: string;
  dpiImage: UploadedDpiImage | null;
}

/**
 * Venta — registers the sale (activation) of one `DISPONIBLE` phone. The
 * client is validated here via `ClientsModule`'s own exported
 * `CLIENT_REPOSITORY` (the clean route that module's own doc comment
 * invites), rather than SIM's raw-SQL-across-module-boundary check —
 * `register_phone_sale` still re-validates it server-side too (defense in
 * depth, never trusts this TypeScript check alone). The phone-availability
 * check, the sale price (always `phones.public_price`, never client-
 * supplied), and the actual state transition all happen atomically inside
 * `register_phone_sale` (see the migration's own doc comment) — nothing
 * here duplicates that.
 */
@Injectable()
export class RegisterPhoneSaleUseCase {
  constructor(
    @Inject(PHONE_SALE_REPOSITORY)
    private readonly phoneSaleRepository: PhoneSaleRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: RegisterPhoneSaleInput): Promise<PhoneSaleOutput> {
    if (input.dpiImage) {
      assertValidDpiImage(input.dpiImage);
    }

    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      if (!client || !client.isActive) {
        throw new InvalidPhoneSaleClientError();
      }
    }

    const sale = await this.phoneSaleRepository.create({
      phoneId: input.phoneId,
      clientId: input.clientId,
      clientDpi: input.clientDpi,
      phoneNumber: input.phoneNumber,
      saleDate: input.saleDate,
      dpiImage: input.dpiImage
        ? {
            data: input.dpiImage.buffer,
            mimeType: input.dpiImage.mimetype,
            sizeBytes: input.dpiImage.size,
          }
        : null,
      createdBy: input.userId,
    });
    return toPhoneSaleOutput(sale);
  }
}
