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
import { CreateSupplierUseCase } from '../../application/use-cases/create-supplier.use-case';
import { ListSuppliersUseCase } from '../../application/use-cases/list-suppliers.use-case';
import { GetSupplierByIdUseCase } from '../../application/use-cases/get-supplier-by-id.use-case';
import { UpdateSupplierUseCase } from '../../application/use-cases/update-supplier.use-case';
import { DeactivateSupplierUseCase } from '../../application/use-cases/deactivate-supplier.use-case';
import { CreateSupplierRequestDto } from '../dtos/create-supplier.request.dto';
import { UpdateSupplierRequestDto } from '../dtos/update-supplier.request.dto';
import { ListSuppliersQueryDto } from '../dtos/list-suppliers.query.dto';
import { SupplierResponseDto } from '../dtos/supplier.response.dto';

@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly listSuppliersUseCase: ListSuppliersUseCase,
    private readonly getSupplierByIdUseCase: GetSupplierByIdUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly deactivateSupplierUseCase: DeactivateSupplierUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSupplierRequestDto): Promise<SupplierResponseDto> {
    return this.createSupplierUseCase.execute(dto);
  }

  @Get()
  findAll(
    @Query() query: ListSuppliersQueryDto,
  ): Promise<SupplierResponseDto[]> {
    return this.listSuppliersUseCase.execute({
      activeOnly: !query.includeInactive,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SupplierResponseDto> {
    return this.getSupplierByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupplierRequestDto,
  ): Promise<SupplierResponseDto> {
    return this.updateSupplierUseCase.execute(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateSupplierUseCase.execute(id);
  }
}
