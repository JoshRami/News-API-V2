import { New } from 'src/news/news.entity';
import { Recommend } from 'src/recommendations/recommendations.entity';
import { Token } from 'src/tokens/tokens.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany((type) => Token, (token) => token.user)
  tokens: Token[];

  @ManyToMany((type) => New, (oneNew) => oneNew.users)
  @JoinTable({ name: 'users_news' })
  news: New[];

  @ManyToMany((type) => Recommend, (recommend) => recommend.users)
  @JoinTable({ name: 'users_recommendations' })
  recommends: Recommend[];
}
