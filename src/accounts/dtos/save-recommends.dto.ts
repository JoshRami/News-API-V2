import { Type } from 'class-transformer';
import { ArrayMinSize, IsUrl, ValidateNested } from 'class-validator';
import { CredentialsDTO } from 'src/auth/dtos/crendetials.dto';

export class webUrl {
  @IsUrl()
  webUrl: string;
}

export class SaveRecommends {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => webUrl)
  urls: webUrl[];

  @ValidateNested({ each: true })
  @Type(() => CredentialsDTO)
  user: CredentialsDTO;
}
