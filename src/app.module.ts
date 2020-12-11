import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    NewsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
