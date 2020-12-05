import { Controller, Get, Query } from '@nestjs/common';
import { ValidFilterPipe } from 'src/pipes/valid-filter.pipe';
import { NotEmptyPipe } from 'src/pipes/not-empty.pipe';
import { NewsService } from './news.service';
import { TransformFilterPipe } from 'src/pipes/transform-filter.pipe';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(
    @Query('q', NotEmptyPipe) query: string,
    @Query('only', ValidFilterPipe, TransformFilterPipe) hide: string,
  ) {
    const data = await this.newsService.getNews(query, hide);
    return { data };
  }
}
