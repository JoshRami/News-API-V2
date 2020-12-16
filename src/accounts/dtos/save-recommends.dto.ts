import { Type } from 'class-transformer';
import { ArrayMinSize, IsUrl, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create.user.dto';

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
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
