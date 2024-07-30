import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from './activity.controller';
import { ActivitySchema } from './activity.model';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Activity', schema: ActivitySchema }]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
