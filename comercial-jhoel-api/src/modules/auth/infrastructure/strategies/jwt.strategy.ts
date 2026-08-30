import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenPayload } from '../../application/ports/token-service.port';
import { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret')!,
    });
  }

  /**
   * Hits the DB on every authenticated request (not just at login) so a
   * deactivated account or a since-changed role can't keep acting on a JWT
   * issued before the change — a still-valid token is not enough on its own.
   */
  async validate(payload: AuthTokenPayload): Promise<RequestUser> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Tu cuenta ha sido desactivada o ya no existe.',
      );
    }

    return {
      userId: user.id,
      username: payload.username,
      role: user.roleName,
    };
  }
}
