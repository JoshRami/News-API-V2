import { Expose, Transform } from 'class-transformer';
import { NewsSources } from '../sources/sources.enum';

export class NYTNews {
  @Expose({ name: 'headline' })
  @Transform((headline) => headline.main)
  webTitle: string;

  @Expose({ name: 'web_url' })
  webUrl: string;

  @Expose({ name: 'pub_date' })
  webPublicationDate: Date;

  @Expose()
  @Transform(() => 'The New York Times')
  source: string;
}
