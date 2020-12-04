import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query('q') query: string) {
    const news = await this.newsService.getNews(query);
    return { data: news };
  }
}
