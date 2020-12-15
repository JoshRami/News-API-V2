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
import { CredentialsDTO } from 'src/auth/dtos/crendetials.dto';
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
      return existToken.endTime < new Date();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while checking token');
    }
  }
  async saveToken(token: string, credentials: CredentialsDTO, expires: number) {
    try {
      const user = await this.usersService.findByCredentials(
        credentials.username,
        credentials.password,
      );
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
  async handleCron() {
    try {
      await this.tokenRepository.delete({ endTime: LessThan(new Date()) });
    } catch (error) {
      console.error('error while deleting expired tokens');
    }
  }
}
