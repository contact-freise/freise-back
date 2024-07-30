import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/user.model';

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  mentionnedUserId: User;

  @Prop({ type: { name: String, activityType: String } })
  action: {
    name: string;
    activityType: string;
  };

  @Prop()
  browser: string;

  @Prop()
  ip: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

// Middleware to set the IP address
/*ActivitySchema.pre('save', function (next) {
  if (!this.ip) {
    this.ip = '127.0.0.1'; // Default IP or logic to get the actual IP
  }
  next();
});
*/
