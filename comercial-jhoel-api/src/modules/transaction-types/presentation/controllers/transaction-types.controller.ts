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
import { CreateTransactionTypeUseCase } from '../../application/use-cases/create-transaction-type.use-case';
import { ListTransactionTypesUseCase } from '../../application/use-cases/list-transaction-types.use-case';
import { GetTransactionTypeByIdUseCase } from '../../application/use-cases/get-transaction-type-by-id.use-case';
import { UpdateTransactionTypeUseCase } from '../../application/use-cases/update-transaction-type.use-case';
import { DeactivateTransactionTypeUseCase } from '../../application/use-cases/deactivate-transaction-type.use-case';
import { CreateTransactionTypeRequestDto } from '../dtos/create-transaction-type.request.dto';
import { UpdateTransactionTypeRequestDto } from '../dtos/update-transaction-type.request.dto';
import { ListTransactionTypesQueryDto } from '../dtos/list-transaction-types.query.dto';
import { TransactionTypeResponseDto } from '../dtos/transaction-type.response.dto';

/** CRUD is admin-only (create/update/deactivate) — same policy as AccountTypesController/CategoriesController. A USER can still read the list (needed for the Transaccionar form's tipo de transacción dropdown). */
@UseGuards(JwtAuthGuard)
@Controller('transaction-types')
export class TransactionTypesController {
  constructor(
    private readonly createTransactionTypeUseCase: CreateTransactionTypeUseCase,
    private readonly listTransactionTypesUseCase: ListTransactionTypesUseCase,
    private readonly getTransactionTypeByIdUseCase: GetTransactionTypeByIdUseCase,
    private readonly updateTransactionTypeUseCase: UpdateTransactionTypeUseCase,
    private readonly deactivateTransactionTypeUseCase: DeactivateTransactionTypeUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateTransactionTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TransactionTypeResponseDto> {
    return this.createTransactionTypeUseCase.execute({
      ...dto,
      createdBy: userId,
    });
  }

  @Get()
  findAll(
    @Query() query: ListTransactionTypesQueryDto,
  ): Promise<TransactionTypeResponseDto[]> {
    return this.listTransactionTypesUseCase.execute(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionTypeResponseDto> {
    return this.getTransactionTypeByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TransactionTypeResponseDto> {
    return this.updateTransactionTypeUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateTransactionTypeUseCase.execute(id);
  }
}
