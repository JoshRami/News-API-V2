import { Injectable, PipeTransform } from '@nestjs/common';
import { NewsSources } from 'src/news/sources/sources.enum';

@Injectable()
export class TransformFilterPipe implements PipeTransform {
  transform(value: any) {
    let source: NewsSources;

    switch (value) {
      case 'thenytimes':
        source = NewsSources.TheNewYorkTimes;
        break;
      case 'theguardian':
        source = NewsSources.TheGuardian;
      case 'gnews':
        source = NewsSources.GNews;
        break;
    }
    return source;
  }
}
