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
import { CreateAssetUseCase } from '../../application/use-cases/create-asset.use-case';
import { ListAssetsUseCase } from '../../application/use-cases/list-assets.use-case';
import { GetAssetByIdUseCase } from '../../application/use-cases/get-asset-by-id.use-case';
import { UpdateAssetUseCase } from '../../application/use-cases/update-asset.use-case';
import { DeactivateAssetUseCase } from '../../application/use-cases/deactivate-asset.use-case';
import { CreateAssetRequestDto } from '../dtos/create-asset.request.dto';
import { UpdateAssetRequestDto } from '../dtos/update-asset.request.dto';
import { ListAssetsQueryDto } from '../dtos/list-assets.query.dto';
import {
  AssetResponseDto,
  PaginatedAssetsResponseDto,
} from '../dtos/asset.response.dto';

/** Create/update/deactivate are admin-only — same policy as Products/Clients. Any authenticated role can list/consult. */
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(
    private readonly createAssetUseCase: CreateAssetUseCase,
    private readonly listAssetsUseCase: ListAssetsUseCase,
    private readonly getAssetByIdUseCase: GetAssetByIdUseCase,
    private readonly updateAssetUseCase: UpdateAssetUseCase,
    private readonly deactivateAssetUseCase: DeactivateAssetUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateAssetRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AssetResponseDto> {
    return this.createAssetUseCase.execute({ ...dto, createdBy: userId });
  }

  @Get()
  findAll(
    @Query() query: ListAssetsQueryDto,
  ): Promise<PaginatedAssetsResponseDto> {
    return this.listAssetsUseCase.execute(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AssetResponseDto> {
    return this.getAssetByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssetRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AssetResponseDto> {
    return this.updateAssetUseCase.execute(id, { ...dto, updatedBy: userId });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateAssetUseCase.execute(id);
  }
}
