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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  AddPaymentGroupNoteUseCase,
  ApprovePaymentGroupUseCase,
  ClosePaymentGroupUseCase,
  CreatePaymentGroupUseCase,
  GetPaymentGroupHistoryUseCase,
  GetPaymentGroupUseCase,
  ListPaymentGroupsUseCase,
  MarkPaymentGroupNoPaymentUseCase,
  PaymentGroupActor,
  PaymentGroupListOutput,
  RegisterPaymentGroupDeliveryUseCase,
  ResolvePaymentGroupItemUseCase,
  UpdatePaymentGroupItemUseCase,
  UpdatePendingPaymentGroupUseCase,
  VoidPaymentGroupItemUseCase,
  VoidPaymentGroupUseCase,
} from '../../application/use-cases/payment-group.use-cases';
import type {
  PaymentGroupDetail,
  PaymentGroupEventRow,
} from '../../domain/payment-group';
import {
  ApprovePaymentGroupRequestDto,
  ClosePaymentGroupRequestDto,
  CreatePaymentGroupRequestDto,
  ListPaymentGroupsQueryDto,
  NoPaymentRequestDto,
  PaymentGroupNoteRequestDto,
  RegisterDeliveryRequestDto,
  ResolveItemRequestDto,
  UpdatePaymentGroupItemRequestDto,
  UpdatePendingPaymentGroupRequestDto,
  VoidItemRequestDto,
  VoidPaymentGroupRequestDto,
} from '../dtos/payment-group.request.dto';

const actor = (user: RequestUser): PaymentGroupActor => ({
  userId: user.userId,
  role: user.role,
});

/**
 * Pagos grupales. Any authenticated Transaccionar user creates groups,
 * confirms payments and documents them; releasing, voiding and closing are
 * admin-only (checked in the use cases and again in the database). A Génesis
 * group is corrected while pending by its creator or an admin, and approved
 * (booked as a whole) only by an admin.
 */
@UseGuards(JwtAuthGuard)
@Controller('payment-groups')
export class PaymentGroupsController {
  constructor(
    private readonly list: ListPaymentGroupsUseCase,
    private readonly get: GetPaymentGroupUseCase,
    private readonly history: GetPaymentGroupHistoryUseCase,
    private readonly create: CreatePaymentGroupUseCase,
    private readonly deliver: RegisterPaymentGroupDeliveryUseCase,
    private readonly noPayment: MarkPaymentGroupNoPaymentUseCase,
    private readonly note: AddPaymentGroupNoteUseCase,
    private readonly updateItem: UpdatePaymentGroupItemUseCase,
    private readonly resolve: ResolvePaymentGroupItemUseCase,
    private readonly voidItem: VoidPaymentGroupItemUseCase,
    private readonly close: ClosePaymentGroupUseCase,
    private readonly voidGroup: VoidPaymentGroupUseCase,
    private readonly updatePending: UpdatePendingPaymentGroupUseCase,
    private readonly approve: ApprovePaymentGroupUseCase,
  ) {}

  @Get()
  findAll(
    @Query() query: ListPaymentGroupsQueryDto,
  ): Promise<PaymentGroupListOutput> {
    return this.list.execute(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentGroupDetail> {
    return this.get.execute(id);
  }

  /** Whole group history, or one transaction's with `?itemId=`. */
  @Get(':id/history')
  getHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('itemId', new ParseUUIDPipe({ optional: true })) itemId?: string,
  ): Promise<PaymentGroupEventRow[]> {
    return this.history.execute(id, itemId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createGroup(
    @Body() dto: CreatePaymentGroupRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.create.execute(dto, actor(user));
  }

  /** Corrects a Génesis group pending approval (creator or admin). */
  @Put(':id')
  updatePendingGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePendingPaymentGroupRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.updatePending.execute(id, dto, actor(user));
  }

  /** Approves a Génesis group (admin): books every cuota at once; idempotent. */
  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  approveGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApprovePaymentGroupRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.approve.execute(id, dto, actor(user));
  }

  @Post(':id/items/:itemId/deliveries')
  @HttpCode(HttpStatus.CREATED)
  registerDelivery(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: RegisterDeliveryRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.deliver.execute(id, itemId, dto, actor(user));
  }

  @Post(':id/items/:itemId/no-payment')
  @HttpCode(HttpStatus.OK)
  markNoPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: NoPaymentRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.noPayment.execute(id, itemId, dto.note, actor(user));
  }

  @Post(':id/notes')
  @HttpCode(HttpStatus.CREATED)
  addNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PaymentGroupNoteRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.note.execute(id, dto.itemId ?? null, dto.note, actor(user));
  }

  @Patch(':id/items/:itemId')
  updateGroupItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdatePaymentGroupItemRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.updateItem.execute(id, itemId, dto, actor(user));
  }

  @Post(':id/items/:itemId/resolution')
  @HttpCode(HttpStatus.OK)
  resolveItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: ResolveItemRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.resolve.execute(id, itemId, dto, actor(user));
  }

  @Post(':id/items/:itemId/void')
  @HttpCode(HttpStatus.OK)
  voidGroupItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: VoidItemRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.voidItem.execute(id, itemId, dto, actor(user));
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  closeGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ClosePaymentGroupRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.close.execute(id, dto.note, actor(user));
  }

  @Post(':id/void')
  @HttpCode(HttpStatus.OK)
  voidWholeGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidPaymentGroupRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaymentGroupDetail> {
    return this.voidGroup.execute(id, dto.reason, actor(user));
  }
}
