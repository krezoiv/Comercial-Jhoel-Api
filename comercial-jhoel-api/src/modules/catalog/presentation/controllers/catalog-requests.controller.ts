import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListCatalogRequestsUseCase } from '../../application/use-cases/list-catalog-requests.use-case';
import { GetCatalogRequestByIdUseCase } from '../../application/use-cases/get-catalog-request-by-id.use-case';
import { UpdateCatalogRequestStatusUseCase } from '../../application/use-cases/update-catalog-request-status.use-case';
import { ListCatalogRequestsQueryDto } from '../dtos/list-catalog-requests.query.dto';
import { UpdateCatalogRequestStatusRequestDto } from '../dtos/update-catalog-request-status.request.dto';
import { CatalogRequestResponseDto } from '../dtos/catalog-request.response.dto';

/** "Catálogo → Solicitudes" — admin-only, same guard shape as `CatalogPhonesController`. */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('catalog/requests')
export class CatalogRequestsController {
  constructor(
    private readonly listCatalogRequestsUseCase: ListCatalogRequestsUseCase,
    private readonly getCatalogRequestByIdUseCase: GetCatalogRequestByIdUseCase,
    private readonly updateCatalogRequestStatusUseCase: UpdateCatalogRequestStatusUseCase,
  ) {}

  @Get()
  findAll(
    @Query() query: ListCatalogRequestsQueryDto,
  ): Promise<CatalogRequestResponseDto[]> {
    return this.listCatalogRequestsUseCase.execute({
      status: query.status,
      requestType: query.requestType,
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CatalogRequestResponseDto> {
    return this.getCatalogRequestByIdUseCase.execute(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogRequestStatusRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogRequestResponseDto> {
    return this.updateCatalogRequestStatusUseCase.execute(id, {
      status: dto.status,
      observation: dto.observation,
      userId,
    });
  }
}
