import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsQueryDto } from './dtos/news-query.dto';
import { JWTGuard } from 'src/auth/guards/jwt.strategy';

@Controller('news')
@UseGuards(JWTGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query() newsQuery: NewsQueryDto) {
    const { q, only } = newsQuery;
    const data = await this.newsService.getNews(q, only);
    return { data };
  }
}
