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
import { CreateCatalogBankUseCase } from '../../application/use-cases/create-catalog-bank.use-case';
import { UpdateCatalogBankUseCase } from '../../application/use-cases/update-catalog-bank.use-case';
import { ListCatalogBanksUseCase } from '../../application/use-cases/list-catalog-banks.use-case';
import { GetCatalogBankByIdUseCase } from '../../application/use-cases/get-catalog-bank-by-id.use-case';
import { SetCatalogBankActiveUseCase } from '../../application/use-cases/set-catalog-bank-active.use-case';
import { ReorderCatalogBanksUseCase } from '../../application/use-cases/reorder-catalog-banks.use-case';
import { SetCatalogBankImageUseCase } from '../../application/use-cases/set-catalog-bank-image.use-case';
import { RemoveCatalogBankImageUseCase } from '../../application/use-cases/remove-catalog-bank-image.use-case';
import { CreateCatalogBankRequestDto } from '../dtos/create-catalog-bank.request.dto';
import { UpdateCatalogBankRequestDto } from '../dtos/update-catalog-bank.request.dto';
import { ListCatalogBanksQueryDto } from '../dtos/list-catalog-banks.query.dto';
import { ReorderCatalogBanksRequestDto } from '../dtos/reorder-catalog-banks.request.dto';
import { CatalogBankResponseDto } from '../dtos/catalog-bank.response.dto';

interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/**
 * Admin-only end to end — "Sistema → Catálogo de Bancos". Completamente
 * independiente del `BanksController` financiero (`/banks`, Cuadre de
 * Agentes) — este controller nunca lee ni escribe esa tabla.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('catalog-banks')
export class CatalogBanksController {
  constructor(
    private readonly createCatalogBankUseCase: CreateCatalogBankUseCase,
    private readonly updateCatalogBankUseCase: UpdateCatalogBankUseCase,
    private readonly listCatalogBanksUseCase: ListCatalogBanksUseCase,
    private readonly getCatalogBankByIdUseCase: GetCatalogBankByIdUseCase,
    private readonly setCatalogBankActiveUseCase: SetCatalogBankActiveUseCase,
    private readonly reorderCatalogBanksUseCase: ReorderCatalogBanksUseCase,
    private readonly setCatalogBankImageUseCase: SetCatalogBankImageUseCase,
    private readonly removeCatalogBankImageUseCase: RemoveCatalogBankImageUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateCatalogBankRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogBankResponseDto> {
    return this.createCatalogBankUseCase.execute({
      name: dto.name,
      description: dto.description,
      additionalInfo: dto.additionalInfo,
      userId,
    });
  }

  @Get()
  findAll(@Query() query: ListCatalogBanksQueryDto): Promise<CatalogBankResponseDto[]> {
    return this.listCatalogBanksUseCase.execute({
      includeInactive: query.includeInactive,
      search: query.search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CatalogBankResponseDto> {
    return this.getCatalogBankByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogBankRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogBankResponseDto> {
    return this.updateCatalogBankUseCase.execute(id, {
      name: dto.name,
      description: dto.description,
      additionalInfo: dto.additionalInfo,
      userId,
    });
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setCatalogBankActiveUseCase.execute(id, true, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setCatalogBankActiveUseCase.execute(id, false, userId);
  }

  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  reorder(@Body() dto: ReorderCatalogBanksRequestDto): Promise<void> {
    return this.reorderCatalogBanksUseCase.execute(dto.items);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  setImage(
    @Param('id', ParseUUIDPipe) catalogBankId: string,
    @UploadedFile() image: UploadedImageFile,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setCatalogBankImageUseCase.execute({
      catalogBankId,
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
    return this.removeCatalogBankImageUseCase.execute(id, userId);
  }
}
