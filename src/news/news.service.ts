import {
  HttpException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { News } from './news.interface';
import { NewsSources } from './sources/sources.enum';

@Injectable()
export class NewsService {
  constructor(private httpService: HttpService) {}

  private async getNYTimesNews(query: string): Promise<News[]> {
    const key = process.env.THE_NYTIMES_KEY;
    const materialType = 'News';
    const endpoint = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&type_of_material=${materialType}&api-key=${key}`;
    const {
      data: {
        response: { docs },
      },
    } = await this.httpService.get(endpoint).toPromise();
    return docs.map((item) => {
      const {
        headline: { main },
        web_url,
        pub_date,
      } = item;
      return {
        webTitle: main,
        webUrl: web_url,
        webPublicationDate: pub_date,
        source: NewsSources.TheNewYorkTimes,
      };
    });
  }

  private async getTheGuardianNews(query: string): Promise<News[]> {
    const key = process.env.THE_GUARDIAN_KEY;
    const endpoint = `https://content.guardianapis.com/search?q=${query}&api-key=${key}`;
    const {
      data: {
        response: { results },
      },
    } = await this.httpService.get(endpoint).toPromise();
    return results.map((item) => {
      const source = NewsSources.TheGuardian;
      const { webTitle, webUrl, webPublicationDate } = item;
      return {
        webTitle,
        webUrl,
        webPublicationDate,
        source,
      };
    });
  }

  private async getGNews(query: string): Promise<News[]> {
    const key = process.env.GNEWS_KEY;
    const endpoint = `https://gnews.io/api/v4/search?q=${query}&token=${key}`;
    const {
      data: { articles },
    } = await this.httpService.get(endpoint).toPromise();
    return articles.map((article) => {
      const {
        title,
        url,
        publishedAt,
        source: { name },
      } = article;
      return {
        webTitle: title,
        webUrl: url,
        webPublicationDate: publishedAt,
        source: name,
      };
    });
  }

  async getNews(query: string, only: NewsSources): Promise<News[]> {
    try {
      const news: News[] = [];

      const isFiltered = Object.values(NewsSources).includes(only);
      if (isFiltered) {
        const oneSourceNews = await this.getByOneSource(query, only);
        news.push(...oneSourceNews);
      } else {
        const nytNews = await this.getNYTimesNews(query);
        const theGuardianNews = await this.getTheGuardianNews(query);
        const gNews = await this.getGNews(query);
        news.push(...nytNews, ...theGuardianNews, ...gNews);
      }

      if (!news.length) {
        throw new NotFoundException(
          `News with search term: ${query} have not been found`,
        );
      }
      return news;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  private async getByOneSource(query: string, only: string): Promise<News[]> {
    const news: News[] = [];
    switch (only) {
      case NewsSources.TheGuardian:
        const theGuardianNews = await this.getTheGuardianNews(query);
        news.push(...theGuardianNews);
        break;
      case NewsSources.TheNewYorkTimes:
        const theNYTimesNews = await this.getNYTimesNews(query);
        news.push(...theNYTimesNews);
        break;
      case NewsSources.GNews:
        const GNews = await this.getGNews(query);
        news.push(...GNews);
        break;
    }
    return news;
  }
}
