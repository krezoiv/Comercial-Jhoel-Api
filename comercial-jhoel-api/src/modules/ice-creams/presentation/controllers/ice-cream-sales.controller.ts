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
import { CreateIceCreamSaleUseCase } from '../../application/use-cases/create-ice-cream-sale.use-case';
import { ListIceCreamSalesUseCase } from '../../application/use-cases/list-ice-cream-sales.use-case';
import { GetIceCreamSaleByIdUseCase } from '../../application/use-cases/get-ice-cream-sale-by-id.use-case';
import { CreateIceCreamSaleRequestDto } from '../dtos/create-ice-cream-sale.request.dto';
import { ListIceCreamSalesQueryDto } from '../dtos/list-ice-cream-sales.query.dto';
import {
  IceCreamSaleResponseDto,
  PaginatedIceCreamSalesResponseDto,
} from '../dtos/ice-cream-sale.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * No `@Roles(...)` restriction — same policy as `PurchasesController`/
 * `IceCreamPurchasesController`: registering a venta is an operational
 * action for whoever runs the register, not an admin-only one.
 * `JwtAuthGuard` (any authenticated, active account) is the only gate.
 * `ListIceCreamSalesUseCase`/`GetIceCreamSaleByIdUseCase` still restrict
 * *which* sales a non-admin can see (only their own).
 */
@UseGuards(JwtAuthGuard)
@Controller('ice-cream-sales')
export class IceCreamSalesController {
  constructor(
    private readonly createIceCreamSaleUseCase: CreateIceCreamSaleUseCase,
    private readonly listIceCreamSalesUseCase: ListIceCreamSalesUseCase,
    private readonly getIceCreamSaleByIdUseCase: GetIceCreamSaleByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateIceCreamSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<IceCreamSaleResponseDto> {
    return this.createIceCreamSaleUseCase.execute({ userId, items: dto.items });
  }

  @Get()
  findAll(
    @Query() query: ListIceCreamSalesQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedIceCreamSalesResponseDto> {
    return this.listIceCreamSalesUseCase.execute({
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
      ...query,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<IceCreamSaleResponseDto> {
    return this.getIceCreamSaleByIdUseCase.execute(id, {
      currentUserId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }
}
