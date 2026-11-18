import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  Actor,
  CancelSchoolQuotationUseCase,
  ChangeSchoolQuotationStatusUseCase,
  CreateSchoolQuotationUseCase,
  DuplicateSchoolTemplateUseCase,
  GetSchoolListDashboardUseCase,
  GetSchoolListPermissionsUseCase,
  GetSchoolQuotationPdfUseCase,
  GetSchoolQuotationUseCase,
  GetSchoolReceiptPdfUseCase,
  GetSchoolTemplateUseCase,
  ListSchoolQuotationsUseCase,
  ListSchoolTemplatesUseCase,
  RegisterSchoolPaymentUseCase,
  SaveSchoolTemplateUseCase,
  SetSchoolTemplateActiveUseCase,
  UpdateSchoolQuotationObservationsUseCase,
  UpdateSchoolQuotationUseCase,
  VoidSchoolPaymentUseCase,
} from '../../application/use-cases/school-list.use-cases';
import {
  CancelQuotationRequestDto,
  CreateQuotationRequestDto,
  DashboardQueryDto,
  DuplicateTemplateRequestDto,
  ObservationsRequestDto,
  QuotationsQueryDto,
  RegisterPaymentRequestDto,
  SaveTemplateRequestDto,
  StatusActionRequestDto,
  TemplateStatusRequestDto,
  TemplatesQueryDto,
  UpdateQuotationRequestDto,
  VoidPaymentRequestDto,
} from '../dtos/school-list.request.dto';

const actor = (user: RequestUser): Actor => ({
  userId: user.userId,
  role: user.role,
});

function sendPdf(res: Response, file: { filename: string; pdf: Buffer }): void {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="${file.filename}"`,
    'Content-Length': file.pdf.length,
  });
  res.end(file.pdf);
}

/**
 * Listas Escolares: templates per grade, customer quotations and their
 * account statement. Every use case checks its permission
 * (`SCHOOL_LIST_PERMISSION_ROLES`) and the SQL functions check it again.
 * Static routes are declared before `:id` ones.
 */
@UseGuards(JwtAuthGuard)
@Controller('school-lists')
export class SchoolListsController {
  constructor(
    private readonly permissions: GetSchoolListPermissionsUseCase,
    private readonly listTemplates: ListSchoolTemplatesUseCase,
    private readonly getTemplate: GetSchoolTemplateUseCase,
    private readonly saveTemplate: SaveSchoolTemplateUseCase,
    private readonly setTemplateActive: SetSchoolTemplateActiveUseCase,
    private readonly duplicateTemplate: DuplicateSchoolTemplateUseCase,
    private readonly listQuotations: ListSchoolQuotationsUseCase,
    private readonly getQuotation: GetSchoolQuotationUseCase,
    private readonly createQuotation: CreateSchoolQuotationUseCase,
    private readonly updateQuotation: UpdateSchoolQuotationUseCase,
    private readonly updateObservations: UpdateSchoolQuotationObservationsUseCase,
    private readonly changeStatus: ChangeSchoolQuotationStatusUseCase,
    private readonly cancelQuotation: CancelSchoolQuotationUseCase,
    private readonly registerPayment: RegisterSchoolPaymentUseCase,
    private readonly voidPayment: VoidSchoolPaymentUseCase,
    private readonly dashboardUseCase: GetSchoolListDashboardUseCase,
    private readonly quotationPdf: GetSchoolQuotationPdfUseCase,
    private readonly receiptPdf: GetSchoolReceiptPdfUseCase,
  ) {}

  /** Permissions of the caller's role — the frontend shows only these actions. */
  @Get('permissions')
  myPermissions(@CurrentUser() user: RequestUser) {
    return this.permissions.execute(actor(user));
  }

  // ── Templates ──────────────────────────────────────────────────────────
  @Get('templates')
  templates(
    @Query() query: TemplatesQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listTemplates.execute(
      actor(user),
      query.includeInactive === 'true',
    );
  }

  @Get('templates/:id')
  template(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getTemplate.execute(actor(user), id);
  }

  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  createTemplate(
    @Body() dto: SaveTemplateRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    // `version` only matters on update; the SQL function ignores it here.
    return this.saveTemplate.execute(actor(user), null, dto, null);
  }

  @Put('templates/:id')
  replaceTemplate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SaveTemplateRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { version, ...input } = dto;
    return this.saveTemplate.execute(actor(user), id, input, version ?? null);
  }

  @Patch('templates/:id/status')
  templateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TemplateStatusRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.setTemplateActive.execute(actor(user), id, dto.isActive);
  }

  @Post('templates/:id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  duplicate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DuplicateTemplateRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.duplicateTemplate.execute(
      actor(user),
      id,
      dto.name,
      dto.grade ?? null,
    );
  }

  // ── Quotations ─────────────────────────────────────────────────────────
  @Get('quotations')
  quotations(
    @Query() query: QuotationsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { page, limit, ...filters } = query;
    return this.listQuotations.execute(actor(user), {
      ...filters,
      page: page ?? 1,
      limit: limit ?? 20,
    });
  }

  @Get('quotations/dashboard')
  dashboard(
    @Query() query: DashboardQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.dashboardUseCase.execute(
      actor(user),
      query.dateFrom,
      query.dateTo,
    );
  }

  @Post('quotations')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateQuotationRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { clientRequestId, ...input } = dto;
    return this.createQuotation.execute(actor(user), input, clientRequestId);
  }

  @Get('quotations/:id/pdf')
  async pdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    sendPdf(res, await this.quotationPdf.execute(actor(user), id));
  }

  @Get('quotations/:id')
  quotation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getQuotation.execute(actor(user), id);
  }

  @Put('quotations/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuotationRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { version, ...input } = dto;
    return this.updateQuotation.execute(actor(user), id, input, version);
  }

  @Patch('quotations/:id/observations')
  observations(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ObservationsRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.updateObservations.execute(
      actor(user),
      id,
      dto.observations ?? null,
      dto.version,
    );
  }

  @Post('quotations/:id/status')
  @HttpCode(HttpStatus.OK)
  status(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: StatusActionRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.changeStatus.execute(
      actor(user),
      id,
      dto.action,
      dto.version ?? null,
    );
  }

  @Post('quotations/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelQuotationRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { clientRequestId, ...input } = dto;
    return this.cancelQuotation.execute(
      actor(user),
      id,
      input,
      clientRequestId,
    );
  }

  // ── Payments ───────────────────────────────────────────────────────────
  @Post('quotations/:id/payments')
  @HttpCode(HttpStatus.CREATED)
  pay(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RegisterPaymentRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { clientRequestId, ...input } = dto;
    return this.registerPayment.execute(
      actor(user),
      id,
      input,
      clientRequestId,
    );
  }

  @Post('payments/:paymentId/void')
  @HttpCode(HttpStatus.OK)
  void(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @Body() dto: VoidPaymentRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidPayment.execute(
      actor(user),
      paymentId,
      dto.reason,
      dto.clientRequestId,
    );
  }

  @Get('payments/:paymentId/receipt')
  async receipt(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    sendPdf(res, await this.receiptPdf.execute(actor(user), paymentId));
  }
}
