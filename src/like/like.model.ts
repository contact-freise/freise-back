import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';

@Schema()
export class Like extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: Post;

  @Prop({ required: true })
  type: 'like' | 'dislike';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
