import { Expose, Transform, Type } from 'class-transformer';
import { NewsSources } from '../sources/sources.enum';

export class TheGuardianNews {
  @Expose()
  webTitle: string;

  @Expose()
  webUrl: string;

  @Expose()
  @Type(() => Date)
  webPublicationDate: Date;

  @Expose()
  @Transform(() => 'The Guardian')
  source: string;
}
