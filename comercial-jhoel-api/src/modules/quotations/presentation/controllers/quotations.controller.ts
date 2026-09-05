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
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateQuotationUseCase } from '../../application/use-cases/create-quotation.use-case';
import { ListQuotationsUseCase } from '../../application/use-cases/list-quotations.use-case';
import { GetQuotationByIdUseCase } from '../../application/use-cases/get-quotation-by-id.use-case';
import { VoidQuotationUseCase } from '../../application/use-cases/void-quotation.use-case';
import { GetQuotationPdfUseCase } from '../../application/use-cases/get-quotation-pdf.use-case';
import { CreateQuotationRequestDto } from '../dtos/create-quotation.request.dto';
import { ListQuotationsQueryDto } from '../dtos/list-quotations.query.dto';
import { VoidQuotationRequestDto } from '../dtos/void-quotation.request.dto';
import {
  PaginatedQuotationsResponseDto,
  QuotationResponseDto,
} from '../dtos/quotation.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * No class-level `@Roles(...)` — same policy as Sales/Purchases/Tickets:
 * creating a Cotización is an operational action for whoever runs the
 * register, not an admin-only one. `ListQuotationsUseCase`/
 * `GetQuotationByIdUseCase` still restrict *which* quotations a non-admin
 * can see (only their own), enforced in the use case. `void` is the one
 * admin-gated route — correcting an already-created quotation is a
 * management action, same policy as Tickets'/`BankDepositsController`'s own
 * void route.
 */
@UseGuards(JwtAuthGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly createQuotationUseCase: CreateQuotationUseCase,
    private readonly listQuotationsUseCase: ListQuotationsUseCase,
    private readonly getQuotationByIdUseCase: GetQuotationByIdUseCase,
    private readonly voidQuotationUseCase: VoidQuotationUseCase,
    private readonly getQuotationPdfUseCase: GetQuotationPdfUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateQuotationRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<QuotationResponseDto> {
    return this.createQuotationUseCase.execute({
      userId,
      clientId: dto.clientId,
      expirationDate: dto.expirationDate,
      observations: dto.observations,
      commercialTerms: dto.commercialTerms,
      items: dto.items,
    });
  }

  @Get()
  findAll(
    @Query() query: ListQuotationsQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedQuotationsResponseDto> {
    return this.listQuotationsUseCase.execute({
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
      ...query,
    });
  }

  /**
   * Reconstructs the quotation's PDF purely from already-persisted,
   * historicized data — never re-runs `create_quotation`. Declared before
   * `:id` so it isn't swallowed by that route's `ParseUUIDPipe` matching on
   * `id`, matching Sales'/Purchases'/Tickets' own route-ordering discipline.
   */
  @Get(':id/pdf')
  async getPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.getQuotationPdfUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cotizacion-${id.slice(0, 8)}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  /** Anular — never a physical delete/edit, see `VoidQuotationUseCase`. */
  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidQuotation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidQuotationRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<QuotationResponseDto> {
    return this.voidQuotationUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<QuotationResponseDto> {
    return this.getQuotationByIdUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }
}
