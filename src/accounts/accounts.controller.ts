import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RecommendsService } from 'src/recommendations/recommendations.service';
import { UsersService } from 'src/users/users.service';
import { SaveNewsDto } from './dtos/create-news.dto';
import { SaveRecommends } from './dtos/save-recommends.dto';

@Controller('me')
export class AccountController {
  constructor(
    private readonly usersService: UsersService,
    private readonly recommendsService: RecommendsService,
  ) {}

  @Get('news')
  async getNewsByUser(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.getUserNews(id);
    return { data };
  }

  @Post('news')
  async saveNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveNewsDto: SaveNewsDto,
  ) {
    const { urls } = saveNewsDto;
    const insertedNews = await this.usersService.saveNews(id, urls);
    return insertedNews;
  }

  @Post(':id/recommendations')
  async saveRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveNewsDto: SaveNewsDto,
  ) {
    const { urls } = saveNewsDto;
    const recommends = await this.usersService.saveRecommends(id, urls);
    return { data: recommends };
  }
  @Get(':id/recommendations')
  async getRecommendations(@Param('id', ParseIntPipe) id: number) {
    const data = this.usersService.getUserRecommends(id);
    return { data };
  }
}
