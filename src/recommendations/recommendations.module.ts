import { Global, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommend } from './recommendations.entity';
import { RecommendsService } from './recommendations.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Recommend]), HttpModule],
  providers: [RecommendsService],
  exports: [RecommendsService],
})
export class RecommendsModule {}
