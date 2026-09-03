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
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case';
import { GetCategoryByIdUseCase } from '../../application/use-cases/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { DeactivateCategoryUseCase } from '../../application/use-cases/deactivate-category.use-case';
import { CreateCategoryRequestDto } from '../dtos/create-category.request.dto';
import { UpdateCategoryRequestDto } from '../dtos/update-category.request.dto';
import { ListCategoriesQueryDto } from '../dtos/list-categories.query.dto';
import { CategoryResponseDto } from '../dtos/category.response.dto';

/**
 * The canonical shape every simple reference-table module in this app
 * follows (`businesses`, `suppliers`, `clients`, `account-types` are all
 * near-identical clones of this exact controller) — flat CRUD over one
 * table, `name` globally unique, soft delete only (`isActive = false`,
 * no row is ever physically removed so nothing that already references it
 * dangles).
 *
 * Two-tier guarding: `JwtAuthGuard` at the class level means every route
 * requires a logged-in session, while `GET` (list/detail) stays open to
 * any authenticated role — viewing the catalog is not a privileged action.
 * `RolesGuard` + `@Roles('ADMIN','SUPER_ADMIN')` is added per-method only
 * on the three mutating routes (create/update/deactivate), since managing
 * the catalog itself is.
 */
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deactivateCategoryUseCase: DeactivateCategoryUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
    return this.createCategoryUseCase.execute(dto);
  }

  @Get()
  findAll(
    @Query() query: ListCategoriesQueryDto,
  ): Promise<CategoryResponseDto[]> {
    return this.listCategoriesUseCase.execute({
      activeOnly: !query.includeInactive,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponseDto> {
    return this.getCategoryByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.updateCategoryUseCase.execute(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateCategoryUseCase.execute(id);
  }
}
