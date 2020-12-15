import {
  HttpException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { url } from 'inspector';
import { webUrl } from 'src/accounts/dtos/create-news.dto';
import { New } from 'src/news/news.entity';
import { Repository } from 'typeorm';
import { Recommend } from './recommendations.entity';

@Injectable()
export class RecommendsService {
  constructor(
    @InjectRepository(Recommend)
    private readonly recommendsRepository: Repository<Recommend>,
  ) {}

  async saveRecommendation(urls: webUrl[]): Promise<Recommend[]> {
    try {
      const {
        identifiers,
      } = await this.recommendsRepository
        .createQueryBuilder()
        .insert()
        .into(Recommend)
        .values(urls)
        .execute();
      const recommendsIds = identifiers.map((identifier) => {
        return identifier.id;
      });

      const insertedRecommends = await this.recommendsRepository
        .createQueryBuilder()
        .where('id in (:...recommendsIds)', { recommendsIds })
        .getMany();
      return insertedRecommends;
    } catch (error) {
      throw new InternalServerErrorException(
        'error while inserting recommends',
      );
    }
  }
}