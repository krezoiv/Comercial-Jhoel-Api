import { Inject, Injectable } from '@nestjs/common';
import { PHONE_REPOSITORY } from '../../domain/repositories/phone.repository';
import type { PhoneRepository } from '../../domain/repositories/phone.repository';
import { PhoneNotFoundError } from '../../domain/errors/phone-not-found.error';
import { PhoneOutput, toPhoneOutput } from '../dtos/phone-output';

@Injectable()
export class GetPhoneByIdUseCase {
  constructor(
    @Inject(PHONE_REPOSITORY)
    private readonly phoneRepository: PhoneRepository,
  ) {}

  async execute(id: string): Promise<PhoneOutput> {
    const phone = await this.phoneRepository.findById(id);
    if (!phone) {
      throw new PhoneNotFoundError(id);
    }
    return toPhoneOutput(phone);
  }
}
