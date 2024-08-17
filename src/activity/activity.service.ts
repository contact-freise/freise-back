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
      .populate('user', 'username avatarUrl')
      .populate('mentionnedUser', 'username avatarUrl')
      .populate(
        'post',
        'title content imageUrl likes likesCount dislikes dislikesCount',
      )
      .sort({ createdAt: -1 });
  }

  async findById(user: string): Promise<Activity[]> {
    return this.activityModel
      .find({ user })
      .populate('user', 'username avatarUrl')
      .populate('mentionnedUser', 'username avatarUrl')
      .populate(
        'post',
        'title content imageUrl likes likesCount dislikes dislikesCount',
      )
      .sort({ createdAt: -1 });
  }

  async create(body): Promise<Activity> {
    const newActivity = new this.activityModel(body);
    return newActivity.save();
  }
}
