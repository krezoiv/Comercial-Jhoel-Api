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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreatePresentationTypeUseCase } from '../../application/use-cases/create-presentation-type.use-case';
import { ListPresentationTypesUseCase } from '../../application/use-cases/list-presentation-types.use-case';
import { GetPresentationTypeByIdUseCase } from '../../application/use-cases/get-presentation-type-by-id.use-case';
import { UpdatePresentationTypeUseCase } from '../../application/use-cases/update-presentation-type.use-case';
import { DeactivatePresentationTypeUseCase } from '../../application/use-cases/deactivate-presentation-type.use-case';
import { CreatePresentationTypeRequestDto } from '../dtos/create-presentation-type.request.dto';
import { UpdatePresentationTypeRequestDto } from '../dtos/update-presentation-type.request.dto';
import { ListPresentationTypesQueryDto } from '../dtos/list-presentation-types.query.dto';
import {
  PresentationTypeListResponseDto,
  PresentationTypeResponseDto,
} from '../dtos/presentation-type.response.dto';

/** CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta. Any authenticated role can read the list (needed by the product/presentation forms' dropdowns). */
@UseGuards(JwtAuthGuard)
@Controller('presentation-types')
export class PresentationTypesController {
  constructor(
    private readonly createPresentationTypeUseCase: CreatePresentationTypeUseCase,
    private readonly listPresentationTypesUseCase: ListPresentationTypesUseCase,
    private readonly getPresentationTypeByIdUseCase: GetPresentationTypeByIdUseCase,
    private readonly updatePresentationTypeUseCase: UpdatePresentationTypeUseCase,
    private readonly deactivatePresentationTypeUseCase: DeactivatePresentationTypeUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreatePresentationTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PresentationTypeResponseDto> {
    return this.createPresentationTypeUseCase.execute({
      ...dto,
      createdBy: userId,
    });
  }

  @Get()
  findAll(
    @Query() query: ListPresentationTypesQueryDto,
  ): Promise<PresentationTypeListResponseDto[]> {
    return this.listPresentationTypesUseCase.execute(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PresentationTypeResponseDto> {
    return this.getPresentationTypeByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePresentationTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PresentationTypeResponseDto> {
    return this.updatePresentationTypeUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivatePresentationTypeUseCase.execute(id);
  }
}
