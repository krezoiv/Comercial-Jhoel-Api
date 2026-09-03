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
import { CreateBusinessUseCase } from '../../application/use-cases/create-business.use-case';
import { ListBusinessesUseCase } from '../../application/use-cases/list-businesses.use-case';
import { GetBusinessByIdUseCase } from '../../application/use-cases/get-business-by-id.use-case';
import { UpdateBusinessUseCase } from '../../application/use-cases/update-business.use-case';
import { DeactivateBusinessUseCase } from '../../application/use-cases/deactivate-business.use-case';
import { CreateBusinessRequestDto } from '../dtos/create-business.request.dto';
import { UpdateBusinessRequestDto } from '../dtos/update-business.request.dto';
import { ListBusinessesQueryDto } from '../dtos/list-businesses.query.dto';
import { BusinessResponseDto } from '../dtos/business.response.dto';

/** A structural clone of `CategoriesController` (see that class's own doc comment for the full CRUD/guard-shape rationale) — `name` globally unique, soft delete, `GET` open to any authenticated role, mutations admin-only. */
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly listBusinessesUseCase: ListBusinessesUseCase,
    private readonly getBusinessByIdUseCase: GetBusinessByIdUseCase,
    private readonly updateBusinessUseCase: UpdateBusinessUseCase,
    private readonly deactivateBusinessUseCase: DeactivateBusinessUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBusinessRequestDto): Promise<BusinessResponseDto> {
    return this.createBusinessUseCase.execute(dto);
  }

  @Get()
  findAll(
    @Query() query: ListBusinessesQueryDto,
  ): Promise<BusinessResponseDto[]> {
    return this.listBusinessesUseCase.execute({
      activeOnly: !query.includeInactive,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessResponseDto> {
    return this.getBusinessByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBusinessRequestDto,
  ): Promise<BusinessResponseDto> {
    return this.updateBusinessUseCase.execute(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateBusinessUseCase.execute(id);
  }
}
