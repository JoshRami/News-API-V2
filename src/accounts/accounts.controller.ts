import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JWTGuard } from 'src/auth/guards/jwt.strategy';
import { RecommendsService } from 'src/recommendations/recommendations.service';
import { UsersService } from 'src/users/users.service';
import { SaveNewsDto } from './dtos/create-news.dto';
import { SaveRecommends } from './dtos/save-recommends.dto';

@Controller('me/:id')
@UseGuards(JWTGuard)
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
    await this.usersService.saveNews(id, saveNewsDto.urls);
  }

  @Post('recommendations')
  async saveRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveRecomendationsDto: SaveRecommends,
  ) {
    const { urls, user } = saveRecomendationsDto;
    const validatedUser = await this.usersService.findByCredentials(
      user.username,
      user.password,
    );
    if (!validatedUser) {
      throw new ForbiddenException('Invalid user credentials');
    }
    return this.usersService.saveRecommends(id, urls);
  }
}
