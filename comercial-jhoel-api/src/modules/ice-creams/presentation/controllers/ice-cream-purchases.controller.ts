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
import { CreateIceCreamPurchaseUseCase } from '../../application/use-cases/create-ice-cream-purchase.use-case';
import { ListIceCreamPurchasesUseCase } from '../../application/use-cases/list-ice-cream-purchases.use-case';
import { GetIceCreamPurchaseByIdUseCase } from '../../application/use-cases/get-ice-cream-purchase-by-id.use-case';
import { CreateIceCreamPurchaseRequestDto } from '../dtos/create-ice-cream-purchase.request.dto';
import { ListIceCreamPurchasesQueryDto } from '../dtos/list-ice-cream-purchases.query.dto';
import {
  IceCreamPurchaseResponseDto,
  PaginatedIceCreamPurchasesResponseDto,
} from '../dtos/ice-cream-purchase.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * No `@Roles(...)` restriction — same policy as `PurchasesController`:
 * registering a compra (receiving stock) is an operational action for
 * whoever runs the register, not an admin-only one. `JwtAuthGuard` (any
 * authenticated, active account) is the only gate.
 * `ListIceCreamPurchasesUseCase`/`GetIceCreamPurchaseByIdUseCase` still
 * restrict *which* purchases a non-admin can see (only their own) —
 * enforced in the use case, not here, identical to how Purchases does it.
 */
@UseGuards(JwtAuthGuard)
@Controller('ice-cream-purchases')
export class IceCreamPurchasesController {
  constructor(
    private readonly createIceCreamPurchaseUseCase: CreateIceCreamPurchaseUseCase,
    private readonly listIceCreamPurchasesUseCase: ListIceCreamPurchasesUseCase,
    private readonly getIceCreamPurchaseByIdUseCase: GetIceCreamPurchaseByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateIceCreamPurchaseRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<IceCreamPurchaseResponseDto> {
    return this.createIceCreamPurchaseUseCase.execute({
      supplierId: dto.supplierId,
      userId,
      purchaseDate: new Date(dto.purchaseDate),
      items: dto.items,
    });
  }

  @Get()
  findAll(
    @Query() query: ListIceCreamPurchasesQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedIceCreamPurchasesResponseDto> {
    return this.listIceCreamPurchasesUseCase.execute({
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
      ...query,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<IceCreamPurchaseResponseDto> {
    return this.getIceCreamPurchaseByIdUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }
}
