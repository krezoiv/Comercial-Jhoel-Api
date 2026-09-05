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
import { CreateUnitOfMeasureUseCase } from '../../application/use-cases/create-unit-of-measure.use-case';
import { ListUnitsOfMeasureUseCase } from '../../application/use-cases/list-units-of-measure.use-case';
import { GetUnitOfMeasureByIdUseCase } from '../../application/use-cases/get-unit-of-measure-by-id.use-case';
import { UpdateUnitOfMeasureUseCase } from '../../application/use-cases/update-unit-of-measure.use-case';
import { DeactivateUnitOfMeasureUseCase } from '../../application/use-cases/deactivate-unit-of-measure.use-case';
import { CreateUnitOfMeasureRequestDto } from '../dtos/create-unit-of-measure.request.dto';
import { UpdateUnitOfMeasureRequestDto } from '../dtos/update-unit-of-measure.request.dto';
import { ListUnitsOfMeasureQueryDto } from '../dtos/list-units-of-measure.query.dto';
import {
  UnitOfMeasureListResponseDto,
  UnitOfMeasureResponseDto,
} from '../dtos/unit-of-measure.response.dto';

/** CRUD is admin-only (create/update/deactivate) — same policy as Categorías/Negocios/Tipos de Cuenta. Any authenticated role can read the list (needed by the product form's dropdown). */
@UseGuards(JwtAuthGuard)
@Controller('units-of-measure')
export class UnitsOfMeasureController {
  constructor(
    private readonly createUnitOfMeasureUseCase: CreateUnitOfMeasureUseCase,
    private readonly listUnitsOfMeasureUseCase: ListUnitsOfMeasureUseCase,
    private readonly getUnitOfMeasureByIdUseCase: GetUnitOfMeasureByIdUseCase,
    private readonly updateUnitOfMeasureUseCase: UpdateUnitOfMeasureUseCase,
    private readonly deactivateUnitOfMeasureUseCase: DeactivateUnitOfMeasureUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateUnitOfMeasureRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<UnitOfMeasureResponseDto> {
    return this.createUnitOfMeasureUseCase.execute({
      ...dto,
      createdBy: userId,
    });
  }

  @Get()
  findAll(
    @Query() query: ListUnitsOfMeasureQueryDto,
  ): Promise<UnitOfMeasureListResponseDto[]> {
    return this.listUnitsOfMeasureUseCase.execute(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UnitOfMeasureResponseDto> {
    return this.getUnitOfMeasureByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUnitOfMeasureRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<UnitOfMeasureResponseDto> {
    return this.updateUnitOfMeasureUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateUnitOfMeasureUseCase.execute(id);
  }
}
