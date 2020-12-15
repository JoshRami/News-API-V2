import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { NewsSources } from '../sources/sources.enum';

export class NewsQueryDto {
  @IsNotEmpty()
  q: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(Object.values(NewsSources))
  only: NewsSources;
}
