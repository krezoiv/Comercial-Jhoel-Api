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
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { ListRolesUseCase } from '../../application/use-cases/list-roles.use-case';
import { GetRoleByIdUseCase } from '../../application/use-cases/get-role-by-id.use-case';
import { UpdateRoleUseCase } from '../../application/use-cases/update-role.use-case';
import { DeactivateRoleUseCase } from '../../application/use-cases/deactivate-role.use-case';
import { CreateRoleRequestDto } from '../dtos/create-role.request.dto';
import { UpdateRoleRequestDto } from '../dtos/update-role.request.dto';
import { ListRolesQueryDto } from '../dtos/list-roles.query.dto';
import { RoleResponseDto } from '../dtos/role.response.dto';

/**
 * Every route here — including reads — is admin-only: unlike categories/products,
 * the module ticket for Users & Roles requires SUPER_ADMIN/ADMIN on the whole
 * surface, not just mutations. Only the admin-only Users/Roles screens ever
 * call this controller, so this doesn't block any other feature.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deactivateRoleUseCase: DeactivateRoleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return this.createRoleUseCase.execute(dto);
  }

  @Get()
  findAll(@Query() query: ListRolesQueryDto): Promise<RoleResponseDto[]> {
    return this.listRolesUseCase.execute({
      activeOnly: !query.includeInactive,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RoleResponseDto> {
    return this.getRoleByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    return this.updateRoleUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateRoleUseCase.execute(id);
  }
}
