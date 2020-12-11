import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class New {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  webTitle: string;

  @Column()
  webUrl: string;

  @Column({ type: 'timestamptz' })
  webPublicationDate: Date;

  @Column()
  source: string;

  @ManyToMany((type) => User, (user) => user.news)
  users: User[];
}
