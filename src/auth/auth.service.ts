import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { CredentialsDTO } from './dtos/crendetials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const foundUser = await this.usersService.findByCredentials(
      username,
      password,
    );
    return foundUser;
  }

  async login(credentials: CredentialsDTO) {
    const access_token = this.jwtService.sign(credentials, {
      secret: process.env.JWTSECRET,
    });
    this.tokensService.saveToken(access_token, credentials);
  }
}
