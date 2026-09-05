import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetCompanySettingsUseCase } from '../../application/use-cases/get-company-settings.use-case';
import { UpdateCompanySettingsUseCase } from '../../application/use-cases/update-company-settings.use-case';
import { UpdateCompanySettingsRequestDto } from '../dtos/update-company-settings.request.dto';
import { CompanySettingsResponseDto } from '../dtos/company-settings.response.dto';

/**
 * "Configuración de Empresa" — the one centralized source of branding/
 * contact data (logo, name, address, phone, email, NIT) every document PDF
 * (Venta, Compra, Ticket, Cotización) reads its letterhead from. Reading is
 * open to any authenticated account (every document-generation code path
 * needs it, not just admins); only changing it is a management action.
 */
@UseGuards(JwtAuthGuard)
@Controller('company-settings')
export class CompanySettingsController {
  constructor(
    private readonly getCompanySettingsUseCase: GetCompanySettingsUseCase,
    private readonly updateCompanySettingsUseCase: UpdateCompanySettingsUseCase,
  ) {}

  @Get()
  get(): Promise<CompanySettingsResponseDto> {
    return this.getCompanySettingsUseCase.execute();
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(
    @Body() dto: UpdateCompanySettingsRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CompanySettingsResponseDto> {
    return this.updateCompanySettingsUseCase.execute({
      businessName: dto.businessName,
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
      taxId: dto.taxId,
      logoBase64: dto.logoBase64,
      socialMedia: dto.socialMedia,
      updatedBy: userId,
    });
  }
}
