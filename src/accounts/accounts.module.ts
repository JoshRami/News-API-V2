import { Module } from '@nestjs/common';
import { RecommendsModule } from 'src/recommendations/recommendations.module';
import { UsersModule } from 'src/users/users.module';
import { AccountController } from './accounts.controller';

@Module({
  imports: [UsersModule, RecommendsModule],
  controllers: [AccountController],
})
export class AccountModule {}
