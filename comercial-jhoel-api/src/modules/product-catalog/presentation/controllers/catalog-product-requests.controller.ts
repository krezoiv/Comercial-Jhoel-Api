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
import { ListCatalogProductRequestsUseCase } from '../../application/use-cases/list-catalog-product-requests.use-case';
import { GetCatalogProductRequestByIdUseCase } from '../../application/use-cases/get-catalog-product-request-by-id.use-case';
import { UpdateCatalogProductRequestStatusUseCase } from '../../application/use-cases/update-catalog-product-request-status.use-case';
import { ListCatalogProductRequestsQueryDto } from '../dtos/list-catalog-product-requests.query.dto';
import { UpdateCatalogProductRequestStatusRequestDto } from '../dtos/update-catalog-product-request-status.request.dto';
import { CatalogProductRequestResponseDto } from '../dtos/catalog-product-request.response.dto';

/** Solicitudes de interés de "Variedades y Accesorios" — Librería nunca genera filas aquí. */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('catalog/product-requests')
export class CatalogProductRequestsController {
  constructor(
    private readonly listCatalogProductRequestsUseCase: ListCatalogProductRequestsUseCase,
    private readonly getCatalogProductRequestByIdUseCase: GetCatalogProductRequestByIdUseCase,
    private readonly updateCatalogProductRequestStatusUseCase: UpdateCatalogProductRequestStatusUseCase,
  ) {}

  @Get()
  findAll(
    @Query() query: ListCatalogProductRequestsQueryDto,
  ): Promise<CatalogProductRequestResponseDto[]> {
    return this.listCatalogProductRequestsUseCase.execute({
      status: query.status,
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CatalogProductRequestResponseDto> {
    return this.getCatalogProductRequestByIdUseCase.execute(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogProductRequestStatusRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CatalogProductRequestResponseDto> {
    return this.updateCatalogProductRequestStatusUseCase.execute(id, {
      status: dto.status,
      observation: dto.observation,
      userId,
    });
  }
}
