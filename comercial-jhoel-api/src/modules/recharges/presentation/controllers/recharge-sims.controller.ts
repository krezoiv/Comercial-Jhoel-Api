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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListRechargeSimTypesUseCase } from '../../application/use-cases/list-recharge-sim-types.use-case';
import { GetRechargeSimDailySummaryUseCase } from '../../application/use-cases/get-recharge-sim-daily-summary.use-case';
import { RegisterRechargeSimPurchaseUseCase } from '../../application/use-cases/register-recharge-sim-purchase.use-case';
import { RegisterRechargeSimSaleUseCase } from '../../application/use-cases/register-recharge-sim-sale.use-case';
import { RegisterRechargeSimSaleWithRegistrationUseCase } from '../../application/use-cases/register-recharge-sim-sale-with-registration.use-case';
import { VoidRechargeSimSaleRegistrationUseCase } from '../../application/use-cases/void-recharge-sim-sale-registration.use-case';
import { GetRechargeSimSaleRegistrationByIdUseCase } from '../../application/use-cases/get-recharge-sim-sale-registration-by-id.use-case';
import { ListRechargeSimSaleRegistrationsUseCase } from '../../application/use-cases/list-recharge-sim-sale-registrations.use-case';
import { GetRechargeSimSaleRegistrationDpiImageUseCase } from '../../application/use-cases/get-recharge-sim-sale-registration-dpi-image.use-case';
import { ListRechargeSimSalesUseCase } from '../../application/use-cases/list-recharge-sim-sales.use-case';
import { VoidRechargeSimSaleUseCase } from '../../application/use-cases/void-recharge-sim-sale.use-case';
import { RechargeSimDailyQueryDto } from '../dtos/recharge-sim-daily.query.dto';
import { RegisterRechargeSimPurchaseRequestDto } from '../dtos/register-recharge-sim-purchase.request.dto';
import { RegisterRechargeSimSaleRequestDto } from '../dtos/register-recharge-sim-sale.request.dto';
import { RegisterRechargeSimSaleRegistrationRequestDto } from '../dtos/register-recharge-sim-sale-registration.request.dto';
import { VoidRechargeSimSaleRegistrationRequestDto } from '../dtos/void-recharge-sim-sale-registration.request.dto';
import { ListRechargeSimSaleRegistrationsQueryDto } from '../dtos/list-recharge-sim-sale-registrations.query.dto';
import { RechargeSimSalesQueryDto } from '../dtos/recharge-sim-sales.query.dto';
import { VoidRechargeSimSaleRequestDto } from '../dtos/void-recharge-sim-sale.request.dto';
import { RechargeSimTypeOutput } from '../../application/dtos/recharge-sim-type-output';
import { RechargeSimDailyStockOutput } from '../../application/dtos/recharge-sim-daily-stock-output';
import { RechargeSimSaleOutput } from '../../application/dtos/recharge-sim-sale-output';
import {
  PaginatedRechargeSimSaleRegistrationsResponseDto,
  RechargeSimSaleRegistrationResponseDto,
} from '../dtos/recharge-sim-sale-registration.response.dto';
import { todayIsoDate } from '../../application/utils/today-iso-date';

