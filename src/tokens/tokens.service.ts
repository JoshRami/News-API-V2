import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Token } from './tokens.entity';
import { UsersService } from 'src/users/users.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly usersService: UsersService,
  ) {}

  async checkToken(token: string) {
    try {
      const existToken = await this.tokenRepository.findOne({ token });
      if (!existToken) {
        throw new UnauthorizedException('Invalid token, hacker');
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while checking token');
    }
  }

  async saveToken(token: string, userId: number, expires: number) {
    try {
      const user = await this.usersService.getUser(userId);
      const newToken = new Token();
      newToken.endTime = new Date(expires * 1000);
      newToken.user = user;
      newToken.token = token;
      return await this.tokenRepository.save(newToken);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while saving token');
    }
  }
  async deleteToken(token: string) {
    try {
      const { affected } = await this.tokenRepository.delete({ token });
      return affected === 1;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while deleting token');
    }
  }
  @Cron('*/3 * * * *')
  async deleteExpiredTokens() {
    try {
      await this.tokenRepository.delete({ endTime: LessThan(new Date()) });
    } catch (error) {
      console.error('error while deleting expired tokens');
    }
  }
}
