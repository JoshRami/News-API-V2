import {
  HttpException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { webUrl } from 'src/accounts/dtos/create-news.dto';
import { Token } from 'src/tokens/tokens.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { GNews } from './docs/gnews.doc';
import { NYTNews } from './docs/nyt-news.doc';
import { TheGuardianNews } from './docs/theguardian.doc';
import { New } from './news.entity';
import { News } from './news.interface';
import { NewsSources } from './sources/sources.enum';

@Injectable()
export class NewsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(New) private readonly newsRepository: Repository<New>,
  ) {}

  private async getNYTimesNews(query: string): Promise<News[]> {
    try {
      const key = process.env.THE_NYTIMES_KEY;
      const materialType = 'News';
      const endpoint = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&type_of_material=${materialType}&api-key=${key}`;
      const {
        data: {
          response: { docs },
        },
      } = await this.httpService.get<theNYTData>(endpoint).toPromise();
      return plainToClass(NYTNews, docs, { excludeExtraneousValues: true });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while getting news from The New York times',
      );
    }
  }

  private async getTheGuardianNews(query: string): Promise<News[]> {
    try {
      const key = process.env.THE_GUARDIAN_KEY;
      const endpoint = `https://content.guardianapis.com/search?q=${query}&api-key=${key}`;
      const {
        data: {
          response: { results },
        },
      } = await this.httpService.get<theGuardianData>(endpoint).toPromise();
      return plainToClass(TheGuardianNews, results, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while getting news from The Guardian',
      );
    }
  }

  private async getGNews(query: string): Promise<News[]> {
    try {
      const key = process.env.GNEWS_KEY;
      const endpoint = `https://gnews.io/api/v4/search?q=${query}&token=${key}`;
      const {
        data: { articles },
      } = await this.httpService.get<gNewsData>(endpoint).toPromise();
      return plainToClass(GNews, articles, { excludeExtraneousValues: true });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while getting news from Gnews Source',
      );
    }
  }

  async getNews(query: string, only: NewsSources): Promise<News[]> {
    try {
      const news: News[] = [];

      const onlyOneSource = Object.values(NewsSources).includes(only);

      if (onlyOneSource) {
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while creating user');
    }
  }
  private async getByOneSource(query: string, only: string): Promise<News[]> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while getting news from: ${only}`,
      );
    }
  }

  async saveNews(urls: webUrl[]): Promise<New[]> {
    try {
      const {
        identifiers,
      } = await this.newsRepository
        .createQueryBuilder()
        .insert()
        .into(New)
        .values(urls)
        .execute();
      const newsIds = identifiers.map((identifier) => {
        return identifier.id;
      });

      const insertedNews = await this.newsRepository
        .createQueryBuilder()
        .where('id in (:...newsIds)', { newsIds })
        .getMany();
      return insertedNews;
    } catch (error) {
      throw new InternalServerErrorException('error while inserting news');
    }
  }
}
