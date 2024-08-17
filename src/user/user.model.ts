import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Like } from 'src/like/like.model';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  backgroundUrl: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  dob: Date;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  role: string;

  @Prop()
  about: string;

  @Prop()
  location: string;

  @Prop()
  website: string;

  @Prop()
  followers: string[];

  @Prop()
  following: string[];

  @Prop()
  notifications: string[];

  @Prop()
  posts: string[];

  @Prop()
  comments: string[];

  @Prop()
  messages: string[];

  @Prop()
  conversations: string[];

  @Prop()
  lastSeen: Date;

  @Prop()
  online: boolean;

  @Prop()
  ip: string;

  @Prop()
  browser: string;

  @Prop()
  status: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerified: boolean;

  @Prop()
  emailVerificationExpires: Date;

  @Prop()
  emailVerificationSent: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  likes: Like[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  dislikes: Like[];
}

export const UserSchema = SchemaFactory.createForClass(User);
