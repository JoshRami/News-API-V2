import { HttpModule, Module } from '@nestjs/common';
import { HideSourcePipe } from 'src/pipes/hide-source.pipe';
import { NotEmptyPipe } from 'src/pipes/not-empty.pipe';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService, HideSourcePipe, NotEmptyPipe],
})
export class NewsModule {}
