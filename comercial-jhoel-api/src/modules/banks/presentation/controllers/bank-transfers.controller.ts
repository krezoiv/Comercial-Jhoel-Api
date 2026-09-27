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
import { BankTransferOutput } from '../../application/dtos/bank-movement-output';
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
 */
@UseGuards(JwtAuthGuard)
@Controller('bank-transfers')
export class BankTransfersController {
  constructor(
    private readonly registerBankTransferUseCase: RegisterBankTransferUseCase,
    private readonly voidBankTransferUseCase: VoidBankTransferUseCase,
    private readonly listBankTransfersUseCase: ListBankTransfersUseCase,
  ) {}

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
