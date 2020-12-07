import {
  HttpException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { News, NewsSources } from './news.interface';

@Injectable()
export class NewsService {
  constructor(private httpService: HttpService) {}

  private async getNYTimesNews(query: string): Promise<News[]> {
    const apiKey = process.env.THE_NYTIMES_KEY;
    const materialType = 'News';
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&type_of_material=${materialType}&api-key=${apiKey}`;
    const {
      data: {
        response: { docs },
      },
    } = await this.httpService.get(url).toPromise();
    return docs.map((item) => {
      const {
        document_type,
        section_name,
        headline: { main },
        web_url,
        pub_date,
      } = item;
      return {
        documentType: document_type,
        sectionName: section_name,
        webTitle: main,
        webUrl: web_url,
        webPublicationDate: pub_date,
        source: NewsSources.TheNewYorkTimes,
      };
    });
  }

  private async getTheGuardianNews(query: string): Promise<News[]> {
    const apiKey = process.env.THE_GUARDIAN_KEY;
    const url = `https://content.guardianapis.com/search?q=${query}&api-key=${apiKey}`;
    const {
      data: {
        response: { results },
      },
    } = await this.httpService.get(url).toPromise();
    return results.map((item) => {
      const source = NewsSources.TheGuardian;
      const { type, sectionName, webTitle, webUrl, webPublicationDate } = item;
      return {
        documentType: type,
        sectionName,
        webTitle,
        webUrl,
        webPublicationDate,
        source,
      };
    });
  }
  async getNews(query: string, only: string): Promise<News[]> {
    try {
      const news: News[] = [];

      const isFiltered =
        only === NewsSources.TheGuardian ||
        only === NewsSources.TheNewYorkTimes;

      if (isFiltered) {
        const oneSourceNews = await this.getByOneSource(query, only);
        news.push(...oneSourceNews);
      } else {
        const theNYTimesNews = await this.getNYTimesNews(query);
        const theGuardianNews = await this.getTheGuardianNews(query);
        news.push(...theGuardianNews, ...theNYTimesNews);
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
  private async getByOneSource(query: string, only: string) {
    const news: News[] = [];

    if (only === NewsSources.TheGuardian) {
      const theGuardianNews = await this.getTheGuardianNews(query);
      news.push(...theGuardianNews);
    }
    if (only === NewsSources.TheNewYorkTimes) {
      const theNYTimesNews = await this.getNYTimesNews(query);
      news.push(...theNYTimesNews);
    }
    return news;
  }
}
