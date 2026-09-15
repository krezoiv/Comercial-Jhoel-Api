import {
  BadRequestException,
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
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { CreatePurchaseUseCase } from '../../application/use-cases/create-purchase.use-case';
import { ListPurchasesUseCase } from '../../application/use-cases/list-purchases.use-case';
import { GetPurchaseByIdUseCase } from '../../application/use-cases/get-purchase-by-id.use-case';
import { MarkPurchaseAsPaidUseCase } from '../../application/use-cases/mark-purchase-as-paid.use-case';
import { GetPurchasePdfUseCase } from '../../application/use-cases/get-purchase-pdf.use-case';
import { VoidPurchaseUseCase } from '../../application/use-cases/void-purchase.use-case';
import { ImportPurchaseFromExcelUseCase } from '../../application/use-cases/import-purchase-from-excel.use-case';
import { GetPurchasesDailyStatsUseCase } from '../../application/use-cases/get-purchases-daily-stats.use-case';
import { GetPurchasesWeeklyStatsUseCase } from '../../application/use-cases/get-purchases-weekly-stats.use-case';
import { GetPurchasesYearlyStatsUseCase } from '../../application/use-cases/get-purchases-yearly-stats.use-case';
import { buildPurchaseImportTemplate } from '../../infrastructure/excel/purchase-import.builder';
import { CreatePurchaseRequestDto } from '../dtos/create-purchase.request.dto';
import { ListPurchasesQueryDto } from '../dtos/list-purchases.query.dto';
import { VoidPurchaseRequestDto } from '../dtos/void-purchase.request.dto';
import { ImportPurchaseResultResponseDto } from '../dtos/import-purchase-result.response.dto';
import { PurchasesDailyStatsResponseDto } from '../dtos/purchases-daily-stats.response.dto';
import { PurchasesWeeklyStatsResponseDto } from '../dtos/purchases-weekly-stats.response.dto';
import { PurchasesYearlyStatsResponseDto } from '../dtos/purchases-yearly-stats.response.dto';
import {
  PaginatedPurchasesResponseDto,
  PurchaseResponseDto,
} from '../dtos/purchase.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/** The minimal shape actually read off an uploaded file — same as `ProductsController`'s own, avoids a dependency on `@types/multer` for a single-field usage. */
interface UploadedExcelFile {
  buffer: Buffer;
  originalname: string;
  size: number;
}

const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * No `@Roles(...)` restriction — same policy as Sales, applied consistently
 * per this ticket's own instruction: registering a purchase (receiving
 * stock) is an operational action for whoever runs the register, not an
 * admin-only one. `JwtAuthGuard` (any authenticated, active account) is the
 * only gate. `ListPurchasesUseCase`/`GetPurchaseByIdUseCase` still restrict
 * *which* purchases a non-admin can see (only their own) — enforced in the
 * use case, not here, identical to how Sales does it.
 */
