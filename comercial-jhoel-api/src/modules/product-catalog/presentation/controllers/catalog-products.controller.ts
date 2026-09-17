import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateCatalogProductUseCase } from '../../application/use-cases/create-catalog-product.use-case';
import { UpdateCatalogProductUseCase } from '../../application/use-cases/update-catalog-product.use-case';
import { ListCatalogProductsUseCase } from '../../application/use-cases/list-catalog-products.use-case';
import { GetCatalogProductByIdUseCase } from '../../application/use-cases/get-catalog-product-by-id.use-case';
import { SetCatalogProductActiveUseCase } from '../../application/use-cases/set-catalog-product-active.use-case';
import { ReorderCatalogProductsUseCase } from '../../application/use-cases/reorder-catalog-products.use-case';
import { SetCatalogProductImageUseCase } from '../../application/use-cases/set-catalog-product-image.use-case';
import { RemoveCatalogProductImageUseCase } from '../../application/use-cases/remove-catalog-product-image.use-case';
import { CreateCatalogProductRequestDto } from '../dtos/create-catalog-product.request.dto';
import { UpdateCatalogProductRequestDto } from '../dtos/update-catalog-product.request.dto';
import { ListCatalogProductsQueryDto } from '../dtos/list-catalog-products.query.dto';
import { ReorderCatalogProductsRequestDto } from '../dtos/reorder-catalog-products.request.dto';
import { CatalogProductResponseDto } from '../dtos/catalog-product.response.dto';

interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/**
 * "Catálogo → Librería" y "Catálogo → Variedades y Accesorios" comparten
 * este mismo controller (la sección se filtra por query param/body) — igual
 * que en Teléfonos, admin-only end-to-end (incluido el listado, porque
 * expone publicaciones inactivas).
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('catalog/products')
export class CatalogProductsController {
  constructor(
    private readonly createCatalogProductUseCase: CreateCatalogProductUseCase,
    private readonly updateCatalogProductUseCase: UpdateCatalogProductUseCase,
    private readonly listCatalogProductsUseCase: ListCatalogProductsUseCase,
    private readonly getCatalogProductByIdUseCase: GetCatalogProductByIdUseCase,
    private readonly setCatalogProductActiveUseCase: SetCatalogProductActiveUseCase,
    private readonly reorderCatalogProductsUseCase: ReorderCatalogProductsUseCase,
    private readonly setCatalogProductImageUseCase: SetCatalogProductImageUseCase,
    private readonly removeCatalogProductImageUseCase: RemoveCatalogProductImageUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateCatalogProductRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogProductResponseDto> {
    return this.createCatalogProductUseCase.execute({
      productId: dto.productId,
      section: dto.section,
      catalogDescription: dto.catalogDescription ?? null,
      userId,
    });
  }

  @Get()
  findAll(@Query() query: ListCatalogProductsQueryDto): Promise<CatalogProductResponseDto[]> {
    return this.listCatalogProductsUseCase.execute({
      section: query.section,
      includeInactive: query.includeInactive,
      search: query.search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CatalogProductResponseDto> {
    return this.getCatalogProductByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogProductRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogProductResponseDto> {
    return this.updateCatalogProductUseCase.execute(id, {
      catalogDescription: dto.catalogDescription,
      userId,
    });
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setCatalogProductActiveUseCase.execute(id, true, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setCatalogProductActiveUseCase.execute(id, false, userId);
  }

  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  reorder(@Body() dto: ReorderCatalogProductsRequestDto): Promise<void> {
    return this.reorderCatalogProductsUseCase.execute(dto.items);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  setImage(
    @Param('id', ParseUUIDPipe) catalogProductId: string,
    @UploadedFile() image: UploadedImageFile,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setCatalogProductImageUseCase.execute({
      catalogProductId,
      image: { buffer: image.buffer, mimetype: image.mimetype, size: image.size },
      userId,
    });
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeImage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.removeCatalogProductImageUseCase.execute(id, userId);
  }
}
