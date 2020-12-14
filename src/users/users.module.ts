import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { New } from 'src/news/news.entity';
import { NewsModule } from 'src/news/news.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, New]), NewsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
