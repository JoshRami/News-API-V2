import { HttpService, Injectable } from '@nestjs/common';
import { News, NewsSources } from './news.interface';

@Injectable()
export class NewsService {
  constructor(private httpService: HttpService) {}

  async getNYTimesNews(query: string): Promise<News[]> {
    const apiKey = process.env.THE_NYTIMES_KEY;
    const materialTipe = 'News';
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&type_of_material=${materialTipe}&api-key=${apiKey}`;
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

  async getTheGuardianNews(query: string): Promise<News[]> {
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
  async getNews(query: string): Promise<News[]> {
    const nytNews = await this.getNYTimesNews(query);
    const theGuardianNews = await this.getTheGuardianNews(query);
    const news = nytNews.concat(theGuardianNews);
    return news;
  }
}
