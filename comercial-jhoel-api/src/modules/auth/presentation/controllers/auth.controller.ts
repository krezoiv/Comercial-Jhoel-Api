import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { LoginRequestDto } from '../dtos/login.request.dto';
import { ChangePasswordRequestDto } from '../dtos/change-password.request.dto';
import { LoginResponseDto } from '../dtos/login.response.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  // 5 attempts per minute per IP: throttles credential-stuffing/brute-force
  // without blocking a legitimate user who mistypes their password once.
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(
    @CurrentUser('userId') userId: string,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<void> {
    return this.changePasswordUseCase.execute({ userId, ...dto });
  }
}
