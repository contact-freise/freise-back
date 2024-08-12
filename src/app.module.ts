// src/app.module.ts
import { Module, MiddlewareConsumer, RequestMethod, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ActivityModule } from './activity/activity.module';
import { AuthMiddleware } from './middleware/auth';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { SecretManagerService } from './secret-manager.service';

export const JWT_OPTIONS = { expiresIn: '60m', secret: process.env.JWT_SECRET };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.register(JWT_OPTIONS),
    ScheduleModule.forRoot(),
    TasksModule,
    UserModule,
    ActivityModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AuthMiddleware, AppService, SecretManagerService],
  exports: [AppService],
})
export class AppModule implements OnModuleInit {

  constructor(private readonly secretManagerService: SecretManagerService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'sse', method: RequestMethod.ALL },
        { path: 'user', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  async onModuleInit() {
    await this.secretManagerService.loadSecretsIntoEnv();
  }
}
