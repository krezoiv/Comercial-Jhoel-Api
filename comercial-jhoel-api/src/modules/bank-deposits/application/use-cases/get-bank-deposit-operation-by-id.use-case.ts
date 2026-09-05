import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { BankDepositOperationNotFoundError } from '../../domain/errors/bank-deposit-operation-not-found.error';
import {
  BankDepositOperationOutput,
  toBankDepositOperationOutput,
} from '../dtos/bank-deposit-output';

@Injectable()
export class GetBankDepositOperationByIdUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(id: string): Promise<BankDepositOperationOutput> {
    const operation = await this.bankDepositRepository.findById(id);
    if (!operation) {
      throw new BankDepositOperationNotFoundError(id);
    }
    return toBankDepositOperationOutput(operation);
  }
}
