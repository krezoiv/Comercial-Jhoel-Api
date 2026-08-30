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
import { CreateAccountReceivableRequestDto } from '../dtos/create-account-receivable.request.dto';
import { UpdateAccountReceivableRequestDto } from '../dtos/update-account-receivable.request.dto';
import { ListAccountsReceivableQueryDto } from '../dtos/list-accounts-receivable.query.dto';
import {
  AccountReceivableResponseDto,
  PaginatedAccountsReceivableResponseDto,
} from '../dtos/account-receivable.response.dto';

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
}
