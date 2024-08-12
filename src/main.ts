import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (process.env.NODE_ENV === 'development') {
    app.use(cors());
  }
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  });
  await app.use(apiLimiter);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
bootstrap();
