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
import { CreateAccountTypeUseCase } from '../../application/use-cases/create-account-type.use-case';
import { ListAccountTypesUseCase } from '../../application/use-cases/list-account-types.use-case';
import { GetAccountTypeByIdUseCase } from '../../application/use-cases/get-account-type-by-id.use-case';
import { UpdateAccountTypeUseCase } from '../../application/use-cases/update-account-type.use-case';
import { DeactivateAccountTypeUseCase } from '../../application/use-cases/deactivate-account-type.use-case';
import { CreateAccountTypeRequestDto } from '../dtos/create-account-type.request.dto';
import { UpdateAccountTypeRequestDto } from '../dtos/update-account-type.request.dto';
import { ListAccountTypesQueryDto } from '../dtos/list-account-types.query.dto';
import { AccountTypeResponseDto } from '../dtos/account-type.response.dto';

/** CRUD is admin-only (create/update/deactivate) — same policy as CategoriesController. A USER can still read the list (needed for the Bancos form's dropdown). */
@UseGuards(JwtAuthGuard)
@Controller('account-types')
export class AccountTypesController {
  constructor(
    private readonly createAccountTypeUseCase: CreateAccountTypeUseCase,
    private readonly listAccountTypesUseCase: ListAccountTypesUseCase,
    private readonly getAccountTypeByIdUseCase: GetAccountTypeByIdUseCase,
    private readonly updateAccountTypeUseCase: UpdateAccountTypeUseCase,
    private readonly deactivateAccountTypeUseCase: DeactivateAccountTypeUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateAccountTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AccountTypeResponseDto> {
    return this.createAccountTypeUseCase.execute({ ...dto, createdBy: userId });
  }

  @Get()
  findAll(
    @Query() query: ListAccountTypesQueryDto,
  ): Promise<AccountTypeResponseDto[]> {
    return this.listAccountTypesUseCase.execute(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccountTypeResponseDto> {
    return this.getAccountTypeByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AccountTypeResponseDto> {
    return this.updateAccountTypeUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateAccountTypeUseCase.execute(id);
  }
}
