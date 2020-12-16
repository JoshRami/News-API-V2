import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class webUrl {
  @IsNotEmpty()
  @IsUrl()
  webUrl: string;
}

export class SaveNewsDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => webUrl)
  urls: webUrl[];
}
