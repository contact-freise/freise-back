import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from 'src/app.service';

export const JWT_OPTIONS = { expiresIn: '60m', secret: process.env.JWT_SECRET };

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register(JWT_OPTIONS),
  ],
  controllers: [UserController],
  providers: [UserService, AppService],
  exports: [UserService],
})
export class UserModule {}
