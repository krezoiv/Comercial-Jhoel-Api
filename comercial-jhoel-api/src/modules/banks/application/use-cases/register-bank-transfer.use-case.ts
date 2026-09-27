import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { BankTransferOutput } from '../dtos/bank-movement-output';
import { todayIsoDate } from '../utils/today-iso-date';
import { BankTransferDestinationRequiredError } from '../../domain/errors/bank-movement.errors';
import { assertBankOperationDayOpen } from './assert-bank-operation-day-open';

export interface RegisterBankTransferInput {
  sourceBankId: string;
  destinationBankId?: string | null;
  /** Retiro de efectivo en banco: sin destino, solo sale del origen. */
  cashWithdrawal?: boolean;
  amount: number;
  referenceText?: string | null;
  concept?: string | null;
  userId: string;
}

/**
 * "Transferencias Bancarias" — traslada saldo entre dos cuentas propias.
 * Toda regla de negocio (monto > 0, saldo suficiente en origen, BI Club solo
 * desde Banco Industrial y con límite configurable, BI Club como origen solo
 * hacia Banco Industrial, Districol solo desde Banco Agromercantil, retiro
 * de efectivo sin destino) vive en `register_bank_transfer`, bajo el lock de
 * ambas filas: este caso de uso no pre-valida saldos en TypeScript, porque
 * eso solo abriría una ventana de carrera (TOCTOU) — mismo criterio que
 * `RegisterAssetPaymentUseCase`. La fecha de negocio es siempre "hoy" en
 * la zona del servidor (America/Guatemala), igual que Transaccionar.
 */
@Injectable()
export class RegisterBankTransferUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
  ) {}

  async execute(input: RegisterBankTransferInput): Promise<BankTransferOutput> {
    const businessDate = todayIsoDate();
    await assertBankOperationDayOpen(this.dayOpeningRepository, businessDate);

    // Exactamente uno: una cuenta destino, o el retiro de efectivo en banco.
    const cashWithdrawal = input.cashWithdrawal === true;
    const destinationBankId = cashWithdrawal
      ? null
      : (input.destinationBankId ?? null);
    if (!cashWithdrawal && !destinationBankId) {
      throw new BankTransferDestinationRequiredError();
    }

    const transferId = await this.bankMovementRepository.registerTransfer({
      sourceBankId: input.sourceBankId,
      destinationBankId,
      amount: input.amount,
      businessDate,
      userId: input.userId,
      referenceText: input.referenceText?.trim() || null,
      concept: input.concept?.trim() || null,
    });

    const transfer =
      await this.bankMovementRepository.findTransferById(transferId);
    if (!transfer) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la transferencia recién registrada.',
      );
    }
    return transfer;
  }
}
