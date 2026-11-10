import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  GetAccountReceivableSettlementUseCase,
  GetChargePaymentHistoryUseCase,
  GetClientPendingChargesUseCase,
  ListAccountReceivableSettlementsUseCase,
  PreviewAccountReceivableSettlementUseCase,
  SettleAccountsReceivableUseCase,
  VoidAccountReceivableSettlementUseCase,
} from '../../application/use-cases/account-receivable-settlement.use-cases';
import {
  ListSettlementsQueryDto,
  PreviewSettlementRequestDto,
  SettleAccountsReceivableRequestDto,
  VoidSettlementRequestDto,
} from '../dtos/account-receivable-settlement.request.dto';

/**
 * Cuentas por Cobrar → "Cancelar cuenta(s)" (cash or bank deposit, one or
 * several accounts of the same client) and its payment history. Its own base
 * path so no route can be swallowed by `GET /accounts-receivable/:id`.
 * Reads: any authenticated account (same as the list/statement). Collect and
 * void: ADMIN/SUPER_ADMIN — the same policy as "Registrar Abono"; the use
 * cases re-check the role.
 */
@UseGuards(JwtAuthGuard)
@Controller('account-receivable-payments')
export class AccountReceivablePaymentsController {
  constructor(
    private readonly getPendingUseCase: GetClientPendingChargesUseCase,
    private readonly previewUseCase: PreviewAccountReceivableSettlementUseCase,
    private readonly settleUseCase: SettleAccountsReceivableUseCase,
    private readonly voidUseCase: VoidAccountReceivableSettlementUseCase,
    private readonly listUseCase: ListAccountReceivableSettlementsUseCase,
    private readonly getUseCase: GetAccountReceivableSettlementUseCase,
    private readonly chargeHistoryUseCase: GetChargePaymentHistoryUseCase,
  ) {}

  @Get()
  list(@Query() query: ListSettlementsQueryDto) {
    return this.listUseCase.execute(query);
  }

  @Get('clients/:clientId/pending')
  pending(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.getPendingUseCase.execute(clientId);
  }

  @Get('charges/:chargeId')
  chargeHistory(@Param('chargeId', ParseUUIDPipe) chargeId: string) {
    return this.chargeHistoryUseCase.execute(chargeId);
  }

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  preview(@Body() dto: PreviewSettlementRequestDto) {
    return this.previewUseCase.execute(dto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  settle(
    @Body() dto: SettleAccountsReceivableRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.settleUseCase.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getUseCase.execute(id);
  }

  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  void(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidSettlementRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidUseCase.execute({
      id,
      reason: dto.reason,
      userId: user.userId,
      role: user.role,
    });
  }
}
