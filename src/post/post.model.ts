import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Like } from 'src/like/like.model';
import { User } from 'src/user/user.model';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop()
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  likes: Like[];

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  dislikes: Like[];

  @Prop({ default: 0 })
  dislikesCount: number;

  @Prop()
  tags: string[];

  @Prop()
  imageUrl: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
