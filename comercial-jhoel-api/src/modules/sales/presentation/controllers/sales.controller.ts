import {
  Body,
  Controller,
  Delete,
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
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateSaleUseCase } from '../../application/use-cases/create-sale.use-case';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { GetSaleByIdUseCase } from '../../application/use-cases/get-sale-by-id.use-case';
import { AdjustSaleItemUseCase } from '../../application/use-cases/adjust-sale-item.use-case';
import { GetOpenSaleUseCase } from '../../application/use-cases/get-open-sale.use-case';
import { ConfirmOpenSaleUseCase } from '../../application/use-cases/confirm-open-sale.use-case';
import { CancelOpenSaleUseCase } from '../../application/use-cases/cancel-open-sale.use-case';
import { CreateSaleRequestDto } from '../dtos/create-sale.request.dto';
import { ListSalesQueryDto } from '../dtos/list-sales.query.dto';
import { AdjustSaleItemRequestDto } from '../dtos/adjust-sale-item.request.dto';
import {
  PaginatedSalesResponseDto,
  SaleResponseDto,
} from '../dtos/sale.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * No `@Roles(...)` restriction on this controller — registering a sale is an
 * operational action for whoever runs the register (typically a USER-role
 * cashier), not an admin-only one. This mirrors how the Inventory screen is
 * readable by every authenticated role: `JwtAuthGuard` (any authenticated,
 * active account) is the only gate. `ListSalesUseCase`/`GetSaleByIdUseCase`
 * still restrict *which* sales a non-admin can see (only their own) — that's
 * enforced in the use case, not here.
 *
 * Route order matters: `current` must be declared before `:id`, or Nest
 * would match `GET /sales/current` as `GET /sales/:id` with `id="current"`
 * (which then fails UUID validation instead of hitting the intended handler).
 */
@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly listSalesUseCase: ListSalesUseCase,
    private readonly getSaleByIdUseCase: GetSaleByIdUseCase,
    private readonly adjustSaleItemUseCase: AdjustSaleItemUseCase,
    private readonly getOpenSaleUseCase: GetOpenSaleUseCase,
    private readonly confirmOpenSaleUseCase: ConfirmOpenSaleUseCase,
    private readonly cancelOpenSaleUseCase: CancelOpenSaleUseCase,
  ) {}

  /** Bulk, one-shot sale creation — unchanged, still fully atomic via `confirm_sale`. Independent of the incremental draft flow below. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<SaleResponseDto> {
    return this.createSaleUseCase.execute({ userId, items: dto.items });
  }

  @Get()
  findAll(
    @Query() query: ListSalesQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedSalesResponseDto> {
    return this.listSalesUseCase.execute({
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
      ...query,
    });
  }

  /** Reserves/releases stock against the caller's own open receipt in real time — one call per cart action. */
  @Post('items')
  adjustItem(
    @Body() dto: AdjustSaleItemRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<SaleResponseDto> {
    return this.adjustSaleItemUseCase.execute({ userId, ...dto });
  }

  /** The caller's in-progress receipt, if any — lets the frontend restore it after a reload/navigation. */
  @Get('current')
  getCurrent(@CurrentUser('userId') userId: string): Promise<SaleResponseDto> {
    return this.getOpenSaleUseCase.execute(userId);
  }

  /** "Guardar venta" — stock is already reserved; this just marks the receipt CONFIRMED. */
  @Post('confirm')
  confirm(@CurrentUser('userId') userId: string): Promise<SaleResponseDto> {
    return this.confirmOpenSaleUseCase.execute(userId);
  }

  /** Discards the receipt and restores every reserved line's stock. */
  @Delete('current')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelCurrent(@CurrentUser('userId') userId: string): Promise<void> {
    return this.cancelOpenSaleUseCase.execute(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<SaleResponseDto> {
    return this.getSaleByIdUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }
}
