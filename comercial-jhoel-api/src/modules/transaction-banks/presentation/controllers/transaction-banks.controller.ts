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
import { CreateTransactionBankUseCase } from '../../application/use-cases/create-transaction-bank.use-case';
import { ListTransactionBanksUseCase } from '../../application/use-cases/list-transaction-banks.use-case';
import { GetTransactionBankByIdUseCase } from '../../application/use-cases/get-transaction-bank-by-id.use-case';
import { UpdateTransactionBankUseCase } from '../../application/use-cases/update-transaction-bank.use-case';
import { DeactivateTransactionBankUseCase } from '../../application/use-cases/deactivate-transaction-bank.use-case';
import { CreateTransactionBankRequestDto } from '../dtos/create-transaction-bank.request.dto';
import { UpdateTransactionBankRequestDto } from '../dtos/update-transaction-bank.request.dto';
import { ListTransactionBanksQueryDto } from '../dtos/list-transaction-banks.query.dto';
import { TransactionBankResponseDto } from '../dtos/transaction-bank.response.dto';

/** CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController. A USER can still read the list (needed for the Transaccionar form's banco agente dropdown). */
@UseGuards(JwtAuthGuard)
@Controller('transaction-banks')
export class TransactionBanksController {
  constructor(
    private readonly createTransactionBankUseCase: CreateTransactionBankUseCase,
    private readonly listTransactionBanksUseCase: ListTransactionBanksUseCase,
    private readonly getTransactionBankByIdUseCase: GetTransactionBankByIdUseCase,
    private readonly updateTransactionBankUseCase: UpdateTransactionBankUseCase,
    private readonly deactivateTransactionBankUseCase: DeactivateTransactionBankUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateTransactionBankRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TransactionBankResponseDto> {
    return this.createTransactionBankUseCase.execute({
      ...dto,
      createdBy: userId,
    });
  }

  @Get()
  findAll(
    @Query() query: ListTransactionBanksQueryDto,
  ): Promise<TransactionBankResponseDto[]> {
    return this.listTransactionBanksUseCase.execute(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionBankResponseDto> {
    return this.getTransactionBankByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionBankRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TransactionBankResponseDto> {
    return this.updateTransactionBankUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateTransactionBankUseCase.execute(id);
  }
}
