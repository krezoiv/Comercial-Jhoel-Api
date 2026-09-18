import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
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
import {
  parseOptionalVisitorId,
  parseRequiredVisitorId,
} from '../../../likes/application/utils/parse-visitor-id';

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
  findAll(
    @Query('section') section: string,
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<PublicCatalogProductResponseDto[]> {
    const normalized = CATALOG_PRODUCT_SECTIONS.includes(section as CatalogProductSection)
      ? (section as CatalogProductSection)
      : 'LIBRERIA';
    return this.listPublishedCatalogProductsUseCase.execute(
      normalized,
      parseOptionalVisitorId(visitorIdHeader),
    );
  }

  @Get('products/:id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<PublicCatalogProductResponseDto> {
    return this.getPublishedCatalogProductByIdUseCase.execute(
      id,
      parseOptionalVisitorId(visitorIdHeader),
    );
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
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  like(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<{ likesCount: number; liked: boolean }> {
    return this.likeCatalogProductUseCase.execute(id, parseRequiredVisitorId(visitorIdHeader), 'LIKE');
  }

  @Post('products/:id/unlike')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  unlike(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<{ likesCount: number; liked: boolean }> {
    return this.likeCatalogProductUseCase.execute(id, parseRequiredVisitorId(visitorIdHeader), 'UNLIKE');
  }
}
