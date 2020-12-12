import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsQueryDto } from './dtos/news-query.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query() newsQuery: NewsQueryDto) {
    const { q, only } = newsQuery;
    const data = await this.newsService.getNews(q, only);
    return { data };
  }
}
