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
import { CreateCatalogPhoneUseCase } from '../../application/use-cases/create-catalog-phone.use-case';
import { UpdateCatalogPhoneUseCase } from '../../application/use-cases/update-catalog-phone.use-case';
import { ListCatalogPhonesUseCase } from '../../application/use-cases/list-catalog-phones.use-case';
import { GetCatalogPhoneByIdUseCase } from '../../application/use-cases/get-catalog-phone-by-id.use-case';
import { ActivateCatalogPhoneUseCase } from '../../application/use-cases/activate-catalog-phone.use-case';
import { DeactivateCatalogPhoneUseCase } from '../../application/use-cases/deactivate-catalog-phone.use-case';
import { PublishCatalogPhoneUseCase } from '../../application/use-cases/publish-catalog-phone.use-case';
import { UnpublishCatalogPhoneUseCase } from '../../application/use-cases/unpublish-catalog-phone.use-case';
import { ReorderCatalogPhonesUseCase } from '../../application/use-cases/reorder-catalog-phones.use-case';
import { AddCatalogPhoneImageUseCase } from '../../application/use-cases/add-catalog-phone-image.use-case';
import { RemoveCatalogPhoneImageUseCase } from '../../application/use-cases/remove-catalog-phone-image.use-case';
import { SetPrimaryCatalogPhoneImageUseCase } from '../../application/use-cases/set-primary-catalog-phone-image.use-case';
import { CreateCatalogPhoneRequestDto } from '../dtos/create-catalog-phone.request.dto';
import { UpdateCatalogPhoneRequestDto } from '../dtos/update-catalog-phone.request.dto';
import { ListCatalogPhonesQueryDto } from '../dtos/list-catalog-phones.query.dto';
import { ReorderCatalogPhonesRequestDto } from '../dtos/reorder-catalog-phones.request.dto';
import {
  CatalogPhoneImageResponseDto,
  CatalogPhoneResponseDto,
} from '../dtos/catalog-phone.response.dto';

/** Same minimal shape `PhoneSalesController`/`RechargeSimsController` read off an uploaded file — avoids a `@types/multer` dependency for one field. */
interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/**
 * "Catálogo → Teléfonos" management — admin-only end-to-end, including
 * `GET` (unlike `PhonesController`'s "any authenticated account" policy):
 * this screen exposes unpublished/inactive phones and lets someone change
 * what the public sees on the landing page, which is a business/marketing
 * decision, not an operational daily-register task.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('catalog/phones')
export class CatalogPhonesController {
  constructor(
    private readonly createCatalogPhoneUseCase: CreateCatalogPhoneUseCase,
    private readonly updateCatalogPhoneUseCase: UpdateCatalogPhoneUseCase,
    private readonly listCatalogPhonesUseCase: ListCatalogPhonesUseCase,
    private readonly getCatalogPhoneByIdUseCase: GetCatalogPhoneByIdUseCase,
    private readonly activateCatalogPhoneUseCase: ActivateCatalogPhoneUseCase,
    private readonly deactivateCatalogPhoneUseCase: DeactivateCatalogPhoneUseCase,
    private readonly publishCatalogPhoneUseCase: PublishCatalogPhoneUseCase,
    private readonly unpublishCatalogPhoneUseCase: UnpublishCatalogPhoneUseCase,
    private readonly reorderCatalogPhonesUseCase: ReorderCatalogPhonesUseCase,
    private readonly addCatalogPhoneImageUseCase: AddCatalogPhoneImageUseCase,
    private readonly removeCatalogPhoneImageUseCase: RemoveCatalogPhoneImageUseCase,
    private readonly setPrimaryCatalogPhoneImageUseCase: SetPrimaryCatalogPhoneImageUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateCatalogPhoneRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogPhoneResponseDto> {
    return this.createCatalogPhoneUseCase.execute({
      brand: dto.brand,
      model: dto.model,
      description: dto.description ?? null,
      price: dto.price,
      screen: dto.screen ?? null,
      ram: dto.ram ?? null,
      storage: dto.storage ?? null,
      camera: dto.camera ?? null,
      battery: dto.battery ?? null,
      processor: dto.processor ?? null,
      operatingSystem: dto.operatingSystem ?? null,
      extraSpecs: dto.extraSpecs ?? [],
      userId,
    });
  }

  @Get()
  findAll(
    @Query() query: ListCatalogPhonesQueryDto,
  ): Promise<CatalogPhoneResponseDto[]> {
    return this.listCatalogPhonesUseCase.execute({
      includeInactive: query.includeInactive,
      search: query.search,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CatalogPhoneResponseDto> {
    return this.getCatalogPhoneByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogPhoneRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogPhoneResponseDto> {
    return this.updateCatalogPhoneUseCase.execute(id, {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      price: dto.price,
      screen: dto.screen,
      ram: dto.ram,
      storage: dto.storage,
      camera: dto.camera,
      battery: dto.battery,
      processor: dto.processor,
      operatingSystem: dto.operatingSystem,
      extraSpecs: dto.extraSpecs,
      userId,
    });
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.activateCatalogPhoneUseCase.execute(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.deactivateCatalogPhoneUseCase.execute(id, userId);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.publishCatalogPhoneUseCase.execute(id, userId);
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  unpublish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.unpublishCatalogPhoneUseCase.execute(id, userId);
  }

  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  reorder(@Body() dto: ReorderCatalogPhonesRequestDto): Promise<void> {
    return this.reorderCatalogPhonesUseCase.execute(dto.items);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  addImage(
    @Param('id', ParseUUIDPipe) catalogPhoneId: string,
    @UploadedFile() image: UploadedImageFile,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogPhoneImageResponseDto> {
    return this.addCatalogPhoneImageUseCase.execute({
      catalogPhoneId,
      image: {
        buffer: image.buffer,
        mimetype: image.mimetype,
        size: image.size,
      },
      userId,
    });
  }

  @Delete(':id/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeImage(
    @Param('id', ParseUUIDPipe) catalogPhoneId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ): Promise<void> {
    return this.removeCatalogPhoneImageUseCase.execute(catalogPhoneId, imageId);
  }

  @Post(':id/images/:imageId/primary')
  @HttpCode(HttpStatus.OK)
  setPrimaryImage(
    @Param('id', ParseUUIDPipe) catalogPhoneId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ): Promise<void> {
    return this.setPrimaryCatalogPhoneImageUseCase.execute(
      catalogPhoneId,
      imageId,
    );
  }
}
