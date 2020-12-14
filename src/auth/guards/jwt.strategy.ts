import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensService } from 'src/tokens/tokens.service';

export class JWTGuard implements CanActivate {
  constructor(
    @Inject('TokensService') private readonly tokensService: TokensService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const access_token = request.get('Authorization').split(' ')[1];

    return this.validate(access_token);
  }

  async validate(token: string) {
    const isExpiredToken = await this.tokensService.checkToken(token);
    if (isExpiredToken) {
      throw new UnauthorizedException(`Ugh expired token`);
    }
    return true;
  }
}
