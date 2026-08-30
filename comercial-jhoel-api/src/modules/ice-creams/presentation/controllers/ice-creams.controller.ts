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
import { CreateIceCreamUseCase } from '../../application/use-cases/create-ice-cream.use-case';
import { ListIceCreamsUseCase } from '../../application/use-cases/list-ice-creams.use-case';
import { GetIceCreamByIdUseCase } from '../../application/use-cases/get-ice-cream-by-id.use-case';
import { UpdateIceCreamUseCase } from '../../application/use-cases/update-ice-cream.use-case';
import { DeactivateIceCreamUseCase } from '../../application/use-cases/deactivate-ice-cream.use-case';
import { CreateIceCreamRequestDto } from '../dtos/create-ice-cream.request.dto';
import { UpdateIceCreamRequestDto } from '../dtos/update-ice-cream.request.dto';
import { ListIceCreamsQueryDto } from '../dtos/list-ice-creams.query.dto';
import {
  IceCreamResponseDto,
  PaginatedIceCreamsResponseDto,
} from '../dtos/ice-cream.response.dto';

/**
 * CRUD is admin-only (create/update/deactivate), same policy as
 * `ProductsController` — a USER can read the catalog (needed for the
 * purchase/sale product pickers) but never manage it.
 */
@UseGuards(JwtAuthGuard)
@Controller('ice-creams')
export class IceCreamsController {
  constructor(
    private readonly createIceCreamUseCase: CreateIceCreamUseCase,
    private readonly listIceCreamsUseCase: ListIceCreamsUseCase,
    private readonly getIceCreamByIdUseCase: GetIceCreamByIdUseCase,
    private readonly updateIceCreamUseCase: UpdateIceCreamUseCase,
    private readonly deactivateIceCreamUseCase: DeactivateIceCreamUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateIceCreamRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<IceCreamResponseDto> {
    return this.createIceCreamUseCase.execute({ ...dto, createdBy: userId });
  }

  @Get()
  findAll(
    @Query() query: ListIceCreamsQueryDto,
  ): Promise<PaginatedIceCreamsResponseDto> {
    return this.listIceCreamsUseCase.execute(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IceCreamResponseDto> {
    return this.getIceCreamByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIceCreamRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<IceCreamResponseDto> {
    return this.updateIceCreamUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateIceCreamUseCase.execute(id);
  }
}
