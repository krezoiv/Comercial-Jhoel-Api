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
import { CreateAssetUseCase } from '../../application/use-cases/create-asset.use-case';
import { ListAssetsUseCase } from '../../application/use-cases/list-assets.use-case';
import { GetAssetByIdUseCase } from '../../application/use-cases/get-asset-by-id.use-case';
import { UpdateAssetUseCase } from '../../application/use-cases/update-asset.use-case';
import { DeactivateAssetUseCase } from '../../application/use-cases/deactivate-asset.use-case';
import { RegisterAssetChargeUseCase } from '../../application/use-cases/register-asset-charge.use-case';
import { RegisterAssetPaymentUseCase } from '../../application/use-cases/register-asset-payment.use-case';
import { GetAssetStatementUseCase } from '../../application/use-cases/get-asset-statement.use-case';
import { GetAssetCurrentBalanceUseCase } from '../../application/use-cases/get-asset-current-balance.use-case';
import { GetAssetActiveBalanceUseCase } from '../../application/use-cases/get-asset-active-balance.use-case';
import { CreateAssetRequestDto } from '../dtos/create-asset.request.dto';
import { UpdateAssetRequestDto } from '../dtos/update-asset.request.dto';
import { ListAssetsQueryDto } from '../dtos/list-assets.query.dto';
import { RegisterMovementRequestDto } from '../dtos/register-movement.request.dto';
import { GetStatementQueryDto } from '../dtos/get-statement.query.dto';
import {
  AssetResponseDto,
  PaginatedAssetsResponseDto,
} from '../dtos/asset.response.dto';
import {
  ActiveBalanceSummaryResponseDto,
  AssetStatementResponseDto,
  CurrentBalanceResponseDto,
} from '../dtos/statement.response.dto';

/** Create/update/deactivate are admin-only — same policy as Products/Clients. Any authenticated role can list/consult. */
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(
    private readonly createAssetUseCase: CreateAssetUseCase,
    private readonly listAssetsUseCase: ListAssetsUseCase,
    private readonly getAssetByIdUseCase: GetAssetByIdUseCase,
    private readonly updateAssetUseCase: UpdateAssetUseCase,
    private readonly deactivateAssetUseCase: DeactivateAssetUseCase,
    private readonly registerAssetChargeUseCase: RegisterAssetChargeUseCase,
    private readonly registerAssetPaymentUseCase: RegisterAssetPaymentUseCase,
    private readonly getAssetStatementUseCase: GetAssetStatementUseCase,
    private readonly getAssetCurrentBalanceUseCase: GetAssetCurrentBalanceUseCase,
    private readonly getAssetActiveBalanceUseCase: GetAssetActiveBalanceUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateAssetRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AssetResponseDto> {
    return this.createAssetUseCase.execute({ ...dto, createdBy: userId });
  }

  @Get()
  findAll(
    @Query() query: ListAssetsQueryDto,
  ): Promise<PaginatedAssetsResponseDto> {
    return this.listAssetsUseCase.execute(query);
  }

  /** Saldo total de cuentas activas — declared before `:id` so "summary" is never swallowed as a UUID param. Open to any authenticated role, same as `findAll`. */
  @Get('summary')
  getActiveBalanceSummary(): Promise<ActiveBalanceSummaryResponseDto> {
    return this.getAssetActiveBalanceUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AssetResponseDto> {
    return this.getAssetByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssetRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AssetResponseDto> {
    return this.updateAssetUseCase.execute(id, { ...dto, updatedBy: userId });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateAssetUseCase.execute(id);
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
  ): Promise<AssetResponseDto> {
    return this.registerAssetChargeUseCase.execute({
      clientId,
      ...dto,
      createdBy: userId,
    });
  }

  /** "Registrar Abono" — admin-only, same policy as `create()`. Unlike Cuentas por Cobrar, an amount exceeding the current balance is allowed (Activos' own long-standing capability — see the migration's own doc comment). */
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post(':clientId/payments')
  @HttpCode(HttpStatus.CREATED)
  registerPayment(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() dto: RegisterMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AssetResponseDto> {
    return this.registerAssetPaymentUseCase.execute({
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
  ): Promise<AssetStatementResponseDto> {
    return this.getAssetStatementUseCase.execute({ clientId, ...query });
  }

  /** Saldo actual — backs the client selector, open to any authenticated role. */
  @Get(':clientId/balance')
  getCurrentBalance(
    @Param('clientId', ParseUUIDPipe) clientId: string,
  ): Promise<CurrentBalanceResponseDto> {
    return this.getAssetCurrentBalanceUseCase.execute(clientId);
  }
}
