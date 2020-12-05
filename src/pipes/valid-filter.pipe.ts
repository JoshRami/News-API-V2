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

    const isPresent = value !== undefined;

    const isValid = value === theNYTimesOption || value === theGuardianOption;
    if (!isValid && isPresent) {
      throw new BadRequestException(
        `The param: ${metadata.data} can pass only ${theNYTimesOption} either ${theGuardianOption} `,
      );
    }

    return value;
  }
}
