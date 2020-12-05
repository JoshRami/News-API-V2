import { Injectable, PipeTransform } from '@nestjs/common';
import { NewsSources } from 'src/news/news.interface';

@Injectable()
export class TransformFilterPipe implements PipeTransform {
  transform(value: any) {
    let source: NewsSources;

    if (value === 'thenytimes') {
      source = NewsSources.TheNewYorkTimes;
    } else if (value === 'theguardian') {
      source = NewsSources.TheGuardian;
    }
    return source;
  }
}
