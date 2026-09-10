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
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateSaleUseCase } from '../../application/use-cases/create-sale.use-case';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { GetSaleByIdUseCase } from '../../application/use-cases/get-sale-by-id.use-case';
import { AdjustSaleItemUseCase } from '../../application/use-cases/adjust-sale-item.use-case';
import { GetOpenSalesUseCase } from '../../application/use-cases/get-open-sales.use-case';
import { ConfirmOpenSaleUseCase } from '../../application/use-cases/confirm-open-sale.use-case';
import { CancelOpenSaleUseCase } from '../../application/use-cases/cancel-open-sale.use-case';
import { ConfigureSalePricingUseCase } from '../../application/use-cases/configure-sale-pricing.use-case';
import { GetSalePdfUseCase } from '../../application/use-cases/get-sale-pdf.use-case';
import { VoidSaleUseCase } from '../../application/use-cases/void-sale.use-case';
import { CreateSaleRequestDto } from '../dtos/create-sale.request.dto';
import { ListSalesQueryDto } from '../dtos/list-sales.query.dto';
import { AdjustSaleItemRequestDto } from '../dtos/adjust-sale-item.request.dto';
import { ConfigureSalePricingRequestDto } from '../dtos/configure-sale-pricing.request.dto';
import { ConfirmOpenSaleRequestDto } from '../dtos/confirm-open-sale.request.dto';
import { CancelOpenSaleQueryDto } from '../dtos/cancel-open-sale.query.dto';
import { VoidSaleRequestDto } from '../dtos/void-sale.request.dto';
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
    private readonly getOpenSalesUseCase: GetOpenSalesUseCase,
    private readonly confirmOpenSaleUseCase: ConfirmOpenSaleUseCase,
    private readonly cancelOpenSaleUseCase: CancelOpenSaleUseCase,
    private readonly configureSalePricingUseCase: ConfigureSalePricingUseCase,
    private readonly getSalePdfUseCase: GetSalePdfUseCase,
    private readonly voidSaleUseCase: VoidSaleUseCase,
  ) {}

  /** Bulk, one-shot sale creation — unchanged, still fully atomic via `confirm_sale`. Independent of the incremental draft flow below. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<SaleResponseDto> {
    return this.createSaleUseCase.execute({
      userId,
      items: dto.items,
      clientId: dto.clientId,
      priceList: dto.priceList,
      invoiceNumber: dto.invoiceNumber,
    });
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

  /**
   * "Anular venta" — admin-only correction path for the "Administrar
   * Facturas de Ventas" module. Only ever targets a `CONFIRMED` sale — an
   * `OPEN` draft has its own correction mechanism (`DELETE /sales/current`).
   * Never an edit, never a physical delete — see `VoidSaleUseCase`'s own
   * doc comment.
   */
  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  voidSale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<SaleResponseDto> {
    return this.voidSaleUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
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

  /** Every one of the caller's in-progress receipts (one per open tab) — lets the frontend restore all of them after a reload/navigation. An empty array means no open tabs, not an error. */
  @Get('current')
  getCurrent(
    @CurrentUser('userId') userId: string,
  ): Promise<SaleResponseDto[]> {
    return this.getOpenSalesUseCase.execute(userId);
  }

  /** Sets/updates one open receipt's client and price list — call once per tab, before or while that tab's cart is empty. Rejects a price-list change once that receipt has line items. */
  @Patch('current/pricing')
  configurePricing(
    @Body() dto: ConfigureSalePricingRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<SaleResponseDto> {
    return this.configureSalePricingUseCase.execute({
      userId,
      clientId: dto.clientId ?? null,
      priceList: dto.priceList,
      draftKey: dto.draftKey,
    });
  }

  /** "Guardar venta" — stock is already reserved; this just marks the targeted tab's receipt CONFIRMED. */
  @Post('confirm')
  confirm(
    @Body() dto: ConfirmOpenSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<SaleResponseDto> {
    return this.confirmOpenSaleUseCase.execute(
      userId,
      dto.draftKey,
      dto.invoiceNumber,
    );
  }

  /** Discards one tab's receipt and restores every reserved line's stock. */
  @Delete('current')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelCurrent(
    @Query() query: CancelOpenSaleQueryDto,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.cancelOpenSaleUseCase.execute(userId, query.draftKey);
  }

  /**
   * Reconstructs the sale's receipt PDF purely from already-persisted data —
   * never re-runs `confirm_open_sale`. Declared before `:id` so it isn't
   * swallowed by that route's `ParseUUIDPipe` matching on `id`, matching
   * this controller's existing route-ordering discipline.
   */
  @Get(':id/pdf')
  async getPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.getSalePdfUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="venta-${id.slice(0, 8)}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
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
