import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotVisibleError } from '../../domain/errors/catalog-bank-not-visible.error';

export interface CatalogBankImageBytesOutput {
  data: Buffer;
  mimeType: string;
}

/** Único endpoint que sirve los bytes — reutilizado tanto por la landing pública como por la vista previa/miniaturas del admin (misma URL, sin necesidad de una ruta admin separada, igual que Teléfonos/Librería/Variedades/Noticias). */
@Injectable()
export class GetCatalogBankImageUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(id: string): Promise<CatalogBankImageBytesOutput> {
    const image = await this.catalogBankRepository.getImage(id);
    if (!image) {
      throw new CatalogBankNotVisibleError();
    }
    return image;
  }
}
