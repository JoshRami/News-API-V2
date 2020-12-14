import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokensService: TokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRET,
    });
  }

  async validate(token: string) {
    const isExpiredToken = this.tokensService.checkToken(token);
    if (!isExpiredToken) {
      throw new UnauthorizedException(`Ugh toe`);
    }
    return isExpiredToken;
  }
}
