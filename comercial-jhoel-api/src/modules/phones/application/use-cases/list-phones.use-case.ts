import { Inject, Injectable } from '@nestjs/common';
import { PHONE_REPOSITORY } from '../../domain/repositories/phone.repository';
import type { PhoneRepository } from '../../domain/repositories/phone.repository';
import { PhoneOutput, toPhoneOutput } from '../dtos/phone-output';

/** Returns the full inventory — filtering (operadora/estado/fecha/búsqueda) is client-side, same pattern as Categorías/Negocios/Proveedores, per the plan's own scope decision (no volume yet that justifies server-side filtering). */
@Injectable()
export class ListPhonesUseCase {
  constructor(
    @Inject(PHONE_REPOSITORY)
    private readonly phoneRepository: PhoneRepository,
  ) {}

  async execute(): Promise<PhoneOutput[]> {
    const phones = await this.phoneRepository.findAll();
    return phones.map(toPhoneOutput);
  }
}
