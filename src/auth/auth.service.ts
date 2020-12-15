import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
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
    try {
      const foundUser = await this.usersService.findByCredentials(
        username,
        password,
      );
      return foundUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while validating user');
    }
  }

  async login(credentials: CredentialsDTO): Promise<string> {
    try {
      const access_token = this.jwtService.sign(credentials, {
        secret: process.env.JWTSECRET,
      });
      const jwt: any = this.jwtService.decode(access_token);
      const token = await this.tokensService.saveToken(
        access_token,
        credentials,
        jwt.exp,
      );
      return token.token;
    } catch (error) {
      throw new InternalServerErrorException('Error while login');
    }
  }
}