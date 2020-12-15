import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { classToPlain, plainToClass } from 'class-transformer';

import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDoc } from '../docs/user.doc';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const cleanUser = plainToClass(UserDoc, user, {
      excludeExtraneousValues: true,
    });
    return classToPlain(cleanUser);
  }
}
