import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), NewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
