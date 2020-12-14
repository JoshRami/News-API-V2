import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './accounts/accounts.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
