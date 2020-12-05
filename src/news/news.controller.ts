import { Controller, Get, Query } from '@nestjs/common';
import { HideSourcePipe } from 'src/pipes/hide-source.pipe';
import { NotEmptyPipe } from 'src/pipes/not-empty.pipe';
import { NewsSources } from './news.interface';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(
    @Query('q', NotEmptyPipe) query: string,
    @Query('only', HideSourcePipe) hide: string,
  ) {
    if (hide === NewsSources.TheGuardian) {
      const theNYTimesNews = await this.newsService.getTheGuardianNews(query);
      return { data: theNYTimesNews };
    }
    if (hide === NewsSources.TheNewYorkTimes) {
      const theGuardianNews = await this.newsService.getNYTimesNews(query);
      return { data: theGuardianNews };
    }

    const bothSourceNews = await this.newsService.getNews(query);
    return { data: bothSourceNews };
  }
}
