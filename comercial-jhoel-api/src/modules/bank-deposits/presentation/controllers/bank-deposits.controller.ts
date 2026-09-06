import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { RegisterBankDepositOperationUseCase } from '../../application/use-cases/register-bank-deposit-operation.use-case';
import { GetBankDepositOperationByIdUseCase } from '../../application/use-cases/get-bank-deposit-operation-by-id.use-case';
import { VoidBankDepositOperationUseCase } from '../../application/use-cases/void-bank-deposit-operation.use-case';
import { GetBankDepositMonthlyCountUseCase } from '../../application/use-cases/get-bank-deposit-monthly-count.use-case';
import { GetBankDepositTransactionSummaryUseCase } from '../../application/use-cases/get-bank-deposit-transaction-summary.use-case';
import { CreateBankDepositRequestDto } from '../dtos/create-bank-deposit.request.dto';
import { VoidBankDepositOperationRequestDto } from '../dtos/void-bank-deposit-operation.request.dto';
import { BankDepositOperationResponseDto } from '../dtos/bank-deposit.response.dto';
import { BankDepositMonthlyCountResponseDto } from '../dtos/bank-deposit-monthly-count.response.dto';
import { BankDepositTransactionSummaryResponseDto } from '../dtos/bank-deposit-transaction-summary.response.dto';

/**
 * No class-level `@Roles(...)` — registering a Transaccionar deposit is an
 * operational action for whoever runs the register, same policy as
 * Sales/Purchases/Recargas. `JwtAuthGuard` (any authenticated, active
 * account) is the only gate on `create`/`findOne`/`monthlyCount`. Reading
 * the full filterable/by-bank report is a separate, admin-only concern —
 * see `BankDepositsReportController` under `/reports/bank-deposits`;
 * `monthlyCount` deliberately only ever returns one plain number (backs the
 * Resumen dashboard's "Bancos" tile, visible to every authenticated
 * account), never that report's own breakdown. `void` is the one route on
 * this controller that IS admin-gated (`@Roles`) — see
 * `VoidBankDepositOperationUseCase`'s own doc comment for why correcting an
 * already-registered operation is a management action, not an operational
 * one.
 */
@UseGuards(JwtAuthGuard)
@Controller('bank-deposits')
export class BankDepositsController {
  constructor(
    private readonly registerBankDepositOperationUseCase: RegisterBankDepositOperationUseCase,
    private readonly getBankDepositOperationByIdUseCase: GetBankDepositOperationByIdUseCase,
    private readonly voidBankDepositOperationUseCase: VoidBankDepositOperationUseCase,
    private readonly getBankDepositMonthlyCountUseCase: GetBankDepositMonthlyCountUseCase,
    private readonly getBankDepositTransactionSummaryUseCase: GetBankDepositTransactionSummaryUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateBankDepositRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankDepositOperationResponseDto> {
    return this.registerBankDepositOperationUseCase.execute({
      transactionBankId: dto.transactionBankId,
      transactionTypeId: dto.transactionTypeId,
      totalAmount: dto.totalAmount,
      cashDetails: dto.cashDetails,
      transactionAmounts: dto.transactionAmounts,
      userId,
      clientName: dto.clientName ?? null,
      changeGiven: dto.changeGiven ?? 0,
    });
  }

  /** Backs the "Bancos" Resumen tile — must be declared before `:id` or Express would swallow "monthly-count" as that param. */
  @Get('monthly-count')
  monthlyCount(): Promise<BankDepositMonthlyCountResponseDto> {
    return this.getBankDepositMonthlyCountUseCase.execute();
  }

  /** Backs Transaccionar's "Resumen Diario"/"Resumen del Mes en Curso" cards and the Resumen dashboard's "Resumen Diario de Transacciones" section — same reasoning as `monthly-count` above, must be declared before `:id`. Open to any authenticated account, same policy as the rest of this controller (excluding `void`). */
  @Get('summary')
  transactionSummary(): Promise<BankDepositTransactionSummaryResponseDto> {
    return this.getBankDepositTransactionSummaryUseCase.execute();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BankDepositOperationResponseDto> {
    return this.getBankDepositOperationByIdUseCase.execute(id);
  }

  /** Anular — never a physical delete/edit, see `VoidBankDepositOperationUseCase`. */
  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidOperation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidBankDepositOperationRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankDepositOperationResponseDto> {
    return this.voidBankDepositOperationUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }
}
