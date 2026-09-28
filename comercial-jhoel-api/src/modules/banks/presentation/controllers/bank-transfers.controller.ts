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
import { RegisterBankTransferUseCase } from '../../application/use-cases/register-bank-transfer.use-case';
import { VoidBankTransferUseCase } from '../../application/use-cases/void-bank-transfer.use-case';
import { ListBankTransfersUseCase } from '../../application/use-cases/list-bank-transfers.use-case';
import { RegisterBankBalanceCreditUseCase } from '../../application/use-cases/register-bank-balance-credit.use-case';
import { VoidBankBalanceCreditUseCase } from '../../application/use-cases/void-bank-balance-credit.use-case';
import { ListBankBalanceCreditsUseCase } from '../../application/use-cases/list-bank-balance-credits.use-case';
import {
  BankMovementOutput,
  BankTransferOutput,
  PaginatedBankMovementsOutput,
} from '../../application/dtos/bank-movement-output';
import {
  BankBalanceCreditsQueryDto,
  CreateBankBalanceCreditRequestDto,
  VoidBankBalanceCreditRequestDto,
} from '../dtos/bank-balance-credit.request.dto';
import {
  CreateBankTransferRequestDto,
  VoidBankTransferRequestDto,
} from '../dtos/bank-transfer.request.dto';
import { BankTransfersQueryDto } from '../dtos/bank-transfers.query.dto';

/**
 * Finanzas → Transferencias Bancarias. Registrar una transferencia es
 * operativo (cualquier cuenta autenticada, mismo criterio que
 * Transaccionar); anularla es de administración (`@Roles`), igual que
 * anular una operación de Transaccionar.
 *
 * "Acreditar saldo" (`/bank-transfers/balance-credits`) suma saldo a una
 * cuenta SIN contrapartida, así que las tres rutas son de administración:
 * `@Roles('ADMIN', 'SUPER_ADMIN')` en el backend, igual que "Ajustar saldo"
 * — ocultar el botón en Angular no es la protección.
 */
@UseGuards(JwtAuthGuard)
@Controller('bank-transfers')
export class BankTransfersController {
  constructor(
    private readonly registerBankTransferUseCase: RegisterBankTransferUseCase,
    private readonly voidBankTransferUseCase: VoidBankTransferUseCase,
    private readonly listBankTransfersUseCase: ListBankTransfersUseCase,
    private readonly registerBankBalanceCreditUseCase: RegisterBankBalanceCreditUseCase,
    private readonly voidBankBalanceCreditUseCase: VoidBankBalanceCreditUseCase,
    private readonly listBankBalanceCreditsUseCase: ListBankBalanceCreditsUseCase,
  ) {}

  @Post('balance-credits')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  createBalanceCredit(
    @Body() dto: CreateBankBalanceCreditRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankMovementOutput> {
    return this.registerBankBalanceCreditUseCase.execute({ ...dto, userId });
  }

  @Get('balance-credits')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  findBalanceCredits(
    @Query() query: BankBalanceCreditsQueryDto,
  ): Promise<PaginatedBankMovementsOutput> {
    return this.listBankBalanceCreditsUseCase.execute(query);
  }

  @Post('balance-credits/:operationId/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidBalanceCredit(
    @Param('operationId', ParseUUIDPipe) operationId: string,
    @Body() dto: VoidBankBalanceCreditRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankMovementOutput> {
    return this.voidBankBalanceCreditUseCase.execute({
      operationId,
      reason: dto.reason,
      userId,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateBankTransferRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankTransferOutput> {
    return this.registerBankTransferUseCase.execute({ ...dto, userId });
  }

  @Get()
  findAll(
    @Query() query: BankTransfersQueryDto,
  ): Promise<BankTransferOutput[]> {
    return this.listBankTransfersUseCase.execute(query);
  }

  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidTransfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidBankTransferRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankTransferOutput> {
    return this.voidBankTransferUseCase.execute({
      transferId: id,
      reason: dto.reason,
      userId,
    });
  }
}
