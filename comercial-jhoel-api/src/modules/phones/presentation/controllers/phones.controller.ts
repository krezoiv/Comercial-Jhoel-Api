import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreatePhoneUseCase } from '../../application/use-cases/create-phone.use-case';
import { ListPhonesUseCase } from '../../application/use-cases/list-phones.use-case';
import { GetPhoneByIdUseCase } from '../../application/use-cases/get-phone-by-id.use-case';
import { CreatePhoneRequestDto } from '../dtos/create-phone.request.dto';
import { PhoneResponseDto } from '../dtos/phone.response.dto';

/**
 * Inventario/Compra de teléfonos — no `@Roles(...)`, same "any authenticated
 * active account" operational policy as Ventas/Compras/Recargas (registering
 * a phone purchase is a daily register task, not admin-only).
 */
@UseGuards(JwtAuthGuard)
@Controller('phones')
export class PhonesController {
  constructor(
    private readonly createPhoneUseCase: CreatePhoneUseCase,
    private readonly listPhonesUseCase: ListPhonesUseCase,
    private readonly getPhoneByIdUseCase: GetPhoneByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreatePhoneRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PhoneResponseDto> {
    return this.createPhoneUseCase.execute({
      operator: dto.operator,
      phoneNumber: dto.phoneNumber,
      imei: dto.imei,
      costPrice: dto.costPrice,
      publicPrice: dto.publicPrice,
      purchaseDate: dto.purchaseDate,
      userId,
    });
  }

  @Get()
  findAll(): Promise<PhoneResponseDto[]> {
    return this.listPhonesUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PhoneResponseDto> {
    return this.getPhoneByIdUseCase.execute(id);
  }
}
