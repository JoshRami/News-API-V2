export interface News {
  documentType: string;
  sectionName: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: Date;
  source: NewsSources;
}
export enum NewsSources {
  TheNewYorkTimes = 'The New York Times',
  TheGuardian = 'The Guardian',
}
