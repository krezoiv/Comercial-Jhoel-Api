import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateAccountReceivableUseCase } from '../../application/use-cases/create-account-receivable.use-case';
import { ListAccountsReceivableUseCase } from '../../application/use-cases/list-accounts-receivable.use-case';
import { GetAccountReceivableByIdUseCase } from '../../application/use-cases/get-account-receivable-by-id.use-case';
import { UpdateAccountReceivableUseCase } from '../../application/use-cases/update-account-receivable.use-case';
import { DeactivateAccountReceivableUseCase } from '../../application/use-cases/deactivate-account-receivable.use-case';
import { RegisterAccountReceivableChargeUseCase } from '../../application/use-cases/register-account-receivable-charge.use-case';
import { RegisterAccountReceivablePaymentUseCase } from '../../application/use-cases/register-account-receivable-payment.use-case';
import { GetAccountReceivableStatementUseCase } from '../../application/use-cases/get-account-receivable-statement.use-case';
import { GetAccountReceivableCurrentBalanceUseCase } from '../../application/use-cases/get-account-receivable-current-balance.use-case';
import { GetAccountReceivableActiveBalanceUseCase } from '../../application/use-cases/get-account-receivable-active-balance.use-case';
import { CreateAccountReceivableRequestDto } from '../dtos/create-account-receivable.request.dto';
import { UpdateAccountReceivableRequestDto } from '../dtos/update-account-receivable.request.dto';
import { ListAccountsReceivableQueryDto } from '../dtos/list-accounts-receivable.query.dto';
import { RegisterMovementRequestDto } from '../dtos/register-movement.request.dto';
import { GetStatementQueryDto } from '../dtos/get-statement.query.dto';
import {
  AccountReceivableResponseDto,
  PaginatedAccountsReceivableResponseDto,
} from '../dtos/account-receivable.response.dto';
import {
  AccountReceivableStatementResponseDto,
  ActiveBalanceSummaryResponseDto,
  CurrentBalanceResponseDto,
} from '../dtos/statement.response.dto';

/** Create/update/deactivate are admin-only — same policy as Products/Clients. Any authenticated role can list/consult. */
@UseGuards(JwtAuthGuard)
@Controller('accounts-receivable')
export class AccountsReceivableController {
  constructor(
    private readonly createAccountReceivableUseCase: CreateAccountReceivableUseCase,
    private readonly listAccountsReceivableUseCase: ListAccountsReceivableUseCase,
    private readonly getAccountReceivableByIdUseCase: GetAccountReceivableByIdUseCase,
    private readonly updateAccountReceivableUseCase: UpdateAccountReceivableUseCase,
    private readonly deactivateAccountReceivableUseCase: DeactivateAccountReceivableUseCase,
    private readonly registerAccountReceivableChargeUseCase: RegisterAccountReceivableChargeUseCase,
    private readonly registerAccountReceivablePaymentUseCase: RegisterAccountReceivablePaymentUseCase,
    private readonly getAccountReceivableStatementUseCase: GetAccountReceivableStatementUseCase,
    private readonly getAccountReceivableCurrentBalanceUseCase: GetAccountReceivableCurrentBalanceUseCase,
    private readonly getAccountReceivableActiveBalanceUseCase: GetAccountReceivableActiveBalanceUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateAccountReceivableRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AccountReceivableResponseDto> {
    return this.createAccountReceivableUseCase.execute({
      ...dto,
      createdBy: userId,
    });
  }

  @Get()
  findAll(
    @Query() query: ListAccountsReceivableQueryDto,
  ): Promise<PaginatedAccountsReceivableResponseDto> {
    return this.listAccountsReceivableUseCase.execute(query);
  }

  /** Saldo total de cuentas activas — declared before `:id` so "summary" is never swallowed as a UUID param. Open to any authenticated role, same as `findAll`. */
  @Get('summary')
  getActiveBalanceSummary(): Promise<ActiveBalanceSummaryResponseDto> {
    return this.getAccountReceivableActiveBalanceUseCase.execute();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccountReceivableResponseDto> {
    return this.getAccountReceivableByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountReceivableRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AccountReceivableResponseDto> {
    return this.updateAccountReceivableUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateAccountReceivableUseCase.execute(id);
  }

  /** "Registrar Cargo" — admin-only, same policy as `create()`. */
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post(':clientId/charges')
  @HttpCode(HttpStatus.CREATED)
  registerCharge(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() dto: RegisterMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AccountReceivableResponseDto> {
    return this.registerAccountReceivableChargeUseCase.execute({
      clientId,
      ...dto,
      createdBy: userId,
    });
  }

  /** "Registrar Abono" — admin-only, same policy as `create()`. Rejects an amount exceeding the client's current balance (`AbonoExceedsBalanceError`, 400). */
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post(':clientId/payments')
  @HttpCode(HttpStatus.CREATED)
  registerPayment(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() dto: RegisterMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AccountReceivableResponseDto> {
    return this.registerAccountReceivablePaymentUseCase.execute({
      clientId,
      ...dto,
      createdBy: userId,
    });
  }

  /** Estado de cuenta — open to any authenticated role, same as `findAll`/`findOne`. */
  @Get(':clientId/statement')
  getStatement(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Query() query: GetStatementQueryDto,
  ): Promise<AccountReceivableStatementResponseDto> {
    return this.getAccountReceivableStatementUseCase.execute({
      clientId,
      ...query,
    });
  }

  /** Saldo actual — backs the client selector, open to any authenticated role. */
  @Get(':clientId/balance')
  getCurrentBalance(
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ): Promise<CurrentBalanceResponseDto> {
    return this.getAccountReceivableCurrentBalanceUseCase.execute(clientId);
  }
}
