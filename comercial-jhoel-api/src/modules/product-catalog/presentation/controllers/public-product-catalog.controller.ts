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
} from '@nestjs/common';
import type { Response } from 'express';
import { ListPublishedCatalogProductsUseCase } from '../../application/use-cases/list-published-catalog-products.use-case';
import { GetPublishedCatalogProductByIdUseCase } from '../../application/use-cases/get-published-catalog-product-by-id.use-case';
import { GetCatalogProductImageUseCase } from '../../application/use-cases/get-catalog-product-image.use-case';
import { CreateCatalogProductRequestUseCase } from '../../application/use-cases/create-catalog-product-request.use-case';
import { LikeCatalogProductUseCase } from '../../application/use-cases/like-catalog-product.use-case';
import { CreateCatalogProductRequestRequestDto } from '../dtos/create-catalog-product-request.request.dto';
import { PublicCatalogProductResponseDto } from '../dtos/public-catalog-product.response.dto';
import { CatalogProductRequestResponseDto } from '../dtos/catalog-product-request.response.dto';
import type { CatalogProductSection } from '../../domain/entities/catalog-product.entity';

const CATALOG_PRODUCT_SECTIONS: CatalogProductSection[] = ['LIBRERIA', 'VARIEDADES_ACCESORIOS'];

/**
 * Público, sin guard — mismo prefijo `public-catalog` que Teléfonos, pero
 * un controller distinto con sub-rutas propias (`products*`), así que no
 * choca con `PublicCatalogController` (`phones*`). Nunca expone costo,
 * stock, proveedor ni ningún dato administrativo.
 */
@Controller('public-catalog')
export class PublicProductCatalogController {
  constructor(
    private readonly listPublishedCatalogProductsUseCase: ListPublishedCatalogProductsUseCase,
    private readonly getPublishedCatalogProductByIdUseCase: GetPublishedCatalogProductByIdUseCase,
    private readonly getCatalogProductImageUseCase: GetCatalogProductImageUseCase,
    private readonly createCatalogProductRequestUseCase: CreateCatalogProductRequestUseCase,
    private readonly likeCatalogProductUseCase: LikeCatalogProductUseCase,
  ) {}

  @Get('products')
  findAll(@Query('section') section: string): Promise<PublicCatalogProductResponseDto[]> {
    const normalized = CATALOG_PRODUCT_SECTIONS.includes(section as CatalogProductSection)
      ? (section as CatalogProductSection)
      : 'LIBRERIA';
    return this.listPublishedCatalogProductsUseCase.execute(normalized);
  }

  @Get('products/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PublicCatalogProductResponseDto> {
    return this.getPublishedCatalogProductByIdUseCase.execute(id);
  }

  /** Mismo header `Cross-Origin-Resource-Policy: cross-origin` que Teléfonos — sin él, Helmet bloquea el `<img>` entre orígenes. */
  @Get('products/images/:id')
  async getImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.getCatalogProductImageUseCase.execute(id);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(image.data);
  }

  @Post('product-requests')
  @HttpCode(HttpStatus.CREATED)
  createRequest(
    @Body() dto: CreateCatalogProductRequestRequestDto,
  ): Promise<CatalogProductRequestResponseDto> {
    return this.createCatalogProductRequestUseCase.execute({
      catalogProductId: dto.catalogProductId,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
    });
  }

  @Post('products/:id/like')
  @HttpCode(HttpStatus.OK)
  like(@Param('id', ParseUUIDPipe) id: string): Promise<{ likesCount: number }> {
    return this.likeCatalogProductUseCase.execute(id, 1);
  }

  @Post('products/:id/unlike')
  @HttpCode(HttpStatus.OK)
  unlike(@Param('id', ParseUUIDPipe) id: string): Promise<{ likesCount: number }> {
    return this.likeCatalogProductUseCase.execute(id, -1);
  }
}
