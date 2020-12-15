import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recommend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  webUrl: string;

  @ManyToMany((type) => User, (user) => user.news)
  users: User[];
}
