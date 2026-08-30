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
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';
import { ListClientsUseCase } from '../../application/use-cases/list-clients.use-case';
import { GetClientByIdUseCase } from '../../application/use-cases/get-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client.use-case';
import { DeactivateClientUseCase } from '../../application/use-cases/deactivate-client.use-case';
import { CreateClientRequestDto } from '../dtos/create-client.request.dto';
import { UpdateClientRequestDto } from '../dtos/update-client.request.dto';
import { ListClientsQueryDto } from '../dtos/list-clients.query.dto';
import { ClientResponseDto } from '../dtos/client.response.dto';

/**
 * Create/update/deactivate are admin-only — same policy as CategoriesController/
 * AccountTypesController. Any authenticated role (SUPER_ADMIN/ADMIN/USER) can still
 * list/consult, since Clientes is a catalog other operational screens (future Ventas)
 * will need to read from. Enforcement is here, not in the frontend — see the frontend's
 * `canManage` gating, which only hides the buttons.
 */
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly listClientsUseCase: ListClientsUseCase,
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deactivateClientUseCase: DeactivateClientUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateClientRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<ClientResponseDto> {
    return this.createClientUseCase.execute({ ...dto, createdBy: userId });
  }

  @Get()
  findAll(@Query() query: ListClientsQueryDto): Promise<ClientResponseDto[]> {
    return this.listClientsUseCase.execute(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClientResponseDto> {
    return this.getClientByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClientRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<ClientResponseDto> {
    return this.updateClientUseCase.execute(id, { ...dto, updatedBy: userId });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateClientUseCase.execute(id);
  }
}
