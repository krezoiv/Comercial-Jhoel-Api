import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotFoundError } from '../../domain/errors/catalog-bank-not-found.error';
import { assertValidCatalogBankImage, UploadedCatalogBankImage } from '../utils/assert-valid-catalog-bank-image';

export interface SetCatalogBankImageInput {
  catalogBankId: string;
  image: UploadedCatalogBankImage;
  userId: string;
}

@Injectable()
export class SetCatalogBankImageUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(input: SetCatalogBankImageInput): Promise<void> {
    const bank = await this.catalogBankRepository.findById(input.catalogBankId);
    if (!bank) {
      throw new CatalogBankNotFoundError(input.catalogBankId);
    }
    assertValidCatalogBankImage(input.image);
    await this.catalogBankRepository.setImage(
      input.catalogBankId,
      { data: input.image.buffer, mimeType: input.image.mimetype, sizeBytes: input.image.size },
      input.userId,
    );
  }
}
