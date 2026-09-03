import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { TOKEN_SERVICE } from './application/ports/token-service.port';
import { NestJwtTokenService } from './infrastructure/services/jwt-token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

/**
 * `JwtStrategy` is registered here as a provider (Passport looks it up by
 * being constructed at all, not by an explicit token) but the guards that
 * *use* it — `JwtAuthGuard`, `RolesGuard` — live under
 * `infrastructure/guards/` and are applied per-route in each feature
 * module's own controller, not exported from here.
 */
@Module({
  imports: [
    UsersModule,
    SharedModule,
    PassportModule,
    // Secret/expiry come from the same typed config namespace every other
    // module reads via `ConfigService` (`src/config/configuration.ts`) —
    // never hardcoded here, so rotating the secret only means an env change.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<number>('jwt.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    ChangePasswordUseCase,
    JwtStrategy,
    { provide: TOKEN_SERVICE, useClass: NestJwtTokenService },
  ],
})
export class AuthModule {}
