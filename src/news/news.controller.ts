import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { HideSourcePipe } from 'src/pipes/hide-source.pipe';
import { NotEmptyPipe } from 'src/pipes/not-empty.pipe';
import { News, NewsSources } from './news.interface';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(
    @Query('q', NotEmptyPipe) query: string,
    @Query('only', HideSourcePipe) hide: string,
  ) {
    const data: News[] = [];
    const isFiltered =
      hide === NewsSources.TheGuardian || hide === NewsSources.TheNewYorkTimes;

    if (isFiltered) {
      if (hide === NewsSources.TheGuardian) {
        const theNYTimesNews = await this.newsService.getNYTimesNews(query);
        data.push(...theNYTimesNews);
      } else if (hide === NewsSources.TheNewYorkTimes) {
        const theGuardianNews = await this.newsService.getTheGuardianNews(
          query,
        );
        data.push(...theGuardianNews);
      }
    } else {
      const bothSourceNews = await this.newsService.getNews(query);
      data.push(...bothSourceNews);
    }

    if (!data.length) {
      throw new NotFoundException(
        `News with search term: ${query} have not been found`,
      );
    }
    return data;
  }
}
