import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { webUrl } from 'src/accounts/dtos/create-news.dto';
import { New } from 'src/news/news.entity';
import { NewsService } from 'src/news/news.service';
import { Recommend } from 'src/recommendations/recommendations.entity';
import { RecommendsService } from 'src/recommendations/recommendations.service';

import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly newsService: NewsService,
    private readonly recommendService: RecommendsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while creating user');
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const { affected } = await this.userRepository.delete(id);
      return affected === 1;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while deleting user');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id);

      const updated = await this.userRepository.save({
        ...user,
        ...updateUserDto,
      });

      return updated;
    } catch (error) {
      throw new InternalServerErrorException('Error while updating user');
    }
  }

  async getUser(id: number) {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw new NotFoundException(`User not found, id: ${id}`);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while getting user');
    }
  }

  async findByCredentials(username: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ username, password });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while fetching user by credentials',
      );
    }
  }

  async getUserNews(id: number): Promise<New[]> {
    try {
      const user = await this.userRepository.findOneOrFail(id, {
        relations: ['news'],
      });
      const news = user.news;
      if (!news.length) {
        throw new NotFoundException(`News for user: ${id} not found`);
      }
      return news;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error while fetchin news from user: ${id}`,
      );
    }
  }

  async saveNews(id: number, urls: webUrl[]): Promise<New[]> {
    try {
      const user = await this.userRepository.findOne(id, {
        relations: ['news'],
      });
      const savedNews = await this.newsService.saveNews(urls);
      user.news = [...user.news, ...savedNews];
      await this.userRepository.save(user);
      return savedNews;
    } catch (error) {
      throw new InternalServerErrorException('Error while saving news');
    }
  }

  async saveRecommends(id: number, urls: webUrl[]): Promise<Recommend[]> {
    try {
      const user = await this.userRepository.findOneOrFail(id, {
        relations: ['recommends'],
      });
      const savedRecommends = await this.recommendService.saveRecommendation(
        urls,
      );
      user.recommends = [...user.recommends, ...savedRecommends];
      await this.userRepository.save(user);
      return savedRecommends;
    } catch (error) {
      throw new InternalServerErrorException('Error while saving recommends');
    }
  }

  async getUserRecommends(id: number) {
    try {
      const { recommends } = await this.userRepository.findOne(id, {
        relations: ['recommends'],
      });
      if (!recommends.length) {
        throw new NotFoundException(`recommends for user : ${id} not found`);
      }
      return recommends;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error while fetchin news from user: ${id}`,
      );
    }
  }
}