@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(
    private readonly createPurchaseUseCase: CreatePurchaseUseCase,
    private readonly listPurchasesUseCase: ListPurchasesUseCase,
    private readonly getPurchaseByIdUseCase: GetPurchaseByIdUseCase,
    private readonly markPurchaseAsPaidUseCase: MarkPurchaseAsPaidUseCase,
    private readonly getPurchasePdfUseCase: GetPurchasePdfUseCase,
    private readonly voidPurchaseUseCase: VoidPurchaseUseCase,
    private readonly importPurchaseFromExcelUseCase: ImportPurchaseFromExcelUseCase,
    private readonly getPurchasesDailyStatsUseCase: GetPurchasesDailyStatsUseCase,
    private readonly getPurchasesWeeklyStatsUseCase: GetPurchasesWeeklyStatsUseCase,
    private readonly getPurchasesYearlyStatsUseCase: GetPurchasesYearlyStatsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreatePurchaseRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PurchaseResponseDto> {
    return this.createPurchaseUseCase.execute({
      supplierId: dto.supplierId,
      userId,
      purchaseDate: new Date(dto.purchaseDate),
      items: dto.items,
      paymentType: dto.paymentType,
      paymentDueDate: dto.paymentDueDate,
      invoiceNumber: dto.invoiceNumber,
    });
  }

  /**
   * "Cargar stock inicial (Excel)" — registers one or more real purchases
   * (see `ImportPurchaseFromExcelUseCase`'s own doc comment) attributed to
   * the fixed "Carga Inicial de Inventario" supplier. Admin-only, like
   * Products' own bulk import — registering hundreds of purchases at once
   * is a heavier action than the operational, any-authenticated-account
   * `POST /purchases` above. Declared before `POST /:id/void`/`:id/pay` so
   * "import" is never swallowed as an `:id` value.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('import')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_FILE_SIZE_BYTES } }))
  importExcel(
    @UploadedFile() file: UploadedExcelFile,
    @CurrentUser('userId') userId: string,
  ): Promise<ImportPurchaseResultResponseDto> {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo Excel (.xlsx).');
    }
    return this.importPurchaseFromExcelUseCase.execute(file.buffer, userId);
  }

  /**
   * "Anular factura" — admin-only correction path for the "Administrar
   * Facturas de Compras" module. Never an edit, never a physical delete —
   * see `VoidPurchaseUseCase`'s own doc comment for why there is
   * deliberately no "editar factura" that touches productos/cantidades.
   */
  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  voidPurchase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidPurchaseRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PurchaseResponseDto> {
    return this.voidPurchaseUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }

  /** "Marcar como pagada" — see `MarkPurchaseAsPaidUseCase`'s own doc comment for why this is operational, not admin-gated. */
  @Post(':id/pay')
  @HttpCode(HttpStatus.OK)
  markAsPaid(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<PurchaseResponseDto> {
    return this.markPurchaseAsPaidUseCase.execute({ id, paidBy: userId });
  }

  @Get()
  findAll(
    @Query() query: ListPurchasesQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedPurchasesResponseDto> {
    return this.listPurchasesUseCase.execute({
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
      ...query,
    });
  }

  /** Downloads the blank Excel template for "Cargar stock inicial" — declared before `GET /:id/pdf`/`:id` for the same route-ordering reason as the import route above. */
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('import/template')
  async importTemplate(@Res() res: Response): Promise<void> {
    const buffer = await buildPurchaseImportTemplate();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="plantilla-compra-inicial.xlsx"',
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  /** Backs "Compras del mes" en Gráficas → Indicadores de Compras — must be declared before `:id`. Open to any authenticated account. */
  @Get('daily-stats')
  dailyStats(): Promise<PurchasesDailyStatsResponseDto> {
    return this.getPurchasesDailyStatsUseCase.execute();
  }

  /** Backs "Compras por semana" en Gráficas → Indicadores de Compras. */
  @Get('weekly-stats')
  weeklyStats(): Promise<PurchasesWeeklyStatsResponseDto> {
    return this.getPurchasesWeeklyStatsUseCase.execute();
  }

  /** Backs "Compras por mes" (anual) en Gráficas → Indicadores de Compras. */
  @Get('yearly-stats')
  yearlyStats(): Promise<PurchasesYearlyStatsResponseDto> {
    return this.getPurchasesYearlyStatsUseCase.execute();
  }

  /**
   * Reconstructs the purchase's invoice PDF purely from already-persisted
   * data — never re-runs `confirm_purchase`. Declared before `:id` so it
   * isn't swallowed by that route's `ParseUUIDPipe` matching on `id`,
   * matching Sales' own route-ordering discipline.
   */
  @Get(':id/pdf')
  async getPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.getPurchasePdfUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="compra-${id.slice(0, 8)}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<PurchaseResponseDto> {
    return this.getPurchaseByIdUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }
}
