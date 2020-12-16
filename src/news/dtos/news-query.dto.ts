import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NewsSources } from '../sources/sources.enum';

export class NewsQueryDto {
  @IsNotEmpty()
  @IsString()
  q: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(NewsSources))
  only: NewsSources;
}
