import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v2');

  app.use(json(), helmet());
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
  }

  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap();
