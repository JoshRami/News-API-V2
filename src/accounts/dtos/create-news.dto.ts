import { Type } from 'class-transformer';
import { ArrayMinSize, IsUrl, ValidateNested } from 'class-validator';

export class webUrl {
  @IsUrl()
  webUrl: string;
}

export class SaveNewsDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => webUrl)
  urls: webUrl[];
}
