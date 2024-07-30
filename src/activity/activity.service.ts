import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './activity.model';
import { Model } from 'mongoose';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private readonly activityModel: Model<Activity>,
  ) {}

  async findAll(): Promise<Activity[]> {
    return this.activityModel
      .find()
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(userId: string): Promise<Activity[]> {
    return this.activityModel
      .find({ userId })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(body): Promise<Activity> {
    const newActivity = new this.activityModel(body);
    return newActivity.save();
  }
}
