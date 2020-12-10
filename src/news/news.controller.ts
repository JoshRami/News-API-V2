import { Controller, Get, Query } from '@nestjs/common';
import { ValidFilterPipe } from 'src/news/pipes/valid-filter.pipe';
import { NotEmptyPipe } from 'src/news/pipes/not-empty.pipe';
import { NewsService } from './news.service';
import { TransformFilterPipe } from 'src/news/pipes/transform-filter.pipe';
import { NewsSources } from './sources/sources.enum';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(
    @Query('q', NotEmptyPipe) query: string,
    @Query('only', ValidFilterPipe, TransformFilterPipe) only: NewsSources,
  ) {
    const data = await this.newsService.getNews(query, only);
    return { data };
  }
}
