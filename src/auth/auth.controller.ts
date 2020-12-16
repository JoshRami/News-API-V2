import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from 'src/tokens/tokens.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { WhitelistGuard } from './guards/jwt-whitelist.guard';
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
  async login(@Req() req) {
    const user = req.user;
    const accessToken = await this.authService.login(user);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, WhitelistGuard)
  async logout(@Req() req: Request) {
    const accessToken = req.get('Authorization').split(' ')[1];
    await this.tokenService.deleteToken(accessToken);
  }
}
