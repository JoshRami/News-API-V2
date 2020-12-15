import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { classToPlain, plainToClass } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CredentialDoc } from '../docs/credentials.doc';
import { UserDoc } from '../docs/user.doc';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWTSECRET,
    });
  }

  async validate(payload: CredentialDoc) {
    const user = plainToClass(UserDoc, payload, {
      excludeExtraneousValues: true,
    });
    return classToPlain(user);
  }
}
