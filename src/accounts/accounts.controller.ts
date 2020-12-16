import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WhitelistGuard } from 'src/auth/guards/jwt-whitelist.guard';
import { UsersService } from 'src/users/users.service';
import { SaveNewsDto } from './dtos/create-news.dto';

@Controller('me')
@UseGuards(JwtAuthGuard, WhitelistGuard)
export class AccountController {
  constructor(private readonly usersService: UsersService) {}

  @Get('news')
  async getNewsByUser(@Req() req) {
    const { id } = req.user;
    const data = await this.usersService.getUserNews(id);
    return { data };
  }

  @Post('news')
  async saveNews(@Body() saveNewsDto: SaveNewsDto, @Req() req) {
    const { id } = req.user;
    const { urls } = saveNewsDto;
    const insertedNews = await this.usersService.saveNews(id, urls);
    return insertedNews;
  }

  @Post(':id/recommendations')
  async saveRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveNewsDto: SaveNewsDto,
    @Req() req,
  ) {
    const recommender = req.user;
    if (recommender.id === id) {
      throw new BadRequestException('You cannot recommend news to yourself');
    }
    const { urls } = saveNewsDto;
    const recommends = await this.usersService.saveRecommends(id, urls);
    return { data: recommends };
  }

  @Get('recommendations')
  async getRecommendations(@Req() req) {
    const { id } = req.user;
    const data = await this.usersService.getUserRecommends(id);
    return { data };
  }
}
