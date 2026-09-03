import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthTokenPayload,
  TokenService,
} from '../../application/ports/token-service.port';

/** The concrete `TokenService`, bound in `AuthModule`; a thin wrapper over `@nestjs/jwt`'s own `JwtService`, configured (secret/expiry) in `AuthModule`'s `JwtModule.registerAsync`. */
@Injectable()
export class NestJwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: AuthTokenPayload): string {
    return this.jwtService.sign(payload);
  }
}
