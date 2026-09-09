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
import { CreateTicketUseCase } from '../../application/use-cases/create-ticket.use-case';
import { ListTicketsUseCase } from '../../application/use-cases/list-tickets.use-case';
import { GetTicketByIdUseCase } from '../../application/use-cases/get-ticket-by-id.use-case';
import { VoidTicketUseCase } from '../../application/use-cases/void-ticket.use-case';
import { GetTicketPdfUseCase } from '../../application/use-cases/get-ticket-pdf.use-case';
import { CreateTicketRequestDto } from '../dtos/create-ticket.request.dto';
import { ListTicketsQueryDto } from '../dtos/list-tickets.query.dto';
import { VoidTicketRequestDto } from '../dtos/void-ticket.request.dto';
import {
  PaginatedTicketsResponseDto,
  TicketResponseDto,
} from '../dtos/ticket.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * No class-level `@Roles(...)` — same policy as Sales/Purchases: creating a
 * Ticket is an operational action for whoever runs the register, not an
 * admin-only one. `ListTicketsUseCase`/`GetTicketByIdUseCase` still restrict
 * *which* tickets a non-admin can see (only their own), enforced in the use
 * case. `void` is the one admin-gated route — correcting an already-created
 * ticket is a management action, same policy as `BankDepositsController`'s
 * own void route.
 */
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly createTicketUseCase: CreateTicketUseCase,
    private readonly listTicketsUseCase: ListTicketsUseCase,
    private readonly getTicketByIdUseCase: GetTicketByIdUseCase,
    private readonly voidTicketUseCase: VoidTicketUseCase,
    private readonly getTicketPdfUseCase: GetTicketPdfUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateTicketRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TicketResponseDto> {
    return this.createTicketUseCase.execute({
      userId,
      clientId: dto.clientId,
      clientName: dto.clientName,
      items: dto.items,
    });
  }

  @Get()
  findAll(
    @Query() query: ListTicketsQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedTicketsResponseDto> {
    return this.listTicketsUseCase.execute({
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
      ...query,
    });
  }

  /**
   * Reconstructs the ticket's receipt PDF purely from already-persisted
   * data — never re-runs `create_ticket`. Declared before `:id` so it isn't
   * swallowed by that route's `ParseUUIDPipe` matching on `id`, matching
   * Sales'/Purchases' own route-ordering discipline.
   */
  @Get(':id/pdf')
  async getPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.getTicketPdfUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ticket-${id.slice(0, 8)}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  /** Anular — never a physical delete/edit, see `VoidTicketUseCase`. */
  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidTicketRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<TicketResponseDto> {
    return this.voidTicketUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<TicketResponseDto> {
    return this.getTicketByIdUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }
}
