import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type {
  BankDepositRepository,
  RegisterBankDepositOperationData,
} from '../../domain/repositories/bank-deposit.repository';
import { DAY_OPENING_REPOSITORY } from '../../../banks/domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { TRANSACTION_TYPE_REPOSITORY } from '../../../transaction-types/domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../../transaction-types/domain/repositories/transaction-type.repository';
import { RegisterAccountReceivableChargeUseCase } from '../../../accounts-receivable/application/use-cases/register-account-receivable-charge.use-case';
import { TRANSACTION_MANAGER } from '../../../../shared/application/ports/transaction-manager.port';
import type { TransactionManager } from '../../../../shared/application/ports/transaction-manager.port';
import { BankDepositDayNotOpenedError } from '../../domain/errors/bank-deposit-day-not-opened.error';
import { BankDepositDayAlreadyClosedError } from '../../domain/errors/bank-deposit-day-already-closed.error';
import { InvalidBankDepositClientError } from '../../domain/errors/invalid-bank-deposit-client.error';
import {
  BankDepositAccountsReceivableForbiddenError,
  BankDepositAccountsReceivableRequiresClientError,
  BankDepositAccountsReceivableWrongTypeError,
} from '../../domain/errors/bank-deposit-accounts-receivable.error';
import {
  BankDepositOperationOutput,
  toBankDepositOperationOutput,
} from '../dtos/bank-deposit-output';
import { todayIsoDate } from '../utils/today-iso-date';

/**
 * Same accepted-hardcoded-name pattern `GetRechargeSalesSummaryUseCase`
 * already established for `KNOWN_RECHARGE_TYPE_NAMES` — `transaction_types`
 * stays a fully normalized, admin-managed catalog everywhere else; this is
 * the one spot that needs to recognize "this is really a depósito" as a
 * business rule (never trusting the frontend to only show the "Enviar a
 * cuentas por cobrar" checkbox for the right type).
 */
const DEPOSIT_TRANSACTION_TYPE_NAME = 'Depósito';

export interface RegisterBankDepositOperationCashDetailInput {
  denomination: number;
  quantity: number;
}

export interface RegisterBankDepositOperationInput {
  transactionBankId: string;
  transactionTypeId: string;
  totalAmount: number;
  cashDetails: RegisterBankDepositOperationCashDetailInput[];
  transactionAmounts: number[];
  userId: string;
  clientName?: string | null;
  /** A REGISTERED client — re-validated (exists + active) here regardless of what the frontend already checked; independent of `sendToAccountsReceivable` (a deposit can link a registered client without also generating a cargo). */
  clientId?: string | null;
  /** "Enviar a cuentas por cobrar" — requires `clientId`, requires the resolved transaction type to actually be "Depósito", and requires `isAdmin` (same rule `POST /accounts-receivable/:clientId/charges` already enforces — see `BankDepositAccountsReceivableForbiddenError`). */
  sendToAccountsReceivable?: boolean;
  isAdmin: boolean;
  /** "Vuelto" — omitted/`0` means no vuelto. `register_bank_deposit_operation` recomputes/validates this against the actual cash total server-side regardless of what's sent here. */
  changeGiven?: number;
}

/**
 * Registers one "Transaccionar" deposit. Reuses Banks' own día-abierto/cerrado
 * cycle (`DAY_OPENING_REPOSITORY`, exported by `BanksModule`) instead of a
 * parallel one — the ticket explicitly asks to reuse the existing mechanism,
 * and a closed day blocks this the same way it blocks Cuadre de Agentes.
 * The actual cuadre validation (cash total / transactions total must both
 * equal the total amount exactly) happens inside `register_bank_deposit_operation`
 * itself — this use case never trusts or recomputes those totals, it only
 * gates on the business-day cycle before delegating.
 * Operation date is always "today" (server-local) — no backdating in v1.
 *
 * **"Enviar a cuentas por cobrar" (follow-up)**: when `sendToAccountsReceivable`
 * is true, this use case also registers a Cuentas por Cobrar CARGO for the
 * same client and amount, reusing `RegisterAccountReceivableChargeUseCase`
 * exactly as-is (client exists+active validation, description
 * normalization, the actual `register_account_receivable_movement` call) —
 * no duplicated validation or SQL. Both writes run inside one shared DB
 * transaction via `TransactionManager.runInTransaction`: if the CARGO
 * fails for any reason, the deposit itself rolls back too, never left
 * half-registered. When the checkbox is off (the default, and every other
 * transaction type), nothing about this flow changes from before —
 * `registerOperation` is called with no transaction context, exactly as it
 * always was.
 */
@Injectable()
export class RegisterBankDepositOperationUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
    private readonly registerAccountReceivableChargeUseCase: RegisterAccountReceivableChargeUseCase,
  ) {}

  async execute(
    input: RegisterBankDepositOperationInput,
  ): Promise<BankDepositOperationOutput> {
    const operationDate = todayIsoDate();

    const dayOpening =
      await this.dayOpeningRepository.findByDate(operationDate);
    if (!dayOpening) {
      throw new BankDepositDayNotOpenedError(operationDate);
    }
    if (dayOpening.isClosed) {
      throw new BankDepositDayAlreadyClosedError(operationDate);
    }

    const sendToAccountsReceivable = input.sendToAccountsReceivable ?? false;

    // A registered client is independent of the checkbox — resolved and
    // validated whenever one was sent, so `clientName` reflects the real
    // client's name for display even if the CxC cargo isn't requested.
    let clientId: string | null = null;
    let clientName = input.clientName ?? null;
    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      if (!client || !client.isActive) {
        throw new InvalidBankDepositClientError();
      }
      clientId = client.id;
      clientName = client.name;
    }

    if (sendToAccountsReceivable) {
      if (!clientId) {
        throw new BankDepositAccountsReceivableRequiresClientError();
      }
      if (!input.isAdmin) {
        throw new BankDepositAccountsReceivableForbiddenError();
      }
      const transactionType = await this.transactionTypeRepository.findById(
        input.transactionTypeId,
      );
      if (
        !transactionType ||
        transactionType.name.trim() !== DEPOSIT_TRANSACTION_TYPE_NAME
      ) {
        throw new BankDepositAccountsReceivableWrongTypeError();
      }
    }

    const depositData: RegisterBankDepositOperationData = {
      transactionBankId: input.transactionBankId,
      transactionTypeId: input.transactionTypeId,
      totalAmount: input.totalAmount,
      operationDate,
      cashDetails: input.cashDetails,
      transactionAmounts: input.transactionAmounts,
      userId: input.userId,
      clientName,
      clientId,
      changeGiven: input.changeGiven ?? 0,
    };

    if (!sendToAccountsReceivable) {
      const operation =
        await this.bankDepositRepository.registerOperation(depositData);
      return toBankDepositOperationOutput(operation);
    }

    const operation = await this.transactionManager.runInTransaction(
      async (context) => {
        const registeredOperation =
          await this.bankDepositRepository.registerOperation(
            depositData,
            context,
          );

        await this.registerAccountReceivableChargeUseCase.execute({
          clientId: clientId as string,
          amount: input.totalAmount,
          date: operationDate,
          description: `Depósito Transaccionar — ${registeredOperation.transactionBankName}`,
          createdBy: input.userId,
          referenceType: 'BANK_DEPOSIT',
          referenceId: registeredOperation.id,
          context,
        });

        return registeredOperation;
      },
    );

    return toBankDepositOperationOutput(operation);
  }
}
