import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListInventoryLocationsUseCase } from '../../application/use-cases/list-inventory-locations.use-case';
import { ListProductPresentationsUseCase } from '../../application/use-cases/list-product-presentations.use-case';
import { CreatePresentationUseCase } from '../../application/use-cases/create-presentation.use-case';
import { UpdatePresentationUseCase } from '../../application/use-cases/update-presentation.use-case';
import { GetProductInventoryUseCase } from '../../application/use-cases/get-product-inventory.use-case';
import { RegisterInventoryTransferUseCase } from '../../application/use-cases/register-inventory-transfer.use-case';
import { SetMinStockUseCase } from '../../application/use-cases/set-min-stock.use-case';
import { CreatePresentationRequestDto } from '../dtos/create-presentation.request.dto';
import { UpdatePresentationRequestDto } from '../dtos/update-presentation.request.dto';
import { RegisterTransferRequestDto } from '../dtos/register-transfer.request.dto';
import { SetMinStockRequestDto } from '../dtos/set-min-stock.request.dto';

/**
 * Locations/presentations/stock/movements/transfers — everything the
 * "producto → presentaciones → ubicaciones → stock" evolution needed that
 * didn't already live in `modules/products/`. Reading is open to any
 * authenticated account (needed by the Compras/Ventas product pickers and
 * the Inventario screen itself); writing a presentation is admin-only
 * (mirrors Products' own create/update split); registering a transfer is
 * operational (same "any authenticated active account" policy as
 * Compras/Ventas/Recargas — moving stock between your own two locations is
 * a daily register task, not an admin-only one).
 */
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly listLocationsUseCase: ListInventoryLocationsUseCase,
    private readonly listPresentationsUseCase: ListProductPresentationsUseCase,
    private readonly createPresentationUseCase: CreatePresentationUseCase,
    private readonly updatePresentationUseCase: UpdatePresentationUseCase,
    private readonly getProductInventoryUseCase: GetProductInventoryUseCase,
    private readonly registerTransferUseCase: RegisterInventoryTransferUseCase,
    private readonly setMinStockUseCase: SetMinStockUseCase,
  ) {}

  @Get('locations')
  findLocations() {
    return this.listLocationsUseCase.execute();
  }

  @Get('products/:productId/presentations')
  findPresentations(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.listPresentationsUseCase.execute(productId);
  }

  @Post('products/:productId/presentations')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  createPresentation(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreatePresentationRequestDto,
  ) {
    return this.createPresentationUseCase.execute({ productId, ...dto });
  }

  @Patch('presentations/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  updatePresentation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePresentationRequestDto,
  ) {
    return this.updatePresentationUseCase.execute({
      presentationId: id,
      ...dto,
    });
  }

  @Get('products/:productId')
  getProductInventory(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.getProductInventoryUseCase.execute(productId);
  }

  /** "Stock mínimo" — the threshold the Alerts module reads for "inventario bajo". Admin-only, mirrors this controller's own presentation-write split. */
  @Patch('products/:productId/locations/:locationId/min-stock')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  setMinStock(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Body() dto: SetMinStockRequestDto,
  ) {
    return this.setMinStockUseCase.execute({
      productId,
      locationId,
      minStock: dto.minStock,
    });
  }

  @Post('transfers')
  registerTransfer(
    @Body() dto: RegisterTransferRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.registerTransferUseCase.execute({
      productId: dto.productId,
      presentationId: dto.presentationId,
      fromLocationId: dto.fromLocationId,
      toLocationId: dto.toLocationId,
      quantity: dto.quantity,
      reason: dto.reason,
      userId,
    });
  }
}
