import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDoc {
  @Expose()
  username: string;

  @Expose()
  id: number;
}
