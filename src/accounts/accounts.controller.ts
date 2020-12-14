import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { SaveNewsDto, webUrl } from './dtos/create-news.dto';

@Controller('me')
@UseGuards(new JwtAuthGuard())
export class AccountController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id/news')
  async getNewsByUser(@Param() id: number) {
    const data = await this.usersService.getUserNews(id);
    return { data };
  }
  @Post('/:id/news')
  async saveNews(@Param() id: number, @Body() saveNewsDto: SaveNewsDto) {
    await this.usersService.saveNews(id, saveNewsDto.urls);
  }
}
