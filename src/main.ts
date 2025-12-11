// Polyfill pour @nestjs/schedule qui utilise crypto.randomUUID() sans l'importer
// Doit être fait AVANT tous les autres imports
import * as crypto from 'crypto';
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = crypto as any;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  if (process.env.NODE_ENV === 'development') {
    app.use(cors());
  } else {
    app.enableCors({
      origin: 'https://freise-c4cfd.firebaseapp.com',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  }

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  });
  app.use(apiLimiter);
  const PORT = process.env.PORT || 8080;
  await app.listen(PORT, '0.0.0.0');
  console.log(`🎧 Application is running on port ${PORT}`);
}
bootstrap();
