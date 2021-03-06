import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from 'src/tokens/tokens.service';
import { CredentialDoc } from './docs/token.doc';
import { User } from 'src/users/users.entity';
import { plainToClass } from 'class-transformer';
import { UserDoc } from '../users/docs/user.doc';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
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

  async login(user: UserDoc): Promise<string> {
    try {
      const tokenData = plainToClass(CredentialDoc, user, {
        excludeExtraneousValues: true,
      });
      const { username, sub } = tokenData;

      const accessToken = this.jwtService.sign(
        { username, sub },
        { secret: process.env.JWTSECRET },
      );
      const jwt: any = this.jwtService.decode(accessToken);
      const token = await this.tokensService.saveToken(
        accessToken,
        sub,
        jwt.exp,
      );
      return token.token;
    } catch (error) {
      throw new InternalServerErrorException('Error while login');
    }
  }
}
