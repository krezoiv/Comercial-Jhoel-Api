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
} from '@nestjs/common';
import type { Response } from 'express';
import { ListPublishedCatalogPhonesUseCase } from '../../application/use-cases/list-published-catalog-phones.use-case';
import { GetPublishedCatalogPhoneByIdUseCase } from '../../application/use-cases/get-published-catalog-phone-by-id.use-case';
import { GetCatalogPhoneImageUseCase } from '../../application/use-cases/get-catalog-phone-image.use-case';
import { CreateCatalogRequestUseCase } from '../../application/use-cases/create-catalog-request.use-case';
import { CreateCatalogRequestRequestDto } from '../dtos/create-catalog-request.request.dto';
import { CatalogRequestResponseDto } from '../dtos/catalog-request.response.dto';
import { PublicCatalogPhoneResponseDto } from '../dtos/public-catalog-phone.response.dto';

/**
 * Public, unauthenticated — backs the landing page's "Teléfonos" section.
 * No class-level guard, same pattern `PublicCompanyController` already
 * uses: never strip the guard off `CatalogPhonesController`/
 * `CatalogRequestsController` themselves, add a separate, deliberately
 * narrow route instead. Every response here is filtered/recalculated
 * server-side — nothing here ever trusts client-supplied price or
 * eligibility data (see `CreateCatalogRequestUseCase`).
 *
 * Deliberately a DIFFERENT path prefix (`public-catalog`, not `catalog`) —
 * same reasoning `PublicCompanyController` already applies (`company-info`
 * vs. `company-settings`): `CatalogPhonesController` already owns
 * `GET /catalog/phones` (admin-gated). Nest matches routes in controller
 * registration order with no guard-awareness, so a same-path public route
 * registered after it would simply never be reached, and one registered
 * before it would shadow the admin route instead — reusing the same path
 * is unsafe here regardless of order, hence the separate prefix.
 */
@Controller('public-catalog')
export class PublicCatalogController {
  constructor(
    private readonly listPublishedCatalogPhonesUseCase: ListPublishedCatalogPhonesUseCase,
    private readonly getPublishedCatalogPhoneByIdUseCase: GetPublishedCatalogPhoneByIdUseCase,
    private readonly getCatalogPhoneImageUseCase: GetCatalogPhoneImageUseCase,
    private readonly createCatalogRequestUseCase: CreateCatalogRequestUseCase,
  ) {}

  @Get('phones')
  findAllPublished(): Promise<PublicCatalogPhoneResponseDto[]> {
    return this.listPublishedCatalogPhonesUseCase.execute();
  }

  @Get('phones/:id')
  findOnePublished(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PublicCatalogPhoneResponseDto> {
    return this.getPublishedCatalogPhoneByIdUseCase.execute(id);
  }

  /**
   * The one public place a catalog photo's bytes are served. Long,
   * cacheable `Cache-Control` (unlike the private/short-lived one on
   * `PhoneSalesController.getDpiImage`) — this is marketing content meant
   * to be cached by the browser, not a sensitive identity document.
   *
   * `Cross-Origin-Resource-Policy: cross-origin` overrides `helmet()`'s
   * global default (`same-origin`, set in `main.ts`) — that default is
   * correct everywhere else in this API (nothing else is meant to be
   * loaded as a raw `<img src>`/asset from a different origin), but this
   * one route's entire purpose is exactly that: the landing app
   * (`comercial-jhoel-app`, a different origin in dev and in some deploy
   * topologies) renders these bytes directly via `<img>`. Without this
   * header, Chrome's CORP enforcement blocks the image load outright
   * (`net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`, no HTTP status even
   * reaches the page) even though CORS already allows the request — CORP
   * and CORS are independent checks. Verified live: blocked in the
   * browser console until this header was added, then loaded correctly.
   */
  @Get('phones/images/:imageId')
  async getImage(
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.getCatalogPhoneImageUseCase.execute(imageId);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(image.data);
  }

  @Post('requests')
  @HttpCode(HttpStatus.CREATED)
  createRequest(
    @Body() dto: CreateCatalogRequestRequestDto,
  ): Promise<CatalogRequestResponseDto> {
    return this.createCatalogRequestUseCase.execute({
      catalogPhoneId: dto.catalogPhoneId,
      requestType: dto.requestType,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
    });
  }
}
