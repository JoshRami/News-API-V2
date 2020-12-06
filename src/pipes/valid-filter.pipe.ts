import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidFilterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const theNYTimesOption = 'thenytimes';
    const theGuardianOption = 'theguardian';

    const isValid = value === theNYTimesOption || value === theGuardianOption;
    if (!isValid && value) {
      throw new BadRequestException(
        `The param: ${metadata.data} can pass only ${theNYTimesOption} either ${theGuardianOption} `,
      );
    }

    return value;
  }
}
