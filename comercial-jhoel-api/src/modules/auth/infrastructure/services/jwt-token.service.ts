import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthTokenPayload,
  TokenService,
} from '../../application/ports/token-service.port';

@Injectable()
export class NestJwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: AuthTokenPayload): string {
    return this.jwtService.sign(payload);
  }
}
