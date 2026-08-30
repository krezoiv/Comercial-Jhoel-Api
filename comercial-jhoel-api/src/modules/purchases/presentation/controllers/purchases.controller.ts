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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { CreatePurchaseUseCase } from '../../application/use-cases/create-purchase.use-case';
import { ListPurchasesUseCase } from '../../application/use-cases/list-purchases.use-case';
import { GetPurchaseByIdUseCase } from '../../application/use-cases/get-purchase-by-id.use-case';
import { CreatePurchaseRequestDto } from '../dtos/create-purchase.request.dto';
import { ListPurchasesQueryDto } from '../dtos/list-purchases.query.dto';
import {
  PaginatedPurchasesResponseDto,
  PurchaseResponseDto,
} from '../dtos/purchase.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

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
    });
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
