import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'default_jwt_secret';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.logger.log(`JWT Strategy initialized with secret: ${secret.substring(0, 5)}...`);
  }

  async validate(payload: any) {
    this.logger.log(`JWT validate called with payload: ${JSON.stringify(payload)}`);
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
      fullName: payload.fullName || '',
    };
  }
}
