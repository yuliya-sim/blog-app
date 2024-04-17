import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { setupSwagger } from './swagger/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const PORT = 8081;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'verbose', 'log', 'warn', 'error'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  setupSwagger(app);
  app.use(cookieParser());
  await app.listen(PORT);
  Logger.log(`Server listening at ${PORT}`, 'main');
}

bootstrap();
