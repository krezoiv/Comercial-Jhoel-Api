import {
  BadRequestException,
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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeactivateProductUseCase } from '../../application/use-cases/deactivate-product.use-case';
import { ExportProductsPdfUseCase } from '../../application/use-cases/export-products-pdf.use-case';
import { ExportProductsExcelUseCase } from '../../application/use-cases/export-products-excel.use-case';
import { ImportProductsFromExcelUseCase } from '../../application/use-cases/import-products-from-excel.use-case';
import { buildProductsImportTemplate } from '../../infrastructure/excel/products-excel.builder';
import { CreateProductRequestDto } from '../dtos/create-product.request.dto';
import { UpdateProductRequestDto } from '../dtos/update-product.request.dto';
import { ListProductsQueryDto } from '../dtos/list-products.query.dto';
import { ExportProductsQueryDto } from '../dtos/export-products.query.dto';
import {
  PaginatedProductsResponseDto,
  ProductResponseDto,
} from '../dtos/product.response.dto';
import { ImportProductsResultResponseDto } from '../dtos/import-products-result.response.dto';

/** The minimal shape actually read off an uploaded file — avoids a dependency on `@types/multer` (not installed; `multer` itself ships transitively via `@nestjs/platform-express`, see that module's own doc comment) for a single-field usage. */
interface UploadedExcelFile {
  buffer: Buffer;
  originalname: string;
  size: number;
}

const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Follows the same CRUD/guard shape as `CategoriesController` (`GET` open
 * to any authenticated role, mutations admin-only, soft delete), but with
 * genuinely more validation: a product must reference an active
 * `categoryId` and `businessId` (see `CreateProductUseCase`/
 * `UpdateProductUseCase`), `name` is unique only among active products,
 * and the optional `sku` follows the identical "unique only among active
 * rows, many `NULL`s allowed" pattern.
 */
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deactivateProductUseCase: DeactivateProductUseCase,
    private readonly exportProductsPdfUseCase: ExportProductsPdfUseCase,
    private readonly exportProductsExcelUseCase: ExportProductsExcelUseCase,
    private readonly importProductsFromExcelUseCase: ImportProductsFromExcelUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.createProductUseCase.execute(dto);
  }

  @Get()
  findAll(
    @Query() query: ListProductsQueryDto,
  ): Promise<PaginatedProductsResponseDto> {
    return this.listProductsUseCase.execute(query);
  }

  /**
   * Declared before `:id` — same route-ordering discipline as every other
   * export/summary route in this codebase (Sales/Purchases/Reportería):
   * otherwise Nest would match `GET /products/export/pdf` as
   * `GET /products/:id` with `id="export"` and fail `ParseUUIDPipe` before
   * ever reaching this handler. Same open-to-any-authenticated-role guard
   * as `GET /products` itself — exporting what you can already see isn't a
   * new permission.
   */
  @Get('export/pdf')
  async exportPdf(
    @Query() query: ExportProductsQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportProductsPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="inventario-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  @Get('export/excel')
  async exportExcel(
    @Query() query: ExportProductsQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportProductsExcelUseCase.execute(query);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="inventario-${Date.now()}.xlsx"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  /**
   * Declared before `:id` for the same route-ordering reason as
   * `export/pdf`/`export/excel` above. Admin-only, same gate as `POST
   * /products` itself — bulk-creating products is a heavier version of the
   * same action, never a lighter one.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('import/template')
  async importTemplate(@Res() res: Response): Promise<void> {
    const buffer = await buildProductsImportTemplate();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="plantilla-importar-productos.xlsx"',
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_FILE_SIZE_BYTES } }),
  )
  importExcel(
    @UploadedFile() file: UploadedExcelFile,
  ): Promise<ImportProductsResultResponseDto> {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo Excel (.xlsx).');
    }
    return this.importProductsFromExcelUseCase.execute(file.buffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
    return this.getProductByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.updateProductUseCase.execute(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateProductUseCase.execute(id);
  }
}
