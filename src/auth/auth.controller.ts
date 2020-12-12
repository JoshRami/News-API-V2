import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/users/public.decorator';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dtos/crendetials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() credentialsDto: CredentialsDTO) {
    await this.authService.login(credentialsDto);
  }
}
