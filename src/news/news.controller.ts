import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsQueryDto } from './dtos/news-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WhitelistGuard } from 'src/auth/guards/jwt-whitelist.guard';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query() newsQuery: NewsQueryDto) {
    const { q, only } = newsQuery;
    const data = await this.newsService.getNews(q, only);
    return { data };
  }
}
