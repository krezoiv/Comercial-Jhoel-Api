import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  AdjustFinancialDayMovementUseCase,
  CloseFinancialDayReviewUseCase,
  CorrectFinancialDaySnapshotUseCase,
  GetFinancialDayReviewSessionUseCase,
  GetFinancialDayReviewUseCase,
  ListFinancialDayCorrectionsUseCase,
  ListFinancialDaysUseCase,
  OpenFinancialDayReviewUseCase,
  RequestFinancialDayReviewCloseUseCase,
} from '../../application/use-cases/financial-day-review.use-cases';
import {
  AdjustMovementRequestDto,
  CloseFinancialDayReviewRequestDto,
  CorrectSnapshotRequestDto,
  ListCorrectionsQueryDto,
  ListFinancialDaysQueryDto,
  OpenFinancialDayReviewRequestDto,
} from '../dtos/financial-day-review.request.dto';

/**
 * Sistema → Administración financiera → Revisión de días operativos.
 * Class-level `@Roles`: only SUPER_ADMIN/ADMIN reach any route
 * (`financial_days.review`); corrections, open and close additionally need
 * `financial_days.correct` (SUPER_ADMIN), re-checked by each use case and
 * again by the PostgreSQL functions.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
@Controller('financial-day-reviews')
export class FinancialDayReviewController {
  constructor(
    private readonly listDays: ListFinancialDaysUseCase,
    private readonly getDay: GetFinancialDayReviewUseCase,
    private readonly openReview: OpenFinancialDayReviewUseCase,
    private readonly correctSnapshot: CorrectFinancialDaySnapshotUseCase,
    private readonly adjustMovement: AdjustFinancialDayMovementUseCase,
    private readonly requestClose: RequestFinancialDayReviewCloseUseCase,
    private readonly closeReview: CloseFinancialDayReviewUseCase,
    private readonly listCorrections: ListFinancialDayCorrectionsUseCase,
    private readonly getSession: GetFinancialDayReviewSessionUseCase,
  ) {}

  @Get('days')
  days(
    @Query() query: ListFinancialDaysQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listDays.execute({ ...query, role: user.role });
  }

  @Get('days/:date')
  day(@Param('date') date: string, @CurrentUser() user: RequestUser) {
    return this.getDay.execute({ date, userId: user.userId, role: user.role });
  }

  @Get('corrections')
  corrections(
    @Query() query: ListCorrectionsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listCorrections.execute({ ...query, role: user.role });
  }

  @Post('sessions')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  open(
    @Body() dto: OpenFinancialDayReviewRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.openReview.execute({
      date: dto.date,
      reason: dto.reason,
      userId: user.userId,
      role: user.role,
    });
  }

  @Get('sessions/:id')
  session(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getSession.execute({ sessionId: id, role: user.role });
  }

  @Post('sessions/:id/snapshot-corrections')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  snapshot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CorrectSnapshotRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.correctSnapshot.execute({
      sessionId: id,
      target: dto.target,
      targetId: dto.targetId,
      field: dto.field,
      newValue: dto.newValue,
      reason: dto.reason,
      observations: dto.observations,
      requestId: dto.requestId,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('sessions/:id/movement-adjustments')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  movement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdjustMovementRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.adjustMovement.execute({
      sessionId: id,
      source: dto.source,
      sourceId: dto.sourceId,
      correctedAmount: dto.correctedAmount,
      reason: dto.reason,
      observations: dto.observations,
      requestId: dto.requestId,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('sessions/:id/close-request')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  closeRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.requestClose.execute({
      sessionId: id,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('sessions/:id/close')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  close(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CloseFinancialDayReviewRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.closeReview.execute({
      sessionId: id,
      observations: dto.observations,
      acceptPendingDifferences: dto.acceptPendingDifferences,
      userId: user.userId,
      role: user.role,
    });
  }
}
