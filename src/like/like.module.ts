import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './like.model';
import { Post, PostSchema } from 'src/post/post.model';
import { User, UserSchema } from 'src/user/user.model';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule { }
