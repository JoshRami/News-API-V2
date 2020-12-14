import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
