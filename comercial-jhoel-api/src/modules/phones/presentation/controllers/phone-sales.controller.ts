import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { RegisterPhoneSaleUseCase } from '../../application/use-cases/register-phone-sale.use-case';
import { ListPhoneSalesUseCase } from '../../application/use-cases/list-phone-sales.use-case';
import { GetPhoneSaleByIdUseCase } from '../../application/use-cases/get-phone-sale-by-id.use-case';
import { GetPhoneSaleDpiImageUseCase } from '../../application/use-cases/get-phone-sale-dpi-image.use-case';
import { VoidPhoneSaleUseCase } from '../../application/use-cases/void-phone-sale.use-case';
import { RegisterPhoneSaleRequestDto } from '../dtos/register-phone-sale.request.dto';
import { VoidPhoneSaleRequestDto } from '../dtos/void-phone-sale.request.dto';
import { PhoneSaleResponseDto } from '../dtos/phone-sale.response.dto';

/** Same minimal shape `RechargeSimsController` reads off an uploaded file — avoids a `@types/multer` dependency for one field. */
interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/**
 * Venta de teléfonos — registering a sale is operational (no `@Roles(...)`,
 * same policy as Ventas/Compras/Recargas/SIM); anular is admin-only, same
 * elevated policy as every other void action in this codebase.
 */
@UseGuards(JwtAuthGuard)
@Controller('phone-sales')
export class PhoneSalesController {
  constructor(
    private readonly registerPhoneSaleUseCase: RegisterPhoneSaleUseCase,
    private readonly listPhoneSalesUseCase: ListPhoneSalesUseCase,
    private readonly getPhoneSaleByIdUseCase: GetPhoneSaleByIdUseCase,
    private readonly getPhoneSaleDpiImageUseCase: GetPhoneSaleDpiImageUseCase,
    private readonly voidPhoneSaleUseCase: VoidPhoneSaleUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('dpiImage'))
  @HttpCode(HttpStatus.CREATED)
  registerSale(
    @Body() dto: RegisterPhoneSaleRequestDto,
    @UploadedFile() dpiImage: UploadedImageFile | undefined,
    @CurrentUser('userId') userId: string,
  ): Promise<PhoneSaleResponseDto> {
    return this.registerPhoneSaleUseCase.execute({
      phoneId: dto.phoneId,
      clientId: dto.clientId ?? null,
      clientDpi: dto.clientDpi,
      salePrice: dto.salePrice,
      saleDate: dto.saleDate,
      userId,
      dpiImage: dpiImage
        ? {
            buffer: dpiImage.buffer,
            mimetype: dpiImage.mimetype,
            size: dpiImage.size,
          }
        : null,
    });
  }

  @Get()
  findAll(): Promise<PhoneSaleResponseDto[]> {
    return this.listPhoneSalesUseCase.execute();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PhoneSaleResponseDto> {
    return this.getPhoneSaleByIdUseCase.execute(id);
  }

  /**
   * The ONE place a phone sale's DPI photo bytes are ever served — still
   * behind the controller's own `JwtAuthGuard`, never a public/static path.
   * `@Res()` direct response, same `ResponseInterceptor`-bypass pattern
   * every PDF export/DPI-image endpoint in this codebase already uses.
   */
  @Get(':id/dpi-image')
  async getDpiImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.getPhoneSaleDpiImageUseCase.execute(id);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'private, max-age=3600',
    });
    res.send(image.data);
  }

  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  voidSale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidPhoneSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PhoneSaleResponseDto> {
    return this.voidPhoneSaleUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }
}
