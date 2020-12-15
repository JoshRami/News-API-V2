import { Expose, Transform, Type } from 'class-transformer';

export class GNews {
  @Expose({ name: 'title' })
  webTitle: string;

  @Expose({ name: 'url' })
  webUrl: string;

  @Expose({ name: 'publishedAt' })
  @Type(() => Date)
  webPublicationDate: Date;

  @Expose({ name: 'source' })
  @Transform((source) => source.name)
  source: string;
}