/** The minimal shape actually read off an uploaded file — same "avoid a `@types/multer` dependency for one field" reasoning as `ProductsController`'s own `UploadedExcelFile`. */
interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * SIM Claro/SIM Tigo — physical, stock-tracked products administered
 * EXCLUSIVELY from Recargas Electrónicas (see the migration's own doc
 * comment for why they're not part of `modules/products/`). A new,
 * separate controller (not added to `RechargesController`) so the existing
 * controller/routes are untouched by this ticket.
 *
 * No `@Roles(...)` — same "any authenticated active account" operational
 * policy as the rest of Recargas (registering a purchase/sale is a daily
 * register task, not admin-only), matching `RechargesController` and
 * Heladería's own purchase/sale controllers.
 */
@UseGuards(JwtAuthGuard)
@Controller('recharges/sims')
export class RechargeSimsController {
  constructor(
    private readonly listRechargeSimTypesUseCase: ListRechargeSimTypesUseCase,
    private readonly getRechargeSimDailySummaryUseCase: GetRechargeSimDailySummaryUseCase,
    private readonly registerRechargeSimPurchaseUseCase: RegisterRechargeSimPurchaseUseCase,
    private readonly registerRechargeSimSaleUseCase: RegisterRechargeSimSaleUseCase,
    private readonly registerRechargeSimSaleWithRegistrationUseCase: RegisterRechargeSimSaleWithRegistrationUseCase,
    private readonly voidRechargeSimSaleRegistrationUseCase: VoidRechargeSimSaleRegistrationUseCase,
    private readonly getRechargeSimSaleRegistrationByIdUseCase: GetRechargeSimSaleRegistrationByIdUseCase,
    private readonly listRechargeSimSaleRegistrationsUseCase: ListRechargeSimSaleRegistrationsUseCase,
    private readonly getRechargeSimSaleRegistrationDpiImageUseCase: GetRechargeSimSaleRegistrationDpiImageUseCase,
    private readonly listRechargeSimSalesUseCase: ListRechargeSimSalesUseCase,
    private readonly voidRechargeSimSaleUseCase: VoidRechargeSimSaleUseCase,
  ) {}

  @Get('types')
  findTypes(): Promise<RechargeSimTypeOutput[]> {
    return this.listRechargeSimTypesUseCase.execute();
  }

  @Get('daily')
  findDaily(
    @Query() query: RechargeSimDailyQueryDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimDailyStockOutput[]> {
    return this.getRechargeSimDailySummaryUseCase.execute(
      userId,
      query.date ?? todayIsoDate(),
    );
  }

  @Post('purchases')
  registerPurchase(
    @Body() dto: RegisterRechargeSimPurchaseRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimDailyStockOutput> {
    return this.registerRechargeSimPurchaseUseCase.execute({
      simTypeId: dto.simTypeId,
      quantity: dto.quantity,
      operationDate: dto.operationDate,
      userId,
    });
  }

  @Post('sales')
  registerSale(
    @Body() dto: RegisterRechargeSimSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimDailyStockOutput> {
    return this.registerRechargeSimSaleUseCase.execute({
      simTypeId: dto.simTypeId,
      quantity: dto.quantity,
      operationDate: dto.operationDate,
      userId,
    });
  }

  /** "Administrar Ventas de SIM (por cantidad)" listing — the by-quantity "Vender SIM" flow's own admin screen, separate from `GET sale-registrations` above (see `TypeOrmRechargeSimSaleRepository`'s own doc comment for why the two never overlap). */
  @Get('sales')
  findSales(
    @Query() query: RechargeSimSalesQueryDto,
  ): Promise<RechargeSimSaleOutput[]> {
    return this.listRechargeSimSalesUseCase.execute(query.date);
  }

  /**
   * "Revertir" for the by-quantity "Vender SIM" flow — admin-only, same
   * elevated policy as `POST /purchases/:id/void` and
   * `POST sale-registrations/:id/void`. Never a physical delete/edit: the
   * original row stays exactly as sold, marked anulada by
   * `void_recharge_sim_sale`, which also atomically restores the SIM
   * stock it decremented and enforces every other guard (day-closed,
   * already-voided, has-active-registration, missing reason).
   */
  @Post('sales/:id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  voidSale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidRechargeSimSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimSaleOutput> {
    return this.voidRechargeSimSaleUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }

  /**
   * "Venta de SIM con registro de identidad" — deliberately separate from
   * `POST sales` above (the pre-existing, still fully-supported by-quantity
   * flow, no DPI capture): this one always registers exactly one physical
   * SIM plus its identity record, in one transaction (see
   * `RegisterRechargeSimSaleWithRegistrationUseCase`'s own doc comment).
   * `multipart/form-data` — `dpiImage` is optional (a sale can be registered
   * without a photo, matching the ticket's own "cuando corresponda"
   * wording for client/identity fields), validated server-side regardless
   * of what the frontend's own `accept="image/*"` hint already filtered.
   */
  @Post('sale-registrations')
  @UseInterceptors(FileInterceptor('dpiImage'))
  @HttpCode(HttpStatus.CREATED)
  registerSaleRegistration(
    @Body() dto: RegisterRechargeSimSaleRegistrationRequestDto,
    @UploadedFile() dpiImage: UploadedImageFile | undefined,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimSaleRegistrationResponseDto> {
    return this.registerRechargeSimSaleWithRegistrationUseCase.execute({
      simTypeId: dto.simTypeId,
      simNumber: dto.simNumber,
      sku: dto.sku,
      clientDpi: dto.clientDpi,
      clientId: dto.clientId ?? null,
      salePrice: dto.salePrice,
      operationDate: dto.operationDate,
      userId,
      dpiImage: dpiImage
        ? { buffer: dpiImage.buffer, mimetype: dpiImage.mimetype, size: dpiImage.size }
        : null,
    });
  }

  /** "Administrar Ventas de SIM" listing — same pagination/filter shape as `GET /purchases`. */
  @Get('sale-registrations')
  findSaleRegistrations(
    @Query() query: ListRechargeSimSaleRegistrationsQueryDto,
  ): Promise<PaginatedRechargeSimSaleRegistrationsResponseDto> {
    return this.listRechargeSimSaleRegistrationsUseCase.execute(query);
  }

  @Get('sale-registrations/:id')
  findSaleRegistrationById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RechargeSimSaleRegistrationResponseDto> {
    return this.getRechargeSimSaleRegistrationByIdUseCase.execute(id);
  }

  /**
   * The ONE place the DPI photo's bytes are ever served — still behind the
   * controller's own `JwtAuthGuard`, never a public/static path. `@Res()`
   * direct response, same `ResponseInterceptor`-bypass pattern every PDF
   * export in this codebase already uses, since the body here is raw image
   * bytes, not a `{ success, data }` JSON envelope.
   */
  @Get('sale-registrations/:id/dpi-image')
  async getSaleRegistrationDpiImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.getRechargeSimSaleRegistrationDpiImageUseCase.execute(id);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'private, max-age=3600',
    });
    res.send(image.data);
  }

  /**
   * "Anular" — admin-only, same elevated policy as `POST /purchases/:id/void`.
   * Never an edit, never a physical delete — restores the parent sale's
   * stock atomically inside `void_recharge_sim_sale_registration`.
   */
  @Post('sale-registrations/:id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  voidSaleRegistration(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidRechargeSimSaleRegistrationRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimSaleRegistrationResponseDto> {
    return this.voidRechargeSimSaleRegistrationUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }
}
