import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dateMath from 'date-arithmetic';
import { Token } from './tokens.entity';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { CredentialsDTO } from 'src/auth/dtos/crendetials.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly usersService: UsersService,
  ) {}
  async checkToken(token: string) {
    const existToken = await this.tokenRepository.findOne({ token });
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
}
