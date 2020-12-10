import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { NewsSources } from '../sources/sources.enum';

@Injectable()
export class ValidFilterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value) {
      const isvalid = Object.values(NewsSources).includes(value);
      if (!isvalid) {
        throw new BadRequestException(
          `The param: ${metadata.data} can pass only gnews, theguardian or thenytimes`,
        );
      }
    }

    return value;
  }
}
