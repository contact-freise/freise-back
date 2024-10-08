import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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
  await app.use(apiLimiter);
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, async () => {
    console.log(`🎧 Application is running on ${await app.getUrl()}`);
  });
}
bootstrap();
