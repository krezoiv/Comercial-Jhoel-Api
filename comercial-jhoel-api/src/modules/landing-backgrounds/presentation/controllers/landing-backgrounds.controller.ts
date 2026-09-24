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
import { CreateLandingBackgroundUseCase } from '../../application/use-cases/create-landing-background.use-case';
import { UpdateLandingBackgroundUseCase } from '../../application/use-cases/update-landing-background.use-case';
import { ListLandingBackgroundsUseCase } from '../../application/use-cases/list-landing-backgrounds.use-case';
import { GetLandingBackgroundByIdUseCase } from '../../application/use-cases/get-landing-background-by-id.use-case';
import { SetLandingBackgroundActiveUseCase } from '../../application/use-cases/set-landing-background-active.use-case';
import { SetLandingBackgroundImageUseCase } from '../../application/use-cases/set-landing-background-image.use-case';
import { RemoveLandingBackgroundImageUseCase } from '../../application/use-cases/remove-landing-background-image.use-case';
import { CreateLandingBackgroundRequestDto } from '../dtos/create-landing-background.request.dto';
import { UpdateLandingBackgroundRequestDto } from '../dtos/update-landing-background.request.dto';
import { ListLandingBackgroundsQueryDto } from '../dtos/list-landing-backgrounds.query.dto';
import { LandingBackgroundResponseDto } from '../dtos/landing-background.response.dto';

interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/**
 * Admin-only end to end — "Sistema → Fondos de Landing". Nunca reemplaza
 * ni se mezcla con los catálogos de contenido (Teléfonos/Librería/
 * Variedades/Bancos/Noticias) — esto es exclusivamente la capa visual de
 * fondo de una sección, no un ítem de catálogo.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('landing-backgrounds')
export class LandingBackgroundsController {
  constructor(
    private readonly createLandingBackgroundUseCase: CreateLandingBackgroundUseCase,
    private readonly updateLandingBackgroundUseCase: UpdateLandingBackgroundUseCase,
    private readonly listLandingBackgroundsUseCase: ListLandingBackgroundsUseCase,
    private readonly getLandingBackgroundByIdUseCase: GetLandingBackgroundByIdUseCase,
    private readonly setLandingBackgroundActiveUseCase: SetLandingBackgroundActiveUseCase,
    private readonly setLandingBackgroundImageUseCase: SetLandingBackgroundImageUseCase,
    private readonly removeLandingBackgroundImageUseCase: RemoveLandingBackgroundImageUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateLandingBackgroundRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<LandingBackgroundResponseDto> {
    return this.createLandingBackgroundUseCase.execute({
      name: dto.name,
      sectionKey: dto.sectionKey,
      opacity: dto.opacity,
      overlay: dto.overlay,
      position: dto.position,
      size: dto.size,
      depthEffect: dto.depthEffect,
      parallax: dto.parallax,
      movement: dto.movement,
      userId,
    });
  }

  @Get()
  findAll(@Query() query: ListLandingBackgroundsQueryDto): Promise<LandingBackgroundResponseDto[]> {
    return this.listLandingBackgroundsUseCase.execute({ includeInactive: query.includeInactive });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<LandingBackgroundResponseDto> {
    return this.getLandingBackgroundByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLandingBackgroundRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<LandingBackgroundResponseDto> {
    return this.updateLandingBackgroundUseCase.execute(id, {
      name: dto.name,
      sectionKey: dto.sectionKey,
      opacity: dto.opacity,
      overlay: dto.overlay,
      position: dto.position,
      size: dto.size,
      depthEffect: dto.depthEffect,
      parallax: dto.parallax,
      movement: dto.movement,
      userId,
    });
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string): Promise<void> {
    return this.setLandingBackgroundActiveUseCase.execute(id, true, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string): Promise<void> {
    return this.setLandingBackgroundActiveUseCase.execute(id, false, userId);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  setImage(
    @Param('id', ParseUUIDPipe) landingBackgroundId: string,
    @UploadedFile() image: UploadedImageFile,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setLandingBackgroundImageUseCase.execute({
      landingBackgroundId,
      image: { buffer: image.buffer, mimetype: image.mimetype, size: image.size },
      userId,
    });
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeImage(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string): Promise<void> {
    return this.removeLandingBackgroundImageUseCase.execute(id, userId);
  }
}
