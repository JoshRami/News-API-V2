import { Expose } from 'class-transformer';

export class CredentialDoc {
  @Expose()
  username: string;

  @Expose({ name: 'id' })
  sub: number;
}
