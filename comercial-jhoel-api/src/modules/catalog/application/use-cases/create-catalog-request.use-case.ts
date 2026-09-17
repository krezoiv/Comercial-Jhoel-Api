import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CATALOG_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-request.repository';
import type { CatalogRequestRepository } from '../../domain/repositories/catalog-request.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { CatalogPhoneNotPublishedError } from '../../domain/errors/catalog-phone-not-published.error';
import { CatalogRequestCreditNotAvailableError } from '../../domain/errors/catalog-request-credit-not-available.error';
import { CatalogRequestType } from '../../domain/entities/catalog-request.entity';
import { isKrediyaCreditAvailable } from '../utils/is-krediya-credit-available';
import {
  CatalogRequestOutput,
  toCatalogRequestOutput,
} from '../dtos/catalog-request-output';

export interface CreateCatalogRequestInput {
  catalogPhoneId: string;
  requestType: CatalogRequestType;
  customerName: string;
  customerPhone: string;
}

/**
 * The most sensitive use case in this module — the public, unauthenticated
 * entry point for "Lo quiero" / "Comprar a crédito con Krediya". Never
 * trusts anything about the phone (price, brand, model, credit
 * eligibility) from the request body — the DTO doesn't even have those
 * fields (see `CreateCatalogRequestRequestDto`, `forbidNonWhitelisted`
 * rejects any attempt to smuggle them in). Everything commercial is
 * re-read from the real `CatalogPhone` row and `company_settings` at the
 * moment of creation, exactly per "el backend debe recalcular la
 * disponibilidad según el precio real" — a manipulated `creditAvailable`
 * claim from the client has literally nowhere to go.
 */
@Injectable()
export class CreateCatalogRequestUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(CATALOG_REQUEST_REPOSITORY)
    private readonly catalogRequestRepository: CatalogRequestRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(
    input: CreateCatalogRequestInput,
  ): Promise<CatalogRequestOutput> {
    const [phone, settings] = await Promise.all([
      this.catalogPhoneRepository.findById(input.catalogPhoneId),
      this.companySettingsRepository.get(),
    ]);

    if (!phone || !phone.isPublished || !phone.isActive) {
      throw new CatalogPhoneNotPublishedError();
    }

    const creditAvailable = isKrediyaCreditAvailable(
      phone.price,
      settings.krediyaMinAmount,
    );

    if (input.requestType === 'INTERES_CREDITO' && !creditAvailable) {
      throw new CatalogRequestCreditNotAvailableError();
    }

    const request = await this.catalogRequestRepository.create({
      catalogPhoneId: phone.id,
      brand: phone.brand,
      model: phone.model,
      price: phone.price,
      creditAvailable,
      requestType: input.requestType,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
    });

    return toCatalogRequestOutput(request);
  }
}
