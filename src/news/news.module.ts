import { HttpModule, Module } from '@nestjs/common';
import { ValidFilterPipe } from 'src/news/pipes/valid-filter.pipe';
import { NotEmptyPipe } from 'src/news/pipes/not-empty.pipe';
import { TransformFilterPipe } from 'src/news/pipes/transform-filter.pipe';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService, ValidFilterPipe, NotEmptyPipe, TransformFilterPipe],
})
export class NewsModule {}
