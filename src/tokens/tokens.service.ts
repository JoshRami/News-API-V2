import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Token } from './tokens.entity';
import { UsersService } from 'src/users/users.service';
import { CredentialsDTO } from 'src/auth/dtos/crendetials.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly usersService: UsersService,
  ) {}
  async checkToken(token: string) {
    const existToken = await this.tokenRepository.findOne({ token });
    if (!existToken) {
      throw new UnauthorizedException('Invalid token, hacker');
    }
    return existToken.endTime < new Date();
  }
  async saveToken(token: string, credentials: CredentialsDTO, expires: number) {
    const user = await this.usersService.findByCredentials(
      credentials.username,
      credentials.password,
    );
    const newToken = new Token();
    newToken.endTime = new Date(expires * 1000);
    newToken.user = user;
    newToken.token = token;
    return await this.tokenRepository.save(newToken);
  }
  async deleteToken(token: string) {
    try {
      const { affected } = await this.tokenRepository.delete({ token });
      return affected === 1;
    } catch (error) {
      throw new InternalServerErrorException('Error while login out');
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
