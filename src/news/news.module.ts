import { HttpModule, Module } from '@nestjs/common';
import { ValidFilterPipe } from 'src/pipes/valid-filter.pipe';
import { NotEmptyPipe } from 'src/pipes/not-empty.pipe';
import { TransformFilterPipe } from 'src/pipes/transform-filter.pipe';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService, ValidFilterPipe, NotEmptyPipe, TransformFilterPipe],
})
export class NewsModule {}
