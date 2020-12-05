import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { NewsSources } from 'src/news/news.interface';

@Injectable()
export class HideSourcePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const theNYTimesOption = 'thenytimes';
    const theGuardianOption = 'theguardian';

    const hasValue = value !== undefined;

    const isValid = value === theNYTimesOption || value === theGuardianOption;
    if (!isValid && hasValue) {
      throw new BadRequestException(
        `The param: ${metadata.data} can pass only ${theNYTimesOption} or ${theGuardianOption} `,
      );
    }

    return value === theNYTimesOption
      ? NewsSources.TheNewYorkTimes
      : NewsSources.TheGuardian;
  }
}
