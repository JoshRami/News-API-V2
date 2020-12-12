import { NewsSources } from './sources/sources.enum';

export interface News {
  webTitle: string;
  webUrl: string;
  webPublicationDate: Date;
  source: string;
}
