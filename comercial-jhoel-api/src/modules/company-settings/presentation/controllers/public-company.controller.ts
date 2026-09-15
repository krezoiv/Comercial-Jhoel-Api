import { Controller, Get } from '@nestjs/common';
import { GetPublicCompanyInfoUseCase } from '../../application/use-cases/get-public-company-info.use-case';
import { PublicCompanyInfoResponseDto } from '../dtos/public-company-info.response.dto';

/**
 * Public, unauthenticated — backs the landing page's "Contacto" section.
 * No class-level guard, same pattern `AuthController` (`login`) and
 * `UsersController` (`register`) already use for their one public route
 * each: never strip the guard off `CompanySettingsController` itself
 * (that route is load-bearing for the authenticated document-generation
 * flows), add a separate, deliberately narrow route instead.
 */
@Controller('company-info')
export class PublicCompanyController {
  constructor(
    private readonly getPublicCompanyInfoUseCase: GetPublicCompanyInfoUseCase,
  ) {}

  @Get()
  get(): Promise<PublicCompanyInfoResponseDto> {
    return this.getPublicCompanyInfoUseCase.execute();
  }
}
