import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TokensService } from 'src/tokens/tokens.service';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dtos/crendetials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokensService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Body() credentialsDto: CredentialsDTO) {
    const access_token = await this.authService.login(credentialsDto);
    return { access_token };
  }
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request) {
    const access_token = req.get('Authorization').split(' ')[1];
    await this.tokenService.deleteToken(access_token);
  }
}
